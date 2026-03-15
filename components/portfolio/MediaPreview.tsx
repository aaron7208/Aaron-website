/**
 * 媒体预览组件 - 图片/视频/链接预览
 * @module components/portfolio/MediaPreview
 */

import Image from "next/image";
import Link from "next/link";
import type { ProjectMedia } from "@/lib/content/types";
import { cn } from "@/lib/utils/cn";
import { isValidHref } from "@/lib/utils/url";

export interface MediaPreviewProps {
  /** 媒体项 */
  media: ProjectMedia;
  /** 追加类名 */
  className?: string;
}

/**
 * 单个媒体项预览
 * @param media - 媒体数据（image | video | link）
 * @returns 媒体展示元素
 */
export function MediaPreview({ media, className }: MediaPreviewProps) {
  if (!isValidHref(media.url)) {
    return null;
  }
  if (media.type === "image") {
    return (
      <figure className={cn("overflow-hidden rounded-lg", className)}>
        <Image
          src={media.url}
          alt={media.caption ?? "作品截图"}
          width={800}
          height={450}
          className="h-auto w-full object-cover"
        />
        {media.caption && (
          <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-300">
            {media.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (media.type === "video") {
    return (
      <figure className={cn("overflow-hidden rounded-lg", className)}>
        <video
          src={media.url}
          controls
          className="h-auto w-full"
          poster={undefined}
        />
        {media.caption && (
          <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-300">
            {media.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // link
  return (
    <Link
      href={media.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-blue-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800",
        className
      )}
    >
      {media.caption ?? "查看链接"}
      <span aria-hidden>→</span>
    </Link>
  );
}

export interface MediaPreviewListProps {
  /** 媒体列表 */
  items: ProjectMedia[];
  /** 追加类名 */
  className?: string;
}

/**
 * 媒体列表 - 批量展示
 */
export function MediaPreviewList({ items, className }: MediaPreviewListProps) {
  if (!items.length) return null;

  return (
    <div className={cn("space-y-6", className)}>
      {items.map((m, i) => (
        <MediaPreview key={i} media={m} />
      ))}
    </div>
  );
}
