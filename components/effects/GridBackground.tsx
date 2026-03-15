/**
 * 网格背景 - 纯 CSS 实现，替代 3D 粒子
 * 极低透明度网格线，不抢主内容
 * @module components/effects/GridBackground
 */

import { cn } from "@/lib/utils/cn";

export interface GridBackgroundProps {
  /** 追加类名 */
  className?: string;
}

/**
 * 网格背景 - 方案 A：现代网格线
 * 使用 linear-gradient 形成低透明度网格
 */
export function GridBackground({ className }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[-1]",
        "bg-[linear-gradient(to_right,rgb(59_130_246_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(59_130_246_/_0.03)_1px,transparent_1px)]",
        "dark:bg-[linear-gradient(to_right,rgb(148_163_184_/_0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_163_184_/_0.05)_1px,transparent_1px)]",
        "bg-[size:24px_24px]",
        className
      )}
      aria-hidden
    />
  );
}
