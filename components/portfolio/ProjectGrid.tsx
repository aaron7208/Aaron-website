/**
 * 项目网格组件 - 作品列表网格布局
 * @module components/portfolio/ProjectGrid
 */

import { ProjectCard } from "./ProjectCard";
import type { ProjectSummary } from "@/lib/content/types";
import { cn } from "@/lib/utils/cn";

export interface ProjectGridProps {
  /** 作品列表 */
  projects: ProjectSummary[];
  /** 追加类名 */
  className?: string;
}

/**
 * 项目网格 - 响应式卡片网格
 * @param projects - 作品数组
 * @returns 网格容器
 */
export function ProjectGrid({ projects, className }: ProjectGridProps) {
  if (!projects.length) {
    return (
      <p className="py-12 text-center text-slate-500 dark:text-slate-300">
        暂无作品，敬请期待
      </p>
    );
  }

  return (
    <div
      className={cn(
        "overflow-visible grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-10",
        "py-2",
        className
      )}
    >
      {projects.map((project) => (
        <div key={project.slug} className="overflow-visible py-2">
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
