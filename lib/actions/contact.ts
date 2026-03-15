/**
 * 联系表单 Server Actions
 * 可选替代 API 路由的表单提交方式
 * @see docs/04-API接口文档.md
 */

"use server";

import { headers } from "next/headers";
import { createContact } from "@/lib/db/queries/contact";
import { sendContactNotificationEmail } from "@/lib/mail/send";
import { contactSchema } from "@/lib/utils/validation";
import { checkAndRecordFromHeaders } from "@/lib/rate-limit";

/**
 * 提交联系表单 Server Action
 * 含限流、Zod 校验、邮件通知
 */
export async function submitContactAction(formData: FormData) {
  const headersList = await headers();
  const { limited } = checkAndRecordFromHeaders(headersList, "contact");
  if (limited) {
    return { success: false, error: "提交过于频繁，请稍后再试" };
  }

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "参数无效";
    return { success: false, error: msg };
  }

  const created = await createContact(parsed.data);
  if (!created) {
    return { success: false, error: "提交失败" };
  }

  const mailResult = await sendContactNotificationEmail(parsed.data);
  if (!mailResult.success) {
    console.error("[contact action] 邮件发送失败:", mailResult.error);
  }

  return {
    success: true,
    data: {
      id: created.id,
      message: "感谢您的留言，我会尽快回复。",
      mailSent: mailResult.success,
    },
  };
}
