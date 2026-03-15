/**
 * 3D 背景组件 - Three.js / React Three Fiber
 * 性能注意：几何体复用、材质缓存、低面数、动态 import 按需加载
 * @module components/effects/Background3D
 */

"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils/cn";
import { prefersReducedMotion } from "@/lib/utils/performance";

/** 动态加载 R3F Canvas，避免 SSR 及首屏阻塞 */
const Scene = dynamic(() => import("./Background3DScene"), {
  ssr: false,
  loading: () => null,
});

export interface Background3DProps {
  /** 容器类名 */
  className?: string;
  /** 是否禁用（如 prefers-reduced-motion） */
  disabled?: boolean;
}

/**
 * 3D 背景 - 置于页面底层，低优先级渲染
 * 尊重 prefers-reduced-motion
 */
export function Background3D({ className, disabled }: Background3DProps) {
  const [reduceMotion, setReduceMotion] = React.useState(false);
  React.useEffect(() => setReduceMotion(prefersReducedMotion()), []);

  if (disabled || reduceMotion) return null;

  return (
    <div
      className={cn(className)}
      aria-hidden
      style={{ pointerEvents: "none", zIndex: -1 }}
    >
      <Scene />
    </div>
  );
}
