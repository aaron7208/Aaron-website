/**
 * 输入框组件
 * 支持 label、error 提示、disabled 等
 * @module components/ui/Input
 */

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 关联的标签文本 */
  label?: string;
  /** 错误信息，显示时添加错误样式 */
  error?: string;
  /** 辅助说明文本 */
  helperText?: string;
}

/**
 * 输入框组件
 * @param label - 标签文本
 * @param error - 错误信息
 * @param helperText - 辅助说明
 * @param className - 追加类名
 * @param id - 若提供 label 且未传 id，将自动生成
 * @returns 包含 label 与 input 的包装元素
 */
export function Input({
  label,
  error,
  helperText,
  className,
  id: rawId,
  disabled,
  ...props
}: InputProps) {
  const id = rawId ?? (label ? `input-${React.useId()}` : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm",
          "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-500 focus:ring-red-500 dark:border-red-600"
            : "border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${id}-helper`} className="text-sm text-slate-500 dark:text-slate-300">
          {helperText}
        </p>
      )}
    </div>
  );
}
