/**
 * 履历 - 在学/在用
 * @module components/resume/ResumeLearning
 */

import type { ResumePublicLearning } from "@/lib/content/types";
import { cn } from "@/lib/utils/cn";

export interface ResumeLearningProps {
  data: ResumePublicLearning;
  className?: string;
}

export function ResumeLearning({ data, className }: ResumeLearningProps) {
  const { tagline, projectStack, studyPlan, closingLine } = data;

  return (
    <section id="learning" className={cn("space-y-6", className)}>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl">
        在学 / 在用
      </h2>
      {tagline && (
        <p className="max-w-prose text-lg font-medium text-primary dark:text-indigo-300">
          {tagline}
        </p>
      )}
      {projectStack?.items?.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {projectStack.label}
          </h3>
          <div className="flex flex-wrap gap-2">
            {projectStack.items.map((item, i) => (
              <span
                key={i}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
      {studyPlan?.items?.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {studyPlan.label}
          </h3>
          <ul className="max-w-prose list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-200">
            {studyPlan.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {closingLine && (
        <blockquote className="max-w-prose border-l-4 border-primary/40 pl-4 italic text-slate-600 dark:border-indigo-400/40 dark:text-slate-200">
          {closingLine}
        </blockquote>
      )}
    </section>
  );
}
