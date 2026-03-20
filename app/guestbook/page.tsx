/**
 * 留言板页面 - 仅展示
 * 为符合 ICP 备案，留言功能已关闭，本页仅用于展示原界面截图
 * @module app/guestbook/page
 */

"use client";

import * as React from "react";
import Image from "next/image";
import { GradientGlowBackground } from "@/components/effects/GradientGlowBackground";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

export default function GuestbookPage() {
  const [modalOpen, setModalOpen] = React.useState(true);

  return (
    <main className="relative container mx-auto px-4 py-12">
      <GradientGlowBackground />
      <div className="relative z-10">
        <PageHeader title="留言板" subtitle="公开留言与互动，写下想法一起交流" />
        {modalOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guestbook-modal-title"
          >
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 dark:shadow-slate-950/50">
              <h2 id="guestbook-modal-title" className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                提示
              </h2>
              <p className="mb-6 text-slate-600 dark:text-slate-300">
                为符合相关法律规定，本页面仅用于展示。
              </p>
              <Button onClick={() => setModalOpen(false)} className="w-full gap-2">
                <X className="h-4 w-4" />
                关闭
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative mx-auto w-full max-w-[min(96vw,90rem)] overflow-hidden rounded-3xl border border-slate-200/60 bg-slate-50/80 shadow-2xl shadow-slate-300/30 dark:border-slate-600/40 dark:bg-slate-900/80 dark:shadow-black/20">
            <Image
              src="/images/留言板.png"
              alt="留言板界面截图"
              width={1440}
              height={900}
              className="w-full object-contain"
              sizes="(max-width: 1536px) 96vw, 90rem"
              priority
            />
          </div>
        )}
      </div>
    </main>
  );
}
