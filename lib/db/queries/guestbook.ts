/**
 * 留言板查询封装
 * 提供 list、create、delete 等 CRUD 操作
 * @module lib/db/queries/guestbook
 * @see docs/03-数据库设计.md
 * @see docs/04-API接口文档.md
 */

import { desc, eq, sql } from "drizzle-orm";
import { db } from "../index";
import { guestbook } from "../schema";

/** 留言列表项类型 */
export interface GuestbookItem {
  id: number;
  name: string;
  content: string;
  email: string | null;
  createdAt: string;
  approved: boolean;
}

/** 创建留言入参 */
export interface CreateGuestbookInput {
  name: string;
  content: string;
  email?: string;
}

/**
 * 分页获取留言列表（按时间倒序）
 * @param limit - 每页条数
 * @param offset - 偏移量
 * @param approvedOnly - 仅返回已审核留言（前台展示用）
 * @returns 留言列表与总数
 */
export async function listGuestbook(
  limit: number,
  offset: number,
  approvedOnly = true
): Promise<{ items: GuestbookItem[]; total: number }> {
  const where = approvedOnly ? eq(guestbook.approved, true) : undefined;

  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(guestbook)
      .where(where)
      .orderBy(desc(guestbook.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(guestbook)
      .where(where),
  ]);

  const total = Number(countResult[0]?.count ?? 0);

  return {
    items: items.map((row) => ({
      id: row.id,
      name: row.name,
      content: row.content,
      email: row.email,
      createdAt: row.createdAt,
      approved: row.approved,
    })),
    total,
  };
}

/**
 * 创建留言
 * @param data - 留言内容
 * @returns 新建留言记录，含 id、name、content、createdAt
 */
export async function createGuestbook(
  data: CreateGuestbookInput
): Promise<GuestbookItem | null> {
  const [inserted] = await db
    .insert(guestbook)
    .values({
      name: data.name,
      content: data.content,
      email: data.email || null,
      approved: false,
    })
    .returning();

  return inserted
    ? {
        id: inserted.id,
        name: inserted.name,
        content: inserted.content,
        email: inserted.email,
        createdAt: inserted.createdAt,
        approved: inserted.approved,
      }
    : null;
}

/**
 * 更新留言审核状态（AI 审核或人工审核后调用）
 * @param id - 留言 ID
 * @param approved - 是否通过
 * @returns 是否更新成功
 */
export async function updateGuestbookApproved(id: number, approved: boolean): Promise<boolean> {
  const result = await db
    .update(guestbook)
    .set({ approved })
    .where(eq(guestbook.id, id))
    .returning();
  return result.length > 0;
}

/**
 * 根据 id 删除留言（后台管理用）
 * @param id - 留言 ID
 * @returns 是否删除成功
 */
export async function deleteGuestbook(id: number): Promise<boolean> {
  const result = await db.delete(guestbook).where(eq(guestbook.id, id)).returning();
  return result.length > 0;
}
