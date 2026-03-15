/**
 * 404 页面 - 路由匹配失败时展示
 * @module app/not-found
 * @see docs/14-子页UI与首页统一方案.md
 */

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GradientGlowBackground } from "@/components/effects/GradientGlowBackground";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center px-4">
      <GradientGlowBackground />
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1
          className="mb-2 inline-block pb-[0.22em] bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-6xl font-black leading-tight text-transparent dark:from-indigo-300 dark:to-violet-300 md:text-7xl"
        >
          404
        </h1>
        <p className="mb-8 text-lg text-slate-600 dark:text-slate-300 md:text-xl">
          页面不存在
        </p>
        <Button asChild>
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    </div>
  );
}
