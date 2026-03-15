/**
 * 详细履历访问 - 密码校验
 * POST /api/resume/verify-password
 * Body: { password: string }
 * 成功时设置 HttpOnly Cookie，有效期 1 小时
 * @see docs/16-个人信息录入与分层保护方案.md
 */

import { NextRequest } from "next/server";
import { createResumeAccessCookie } from "@/lib/resume-access";
import { checkAndRecord } from "@/lib/rate-limit";
import { success, error } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const { limited } = checkAndRecord(request, "verify-password");
    if (limited) {
      return error("RATE_LIMITED", "尝试过于频繁，请稍后再试");
    }

    const secret = process.env.RESUME_ACCESS_PASSWORD;
    if (!secret || secret.length < 6) {
      return error("SERVICE_UNAVAILABLE", "详细履历功能未配置");
    }

    let body: { password?: string };
    try {
      body = await request.json();
    } catch {
      return error("BAD_REQUEST", "请求体格式无效");
    }

    const password = typeof body.password === "string" ? body.password.trim() : "";
    if (password !== secret) {
      return error("UNAUTHORIZED", "密码错误");
    }

    const cookieHeader = createResumeAccessCookie();
    if (!cookieHeader) {
      return error("INTERNAL_ERROR", "无法生成访问凭证");
    }

    const res = success({ ok: true });
    res.headers.set("Set-Cookie", cookieHeader);
    return res;
  } catch (err) {
    console.error("[resume/verify-password]", err);
    return error("INTERNAL_ERROR", "服务异常");
  }
}
