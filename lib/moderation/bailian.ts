/**
 * 阿里云百炼内容审核（DashScope 千问 Qwen 大模型）
 * 不写死密钥、URL、模型名：全部从 process.env 读取；
 * 你配置的 DASHSCOPE_BASE_URL / DASHSCOPE_MODEL 不会被代码覆盖。
 * @module lib/moderation/bailian
 */

const MODERATION_TIMEOUT_MS = 8000;
/** 仅当未配置 DASHSCOPE_BASE_URL 时使用，你配置了则用你的 URL */
const FALLBACK_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
/** 仅当未配置 DASHSCOPE_MODEL 时使用；Coding 套餐请填控制台「可使用模型」里的名称，如 qwen3.5-plus */
const FALLBACK_MODEL = "qwen3.5-plus";

function getApiKey(): string | undefined {
  return process.env.DASHSCOPE_API_KEY?.trim() || undefined;
}

function getBaseUrl(): string {
  const u = process.env.DASHSCOPE_BASE_URL?.trim();
  return u ? u.replace(/\/$/, "") : FALLBACK_BASE_URL;
}

function getModel(): string {
  const m = process.env.DASHSCOPE_MODEL?.trim();
  return m || FALLBACK_MODEL;
}

/**
 * 是否已配置百炼审核（未配置则不调用，保持原有人工审核逻辑）
 */
export function isBailianConfigured(): boolean {
  return !!getApiKey();
}

/**
 * 调用阿里云百炼（千问）对话接口做内容审核
 * @param text 待审核文本（昵称 + 留言内容拼接）
 * @returns true=通过可公开展示，false=不通过或超时/异常（不展示）
 */
export async function moderateWithBailian(text: string): Promise<boolean> {
  if (!text || !text.trim()) return true;
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("[bailian] DASHSCOPE_API_KEY 未配置，跳过 AI 审核");
    return false;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), MODERATION_TIMEOUT_MS);
  const chatUrl = `${getBaseUrl()}/chat/completions`;
  const model = getModel();

  try {
    const body = {
      model,
      messages: [
        {
          role: "user",
          content: `你是一个内容审核助手。请判断以下用户留言是否违反公序良俗（包括但不限于：辱骂、人身攻击、色情、暴力、违法信息、恶意广告刷屏等）。仅回复「通过」或「不通过」，不要其他解释。\n\n留言内容：\n${text.slice(0, 2000)}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 10,
    };
    const res = await fetch(chatUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const rawBody = await res.text();
    let data: {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string; code?: string };
      output?: { text?: string };
      result?: string;
    };
    try {
      data = JSON.parse(rawBody) as typeof data;
    } catch {
      console.error("[bailian] API 返回非 JSON:", rawBody.slice(0, 300));
      return false;
    }

    if (!res.ok) {
      console.error("[bailian] 请求失败", res.status, data?.error?.message ?? rawBody.slice(0, 200));
      return false;
    }

    if (data.error?.message) {
      console.error("[bailian] API 错误:", data.error.code, data.error.message, "（若为模型不存在，可设置 DASHSCOPE_MODEL=qwen-turbo 或 qwen-plus）");
      return false;
    }

    const raw =
      data.choices?.[0]?.message?.content ??
      data.output?.text ??
      data.result ??
      "";
    const result = String(raw).trim();
    const pass = !result.includes("不通过") && result.includes("通过");
    if (!pass && result) {
      console.warn("[bailian] 审核结果:", result.slice(0, 80));
    }
    return pass;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      console.error("[bailian] 调用异常:", err.message);
    }
    return false;
  }
}
