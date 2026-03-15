/**
 * 技能树组件 - 技能分类展示
 * @module components/resume/SkillTree
 */

import type { SkillCategory } from "@/lib/content/types";
import { cn } from "@/lib/utils/cn";

export interface SkillTreeProps {
  /** 技能分类列表 */
  skills: SkillCategory[];
  /** 追加类名 */
  className?: string;
}

/**
 * 技能树 - 按分类展示技能标签
 * @param skills - 技能分类数组
 * @returns 技能树容器
 */
export function SkillTree({ skills, className }: SkillTreeProps) {
  if (!skills.length) {
    return (
      <p className="text-center text-slate-500 dark:text-slate-300">暂无技能数据</p>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {skills.map((category, i) => (
        <div key={i}>
          <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            {category.name}
          </h4>
          <div className="flex flex-wrap gap-2">
            {category.items.map((item, j) => (
              <span
                key={j}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
