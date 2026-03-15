/**
 * Drizzle Kit 配置 - 数据库迁移
 * 数据库：SQLite (dev) / Turso (prod)
 * v0.20+ 使用 driver 替代 dialect
 * @see docs/03-数据库设计.md
 */
/// <reference types="node" />

import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL ?? "file:./local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle/migrations",
  driver: authToken ? "turso" : "libsql",
  dbCredentials: authToken
    ? { url, authToken }
    : { url },
});
