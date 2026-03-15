/**
 * 光晕渐变背景 - 左上 indigo、右下 purple 对角呼应
 * 含 1%～2% 噪点纹理叠加，纯 CSS
 * @module components/effects/GradientGlowBackground
 * @see docs/10-视觉与交互优化需求报告-二轮.md
 */

import { cn } from "@/lib/utils/cn";

export interface GradientGlowBackgroundProps {
  /** 追加类名 */
  className?: string;
}

/** 噪点 SVG data URL - feTurbulence 生成纹理 */
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/**
 * 光晕渐变 + 噪点纹理背景
 * 左上 indigo-200、右下 purple-200 约 40%～50% 透明度；椭圆范围扩大确保可见
 * @see 三轮 refinements：光晕由 30% 提升至 40%～50%
 */
export function GradientGlowBackground({ className }: GradientGlowBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none fixed inset-0 z-[-1]", className)}
      aria-hidden
    >
      {/* 光晕渐变 - 亮色 45%；深色 15% 降低光斑 */}
      <div
        className="absolute inset-0 dark:opacity-[0.15]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 0% 0%, rgb(199 210 254 / 0.45), transparent 55%), radial-gradient(ellipse 80% 60% at 100% 100%, rgb(233 213 255 / 0.45), transparent 55%)",
        }}
      />
      {/* 噪点纹理 1%～2% 透明度 */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG, backgroundSize: "256px 256px" }}
      />
    </div>
  );
}
