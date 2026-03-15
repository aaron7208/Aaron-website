/**
 * 首页模块卡片区域 - stagger 入场动画
 * 顺序在 Hero 之后，每张卡片延迟 100～150ms
 * @module components/home/HomeModulesSection
 * @see docs/10-视觉与交互优化需求报告-二轮.md
 */

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, FolderKanban, Link2, MessageSquare, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

/** 图标 key 与 Lucide 组件映射（仅在 Client 内解析） */
const ICON_MAP = {
  "file-text": FileText,
  "folder-kanban": FolderKanban,
  link2: Link2,
  "message-square": MessageSquare,
  mail: Mail,
} as const;

export type ModuleIconKey = keyof typeof ICON_MAP;

export interface ModuleItem {
  href: string;
  label: string;
  icon: ModuleIconKey;
  desc: string;
  highlight?: boolean;
}

export interface HomeModulesSectionProps {
  modules: ModuleItem[];
  className?: string;
}

const container = {
  hidden: { opacity: 0 },
  visible: (reduce: boolean) => ({
    opacity: 1,
    transition: {
      staggerChildren: reduce ? 0 : 0.12,
      delayChildren: reduce ? 0 : 0.15,
    },
  }),
};

const item = (reduce: boolean) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: reduce ? { duration: 0 } : { ease: "easeOut", duration: 0.4 },
  },
});

function ModuleCard({
  href,
  label,
  icon,
  desc,
  highlight,
  reduceMotion,
}: ModuleItem & { reduceMotion: boolean }) {
  const Icon = ICON_MAP[icon];
  return (
    <motion.div variants={item(reduceMotion)} custom={reduceMotion}>
      <Link href={href} className="group block">
        <Card variant={highlight ? "highlight" : "default"} className="h-full">
          <CardContent className="flex flex-col items-start gap-3 p-6">
            <Icon
              className={cn(
                "h-8 w-8 transition-transform duration-200 group-hover:scale-110",
                highlight ? "text-accent dark:text-violet-400 group-hover:text-accent/90 dark:group-hover:text-violet-300" : "text-primary dark:text-indigo-400 group-hover:text-primary/90 dark:group-hover:text-indigo-300"
              )}
            />
            <h2 className="text-lg font-extrabold leading-tight text-slate-900 dark:text-slate-100">
              {label}
            </h2>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-300">
              {desc}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

/**
 * 首页模块卡片 - 第一行 2 卡（履历、作品集），第二行 3 卡（社交、留言、联系）
 * @see docs/21-全站优化报告.md
 */
export function HomeModulesSection({ modules, className }: HomeModulesSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const reduce = !!shouldReduceMotion;
  const row1 = modules.slice(0, 2);
  const row2 = modules.slice(2, 5);

  return (
    <motion.section
      className={cn("space-y-10", className)}
      variants={container}
      initial="hidden"
      animate="visible"
      custom={reduce}
    >
      <div className="grid gap-6 sm:grid-cols-2 md:gap-10">
        {row1.map((m) => (
          <ModuleCard key={m.href} {...m} reduceMotion={reduce} />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-3 md:gap-10">
        {row2.map((m) => (
          <ModuleCard key={m.href} {...m} reduceMotion={reduce} />
        ))}
      </div>
    </motion.section>
  );
}
