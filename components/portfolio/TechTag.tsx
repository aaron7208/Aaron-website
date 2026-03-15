/**
 * 技术栈标签组件 - 技术栈标签展示
 * @module components/portfolio/TechTag
 */

import { cn } from "@/lib/utils/cn";

export interface TechTagProps {
  /** 标签文本 */
  children: string;
  /** 追加类名 */
  className?: string;
}

/**
 * 技术栈标签 - 单个技术名称标签
 * @param children - 标签文本
 * @returns span 元素
 */
export function TechTag({ children, className }: TechTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
        className
      )}
    >
      {children}
    </span>
  );
}
