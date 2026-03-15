/**
 * 限流工具 - 内存计数器（单实例部署）
 * 生产环境建议使用 Upstash Redis Rate Limit
 * @module lib/rate-limit
 * @see docs/04-API接口文档.md § 五
 */

type RateLimitKey = "guestbook" | "guestbook-get" | "contact" | "resume" | "verify-password";

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, Map<RateLimitKey, RateLimitEntry>>();

/** 最大存储 IP 数，超出时清理最久未活跃的 */
const MAX_STORE_SIZE = 10000;

const config: Record<RateLimitKey, { max: number; windowMs: number }> = {
  guestbook: { max: 3, windowMs: 60 * 1000 }, // 3 次/分钟
  contact: { max: 5, windowMs: 60 * 60 * 1000 }, // 5 次/小时
  resume: { max: 5, windowMs: 24 * 60 * 60 * 1000 }, // 5 次/天
  "verify-password": { max: 5, windowMs: 15 * 60 * 1000 }, // 5 次/15 分钟，防暴力破解
  "guestbook-get": { max: 60, windowMs: 60 * 1000 }, // 60 次/分钟，防爬取/枚举
};

/**
 * 从 Request 中解析客户端 IP，优先 x-forwarded-for 首段。
 * 注意：仅在部署于可信反向代理（如 Vercel、Nginx）且代理正确设置 X-Forwarded-For 时可靠；
 * 客户端可伪造该头，部署文档中需明确代理架构。@see docs/08-上线检查清单.md
 */
export function getClientIp(request: Request): string {
  return getClientIpFromHeaders(request.headers);
}

/**
 * 从 Headers 中解析客户端 IP（用于 Server Actions 等）
 */
export function getClientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

/**
 * 检查是否超过限流
 * @param key - 限流类型
 * @param ip - 客户端 IP
 * @returns 若超限返回 true
 */
export function isRateLimited(key: RateLimitKey, ip: string): boolean {
  const { max, windowMs } = config[key];
  const now = Date.now();
  const cutoff = now - windowMs;

  let ipStore = store.get(ip);
  if (!ipStore) {
    ipStore = new Map();
    store.set(ip, ipStore);
  }

  let entry = ipStore.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    ipStore.set(key, entry);
  }

  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= max) {
    return true;
  }
  return false;
}

/**
 * 清理过期条目，防止 Map 无限增长导致 OOM
 * 当 store 超过 MAX_STORE_SIZE 时，删除最久未活跃的 IP
 */
function pruneStore(): void {
  if (store.size <= MAX_STORE_SIZE) return;

  const now = Date.now();
  const maxWindow = Math.max(...Object.values(config).map((c) => c.windowMs));
  const cutoff = now - maxWindow;

  for (const [ip, ipStore] of store.entries()) {
    let hasActive = false;
    for (const [, entry] of ipStore.entries()) {
      if (entry.timestamps.some((t) => t > cutoff)) {
        hasActive = true;
        break;
      }
    }
    if (!hasActive) store.delete(ip);
    if (store.size <= MAX_STORE_SIZE) break;
  }

  if (store.size > MAX_STORE_SIZE) {
    const entries = [...store.entries()];
    entries.sort((a, b) => {
      const aLast = Math.max(...[...a[1].values()].flatMap((e) => e.timestamps));
      const bLast = Math.max(...[...b[1].values()].flatMap((e) => e.timestamps));
      return aLast - bLast;
    });
    for (let i = 0; i < entries.length - MAX_STORE_SIZE; i++) {
      store.delete(entries[i][0]);
    }
  }
}

/**
 * 记录一次请求（调用前需先通过 isRateLimited 检查）
 * @param key - 限流类型
 * @param ip - 客户端 IP
 */
export function recordRequest(key: RateLimitKey, ip: string): void {
  const ipStore = store.get(ip);
  if (!ipStore) return;
  const entry = ipStore.get(key);
  if (!entry) return;
  entry.timestamps.push(Date.now());
}

/**
 * 检查并记录限流（一体化）
 * @param request - Request 对象
 * @param key - 限流类型
 * @returns 若超限返回 true，否则记录并返回 false
 */
export function checkAndRecord(
  request: Request,
  key: RateLimitKey
): { limited: boolean; ip: string } {
  return checkAndRecordFromHeaders(request.headers, key);
}

/**
 * 从 Headers 检查并记录限流（用于 Server Actions）
 * @param headers - Headers 对象
 * @param key - 限流类型
 * @returns 若超限返回 limited: true
 */
export function checkAndRecordFromHeaders(
  headers: Headers,
  key: RateLimitKey
): { limited: boolean; ip: string } {
  const ip = getClientIpFromHeaders(headers);
  pruneStore();
  if (isRateLimited(key, ip)) {
    return { limited: true, ip };
  }
  recordRequest(key, ip);
  return { limited: false, ip };
}
