/**
 * className 合并工具 - clsx + tailwind-merge
 * 用于安全合并 Tailwind 类名，避免冲突
 * @module lib/utils/cn
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并多个 className，支持条件类与 Tailwind 冲突消解
 * @param inputs - 类名字符串、条件对象、数组等
 * @returns 合并后的单一类名字符串
 * @example
 * cn("px-4 py-2", "px-6") // => "py-2 px-6" (后者覆盖前者)
 * cn("base", isActive && "active") // => "base active" | "base"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
