/**
 * Drizzle 数据库客户端初始化
 * 开发环境：SQLite 本地文件 | 生产环境：Turso (libsql 边缘)
 * @module lib/db
 * @see docs/03-数据库设计.md
 */

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

/** 数据库连接 URL，开发默认本地文件 */
const url = process.env.DATABASE_URL ?? "file:./local.db";

/** libsql 客户端 - 生产环境需配置 TURSO_AUTH_TOKEN */
const client = createClient({
  url,
  ...(process.env.TURSO_AUTH_TOKEN && {
    authToken: process.env.TURSO_AUTH_TOKEN,
  }),
});

/**
 * Drizzle ORM 实例，注入 schema 以支持类型推断
 * @example
 * import { db } from "@/lib/db";
 * const users = await db.select().from(guestbook);
 */
export const db = drizzle(client, { schema });
