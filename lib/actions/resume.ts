/**
 * 简历相关 Server Actions
 * 获取下载链接
 * @see docs/04-API接口文档.md
 */

"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { getResumeDownloadUrl } from "@/lib/storage/blob";
import { checkAndRecordFromHeaders } from "@/lib/rate-limit";
import { insertResumeDownloadLog } from "@/lib/db/queries/resume";

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

/**
 * 获取简历下载链接 Server Action
 * 含限流 5 次/天/IP，成功时写入 resume_download_log
 */
export async function getResumeDownloadUrlAction() {
  const headersList = await headers();
  const { limited, ip } = checkAndRecordFromHeaders(headersList, "resume");
  if (limited) {
    return { success: false, url: null, error: "下载次数已达上限" };
  }

  const result = await getResumeDownloadUrl();
  if (!result) {
    return { success: false, url: null };
  }

  try {
    const userAgent = headersList.get("user-agent") ?? undefined;
    await insertResumeDownloadLog(hashIp(ip), userAgent);
  } catch (logErr) {
    console.error("[resume action] log insert failed:", logErr);
  }

  return {
    success: true,
    url: result.url || "/resume.pdf",
    expiresAt: result.expiresAt,
  };
}
