/**
 * 首页 Hero 配置加载
 * @module lib/content/home
 */

import path from "path";
import fs from "fs";

export interface HomeData {
  title: string;
  /** 公开姓名/昵称，可选；无则用 title */
  name?: string;
  slogan: string;
  /** 浅色模式头像（#F8FAFC 背景） */
  avatarLight: string;
  /** 深色模式头像（#0F172A 背景） */
  avatarDark: string;
}

let cached: HomeData | null = null;

/**
 * 获取首页 Hero 配置
 * @returns 主标题、标语、头像路径
 */
export function getHomeData(): HomeData {
  if (cached) return cached;

  const filePath = path.join(process.cwd(), "content", "home.json");
  const defaultData: HomeData = {
    title: "Aaron",
    slogan: "欢迎来到我的个人网站，这里展示我的履历、作品与联系方式。",
    avatarLight: "/images/Aaron-light.png",
    avatarDark: "/images/Aaron-dark.png",
  };

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as Partial<HomeData>;
    cached = {
      title: data.title ?? defaultData.title,
      name: data.name,
      slogan: data.slogan ?? defaultData.slogan,
      avatarLight: data.avatarLight ?? defaultData.avatarLight,
      avatarDark: data.avatarDark ?? defaultData.avatarDark,
    };
    return cached;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
      console.error("[content/home] 文件不存在:", filePath);
    } else {
      console.error("[content/home] 加载失败:", err);
    }
    return defaultData;
  }
}
