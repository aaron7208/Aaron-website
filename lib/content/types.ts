/**
 * 静态内容类型定义
 * 履历、作品集、社交链接等 JSON 数据结构
 * @module lib/content/types
 */

/** 教育经历 */
export interface Education {
  school: string;
  degree: string;
  period: string;
  description?: string;
}

/** 工作经历 */
export interface Experience {
  company: string;
  role: string;
  period: string;
  description?: string;
  highlights?: string[];
}

/** 技能分类 */
export interface SkillCategory {
  name: string;
  items: string[];
}

/** 履历数据 */
export interface ResumeData {
  education: Education[];
  experience: Experience[];
  skills: SkillCategory[];
}

/** 履历公开层 - about / learning / experience（content/resume/public.json） */
export interface ResumePublicAbout {
  paragraphs: string[];
}

export interface ResumePublicLearning {
  tagline: string;
  projectStack: { label: string; items: string[] };
  studyPlan: { label: string; items: string[] };
  closingLine: string;
}

export interface ResumePublicTechProject {
  title: string;
  role: string;
  duration?: string;
  highlights?: string[];
  note?: string;
}

export interface ResumePublicOther {
  title: string;
  period: string;
  role: string;
  description: string;
}

export interface ResumePublicExperience {
  techProjects: ResumePublicTechProject[];
  other: ResumePublicOther[];
}

export interface ResumePublicData {
  about: ResumePublicAbout;
  learning: ResumePublicLearning;
  experience: ResumePublicExperience;
  featuredProjects?: { slugs: string[] };
}

/** 作品链接 */
export interface ProjectLinks {
  preview?: string;
  repo?: string;
}

/** 作品媒体项 */
export interface ProjectMedia {
  type: "image" | "video" | "link";
  url: string;
  caption?: string;
}

/** 作品列表项（索引用） */
export interface ProjectSummary {
  slug: string;
  title: string;
  description?: string;
  techStack: string[];
  thumbnail?: string;
  links?: ProjectLinks;
}

/** 作品详情 */
export interface ProjectDetail extends ProjectSummary {
  /** 项目亮点列表（与履历 techProjects.highlights 可一致） */
  highlights?: string[];
  /** 学习收获，单段或多段 */
  learnings?: string | string[];
  media?: ProjectMedia[];
}

/** 作品列表数据 */
export interface PortfolioIndexData {
  projects: ProjectSummary[];
}

/** 社交链接项 */
export interface LinkItem {
  label: string;
  url: string;
  icon?: string;
  description?: string;
}

/** 社交链接数据 */
export interface LinksData {
  links: LinkItem[];
}
