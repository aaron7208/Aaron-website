/**
 * 数据库表结构定义 - Drizzle ORM
 * 表：guestbook, contact, resume_download_log
 * @see docs/03-数据库设计.md
 */

import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/** 留言表 - 索引见 migrations */
export const guestbook = sqliteTable("guestbook", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  content: text("content").notNull(),
  email: text("email"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  approved: integer("approved", { mode: "boolean" }).notNull().default(false),
});

/** 联系表单提交记录 - 索引见 migrations */
export const contact = sqliteTable("contact", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
});

/** 简历下载日志（可选） - 索引见 migrations */
export const resumeDownloadLog = sqliteTable("resume_download_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ipHash: text("ip_hash"),
  userAgent: text("user_agent"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
