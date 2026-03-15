/**
 * 渐变背景 - 柔和色晕
 * 方案 B：radial-gradient 组合，透明度极低
 * @module components/effects/MeshGradientBackground
 */

import { cn } from "@/lib/utils/cn";

export interface MeshGradientBackgroundProps {
  /** 追加类名 */
  className?: string;
}

/**
 * 渐变背景 - 柔和色晕，不抢眼
 */
export function MeshGradientBackground({ className }: MeshGradientBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[-1]",
        "bg-gradient-to-br from-blue-500/[0.05] via-transparent to-slate-500/[0.05]",
        "dark:from-blue-400/[0.06] dark:via-transparent dark:to-slate-400/[0.06]",
        className
      )}
      aria-hidden
    />
  );
}
