/**
 * 单条留言组件 - 展示昵称、内容、时间
 * 使用 Card 统一 hover 样式（去边框、阴影、上浮）
 * @module components/guestbook/GuestbookEntry
 */

import { formatDateTime } from "@/lib/utils/format";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

export interface GuestbookEntryProps {
  /** 留言 ID */
  id: number;
  /** 昵称 */
  name: string;
  /** 留言内容 */
  content: string;
  /** 创建时间 ISO8601 */
  createdAt: string;
  /** 追加类名 */
  className?: string;
}

/**
 * 单条留言展示
 * @param name - 昵称
 * @param content - 内容
 * @param createdAt - 时间
 */
export function GuestbookEntry({
  id,
  name,
  content,
  createdAt,
  className,
}: GuestbookEntryProps) {
  return (
    <article className={cn(className)} data-entry-id={id}>
      <Card>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="font-medium text-slate-900 dark:text-slate-100">{name}</span>
            <time className="text-xs text-slate-500 dark:text-slate-300">
              {formatDateTime(createdAt)}
            </time>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-500 dark:text-slate-300">
            {content}
          </p>
        </CardContent>
      </Card>
    </article>
  );
}
