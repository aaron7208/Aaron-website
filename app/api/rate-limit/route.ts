/**
 * 限流检查 API
 * GET /api/rate-limit - 检查当前 IP 限流状态（可选）
 * 生产环境下仅在使用 ADMIN_API_KEY 鉴权时返回，否则 404，避免暴露限流状态 @see docs/26-安全审查报告.md
 * @see docs/04-API接口文档.md § 五
 */

import { NextRequest } from "next/server";
import { success } from "@/lib/api-response";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

function isAuthorized(request: NextRequest): boolean {
  const key = process.env.ADMIN_API_KEY?.trim();
  if (!key) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${key}`;
}

/**
 * GET - 返回当前 IP 各端点限流状态
 * 生产环境：仅当请求带合法 Authorization: Bearer <ADMIN_API_KEY> 时返回；否则 404
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && !isAuthorized(request)) {
    return new Response(null, { status: 404 });
  }

  const ip = getClientIp(request);
  const data = {
    contact: !isRateLimited("contact", ip),
    resume: !isRateLimited("resume", ip),
  };
  return success(data);
}
