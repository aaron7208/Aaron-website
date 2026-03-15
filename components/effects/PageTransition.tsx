/**
 * 页面过渡动画 - 路由切换时淡入 + 轻微上移
 * @module components/effects/PageTransition
 * @see docs/11-视觉与交互优化需求报告-三轮.md
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * 包裹页面内容，路由切换时执行淡入上移
 */
export function PageTransition({ children }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
