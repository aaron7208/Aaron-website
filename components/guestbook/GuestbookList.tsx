/**
 * 留言列表组件 - 展示与分页
 * @module components/guestbook/GuestbookList
 */

"use client";

import * as React from "react";
import { MessageSquare } from "lucide-react";
import { GuestbookEntry } from "./GuestbookEntry";
import { cn } from "@/lib/utils/cn";

export interface GuestbookItem {
  id: number;
  name: string;
  content: string;
  created_at: string;
  approved: number;
}

export interface GuestbookListProps {
  /** 初始留言列表（服务端预取） */
  initialItems?: GuestbookItem[];
  /** 初始总数 */
  initialTotal?: number;
  /** 每页条数 */
  pageSize?: number;
  /** 变化时触发刷新（如表单提交成功后的 key） */
  refreshTrigger?: number;
  /** 追加类名 */
  className?: string;
}

/**
 * 留言列表 - 服务端预取 + 客户端加载更多
 */
export function GuestbookList({
  initialItems = [],
  initialTotal = 0,
  pageSize = 20,
  refreshTrigger,
  className,
}: GuestbookListProps) {
  const [items, setItems] = React.useState<GuestbookItem[]>(initialItems);
  const [total, setTotal] = React.useState(initialTotal);
  const [offset, setOffset] = React.useState(initialItems.length);
  const [loading, setLoading] = React.useState(false);
  const hasMore = items.length < total;

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/guestbook?limit=20&offset=0");
      const json = await res.json();
      if (json.success && json.data) {
        setItems(json.data.items);
        setTotal(json.data.total);
        setOffset(json.data.items.length);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = React.useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/guestbook?limit=${pageSize}&offset=${offset}`);
      const json = await res.json();
      if (json.success && json.data) {
        setItems((prev) => [...prev, ...json.data.items]);
        setTotal(json.data.total);
        setOffset((o) => o + json.data.items.length);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, pageSize]);

  React.useEffect(() => {
    if (refreshTrigger != null && refreshTrigger > 0) refresh();
  }, [refreshTrigger, refresh]);

  return (
    <div className={cn("space-y-4", className)}>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-12 px-6 text-center dark:border-slate-600 dark:bg-slate-800/30">
          <MessageSquare className="mb-3 h-12 w-12 text-slate-400 dark:text-slate-500" aria-hidden />
          <p className="text-base font-medium text-slate-700 dark:text-slate-200">
            暂无留言
          </p>
          <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            写下第一条留言，与大家互动吧。右侧表单提交后经审核会公开展示。
          </p>
        </div>
      ) : (
        <>
          {items.map((item) => (
            <GuestbookEntry
              key={item.id}
              id={item.id}
              name={item.name}
              content={item.content}
              createdAt={item.created_at}
            />
          ))}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {loading ? "加载中..." : "加载更多"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
