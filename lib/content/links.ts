/**
 * 社交链接内容加载
 * @module lib/content/links
 */

import path from "path";
import fs from "fs";
import type { LinksData } from "./types";

let cached: LinksData | null = null;

/**
 * 获取社交链接配置，结果缓存于模块内
 * @returns { links: LinkItem[] }
 */
export function getLinksData(): LinksData {
  if (cached) return cached;

  const filePath = path.join(process.cwd(), "content", "links", "data.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as LinksData;
    cached = { links: data.links ?? [] };
    return cached;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
      console.error("[content/links] 文件不存在:", filePath);
    } else if (err instanceof SyntaxError) {
      console.error("[content/links] JSON 解析错误:", (err as SyntaxError).message);
    } else {
      console.error("[content/links] 加载失败:", err);
    }
    return { links: [] };
  }
}
