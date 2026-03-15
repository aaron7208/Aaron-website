/**
 * 履历页「站内其他页面」：左侧边栏（大屏）+ 底部横条（全屏）
 * @see docs/18-履历子页问题修复说明.md
 */

import Link from "next/link";
import { FolderKanban, Mail, FileKey } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/portfolio", label: "作品集", icon: FolderKanban },
  { href: "/contact", label: "联系我", icon: Mail },
  { href: "/resume/detailed", label: "查看详细履历（需密码）", icon: FileKey },
] as const;

export interface ResumeQuickLinksProps {
  /** 标题，默认「站内其他页面」 */
  title?: string;
  /** 是否显示副标题 */
  showSubtitle?: boolean;
  /** 左侧边栏模式（大屏），否则为底部横条 */
  sidebar?: boolean;
  className?: string;
}

export function ResumeQuickLinks({
  title = "站内其他页面",
  showSubtitle = true,
  sidebar = false,
  className,
}: ResumeQuickLinksProps) {
  if (sidebar) {
    return (
      <aside
        className={cn("hidden lg:block", "w-[220px] shrink-0", className)}
        aria-label="站内其他页面"
      >
        <div className="sticky top-24 space-y-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {title}
            </h3>
            {showSubtitle && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                跳转到本站其他模块
              </p>
            )}
          </div>
          <nav className="space-y-2">
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="block">
                <Card className="transition-shadow hover:shadow-card-hover dark:hover:shadow-card-hover-dark">
                  <CardContent className="flex items-center gap-2.5 p-3">
                    <Icon className="h-4 w-4 shrink-0 text-primary dark:text-indigo-400" />
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {label}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    );
  }

  return (
    <section
      className={cn(
        "border-t border-slate-200 pt-8 dark:border-slate-700",
        className
      )}
      aria-label="站内其他页面"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        {showSubtitle && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            跳转到本站其他模块
          </p>
        )}
      </div>
      <nav className="flex flex-wrap items-center gap-4" aria-label="快捷入口">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline dark:text-indigo-300"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
