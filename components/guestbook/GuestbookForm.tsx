/**
 * 留言表单组件 - 提交至 POST /api/guestbook
 * @module components/guestbook/GuestbookForm
 */

"use client";

import * as React from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export interface GuestbookFormProps {
  /** 提交成功回调（用于刷新列表） */
  onSuccess?: () => void;
  /** 追加类名 */
  className?: string;
}

/**
 * 留言表单 - name, content, email（可选）
 */
export function GuestbookForm({ onSuccess, className }: GuestbookFormProps) {
  const [name, setName] = React.useState("");
  const [content, setContent] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          content: content.trim(),
          email: email.trim() || undefined,
        }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.error?.message ?? "提交失败");
        return;
      }

      setName("");
      setContent("");
      setEmail("");
      setSuccessMessage(json.data?.message ?? "留言已提交，审核通过后将公开展示。");
      onSuccess?.();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>留下你的足迹</CardTitle>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          留言将公开展示，与访客互动。
        </p>
      </CardHeader>
      <CardContent>
        {successMessage && (
          <p className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {successMessage}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="昵称"
            placeholder="请输入您的昵称"
            helperText="2-50 字符，必填"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={50}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="guestbook-content">
              留言内容
            </label>
            <textarea
              id="guestbook-content"
              placeholder="写下你想说的话"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={1}
              maxLength={500}
              rows={4}
              className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400">1-500 字符，必填</p>
          </div>
          <Input
            label="邮箱（选填）"
            type="email"
            placeholder="example@email.com"
            helperText="选填，用于回复通知"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" loading={loading} disabled={loading}>
            提交留言
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
