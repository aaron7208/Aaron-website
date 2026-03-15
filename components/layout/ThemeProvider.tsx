/**
 * 主题 Provider - 亮/暗主题切换
 * 使用 next-themes 或 data-theme 方案，支持 SSR
 * @module components/layout/ThemeProvider
 */

"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

/**
 * 获取当前主题上下文
 * @throws 若在 Provider 外调用则抛出
 */
export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** 默认主题，默认 dark */
  defaultTheme?: Theme;
  /** 存储 key，用于 localStorage */
  storageKey?: string;
}

/**
 * 主题 Provider - 管理亮/暗/跟随系统
 * @param children - 子节点
 * @param defaultTheme - 默认主题
 * @param storageKey - localStorage 键名
 */
export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "persona-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    defaultTheme === "light" ? "light" : "dark"
  );
  const [mounted, setMounted] = React.useState(false);

  // 客户端挂载后从 localStorage 读取
  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored && ["light", "dark", "system"].includes(stored)) {
      setThemeState(stored);
    }
  }, [storageKey]);

  // 解析实际应用的主题（含 system 时跟随 prefers-color-scheme）
  React.useEffect(() => {
    if (!mounted) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (isDark: boolean) => {
      const resolved: "light" | "dark" = isDark ? "dark" : "light";
      setResolvedTheme(resolved);
      document.documentElement.classList.toggle("dark", isDark);
    };

    if (theme === "system") {
      apply(media.matches);
      const handler = (e: MediaQueryListEvent) => apply(e.matches);
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
    const isDark = theme === "dark";
    apply(isDark);
  }, [theme, mounted]);

  const setTheme = React.useCallback(
    (next: Theme) => {
      setThemeState(next);
      if (mounted) localStorage.setItem(storageKey, next);
    },
    [storageKey, mounted]
  );

  const value: ThemeContextValue = { theme, setTheme, resolvedTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
