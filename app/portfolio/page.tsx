/**
 * 作品集列表页
 * 路由：/portfolio
 * 数据流：Server Component 直接读取 content/portfolio/index.json
 * @module app/portfolio/page
 * @see docs/14-子页UI与首页统一方案.md, docs/20-作品集页面优化报告.md
 */

import { getPortfolioIndex } from "@/lib/content/portfolio";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { GradientGlowBackground } from "@/components/effects/GradientGlowBackground";

export default function PortfolioPage() {
  const { projects } = getPortfolioIndex();

  return (
    <main className="relative min-h-screen container mx-auto px-4 py-12">
      <GradientGlowBackground />
      <div className="relative z-10 overflow-visible">
        <PageHeader
          title="Vibe-Coding 作品集"
          subtitle="项目展示、技术栈与链接"
        />
        <ProjectGrid projects={projects} />
      </div>
    </main>
  );
}
