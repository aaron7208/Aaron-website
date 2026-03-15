/**
 * 履历页滚轮翻页：轻滚即平滑滚动到下一/上一区块，顺滑且即时响应
 * 替代 CSS 瞬间吸附，改用 scrollIntoView({ behavior: 'smooth' })
 */

"use client";

import { useCallback, useEffect, useRef } from "react";

const SECTION_IDS = ["about", "learning", "experience"] as const;
const COOLDOWN_MS = 500;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** 标题随页面滚动（方案 B），无需标题高度偏移 */
function getSectionIndex(): number {
  if (typeof document === "undefined") return 0;
  const scrollTop = window.scrollY;
  const threshold = 80;
  let index = 0;
  for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
    const el = document.getElementById(SECTION_IDS[i]);
    if (el && el.getBoundingClientRect().top + window.scrollY <= scrollTop + threshold) {
      index = i;
      break;
    }
  }
  return index;
}

function scrollToSection(index: number) {
  const id = SECTION_IDS[Math.max(0, Math.min(index, SECTION_IDS.length - 1))];
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function ResumeWheelSnap() {
  const cooldownUntil = useRef(0);
  const reducedMotion = useRef(false);

  const onWheel = useCallback((e: WheelEvent) => {
    if (reducedMotion.current) return;
    const now = Date.now();
    if (now < cooldownUntil.current) {
      e.preventDefault();
      return;
    }
    const delta = e.deltaY;
    if (Math.abs(delta) < 10) return;
    const current = getSectionIndex();
    const next = delta > 0 ? current + 1 : current - 1;
    if (next < 0 || next >= SECTION_IDS.length) return;
    e.preventDefault();
    cooldownUntil.current = now + COOLDOWN_MS;
    scrollToSection(next);
  }, []);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    const handler = () => {
      reducedMotion.current = mq.matches;
    };
    mq.addEventListener("change", handler);

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      mq.removeEventListener("change", handler);
    };
  }, [onWheel]);

  return null;
}
