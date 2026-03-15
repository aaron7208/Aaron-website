/**
 * 简历下载日志查询
 * @module lib/db/queries/resume
 * @see docs/03-数据库设计.md
 */

import { db } from "../index";
import { resumeDownloadLog } from "../schema";

/**
 * 写入简历下载日志（用于统计与限流）
 * @param ipHash - IP 哈希（脱敏）
 * @param userAgent - 浏览器 UA（可选）
 */
export async function insertResumeDownloadLog(
  ipHash: string,
  userAgent?: string
): Promise<void> {
  await db.insert(resumeDownloadLog).values({
    ipHash,
    userAgent: userAgent ?? null,
  });
}
