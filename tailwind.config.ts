import type { Config } from "tailwindcss";

/**
 * Tailwind CSS 配置 - 个人网站系统
 * 设计令牌：颜色、字体、动画等
 * @see docs/01-系统架构.md
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          foreground: "rgb(var(--color-primary-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          foreground: "rgb(var(--color-accent-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
          foreground: "rgb(var(--color-muted-foreground))",
        },
      },
      boxShadow: {
        glow: "0 0 24px rgb(var(--color-primary) / 0.15)",
        "glow-accent": "0 0 24px rgb(var(--color-accent) / 0.2)",
        card:
          "0 1px 3px rgb(0 0 0 / 0.08), 0 8px 24px rgb(0 0 0 / 0.12)",
        "card-hover":
          "0 2px 6px rgb(0 0 0 / 0.09), 0 10px 32px rgb(0 0 0 / 0.14)",
        "card-hover-lg":
          "0 3px 8px rgb(0 0 0 / 0.1), 0 12px 36px rgb(0 0 0 / 0.16)",
        "card-hover-lg-dark":
          "0 3px 8px rgb(0 0 0 / 0.24), 0 12px 36px rgb(0 0 0 / 0.34)",
        "card-dark":
          "0 1px 3px rgb(0 0 0 / 0.2), 0 8px 24px rgb(0 0 0 / 0.3)",
        "card-hover-dark":
          "0 2px 6px rgb(0 0 0 / 0.22), 0 10px 32px rgb(0 0 0 / 0.32)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "card-glow-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "card-glow-spin": "card-glow-spin 4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
