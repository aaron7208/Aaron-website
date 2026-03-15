/**
 * 根模板 - 路由切换时触发重渲染，用于页面过渡
 * @see docs/11-视觉与交互优化需求报告-三轮.md
 */

import { PageTransition } from "@/components/effects/PageTransition";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
