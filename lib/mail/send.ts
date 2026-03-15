/**
 * 邮件发送 - Resend 集成
 * 用于联系表单通知、站主邮件
 * @module lib/mail/send
 * @see docs/01-系统架构.md
 */

/** 联系表单通知邮件入参 */
export interface ContactNotificationInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/** 发送结果 */
export interface SendResult {
  success: boolean;
  error?: string;
}

/**
 * 发送联系表单通知邮件至站主
 * 需配置 RESEND_API_KEY、SITE_OWNER_EMAIL 环境变量
 * @param data - 联系表单数据
 * @returns 发送结果
 */
export async function sendContactNotificationEmail(
  data: ContactNotificationInput
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
  const toEmail = process.env.SITE_OWNER_EMAIL;

  if (!apiKey) {
    return { success: false, error: "RESEND_API_KEY 未配置" };
  }

  if (!toEmail) {
    return { success: false, error: "SITE_OWNER_EMAIL 未配置" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: data.subject ? `[联系表单] ${data.subject}` : "[联系表单] 新留言",
      html: `
        <p><strong>姓名：</strong> ${escapeHtml(data.name)}</p>
        <p><strong>邮箱：</strong> ${escapeHtml(data.email)}</p>
        ${data.subject ? `<p><strong>主题：</strong> ${escapeHtml(data.subject)}</p>` : ""}
        <p><strong>留言内容：</strong></p>
        <pre>${escapeHtml(data.message)}</pre>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "未知错误";
    return { success: false, error: message };
  }
}

/**
 * HTML 转义，防止 XSS
 * @param s - 原始字符串
 * @returns 转义后字符串
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
