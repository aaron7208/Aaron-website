/**
 * 个人履历页
 * 路由：/resume
 * 数据流：优先 content/resume/public.json（关于我 / 在学在用 / 经历），无则回退 data.json
 * 布局：单栏，无右侧栏；底部「站内其他页面」三链接（docs/18-履历子页问题修复说明.md § 四）
 * @module app/resume/page
 */

import { getResumePublicData, getResumeData } from "@/lib/content/resume";
import { ResumeAbout } from "@/components/resume/ResumeAbout";
import { ResumeLearning } from "@/components/resume/ResumeLearning";
import { ResumeExperience } from "@/components/resume/ResumeExperience";
import { ResumeToc } from "@/components/resume/ResumeToc";
import { ResumeScrollSnap } from "@/components/resume/ResumeScrollSnap";
import { ResumeWheelSnap } from "@/components/resume/ResumeWheelSnap";
import { ResumeQuickLinks } from "@/components/resume/ResumeQuickLinks";
import { Timeline } from "@/components/resume/Timeline";
import { SkillTree } from "@/components/resume/SkillTree";
import { PageHeader } from "@/components/layout/PageHeader";
import { GradientGlowBackground } from "@/components/effects/GradientGlowBackground";

export default function ResumePage() {
  const publicData = getResumePublicData();
  const legacyData = getResumeData();

  return (
    <main className="relative container mx-auto px-4 py-12">
      <GradientGlowBackground />
      {/* 大屏：左侧页内锚点目录（公开数据时）或无侧栏；标题随页面滚动（方案 B）、首屏、Scrollspy、滚轮 @see docs/23 */}
      <div
        className={`relative z-10 grid min-w-0 gap-10 ${publicData ? "lg:grid-cols-[200px_1fr] lg:gap-12" : ""}`}
      >
        {publicData ? <ResumeToc /> : null}
        <div className="min-w-0">
          {!publicData && (
            <div className="mx-auto max-w-3xl">
              <PageHeader
                title="个人履历"
                subtitle="关于我、在学在用与经历"
              />
            </div>
          )}

          {publicData ? (
            <>
              <ResumeScrollSnap />
              <ResumeWheelSnap />
              <div className="mx-auto max-w-3xl space-y-0">
                {/* 标题随页面滚动，与三块同一文档流，不置顶 @see docs/23 §2 方案 B */}
                <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
                  <PageHeader
                    title="个人履历"
                    subtitle="关于我、在学在用与经历"
                  />
                </div>
                {/* 第一块：关于我 */}
                <div className="snap-start pt-6">
                  <ResumeAbout data={publicData.about} />
                </div>
                {/* 第二块：在学/在用 */}
                <div className="snap-start border-t border-slate-200 pt-8 dark:border-slate-700">
                  <ResumeLearning data={publicData.learning} />
                </div>
                {/* 第三块：经历/项目 */}
                <div className="min-h-[100vh] snap-start border-t border-slate-200 py-8 dark:border-slate-700">
                  <ResumeExperience data={publicData.experience} />
                </div>
              </div>
              <div className="mx-auto max-w-3xl border-t border-slate-200 pt-6 dark:border-slate-700 lg:hidden">
                <ResumeQuickLinks title="站内其他页面" />
              </div>
            </>
          ) : (
            <>
              <div className="mt-6 grid gap-12 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Timeline
                    education={legacyData.education}
                    experience={legacyData.experience}
                  />
                </div>
                <aside>
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100 md:text-xl">
                    技能树
                  </h3>
                  <SkillTree skills={legacyData.skills} />
                </aside>
              </div>
              <ResumeQuickLinks className="lg:hidden" />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
