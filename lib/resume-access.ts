/**
 * 详细履历访问凭证（🟡 验证层）
 * 密码校验通过后设置带签名的 Cookie，有效期 1 小时
 * @see docs/16-个人信息录入与分层保护方案.md
 */

import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "resume_access";
const TTL_MS = 60 * 60 * 1000; // 1 小时

function getSecret(): string {
  const secret = process.env.RESUME_ACCESS_PASSWORD;
  if (!secret || secret.length < 6) return "";
  return secret;
}

/**
 * 生成签名：HMAC-SHA256(secret, expiry)
 */
function sign(expiry: number): string {
  const secret = getSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(String(expiry)).digest("base64url");
}

/**
 * 校验密码并生成 Set-Cookie 头
 * @returns 若密码正确返回 Set-Cookie 字符串，否则 null
 */
export function createResumeAccessCookie(): string | null {
  const secret = getSecret();
  if (!secret) return null;

  const expiry = Date.now() + TTL_MS;
  const signature = sign(expiry);
  const value = `${expiry}.${signature}`;

  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600${secure}`;
}

/**
 * 从请求头 Cookie 中解析并校验 resume_access
 */
export function verifyResumeAccessCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader || !getSecret()) return false;

  const match = cookieHeader.split(";").find((s) => s.trim().startsWith(COOKIE_NAME + "="));
  if (!match) return false;

  const value = match.split("=")[1]?.trim();
  if (!value) return false;

  const [expiryStr, signature] = value.split(".");
  const expiry = Number(expiryStr, 10);
  if (!Number.isFinite(expiry) || expiry < Date.now() || !signature) return false;

  const expected = sign(expiry);
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(signature, "utf8"));
}
