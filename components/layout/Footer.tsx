/**
 * 页脚布局组件
 * 版权信息、社交链接等
 * @module components/layout/Footer
 */

import { cn } from "@/lib/utils/cn";

export interface FooterProps {
  /** 追加类名 */
  className?: string;
}

/**
 * 页脚 - 版权、快速链接
 */
export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-slate-200 bg-slate-50 py-8 dark:border-slate-800 dark:bg-slate-900/50",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-slate-500 dark:text-slate-300">
          © {currentYear} Aaron. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
