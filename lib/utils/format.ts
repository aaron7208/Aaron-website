/**
 * 通用格式化工具
 * 提供日期、文本、数字等格式化函数
 * @module lib/utils/format
 */

/**
 * 日期格式化 - 将 ISO 字符串或 Date 转为本地化显示
 * @param date - ISO8601 字符串或 Date 对象
 * @param options - Intl.DateTimeFormat 选项，默认相对时间优先
 * @returns 格式化后的日期字符串
 * @example
 * formatDate("2025-03-14T10:00:00.000Z") // => "2025年3月14日"
 * formatDate(new Date(), { relative: true }) // => "刚刚" | "3分钟前"
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions & { relative?: boolean }
): string {
  const d =
    typeof date === "string" ? new Date(parseAsUtcIfNeeded(date)) : date;

  // 无效日期处理
  if (Number.isNaN(d.getTime())) {
    return "";
  }

  // 相对时间（可选）
  if (options?.relative) {
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "刚刚";
    if (diffMin < 60) return `${diffMin} 分钟前`;
    if (diffHour < 24) return `${diffHour} 小时前`;
    if (diffDay < 7) return `${diffDay} 天前`;
  }

  // 默认：本地化日期
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

/**
 * 将 SQLite 等返回的「无时区」时间视为 UTC，便于正确转为本地时间显示
 * 格式如 "2025-03-15 03:16:00" 或 "2025-03-15T03:16:00" 且无 Z/± 时，补 Z
 */
function parseAsUtcIfNeeded(dateStr: string): string {
  const s = dateStr.trim();
  if (!/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}/.test(s)) return dateStr;
  if (/[Zz+-]\d{2}:?\d{2}$/.test(s) || s.endsWith("Z")) return dateStr;
  const normalized = s.replace(" ", "T").replace(/\.\d+$/, "");
  return normalized.includes("Z") ? normalized : `${normalized}Z`;
}

/**
 * 日期时间格式化 - 含时分，按访客本地时区显示
 * 数据库存的是 UTC（如 SQLite datetime('now')），此处按 UTC 解析再转本地
 * @param date - ISO8601 或 "YYYY-MM-DD HH:mm:ss"（无时区时按 UTC 处理）
 * @returns 格式化后的日期时间字符串，如 "2025/03/15 11:16"
 */
export function formatDateTime(date: string | Date): string {
  const d =
    typeof date === "string"
      ? new Date(parseAsUtcIfNeeded(date))
      : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 文本截断 - 超出长度时追加省略号
 * @param text - 原始文本
 * @param maxLength - 最大长度（含省略号）
 * @param suffix - 省略号，默认 "..."
 * @returns 截断后的文本
 */
export function truncate(text: string, maxLength: number, suffix = "..."): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}
