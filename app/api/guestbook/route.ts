/**
 * 留言板 API
 * GET /api/guestbook - 获取留言列表
 * POST /api/guestbook - 新增留言
 * @see docs/04-API接口文档.md § 2.1, 2.2
 */

import { NextRequest } from "next/server";
import { listGuestbook, createGuestbook, updateGuestbookApproved } from "@/lib/db/queries/guestbook";
import { guestbookSchema } from "@/lib/utils/validation";
import { checkAndRecord } from "@/lib/rate-limit";
import { success, error } from "@/lib/api-response";
import { isBailianConfigured, moderateWithBailian } from "@/lib/moderation/bailian";

/**
 * GET - 获取留言列表
 * @param limit - 每页条数，默认 20
 * @param offset - 偏移量，默认 0
 * @param approved - 前台固定 true
 */
export async function GET(request: NextRequest) {
  try {
    const { limited } = checkAndRecord(request, "guestbook-get");
    if (limited) {
      return error("RATE_LIMITED", "请求过于频繁，请稍后再试");
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
    const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);

    const { items, total } = await listGuestbook(limit, offset, true);

    // 公开接口不返回 email，避免隐私与滥发风险 @see docs/26-安全审查报告.md
    const data = {
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        content: i.content,
        created_at: i.createdAt,
        approved: i.approved ? 1 : 0,
      })),
      total,
    };

    return success(data);
  } catch (err) {
    console.error("[guestbook GET]", err);
    return error("INTERNAL_ERROR", "服务异常，请稍后重试");
  }
}

/**
 * POST - 提交留言
 * 限流：3 次/分钟/IP
 * 校验：name 2-50，content 1-500，email 可选
 */
export async function POST(request: NextRequest) {
  try {
    const { limited } = checkAndRecord(request, "guestbook");
    if (limited) {
      return error("RATE_LIMITED", "提交过于频繁，请稍后再试");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return error("BAD_REQUEST", "请求体格式无效");
    }

    const parsed = guestbookSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? "参数无效";
      return error("BAD_REQUEST", msg);
    }

    const created = await createGuestbook(parsed.data);
    if (!created) {
      return error("INTERNAL_ERROR", "留言提交失败");
    }

    let approved = false;
    if (isBailianConfigured()) {
      const textToCheck = `昵称：${created.name}\n内容：${created.content}`;
      approved = await moderateWithBailian(textToCheck);
      await updateGuestbookApproved(created.id, approved);
    }

    const data = {
      id: created.id,
      name: created.name,
      content: created.content,
      created_at: created.createdAt,
      message: approved
        ? "留言已发布，将公开展示。"
        : "留言已提交，审核通过后将公开展示。",
    };

    return success(data);
  } catch (err) {
    console.error("[guestbook POST]", err);
    return error("INTERNAL_ERROR", "服务异常，请稍后重试");
  }
}
