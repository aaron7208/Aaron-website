/**
 * 作品集内容加载
 * 服务端读取 content/portfolio/*.json
 * @module lib/content/portfolio
 */

import path from "path";
import fs from "fs";
import type { PortfolioIndexData, ProjectDetail } from "./types";

/** 作品列表缓存 */
let cachedIndex: PortfolioIndexData | null = null;

/**
 * 获取作品列表
 * @returns 作品列表数据
 */
export function getPortfolioIndex(): PortfolioIndexData {
  if (cachedIndex) return cachedIndex;

  const filePath = path.join(process.cwd(), "content", "portfolio", "index.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as PortfolioIndexData;
    cachedIndex = { projects: data.projects ?? [] };
    return cachedIndex;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
      console.error("[content/portfolio] 文件不存在:", filePath);
    } else if (err instanceof SyntaxError) {
      console.error("[content/portfolio] JSON 解析错误:", (err as SyntaxError).message);
    } else {
      console.error("[content/portfolio] 加载失败:", err);
    }
    cachedIndex = { projects: [] };
    return cachedIndex;
  }
}

/** 允许的 slug 字符：字母、数字、连字符、下划线，防止路径遍历 */
const SAFE_SLUG_REGEX = /^[a-zA-Z0-9_-]+$/;

/**
 * 根据 slug 获取作品详情
 * @param slug - 作品标识（仅允许字母数字、连字符、下划线，防止路径遍历）
 * @returns 作品详情，不存在时返回 null
 */
export function getProjectBySlug(slug: string): ProjectDetail | null {
  if (!slug || !SAFE_SLUG_REGEX.test(slug)) {
    return null;
  }
  const baseDir = path.join(process.cwd(), "content", "portfolio", "projects");
  const filePath = path.join(baseDir, `${slug}.json`);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(baseDir))) {
    return null;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as ProjectDetail;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
      console.error("[content/portfolio] 作品不存在:", filePath);
    } else if (err instanceof SyntaxError) {
      console.error("[content/portfolio] 作品 JSON 解析错误:", filePath, (err as SyntaxError).message);
    } else {
      console.error("[content/portfolio] 加载作品失败:", filePath, err);
    }
    return null;
  }
}

/**
 * 获取所有作品 slug（用于 generateStaticParams）
 * @returns slug 数组
 */
export function getAllProjectSlugs(): string[] {
  const { projects } = getPortfolioIndex();
  return projects.map((p) => p.slug);
}
