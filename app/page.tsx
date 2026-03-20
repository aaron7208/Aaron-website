/**
 * 首页 - 入口/导航
 * 路由：/
 * 数据流：getHomeData 静态配置，无服务端动态请求
 * @module app/page
 * @see docs/10-视觉与交互优化需求报告-二轮.md
 */

import { HeroSection } from "@/components/layout/HeroSection";
import { GradientGlowBackground } from "@/components/effects/GradientGlowBackground";
import { HomeModulesSection } from "@/components/home/HomeModulesSection";
import { getHomeData } from "@/lib/content/home";

/**
 * 模块入口配置 - icon 为字符串 key，由 HomeModulesSection（Client）内部映射
 * 因 Server Component 不能向 Client 传递函数/组件
 */
const modules = [
  {
    href: "/resume",
    label: "个人履历",
    icon: "file-text" as const,
    desc: "教育、工作经历与技能",
    highlight: true,
  },
  {
    href: "/portfolio",
    label: "作品集",
    icon: "folder-kanban" as const,
    desc: "项目展示与技术栈",
    highlight: true,
  },
  { href: "/links", label: "社交链接", icon: "link2" as const, desc: "链接聚合与社交媒体" },
  { href: "/guestbook", label: "留言板（已关闭）", icon: "message-square" as const, desc: "访客留言与互动" },
  { href: "/contact", label: "联系我", icon: "mail" as const, desc: "私密消息与表单" },
];

export default function HomePage() {
  const homeData = getHomeData();

  return (
    <main className="relative container mx-auto px-4 py-12">
      <GradientGlowBackground />
      <HeroSection data={homeData} className="relative z-10 mb-10 min-h-0 md:min-h-[28vh]" />
      <HomeModulesSection modules={modules} className="relative z-10" />
    </main>
  );
}
