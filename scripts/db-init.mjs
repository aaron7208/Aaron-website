/**
 * 数据库初始化脚本 - 创建 guestbook、contact、resume_download_log 表
 * 当 drizzle-kit push 不可用时，运行此脚本：node scripts/db-init.mjs
 */

import { createClient } from "@libsql/client";
import { existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dbPath = join(root, "local.db");
const dbDir = dirname(dbPath);

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const url = process.env.DATABASE_URL ?? `file:${dbPath}`;
const client = createClient({
  url,
  ...(process.env.TURSO_AUTH_TOKEN && { authToken: process.env.TURSO_AUTH_TOKEN }),
});

const statements = [
  `CREATE TABLE IF NOT EXISTS guestbook (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    email TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    approved INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS contact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    "read" INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS resume_download_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_hash TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  "CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook(created_at DESC)",
  "CREATE INDEX IF NOT EXISTS idx_guestbook_approved ON guestbook(approved)",
  "CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact(created_at DESC)",
  'CREATE INDEX IF NOT EXISTS idx_contact_read ON contact("read")',
  "CREATE INDEX IF NOT EXISTS idx_resume_log_created_at ON resume_download_log(created_at)",
  "CREATE INDEX IF NOT EXISTS idx_resume_log_ip_hash ON resume_download_log(ip_hash)",
];

async function main() {
  try {
    for (const stmt of statements) {
      await client.execute(stmt);
    }
    console.log("✅ 数据库表已创建完成 (guestbook, contact, resume_download_log)");
  } catch (err) {
    console.error("❌ 初始化失败:", err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

main();
