/**
 * 履历内容加载
 * 服务端读取 content/resume/data.json
 * @module lib/content/resume
 */

import path from "path";
import fs from "fs";
import type { ResumeData, ResumePublicData } from "./types";

/** 履历数据缓存（构建时加载） */
let cached: ResumeData | null = null;

/**
 * 获取履历数据
 * @returns 履历数据，空数据时返回默认结构
 */
export function getResumeData(): ResumeData {
  if (cached) return cached;

  const filePath = path.join(process.cwd(), "content", "resume", "data.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as ResumeData;
    cached = {
      education: data.education ?? [],
      experience: data.experience ?? [],
      skills: data.skills ?? [],
    };
    return cached;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
      console.error("[content/resume] 文件不存在:", filePath);
    } else if (err instanceof SyntaxError) {
      console.error("[content/resume] JSON 解析错误:", (err as SyntaxError).message);
    } else {
      console.error("[content/resume] 加载失败:", err);
    }
    return { education: [], experience: [], skills: [] };
  }
}

/** 履历公开层缓存（content/resume/public.json） */
let publicCache: ResumePublicData | null = null;

/**
 * 获取履历公开层数据
 * @returns about / learning / experience 等，文件不存在或解析失败时返回 null
 */
export function getResumePublicData(): ResumePublicData | null {
  if (publicCache) return publicCache;

  const filePath = path.join(process.cwd(), "content", "resume", "public.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as ResumePublicData;
    if (!data.about?.paragraphs || !data.learning || !data.experience) {
      console.error("[content/resume] public.json 结构不完整");
      return null;
    }
    publicCache = {
      about: data.about,
      learning: data.learning,
      experience: data.experience,
      featuredProjects: data.featuredProjects,
    };
    return publicCache;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && (err as NodeJS.ErrnoException).code === "ENOENT") {
      console.error("[content/resume] public.json 不存在:", filePath);
    } else {
      console.error("[content/resume] public.json 解析失败:", err);
    }
    return null;
  }
}

/** 详细履历缓存（🟡 验证层，需密码访问） */
let detailedCache: ResumeData | null | undefined = undefined;

/**
 * 获取详细履历数据（来自 content/resume/detailed.json）
 * 仅用于密码校验通过后的展示，文件不存在时返回 null
 */
export function getResumeDetailed(): ResumeData | null {
  if (detailedCache !== undefined) return detailedCache;

  const filePath = path.join(process.cwd(), "content", "resume", "detailed.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as ResumeData;
    detailedCache = {
      education: data.education ?? [],
      experience: data.experience ?? [],
      skills: data.skills ?? [],
    };
    return detailedCache;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
      detailedCache = null;
      return null;
    }
    console.error("[content/resume] detailed.json 解析失败:", err);
    detailedCache = null;
    return null;
  }
}
