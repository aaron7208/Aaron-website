/**
 * 履历 - 关于我
 * @module components/resume/ResumeAbout
 */

import type { ResumePublicAbout } from "@/lib/content/types";
import { cn } from "@/lib/utils/cn";

export interface ResumeAboutProps {
  data: ResumePublicAbout;
  className?: string;
}

export function ResumeAbout({ data, className }: ResumeAboutProps) {
  if (!data.paragraphs?.length) return null;

  return (
    <section id="about" className={cn("space-y-4", className)}>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl">
        关于我
      </h2>
      <div className="max-w-prose space-y-4">
        {data.paragraphs.map((p, i) => (
          <p
            key={i}
            className="leading-relaxed text-slate-600 dark:text-slate-200"
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
