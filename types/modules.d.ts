/**
 * 模块类型声明 - 覆盖无内置类型或类型解析有问题的第三方包
 * 确保在 node_modules 安装后、部分包类型解析异常时仍有兜底
 * @see docs/05-代码审查报告.md
 */

/** lenis 平滑滚动库（动态 import 时类型解析补充） */
declare module "lenis" {
  interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    smoothWheel?: boolean;
    autoRaf?: boolean;
  }
  interface LenisInstance {
    destroy: () => void;
    raf: (time: number) => void;
  }
  const Lenis: new (options?: LenisOptions) => LenisInstance;
  export default Lenis;
}

