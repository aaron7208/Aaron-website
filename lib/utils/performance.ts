/**
 * 性能优化工具函数
 * 节流、防抖、rAF、懒加载等
 * @module lib/utils/performance
 */

/**
 * 节流 - 在指定间隔内最多执行一次
 * @param fn - 要节流的函数
 * @param delay - 间隔（ms）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
}

/**
 * 防抖 - 延迟执行，连续调用时重置计时
 * @param fn - 要防抖的函数
 * @param delay - 延迟（ms）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, delay);
  };
}

/**
 * requestAnimationFrame 节流 - 每帧最多执行一次
 * @param fn - 回调
 * @returns 节流后的触发函数
 */
export function rafThrottle(fn: () => void): () => void {
  let rafId: number | null = null;
  return () => {
    if (rafId != null) return;
    rafId = requestAnimationFrame(() => {
      fn();
      rafId = null;
    });
  };
}

/**
 * 检测 prefers-reduced-motion，减少动画以提升可访问性
 * @returns 用户是否偏好减少动画
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * 延迟执行 - 用于将耗时任务推迟到空闲时
 * @param fn - 要执行的函数
 * @param timeout - 超时（ms），默认 100
 */
export function runWhenIdle(
  fn: () => void,
  timeout = 100
): void {
  if (typeof window === "undefined") {
    fn();
    return;
  }
  if ("requestIdleCallback" in window) {
    (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(fn, { timeout });
  } else {
    setTimeout(fn, 0);
  }
}
