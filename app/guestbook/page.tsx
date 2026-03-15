/**
 * 留言板页面
 * 路由：/guestbook
 * 数据流：服务端预取留言列表，客户端表单提交 + 加载更多
 * @module app/guestbook/page
 * @see docs/14-子页UI与首页统一方案.md
 */

import { listGuestbook } from "@/lib/db/queries/guestbook";
import { GuestbookSection } from "./GuestbookSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { GradientGlowBackground } from "@/components/effects/GradientGlowBackground";

export default async function GuestbookPage() {
  const { items, total } = await listGuestbook(20, 0, true);

  const initialItems = items.map((i) => ({
    id: i.id,
    name: i.name,
    content: i.content,
    email: i.email,
    created_at: i.createdAt,
    approved: i.approved ? 1 : 0,
  }));

  return (
    <main className="relative container mx-auto px-4 py-12">
      <GradientGlowBackground />
      <div className="relative z-10">
        <PageHeader
          title="留言板"
          subtitle="公开留言与互动，写下想法一起交流"
        />
        <GuestbookSection
          initialItems={initialItems}
          initialTotal={total}
        />
      </div>
    </main>
  );
}
