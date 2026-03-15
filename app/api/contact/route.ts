/**
 * 联系表单 API
 * POST /api/contact - 提交联系表单
 * @see docs/04-API接口文档.md § 3.1
 */

import { NextRequest } from "next/server";
import { createContact } from "@/lib/db/queries/contact";
import { sendContactNotificationEmail } from "@/lib/mail/send";
import { contactSchema } from "@/lib/utils/validation";
import { checkAndRecord } from "@/lib/rate-limit";
import { success, error } from "@/lib/api-response";

/**
 * POST - 提交联系表单
 * 限流：5 次/小时/IP
 * 校验：name 2-100，email 有效，subject 可选 1-200，message 1-2000
 * 副作用：写入 contact 表 + 发送通知邮件
 */
export async function POST(request: NextRequest) {
  try {
    const { limited } = checkAndRecord(request, "contact");
    if (limited) {
      return error("RATE_LIMITED", "提交过于频繁，请稍后再试");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return error("BAD_REQUEST", "请求体格式无效");
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? "参数无效";
      return error("BAD_REQUEST", msg);
    }

    const { name, email, subject, message, hp } = parsed.data;
    if (hp && hp.length > 0) {
      return success({ message: "感谢您的留言，我会尽快回复。" }); // 静默拒绝机器人
    }

    const created = await createContact({ name, email, subject, message });
    if (!created) {
      return error("INTERNAL_ERROR", "提交失败");
    }

    const mailResult = await sendContactNotificationEmail({
      name,
      email,
      subject,
      message,
    });
    if (!mailResult.success) {
      console.error("[contact] 邮件发送失败:", mailResult.error);
    }

    const data = {
      id: created.id,
      message: "感谢您的留言，我会尽快回复。",
      mailSent: mailResult.success,
    };

    return success(data);
  } catch (err) {
    console.error("[contact POST]", err);
    return error("INTERNAL_ERROR", "服务异常，请稍后重试");
  }
}
