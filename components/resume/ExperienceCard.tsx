/**
 * 经历卡片组件 - 单条教育/工作经历展示
 * @module components/resume/ExperienceCard
 */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import type { Education, Experience } from "@/lib/content/types";
import { cn } from "@/lib/utils/cn";

export interface ExperienceCardProps {
  /** 教育经历或工作经历数据 */
  item: Education | Experience;
  /** 类型：教育 | 工作 */
  type: "education" | "experience";
  /** 追加类名 */
  className?: string;
}

/**
 * 经历卡片 - 展示学校/公司、角色、时间、描述
 * @param item - 经历数据
 * @param type - 教育或工作
 * @returns 卡片元素
 */
export function ExperienceCard({ item, type, className }: ExperienceCardProps) {
  const isEducation = type === "education";
  const title = isEducation ? (item as Education).school : (item as Experience).company;
  const subtitle = isEducation ? (item as Education).degree : (item as Experience).role;
  const exp = item as Experience;

  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{subtitle}</p>
        <p className="text-xs text-slate-500 dark:text-slate-500">{item.period}</p>
      </CardHeader>
      {(item.description || (exp.highlights && exp.highlights.length > 0)) && (
        <CardContent className="pt-0">
          {item.description && (
            <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
          )}
          {exp.highlights && exp.highlights.length > 0 && (
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-300">
              {exp.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}
        </CardContent>
      )}
    </Card>
  );
}
