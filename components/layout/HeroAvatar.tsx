/**
 * Hero 头像 - 支持加载失败时显示首字母占位
 */

"use client";

import * as React from "react";
import { useTheme } from "./ThemeProvider";

interface HeroAvatarProps {
  srcLight: string;
  srcDark: string;
  alt: string;
  fallbackLetter: string;
  size?: "md" | "lg";
}

export function HeroAvatar({
  srcLight,
  srcDark,
  alt,
  fallbackLetter,
  size = "lg",
}: HeroAvatarProps) {
  const [failed, setFailed] = React.useState(false);
  const { resolvedTheme } = useTheme();
  const src = resolvedTheme === "dark" ? srcDark : srcLight;

  const sizeClass = size === "lg" ? "h-28 w-28 md:h-32 md:w-32" : "h-24 w-24";

  if (failed) {
    return (
      <div
        className={`${sizeClass} flex items-center justify-center rounded-full bg-slate-200 text-4xl font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400 md:text-5xl`}
      >
        {fallbackLetter}
      </div>
    );
  }

  return (
    <div className={`${sizeClass} overflow-hidden rounded-full`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={128}
        height={128}
        loading="eager"
        decoding="async"
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
