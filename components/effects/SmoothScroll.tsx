/**
 * 平滑滚动 - Lenis 集成
 * 性能：requestAnimationFrame 驱动，尊重 prefers-reduced-motion
 * @module components/effects/SmoothScroll
 */

"use client";

import * as React from "react";
import { prefersReducedMotion } from "@/lib/utils/performance";

export interface SmoothScrollProps {
  children: React.ReactNode;
  /** 是否强制禁用 */
  disabled?: boolean;
}

/**
 * Lenis 平滑滚动 Provider
 * 子节点需包裹在可滚动容器内
 */
export function SmoothScroll({ children, disabled }: SmoothScrollProps) {
  const [mounted, setMounted] = React.useState(false);
  const lenisRef = React.useRef<unknown>(null);
  const rafRef = React.useRef<number>(0);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || disabled || prefersReducedMotion()) return;

    let lenis: { destroy: () => void; raf: (t: number) => void } | null = null;
    let cancelled = false;

    const init = async () => {
      const mod = await import("lenis");
      const Lenis = mod.default;
      if (!Lenis || cancelled) return;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      const raf = (time: number) => {
        if (cancelled) return;
        lenis?.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      };
      rafRef.current = requestAnimationFrame(raf);
    };

    init();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, [mounted, disabled]);

  return <>{children}</>;
}
