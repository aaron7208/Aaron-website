/**
 * Hero Section - 首屏视觉焦点
 * 头像 + 主标题（渐变发光）+ 核心标语
 * 入场顺序：标题 → 副标题 →（卡片由 page 控制）
 * @module components/layout/HeroSection
 * @see docs/10-视觉与交互优化需求报告-二轮.md
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HomeData } from "@/lib/content/home";
import { HeroAvatar } from "./HeroAvatar";

export interface HeroSectionProps {
  /** Hero 配置数据 */
  data: HomeData;
  /** 追加类名 */
  className?: string;
}

/**
 * Hero Section - L1 主焦点，渐变标题 + 入场动画
 */
export function HeroSection({ data, className }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 0 : 0.4;
  const staggerDelay = shouldReduceMotion ? 0 : 0.12;

  return (
    <motion.section
      className={`flex flex-col items-center justify-center text-center ${className ?? ""}`}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: shouldReduceMotion ? 0 : 0.05,
          },
        },
      }}
    >
      <motion.div
        className="relative mb-4 md:mb-5"
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration } },
        }}
      >
        <div className="rounded-full bg-slate-50 p-1 dark:bg-slate-900 ring-4 ring-primary/20 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900">
          <HeroAvatar
            srcLight={data.avatarLight}
            srcDark={data.avatarDark}
            alt="个人头像"
            fallbackLetter={(data.name ?? data.title).charAt(0)}
          />
        </div>
      </motion.div>

      <motion.h1
        className="mb-3 inline-block pb-[0.22em] bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-5xl font-black leading-tight tracking-tight text-transparent drop-shadow-sm md:text-6xl lg:text-7xl dark:from-indigo-200 dark:to-violet-200 dark:drop-shadow-[0_0_20px_rgba(129,140,248,0.25)]"
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: duration || 0.45 } },
        }}
      >
        {data.name ?? data.title}
      </motion.h1>

      <motion.p
        className="mx-auto max-w-2xl font-semibold text-lg leading-relaxed text-slate-600 dark:text-slate-200 md:text-xl"
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration } },
        }}
      >
        {data.slogan}
      </motion.p>
    </motion.section>
  );
}
