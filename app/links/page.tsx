/**
 * 社交名片页面
 * 路由：/links
 * 数据流：服务端读取 content/links/data.json
 * @module app/links/page
 * @see docs/14-子页UI与首页统一方案.md
 */

import { getLinksData } from "@/lib/content/links";
import { SocialGrid } from "@/components/links/SocialGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { GradientGlowBackground } from "@/components/effects/GradientGlowBackground";

export default function LinksPage() {
  const { links } = getLinksData();

  return (
    <main className="relative container mx-auto px-4 py-12">
      <GradientGlowBackground />
      <div className="relative z-10">
        <PageHeader
          title="社交名片"
          subtitle="链接聚合与社交媒体入口"
        />
        <SocialGrid links={links} />
      </div>
    </main>
  );
}
