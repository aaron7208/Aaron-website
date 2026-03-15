/**
 * 联系表单查询封装
 * 提供 create 等操作
 * @module lib/db/queries/contact
 * @see docs/03-数据库设计.md
 * @see docs/04-API接口文档.md
 */

import { db } from "../index";
import { contact } from "../schema";

/** 创建联系记录入参 */
export interface CreateContactInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/** 联系记录类型 */
export interface ContactRecord {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  createdAt: string;
  read: boolean;
}

/**
 * 创建联系表单提交记录
 * @param data - 表单数据
 * @returns 新建记录，含 id
 */
export async function createContact(
  data: CreateContactInput
): Promise<ContactRecord | null> {
  const [inserted] = await db
    .insert(contact)
    .values({
      name: data.name,
      email: data.email,
      subject: data.subject || null,
      message: data.message,
    })
    .returning();

  return inserted
    ? {
        id: inserted.id,
        name: inserted.name,
        email: inserted.email,
        subject: inserted.subject,
        message: inserted.message,
        createdAt: inserted.createdAt,
        read: inserted.read,
      }
    : null;
}
