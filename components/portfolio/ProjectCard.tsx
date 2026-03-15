/**
 * 项目卡片组件 - 作品卡片展示，缩略图使用作品首页截图
 * @module components/portfolio/ProjectCard
 */

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProjectSummary } from "@/lib/content/types";
import { TechTag } from "./TechTag";
import { truncate } from "@/lib/utils/format";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

export interface ProjectCardProps {
  /** 作品摘要数据 */
  project: ProjectSummary;
  /** 追加类名 */
  className?: string;
}

/** 首字母占位块 - 无图或图片加载失败时显示 */
function ThumbnailPlaceholder({ letter }: { letter: string }) {
  return (
    <div
      className="flex aspect-video w-full items-center justify-center rounded-t-[10px] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600"
      aria-hidden
    >
      <span className="text-4xl font-bold text-slate-500 dark:text-slate-400">{letter}</span>
    </div>
  );
}

/**
 * 项目卡片 - 展示标题、描述、技术栈、链接；缩略图为作品首页图
 * @param project - 作品摘要
 * @returns 可点击的卡片链接
 */
export function ProjectCard({ project, className }: ProjectCardProps) {
  const href = `/portfolio/${project.slug}`;
  const [imgError, setImgError] = React.useState(false);
  const placeholderLetter = project.title.charAt(0).toUpperCase();
  const showImage = project.thumbnail && !imgError;

  return (
    <Link href={href} className="group block">
      <Card className={cn("h-full", className)}>
        {showImage ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-[10px]">
            <Image
              src={project.thumbnail!}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <ThumbnailPlaceholder letter={placeholderLetter} />
        )}
        <CardHeader>
          <CardTitle className="line-clamp-1">{project.title}</CardTitle>
          {project.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
              {truncate(project.description, 120)}
            </p>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {project.techStack?.map((tech, i) => (
              <TechTag key={i}>{tech}</TechTag>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
