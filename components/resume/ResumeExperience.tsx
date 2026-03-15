/**
 * 履历 - 经历/项目（技术项目 + 其他）
 * @module components/resume/ResumeExperience
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type {
  ResumePublicExperience,
  ResumePublicTechProject,
  ResumePublicOther,
} from "@/lib/content/types";
import { cn } from "@/lib/utils/cn";

export interface ResumeExperienceProps {
  data: ResumePublicExperience;
  className?: string;
}

function TechProjectCard({ item }: { item: ResumePublicTechProject }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">{item.title}</CardTitle>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-200">
          {item.role}
        </p>
        {item.duration && (
          <p className="text-xs text-slate-500 dark:text-slate-300">
            {item.duration}
          </p>
        )}
      </CardHeader>
      {(item.highlights?.length || item.note) && (
        <CardContent className="pt-0">
          {item.highlights && item.highlights.length > 0 && (
            <ul className="max-w-prose list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-200">
              {item.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}
          {item.note && (
            <p className="mt-2 max-w-prose text-sm text-slate-500 dark:text-slate-300">
              {item.note}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function OtherCard({ item }: { item: ResumePublicOther }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">{item.title}</CardTitle>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-200">
          {item.role}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-300">
          {item.period}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="max-w-prose text-sm text-slate-600 dark:text-slate-200">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
}

export function ResumeExperience({ data, className }: ResumeExperienceProps) {
  const { techProjects = [], other = [] } = data;
  const hasTech = techProjects.length > 0;
  const hasOther = other.length > 0;

  if (!hasTech && !hasOther) return null;

  return (
    <section id="experience" className={cn("space-y-8", className)}>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl">
        经历 / 项目
      </h2>
      {hasTech && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
            技术项目
          </h3>
          <div className="space-y-4">
            {techProjects.map((item, i) => (
              <TechProjectCard key={i} item={item} />
            ))}
          </div>
        </div>
      )}
      {hasOther && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
            其他经历
          </h3>
          <div className="space-y-4">
            {other.map((item, i) => (
              <OtherCard key={i} item={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
