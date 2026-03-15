/**
 * 视差区域组件 - 基于 Framer Motion 与 scroll 进度
 * 性能：使用 transform/opacity 等 GPU 加速属性
 * @module components/effects/ParallaxSection
 */

"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { prefersReducedMotion } from "@/lib/utils/performance";

export interface ParallaxSectionProps {
  children: React.ReactNode;
  /** 视差偏移强度，默认 0.2 */
  speed?: number;
  /** 是否启用透明度变化 */
  fade?: boolean;
  /** 追加类名 */
  className?: string;
}

/**
 * 视差区块 - 随滚动产生位移/透明度变化
 * 注意：尊重 prefers-reduced-motion，禁用时无动效
 */
export function ParallaxSection({
  children,
  speed = 0.2,
  fade = false,
  className,
}: ParallaxSectionProps) {
  const ref = React.useRef<HTMLElement>(null);
  const reduceRef = React.useRef<boolean | null>(null);
  if (reduceRef.current === null) reduceRef.current = prefersReducedMotion();
  const shouldReduce = reduceRef.current;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50 * speed, -50 * speed]);
  const opacity = fade
    ? useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5])
    : undefined;

  if (shouldReduce) {
    return <section ref={ref} className={cn(className)}>{children}</section>;
  }

  return (
    <motion.section
      ref={ref}
      style={{ y, opacity }}
      className={cn(className)}
    >
      {children}
    </motion.section>
  );
}
