/**
 * 履历页内锚点目录 + Scrollspy
 * 关于我、在学/在用、经历/项目；随滚动高亮「视口内占比最大」的区块 @see docs/23
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

const SECTIONS = [
  { id: "about", label: "关于我" },
  { id: "learning", label: "在学 / 在用" },
  { id: "experience", label: "经历 / 项目" },
] as const;

/** 标题随页面滚动（方案 B），无置顶偏移，视口全屏参与占比计算 */

export interface ResumeTocProps {
  className?: string;
}

export function ResumeToc({ className }: ResumeTocProps) {
  const [activeId, setActiveId] = React.useState<string | null>(SECTIONS[0].id);
  const ratiosRef = React.useRef<Record<string, number>>({});

  React.useEffect(() => {
    const els = SECTIONS.map((s) => ({ id: s.id, el: document.getElementById(s.id) })).filter(
      (x): x is { id: (typeof SECTIONS)[number]["id"]; el: HTMLElement } => x.el != null
    );
    if (els.length === 0) return;

    const updateActive = () => {
      let maxId = els[0].id;
      let maxRatio = ratiosRef.current[els[0].id] ?? 0;
      for (const { id } of els) {
        const r = ratiosRef.current[id] ?? 0;
        if (r > maxRatio) {
          maxRatio = r;
          maxId = id;
        }
      }
      setActiveId(maxId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id;
          if (SECTIONS.some((s) => s.id === id)) {
            ratiosRef.current[id] = e.intersectionRatio;
          }
        }
        updateActive();
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    );

    els.forEach(({ el }) => observer.observe(el));
    updateActive();
    return () => els.forEach(({ el }) => observer.unobserve(el));
  }, []);

  return (
    <aside className={cn("hidden lg:block", "w-[200px] shrink-0", className)} aria-label="本页目录">
      <nav className="sticky top-24 space-y-1">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          本页目录
        </h3>
        {SECTIONS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={cn(
              "block rounded-md border-l-[3px] border-transparent px-3 py-2 text-sm font-medium transition-colors",
              activeId === id
                ? "border-l-primary bg-primary/15 text-primary dark:border-l-indigo-400 dark:bg-indigo-500/25 dark:text-indigo-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            )}
          >
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
