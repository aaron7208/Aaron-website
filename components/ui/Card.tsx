/**
 * 卡片组件
 * 提供 Card、CardHeader、CardContent、CardFooter 子组件
 * @module components/ui/Card
 */

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type CardVariant = "default" | "highlight";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** L2 高亮卡片：ring-2、阴影加深、强调色点缀 */
  variant?: CardVariant;
}

/**
 * 卡片容器
 * 双层阴影；Hover 微上浮(2px) + 阴影加深 + 克制光晕；点击 scale 0.98
 * variant=highlight 用于 L2 卡片（履历、作品集）；悬停时强调条淡出
 * @see docs/11-视觉与交互优化需求报告-三轮.md
 * @see docs/12-视觉与交互优化需求报告-四轮.md
 */
export function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "group/card relative overflow-visible rounded-xl",
        "transition-all duration-200 ease-out",
        "motion-reduce:transform-none motion-reduce:transition-none",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
        className
      )}
    >
      {/* 悬停光晕：透明度 10%～20%，克制不刺眼 */}
      <div
        className={cn(
          "absolute inset-[-2px] -z-10 overflow-hidden rounded-xl opacity-0 transition-opacity duration-300",
          "group-hover/card:opacity-100",
          "motion-reduce:opacity-0"
        )}
        aria-hidden
      >
        <div
          className="absolute inset-[-50%] left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 animate-card-glow-spin"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, rgb(129 140 248 / 0.15) 20%, rgb(167 139 250 / 0.18) 40%, transparent 60%)",
          }}
        />
      </div>

      <div
        className={cn(
          "relative m-[2px] min-h-0 overflow-hidden rounded-[10px]",
          variant === "highlight"
            ? "bg-slate-50 dark:bg-slate-800/90 dark:border dark:border-slate-600/60"
            : "bg-white dark:bg-slate-800 dark:border dark:border-slate-600/60",
          "shadow-card dark:shadow-card-dark",
          "group-active:scale-[0.98]",
          "group-hover/card:-translate-y-0.5 group-hover/card:shadow-card-hover dark:group-hover/card:shadow-card-hover-dark",
          variant === "highlight" && [
            "ring-2 ring-primary/25",
            "border-l-4 border-l-accent dark:border-l-violet-300 transition-colors duration-200",
            "group-hover/card:border-l-accent/35 dark:group-hover/card:border-l-violet-300/40",
            "group-hover/card:shadow-card-hover-lg dark:group-hover/card:shadow-card-hover-lg-dark group-hover/card:ring-primary/35",
            "dark:group-hover/card:ring-primary/45",
          ]
        )}
        {...props}
      />
    </div>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片头部区域
 */
export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * 卡片标题 - 大字号加粗，与描述形成强对比
 */
export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        "text-xl font-extrabold leading-tight tracking-tight md:text-2xl",
        className
      )}
      {...props}
    />
  );
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * 卡片描述文本 - text-slate-500 提升可读性
 */
export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn(
        "text-sm font-normal leading-relaxed text-slate-500 dark:text-slate-300",
        className
      )}
      {...props}
    />
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片主体内容区域
 */
export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片底部区域
 */
export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
