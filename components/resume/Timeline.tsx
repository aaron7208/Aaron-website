/**
 * 履历时间线组件 - 教育/工作经历时间线展示
 * @module components/resume/Timeline
 */

import { ExperienceCard } from "./ExperienceCard";
import type { Education, Experience } from "@/lib/content/types";
import { cn } from "@/lib/utils/cn";

export interface TimelineProps {
  /** 教育经历列表 */
  education?: Education[];
  /** 工作经历列表 */
  experience?: Experience[];
  /** 追加类名 */
  className?: string;
}

/**
 * 时间线 - 按时间顺序展示教育与工作经历
 * @param education - 教育经历
 * @param experience - 工作经历
 * @returns 时间线容器
 */
export function Timeline({ education = [], experience = [], className }: TimelineProps) {
  const hasEducation = education.length > 0;
  const hasExperience = experience.length > 0;

  if (!hasEducation && !hasExperience) {
    return (
      <p className="text-center text-slate-500 dark:text-slate-300">暂无经历数据</p>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {hasEducation && (
        <section>
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            教育经历
          </h3>
          <div className="space-y-4">
            {education.map((item, i) => (
              <ExperienceCard key={i} item={item} type="education" />
            ))}
          </div>
        </section>
      )}
      {hasExperience && (
        <section>
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            工作经历
          </h3>
          <div className="space-y-4">
            {experience.map((item, i) => (
              <ExperienceCard key={i} item={item} type="experience" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
