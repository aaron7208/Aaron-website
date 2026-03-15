/**
 * 社交链接网格组件 - 链接聚合布局
 * @module components/links/SocialGrid
 */

import { LinkCard } from "./LinkCard";
import type { LinkItem } from "@/lib/content/types";
import { cn } from "@/lib/utils/cn";

export interface SocialGridProps {
  /** 链接列表 */
  links: LinkItem[];
  /** 追加类名 */
  className?: string;
}

/**
 * 社交链接网格 - 响应式卡片网格
 */
export function SocialGrid({ links, className }: SocialGridProps) {
  if (!links.length) {
    return (
      <p className="py-12 text-center text-slate-500 dark:text-slate-300">
        暂无链接
      </p>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-10",
        className
      )}
    >
      {links.map((item) => (
        <LinkCard key={`${item.label}-${item.url}`} item={item} />
      ))}
    </div>
  );
}
