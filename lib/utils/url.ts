/**
 * URL 校验工具 - 防止 javascript: 等危险协议
 * @module lib/utils/url
 * @see docs/01-系统架构.md 5.1 安全
 */

/**
 * 校验 URL 是否允许用于 href
 * 仅允许 http:、https:、相对路径 /
 * 禁止 javascript:、data: 等
 * @param url - 待校验的 URL
 * @returns 是否安全
 */
export function isValidHref(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  try {
    const u = new URL(trimmed, "https://example.com");
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
