/**
 * 页头布局组件
 * 包含 Logo、导航、主题切换
 * @module components/layout/Header
 */

import Link from "next/link";
import { Navigation } from "./Navigation";
import { cn } from "@/lib/utils/cn";

export interface HeaderProps {
  /** 追加类名 */
  className?: string;
}

/**
 * 页头 - 固定在顶部，含导航
 */
export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80",
        className
      )}
    >
      <div className="container relative mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-bold text-slate-900 transition-colors hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
        >
          Aaron
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
