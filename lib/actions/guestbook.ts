/**
 * 留言板 Server Actions
 * 可选替代 API 路由的表单提交方式
 * @see docs/04-API接口文档.md
 */

"use server";

import { headers } from "next/headers";
import { createGuestbook } from "@/lib/db/queries/guestbook";
import { guestbookSchema } from "@/lib/utils/validation";
import { checkAndRecordFromHeaders } from "@/lib/rate-limit";

/**
 * 提交留言 Server Action
 * 含限流与 Zod 校验
 */
export async function submitGuestbookAction(formData: FormData) {
  const headersList = await headers();
  const { limited } = checkAndRecordFromHeaders(headersList, "guestbook");
  if (limited) {
    return { success: false, error: "提交过于频繁，请稍后再试" };
  }

  const raw = {
    name: formData.get("name"),
    content: formData.get("content"),
    email: formData.get("email") || undefined,
  };

  const parsed = guestbookSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "参数无效";
    return { success: false, error: msg };
  }

  const created = await createGuestbook(parsed.data);
  if (!created) {
    return { success: false, error: "提交失败" };
  }

  return {
    success: true,
    data: { id: created.id, name: created.name, content: created.content },
  };
}
