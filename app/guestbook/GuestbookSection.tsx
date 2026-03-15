/**
 * 留言板区块 - 表单 + 列表（客户端组件）
 * 协调表单提交成功后的列表刷新
 */

"use client";

import * as React from "react";
import { GuestbookForm } from "@/components/guestbook/GuestbookForm";
import { GuestbookList } from "@/components/guestbook/GuestbookList";
import type { GuestbookItem } from "@/components/guestbook/GuestbookList";

export interface GuestbookSectionProps {
  initialItems: GuestbookItem[];
  initialTotal: number;
}

export function GuestbookSection({
  initialItems,
  initialTotal,
}: GuestbookSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  return (
    <div className="grid gap-12 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <GuestbookList
          initialItems={initialItems}
          initialTotal={initialTotal}
          refreshTrigger={refreshTrigger}
        />
      </div>
      <aside>
        <GuestbookForm onSuccess={() => setRefreshTrigger((k) => k + 1)} />
      </aside>
    </div>
  );
}
