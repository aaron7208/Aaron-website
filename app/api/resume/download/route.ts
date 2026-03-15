/**
 * 简历下载 API
 * GET /api/resume/download - 获取简历 PDF 下载链接
 * @see docs/04-API接口文档.md § 4.1
 */

import { createHash } from "crypto";
import { NextRequest } from "next/server";
import { getResumeDownloadUrl } from "@/lib/storage/blob";
import { checkAndRecord } from "@/lib/rate-limit";
import { insertResumeDownloadLog } from "@/lib/db/queries/resume";
import { success, error } from "@/lib/api-response";

/** 对 IP 做 SHA256 哈希脱敏 */
function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

/**
 * GET - 获取简历下载 URL
 * 限流：5 次/天/IP
 * 写入 resume_download_log 用于统计
 */
export async function GET(request: NextRequest) {
  try {
    const { limited, ip } = checkAndRecord(request, "resume");
    if (limited) {
      return error("RATE_LIMITED", "下载次数已达上限，请明日再试");
    }

    const result = await getResumeDownloadUrl();
    if (!result) {
      return error("INTERNAL_ERROR", "暂无可用的简历链接");
    }

    try {
      const userAgent = request.headers.get("user-agent") ?? undefined;
      await insertResumeDownloadLog(hashIp(ip), userAgent);
    } catch (logErr) {
      console.error("[resume/download] log insert failed:", logErr);
    }

    const data = {
      url: result.url,
      expires_at: result.expiresAt || new Date(Date.now() + 3600000).toISOString(),
    };

    return success(data);
  } catch (err) {
    console.error("[resume/download GET]", err);
    return error("INTERNAL_ERROR", "服务异常");
  }
}
