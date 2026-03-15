/**
 * 根布局 - Next.js App Router
 * 全局样式、字体、Provider、特效（平滑滚动）
 * @see docs/01-系统架构.md
 */
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/effects/SmoothScroll";

export const metadata: Metadata = {
  title: "Aaron | 个人网站",
  description: "个人履历 | 作品集 | 社交名片",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('persona-theme');var d=t==='light'?false:t==='dark'||!t?true:window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark">
          <SmoothScroll>
            <Header />
            <main className="min-h-[calc(100vh-8rem)]">{children}</main>
            <Footer />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
