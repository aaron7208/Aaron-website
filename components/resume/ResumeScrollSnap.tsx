/**
 * 履历页：为 html 添加 resume-snap 类（锚点平滑、scroll-padding、section scroll-margin）
 * 进入页时滚动到顶部，保证首屏为标题 + 关于我 @see docs/23
 */

"use client";

import { useEffect } from "react";

const CLASS = "resume-snap";

export function ResumeScrollSnap() {
  useEffect(() => {
    document.documentElement.classList.add(CLASS);
    window.scrollTo(0, 0);
    return () => {
      document.documentElement.classList.remove(CLASS);
    };
  }, []);
  return null;
}
