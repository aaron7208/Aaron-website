# API 接口文档

> 文档版本：v1.0  
> 最后更新：2025-03-14  
> Base URL：`/api`（相对路径，同源部署）

---

## 一、通用规范

### 1.1 请求头

| Header | 说明 |
|--------|------|
| Content-Type | application/json（POST/PUT 请求） |
| Accept | application/json |

### 1.2 响应格式

**成功：**
```json
{
  "success": true,
  "data": { ... }
}
```

**失败：**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "用户可读的错误描述"
  }
}
```

### 1.3 错误码

| 错误码 | HTTP 状态 | 说明 |
|--------|-----------|------|
| BAD_REQUEST | 400 | 请求参数无效 |
| UNAUTHORIZED | 401 | 未认证 |
| FORBIDDEN | 403 | 无权限 |
| NOT_FOUND | 404 | 资源不存在 |
| RATE_LIMITED | 429 | 请求过于频繁 |
| INTERNAL_ERROR | 500 | 服务端异常 |

### 1.4 认证与授权

- 留言、联系表单：无需认证，通过 rate limit 防刷。
- 删除留言、管理联系记录：需后台管理鉴权（后续扩展，当前可无）。

---

## 二、留言板 API

### 2.1 获取留言列表

**端点**：`GET /api/guestbook`

**认证**：无需

**查询参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | number | 否 | 每页条数，默认 20 |
| offset | number | 否 | 偏移量，默认 0 |
| approved | boolean | 否 | 仅前台调用时固定为 true |

**响应示例**：
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "访客A",
        "content": "网站很酷！",
        "email": null,
        "created_at": "2025-03-14T10:00:00.000Z",
        "approved": 1
      }
    ],
    "total": 42
  }
}
```

---

### 2.2 提交留言

**端点**：`POST /api/guestbook`

**认证**：无需

**请求体**：
```json
{
  "name": "string (必填, 2-50 字符)",
  "content": "string (必填, 1-500 字符)",
  "email": "string (可选, 有效邮箱格式)"
}
```

**校验规则**：
- name：2–50 字符，去除首尾空白
- content：1–500 字符
- email：可选，若提供须为有效邮箱

**响应示例**：
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "访客B",
    "content": "期待更多作品！",
    "created_at": "2025-03-14T10:05:00.000Z"
  }
}
```

**限流**：同一 IP 每分钟最多 3 次提交（可配置）

---

### 2.3 删除留言（可选，后台用）

**端点**：`DELETE /api/guestbook/[id]`

**认证**：**必须**。`Authorization: Bearer <ADMIN_API_KEY>`，环境变量 `ADMIN_API_KEY`。若未配置鉴权，该接口**不应对外暴露**。临时方案采用 API Key；生产可替换为 NextAuth 等。

**路径参数**：`id` — 留言 ID

**响应**：204 No Content 或 200 + `{ "success": true }`

---

## 三、联系表单 API

### 3.1 提交联系表单

**端点**：`POST /api/contact`

**认证**：无需

**请求体**：
```json
{
  "name": "string (必填, 2-100 字符)",
  "email": "string (必填, 有效邮箱)",
  "subject": "string (可选, 1-200 字符)",
  "message": "string (必填, 1-2000 字符)"
}
```

**校验规则**：
- name：2–100 字符
- email：有效邮箱格式
- subject：可选，1–200 字符
- message：1–2000 字符

**响应示例**：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "message": "感谢您的留言，我会尽快回复。",
    "mailSent": true
  }
}
```

**说明**：`mailSent`（可选）— 邮件是否发送成功，失败时可显式返回 `false`。

**副作用**：触发邮件发送至站主邮箱（Resend）

**限流**：同一 IP 每小时最多 5 次提交

---

## 四、简历下载 API

### 4.1 获取简历下载链接

**端点**：`GET /api/resume/download`

**认证**：无需（或可选 token 鉴权）

**说明**：返回简历 PDF 的临时下载 URL（如 Vercel Blob signed URL），或重定向至静态文件。

**响应示例（返回 URL）**：
```json
{
  "success": true,
  "data": {
    "url": "https://xxx.blob.vercel-storage.com/resume.pdf?token=...",
    "expires_at": "2025-03-14T11:00:00.000Z"
  }
}
```

**或**：302 重定向至 PDF 地址

**副作用**：可写入 `resume_download_log` 用于统计与限流（如每日每 IP 限制 5 次）

---

## 五、限流说明

| 端点 | 限流策略 |
|------|----------|
| POST /api/guestbook | 3 次/分钟/IP |
| POST /api/contact | 5 次/小时/IP |
| GET /api/resume/download | 5 次/天/IP（可选） |

限流实现建议：Upstash Redis Rate Limit 或内存/文件简单计数器（单实例部署时）。

---

## 六、变更记录

| 日期 | 变更内容 |
|------|----------|
| 2025-03-14 | 初版：guestbook、contact、resume/download |
