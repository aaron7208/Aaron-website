/**
 * 联系表单组件 - 提交至 POST /api/contact
 * @module components/contact/ContactForm
 */

"use client";

import * as React from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export interface ContactFormProps {
  /** 追加类名 */
  className?: string;
}

/** 生成 0～20 的随机整数 */
function randomNum() {
  return Math.floor(Math.random() * 21);
}

/**
 * 联系表单 - name, email, subject, message + 简单数学验证码
 */
export function ContactForm({ className }: ContactFormProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [hp, setHp] = React.useState(""); // Honeypot，真人不可见不填
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || undefined,
          message: message.trim(),
          hp: hp.trim() || undefined,
        }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.error?.message ?? "提交失败");
        return;
      }

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSuccess(true);
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>联系我</CardTitle>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          您的信息仅站长可见，不会公开展示。
        </p>
      </CardHeader>
      <CardContent>
        {success && (
          <p className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-400">
            感谢您的留言，我会尽快回复。
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="姓名"
            placeholder="请输入您的称呼"
            helperText="2-100 字符，必填"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={100}
          />
          <Input
            label="邮箱"
            type="email"
            placeholder="example@email.com"
            helperText="必填，用于回复"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="主题（选填）"
            placeholder="简要概括您想聊的话题"
            helperText="1-200 字符"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={200}
          />
          {/* Honeypot：对用户隐藏，机器人会填，后端拒收 */}
          <div className="absolute -left-[9999px] top-0 opacity-0" aria-hidden>
            <label htmlFor="contact-hp">不要填写</label>
            <input
              id="contact-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="contact-message">
              留言内容
            </label>
            <textarea
              id="contact-message"
              placeholder="请简要描述您的问题或留言"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              minLength={1}
              maxLength={2000}
              rows={6}
              className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400">1-2000 字符，必填</p>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" loading={loading} disabled={loading}>
            发送
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
