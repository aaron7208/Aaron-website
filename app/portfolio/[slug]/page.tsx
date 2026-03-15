/**
 * 作品详情页 - 动态路由
 * 路由：/portfolio/[slug]
 * 数据流：Server Component 根据 slug 读取 content/portfolio/projects/[slug].json
 * @module app/portfolio/[slug]/page
 * @see docs/14-子页UI与首页统一方案.md, docs/20-作品集页面优化报告.md
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/content/portfolio";
import { isValidHref } from "@/lib/utils/url";
import { TechTag } from "@/components/portfolio/TechTag";
import { MediaPreviewList } from "@/components/portfolio/MediaPreview";
import { Button } from "@/components/ui/Button";
import { GradientGlowBackground } from "@/components/effects/GradientGlowBackground";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";

export interface PageProps {
  /** Next.js 15+ 可能改为 Promise<{ slug: string }>，升级时确认并必要时 await params */
  params: { slug: string };
}

/** 静态生成：预生成所有作品页 */
export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const slugs = getAllProjectSlugs();
  const currentIndex = slugs.indexOf(slug);
  const nextSlug = currentIndex >= 0 && currentIndex < slugs.length - 1 ? slugs[currentIndex + 1] : null;
  const nextProject = nextSlug ? getProjectBySlug(nextSlug) : null;

  const learningsArr = project.learnings
    ? Array.isArray(project.learnings)
      ? project.learnings
      : [project.learnings]
    : [];

  const safePreview = project.links?.preview && isValidHref(project.links.preview) ? project.links.preview : null;
  const safeRepo = project.links?.repo && isValidHref(project.links.repo) ? project.links.repo : null;

  return (
    <main className="relative container mx-auto px-4 py-12">
      <GradientGlowBackground />
      <div className="relative z-10">
        <Link
          href="/portfolio"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-primary dark:text-slate-300 dark:hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          返回作品集
        </Link>
        <article>
          {/* 品字形：上 title，左下 介绍+亮点，右下 图片 */}
          <header className="mb-8">
            <h1
              className="mb-0 inline-block pb-[0.22em] bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text font-black leading-tight text-transparent dark:from-indigo-300 dark:to-violet-300 text-4xl md:text-5xl lg:text-6xl tracking-tight"
            >
              {project.title}
            </h1>
          </header>

          {/* 品字型：上 title，左下 介绍+亮点，右下 图片；左右对半分 */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="min-w-0">
              {project.description && (
                <p className="mb-4 text-lg text-slate-600 dark:text-slate-300 md:text-xl">
                  {project.description}
                </p>
              )}
              <div className="mb-4 flex flex-wrap gap-2">
                {project.techStack?.map((tech, i) => (
                  <TechTag key={i}>{tech}</TechTag>
                ))}
              </div>
              {(safePreview || safeRepo) && (
                <div className="mb-8 flex flex-wrap gap-4">
                  {safePreview && (
                    <Button variant="default" asChild>
                      <a href={safePreview} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        预览
                      </a>
                    </Button>
                  )}
                  {safeRepo && (
                    <Button variant="outline" asChild>
                      <a href={safeRepo} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        仓库
                      </a>
                    </Button>
                  )}
                </div>
              )}

              {project.highlights && project.highlights.length > 0 && (
                <section className="mb-10">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100 md:text-xl">
                    项目亮点
                  </h2>
                  <ul className="list-inside list-disc space-y-2 text-slate-600 dark:text-slate-300">
                    {project.highlights.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {project.thumbnail && (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-700 shadow-lg shadow-[inset_0_0_12px_rgba(0,0,0,0.2)] lg:min-h-0 dark:border-white/10 dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.35)] dark:shadow-xl">
                <Image
                  src={project.thumbnail}
                  alt={`${project.title} 首页`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            )}
          </div>

          {project.media && project.media.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100 md:text-xl">
                作品展示
              </h2>
              <MediaPreviewList items={project.media} />
            </section>
          )}

          {learningsArr.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100 md:text-xl">
                学习收获
              </h2>
              <div className="space-y-3 text-slate-600 dark:text-slate-300">
                {learningsArr.map((p, i) => (
                  <p key={i} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          )}

          <nav className="mt-12 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-8 dark:border-slate-700" aria-label="作品导航">
            {nextProject ? (
              <Link
                href={`/portfolio/${nextSlug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline dark:text-indigo-300"
              >
                下一个：{nextProject.title}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-indigo-400"
            >
              <ArrowLeft className="h-4 w-4" />
              返回作品集
            </Link>
          </nav>
        </article>
      </div>
    </main>
  );
}
