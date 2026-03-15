/**
 * 详细履历页（🟡 验证层 - 需密码访问）
 * 路由：/resume/detailed
 * 数据：GET /api/resume/detailed（需先 POST /api/resume/verify-password 获得 Cookie）
 * @see docs/16-个人信息录入与分层保护方案.md
 */

"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GradientGlowBackground } from "@/components/effects/GradientGlowBackground";
import { Timeline } from "@/components/resume/Timeline";
import { SkillTree } from "@/components/resume/SkillTree";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ResumeData } from "@/lib/content/types";

type ViewState = "loading" | "locked" | "unlocked" | "not_found" | "error";

export default function ResumeDetailedPage() {
  const [view, setView] = React.useState<ViewState>("loading");
  const [data, setData] = React.useState<ResumeData | null>(null);
  const [password, setPassword] = React.useState("");
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const fetchDetailed = React.useCallback(async () => {
    const res = await fetch("/api/resume/detailed", { credentials: "include" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setView("unlocked");
        return;
      }
    }
    if (res.status === 401) setView("locked");
    else if (res.status === 404) setView("not_found");
    else setView("error");
  }, []);

  React.useEffect(() => {
    fetchDetailed();
  }, [fetchDetailed]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitLoading(true);
    try {
      const res = await fetch("/api/resume/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        await fetchDetailed();
        setPassword("");
      } else {
        setSubmitError(json.error?.message ?? "验证失败");
      }
    } catch {
      setSubmitError("网络错误，请重试");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <main className="relative container mx-auto px-4 py-12">
      <GradientGlowBackground />
      <div className="relative z-10">
        <PageHeader
          title="详细履历"
          subtitle="需输入访问密码查看"
        />
        {view === "loading" && (
          <p className="text-slate-500 dark:text-slate-300">验证中…</p>
        )}
        {view === "locked" && (
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>输入访问密码</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUnlock} className="space-y-4">
                <Input
                  type="password"
                  label="密码"
                  placeholder="请输入详细履历访问密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                {submitError && (
                  <p className="text-sm text-red-500">{submitError}</p>
                )}
                <Button type="submit" loading={submitLoading} disabled={submitLoading}>
                  解锁
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        {view === "not_found" && (
          <p className="text-slate-500 dark:text-slate-300">
            暂无详细履历内容。可在 content/resume/detailed.json 中维护。
          </p>
        )}
        {view === "error" && (
          <p className="text-slate-500 dark:text-slate-300">
            加载失败，请稍后重试。
          </p>
        )}
        {view === "unlocked" && data && (
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Timeline education={data.education} experience={data.experience} />
            </div>
            <aside>
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100 md:text-xl">
                技能树
              </h3>
              <SkillTree skills={data.skills} />
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
