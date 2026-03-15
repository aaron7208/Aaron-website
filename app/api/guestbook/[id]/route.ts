/**
 * 留言板 API - 单条操作
 * DELETE /api/guestbook/[id] - 删除留言（需鉴权）
 * 认证：Authorization: Bearer <ADMIN_API_KEY>
 * @see docs/04-API接口文档.md § 2.3
 */

import { NextRequest } from "next/server";
import { deleteGuestbook } from "@/lib/db/queries/guestbook";
import { success, error } from "@/lib/api-response";

export interface RouteParams {
  /** Next.js 15+ 可能为 Promise，升级时确认并 await params */
  params: { id: string };
}

/**
 * DELETE - 删除留言
 * 鉴权：Bearer Token，环境变量 ADMIN_API_KEY
 * 若未配置 ADMIN_API_KEY，返回 503
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const adminKey = process.env.ADMIN_API_KEY;
    if (!adminKey) {
      return error("SERVICE_UNAVAILABLE", "管理接口未配置");
    }

    const auth = request.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (token !== adminKey) {
      return error("UNAUTHORIZED", "未授权");
    }

    const id = Number(params.id);
    if (!Number.isInteger(id) || id < 1) {
      return error("BAD_REQUEST", "无效的留言 ID");
    }

    const deleted = await deleteGuestbook(id);
    if (!deleted) {
      return error("NOT_FOUND", "留言不存在");
    }

    return success({ success: true });
  } catch (err) {
    console.error("[guestbook DELETE]", err);
    return error("INTERNAL_ERROR", "服务异常");
  }
}
