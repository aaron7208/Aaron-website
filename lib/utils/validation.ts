/**
 * 校验工具 - Zod Schema 定义
 * 用于留言板、联系表单等 API 请求校验
 * @module lib/utils/validation
 * @see docs/04-API接口文档.md
 */

import { z } from "zod";

/**
 * 留言板提交校验 Schema
 * - name: 2-50 字符，自动 trim
 * - content: 1-500 字符
 * - email: 可选，若提供须为有效邮箱格式
 */
export const guestbookSchema = z.object({
  name: z.string().min(2, "昵称至少 2 个字符").max(50, "昵称最多 50 个字符").trim(),
  content: z.string().min(1, "留言内容不能为空").max(500, "留言最多 500 字符"),
  email: z
    .string()
    .email("请输入有效邮箱")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
});

/**
 * 联系表单提交校验 Schema
 * - name: 2-100 字符
 * - email: 必填，有效邮箱
 * - subject: 可选，1-200 字符
 * - message: 1-2000 字符
 * - hp: Honeypot 防机器人，若被填写则视为机器人
 */
export const contactSchema = z.object({
  name: z.string().min(2, "姓名至少 2 个字符").max(100, "姓名最多 100 个字符").trim(),
  email: z.string().email("请输入有效邮箱"),
  subject: z.string().max(200, "主题最多 200 字符").optional(),
  message: z.string().min(1, "留言内容不能为空").max(2000, "留言最多 2000 字符"),
  hp: z.string().optional(), // Honeypot：真人留空，机器人会填；后端见填即拒
});

/** 留言板提交类型推断 */
export type GuestbookSubmit = z.infer<typeof guestbookSchema>;

/** 联系表单提交类型推断 */
export type ContactSubmit = z.infer<typeof contactSchema>;
