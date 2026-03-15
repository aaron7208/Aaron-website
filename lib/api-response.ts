/**
 * API 统一响应格式
 * @module lib/api-response
 * @see docs/04-API接口文档.md § 1.2, 1.3
 */

import { NextResponse } from "next/server";

export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "SERVICE_UNAVAILABLE";

const statusByCode: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * 成功响应
 * @param data - 响应数据
 * @param status - HTTP 状态，默认 200
 */
export function success<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * 错误响应
 * @param code - 错误码
 * @param message - 用户可读描述
 */
export function error(code: ErrorCode, message: string) {
  const status = statusByCode[code];
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}
