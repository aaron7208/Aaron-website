/**
 * 页面头部 - 子页标题 + 副标题，与首页 Hero 风格一致
 * @module components/layout/PageHeader
 * @see docs/14-子页UI与首页统一方案.md
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface PageHeaderProps {
  /** 标题 */
  title: string;
  /** 副标题 */
  subtitle?: string;
  /** 是否居中，默认 true */
  centered?: boolean;
  /** 是否启用入场动画，默认 true */
  animate?: boolean;
  className?: string;
}

/**
 * 子页头部 - 大字号渐变标题 + 副标题
 */
export function PageHeader({
  title,
  subtitle,
  centered = true,
  animate = true,
  className,
}: PageHeaderProps) {
  const shouldReduceMotion = useReducedMotion();
  const doAnimate = animate && !shouldReduceMotion;

  const content = (
    <>
      <h1
        className={cn(
          "mb-2 inline-block pb-[0.22em] bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text font-black text-transparent",
          "dark:from-indigo-300 dark:to-violet-300",
          "text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight"
        )}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-slate-500 dark:text-slate-300 md:text-xl">
          {subtitle}
        </p>
      )}
    </>
  );

  if (doAnimate) {
    return (
      <motion.header
        className={cn(
          "relative z-10 mb-12 md:mb-16",
          centered && "text-center",
          !centered && "text-left",
          className
        )}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {content}
      </motion.header>
    );
  }

  return (
    <header
      className={cn(
        "relative z-10 mb-12 md:mb-16",
        centered && "text-center",
        !centered && "text-left",
        className
      )}
    >
      {content}
    </header>
  );
}
