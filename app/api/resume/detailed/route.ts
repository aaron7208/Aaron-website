/**
 * 详细履历数据 API（需已通过密码校验的 Cookie）
 * GET /api/resume/detailed
 * 无有效 Cookie 返回 401
 * @see docs/16-个人信息录入与分层保护方案.md
 */

import { NextRequest } from "next/server";
import { verifyResumeAccessCookie } from "@/lib/resume-access";
import { getResumeDetailed } from "@/lib/content/resume";
import { success, error } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    if (!process.env.RESUME_ACCESS_PASSWORD) {
      return error("NOT_FOUND", "详细履历未配置");
    }

    const cookieHeader = request.headers.get("cookie");
    if (!verifyResumeAccessCookie(cookieHeader)) {
      return error("UNAUTHORIZED", "请先输入访问密码");
    }

    const data = getResumeDetailed();
    if (!data) {
      return error("NOT_FOUND", "暂无详细履历内容");
    }

    return success(data);
  } catch (err) {
    console.error("[resume/detailed GET]", err);
    return error("INTERNAL_ERROR", "服务异常");
  }
}
