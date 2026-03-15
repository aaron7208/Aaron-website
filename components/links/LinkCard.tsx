/**
 * 链接卡片组件 - 社交/外链卡片
 * @module components/links/LinkCard
 */

import Link from "next/link";
import { ExternalLink, Github, Twitter, Book, Video } from "lucide-react";
import type { LinkItem } from "@/lib/content/types";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import { isValidHref } from "@/lib/utils/url";

/** 哔哩哔哩品牌图标（简化 b 字） */
function BilibiliIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17.813 4.653h.694c.957 0 1.733.776 1.733 1.733v10.134c0 .956-.776 1.732-1.733 1.732h-.694v2.4c0 .239-.281.359-.447.359-.112 0-.224-.056-.28-.168l-2.24-3.6-2.24 3.6c-.056.112-.168.168-.28.168-.166 0-.447-.12-.447-.359v-2.4H6.92c-.957 0-1.733-.776-1.733-1.732V6.386c0-.957.776-1.733 1.733-1.733h.694V2.453c0-.24.282-.36.448-.36.111 0 .223.056.279.168l2.24 3.6 2.24-3.6c.056-.112.168-.168.28-.168.166 0 .447.12.447.36v2.4zm-5.6 2.4v6.4h1.12V7.053h-1.12zm-4.48 1.12v5.28h1.12V8.173h-1.12zm8.96 0v5.28h1.12V8.173h-1.12z" />
    </svg>
  );
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  twitter: Twitter,
  book: Book,
  video: Video,
  bilibili: BilibiliIcon,
};

export interface LinkCardProps {
  /** 链接数据 */
  item: LinkItem;
  /** 追加类名 */
  className?: string;
}

/**
 * 链接卡片 - 展示标签、描述、外链
 */
export function LinkCard({ item, className }: LinkCardProps) {
  if (!isValidHref(item.url)) {
    return (
      <Card className={cn(className)}>
        <CardContent className="flex items-center gap-5 p-8">
          <span className="text-slate-500 dark:text-slate-300">
            {item.label}（链接无效）
          </span>
        </CardContent>
      </Card>
    );
  }
  const isExternal = item.url.startsWith("http");
  const Icon = item.icon ? iconMap[item.icon] ?? ExternalLink : ExternalLink;

  const content = (
    <Card className={cn("min-h-[120px]", className)}>
      <CardContent className="flex items-center gap-5 p-8">
        <Icon className="h-10 w-10 shrink-0 text-primary dark:text-indigo-400" />
        <div className="min-w-0 flex-1">
          <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {item.label}
          </span>
          {item.description && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-300">
              {item.description}
            </p>
          )}
        </div>
        <ExternalLink className="h-5 w-5 shrink-0 text-slate-400" />
      </CardContent>
    </Card>
  );

  if (isExternal) {
    return (
      <Link href={item.url} target="_blank" rel="noopener noreferrer" className="group block">
        {content}
      </Link>
    );
  }

  return (
    <Link href={item.url} className="group block">
      {content}
    </Link>
  );
}
