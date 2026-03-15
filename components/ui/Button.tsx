/**
 * 基础按钮组件
 * 支持多种变体、尺寸、loading 状态
 * @module components/ui/Button
 */

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 样式变体 */
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  /** 尺寸 */
  size?: "default" | "sm" | "lg" | "icon";
  /** 加载中状态，禁用点击并显示 loading 指示 */
  loading?: boolean;
  /** 为 true 时渲染子元素并透传样式，用于 a 标签等 */
  asChild?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
  outline: "border border-slate-300 bg-transparent hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800",
  ghost: "hover:bg-slate-100 dark:hover:bg-slate-800",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3 text-sm",
  lg: "h-11 px-8 text-base",
  icon: "h-10 w-10",
};

/**
 * 按钮组件
 * @param variant - 样式变体，默认 default
 * @param size - 尺寸，默认 default
 * @param loading - 是否加载中
 * @returns 按钮元素
 */
export function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const mergedClassName = cn(
    "inline-flex items-center justify-center font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn(mergedClassName, (children as React.ReactElement<{ className?: string }>).props.className),
    });
  }

  return (
    <button
      className={mergedClassName}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
