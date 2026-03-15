/**
 * 导航组件 - 路由导航、移动端菜单
 * @module components/layout/Navigation
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/Button";

/** 导航项配置 */
export const navItems = [
  { href: "/", label: "首页" },
  { href: "/resume", label: "履历" },
  { href: "/portfolio", label: "作品集" },
  { href: "/links", label: "链接" },
  { href: "/guestbook", label: "留言板" },
  { href: "/contact", label: "联系" },
] as const;

export interface NavigationProps {
  /** 追加类名 */
  className?: string;
}

/**
 * 导航组件 - 桌面端横向链接，移动端汉堡菜单
 */
export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <nav className={cn("flex items-center gap-4", className)}>
      {/* 桌面端导航 */}
      <ul className="hidden md:flex md:items-center md:gap-6">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary dark:hover:text-indigo-300",
                pathname === item.href
                  ? "text-primary dark:text-indigo-300 border-b-2 border-primary dark:border-indigo-400"
                  : "text-slate-600 dark:text-slate-300"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* 主题切换 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={resolvedTheme === "dark" ? "切换到亮色" : "切换到暗色"}
      >
        {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      {/* 移动端菜单按钮 */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* 移动端抽屉 */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 border-b border-slate-200 bg-white py-4 dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <ul className="flex flex-col gap-2 px-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded px-3 py-2 text-sm font-medium",
                    pathname === item.href
                      ? "bg-primary/10 text-primary dark:bg-indigo-500/20 dark:text-indigo-300"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
