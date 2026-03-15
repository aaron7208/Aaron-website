/**
 * 文件存储 - Vercel Blob 占位实现
 * 用于简历 PDF 签名 URL 生成，需安装 @vercel/blob 后完善
 * @module lib/storage/blob
 * @see docs/01-系统架构.md
 */

/** 签名 URL 结果 */
export interface SignedUrlResult {
  url: string;
  expiresAt: string;
}

/**
 * 获取简历 PDF 的下载 URL（占位实现）
 * 当前返回静态路径；集成 @vercel/blob 后可生成签名 URL
 * @returns 静态路径或 Blob 签名 URL，未配置时返回 /resume.pdf；expiresAt 为空表示静态文件
 */
export async function getResumeDownloadUrl(): Promise<SignedUrlResult | null> {
  // 可选：集成 @vercel/blob 可生成签名 URL；当前返回静态路径 /resume.pdf
  const staticPath = "/resume.pdf";
  return {
    url: staticPath,
    expiresAt: "",
  };
}
