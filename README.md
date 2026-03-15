# Persona - 个人网站系统

个人履历、作品集、社交名片、留言板、联系表单一体化网站。

## 技术栈

- **前端**: Next.js 14 (App Router)、TypeScript、Tailwind CSS、Framer Motion、Three.js/R3F
- **后端**: Next.js API Routes、Drizzle ORM、SQLite/Turso
- **服务**: Resend 邮件、Vercel Blob 存储

## 快速开始

### 1. 安装依赖（必选，否则 IDE 会报 drizzle-kit、process 等类型错误）

```bash
npm install
# 或
pnpm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
# 编辑 .env.local 填入实际值
```

### 3. 数据库初始化（必选，否则留言板/联系表单报错「no such table」）

**方式一：推送到数据库（推荐）**
```bash
npm run db:push
```

**方式二：生成迁移后执行**
```bash
npm run db:generate   # 生成迁移文件
npm run db:migrate    # 执行迁移
```

**方式三：直接建表（db:push 失败时备用）**
```bash
npm run db:init
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 上线前必读

本地预览与生产环境有差异，上线前请阅读 **`docs/08-上线检查清单.md`**，重点包括：

- **Vercel**：必须使用 Turso，且需在**上线前**用生产 `DATABASE_URL` 执行建表
- **Docker**：需正确配置数据库路径与首次建表

---

## 部署（Vercel）

### 1. 连接仓库

在 Vercel 控制台导入 Git 仓库。

### 2. 配置环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| DATABASE_URL | 是 | Turso 连接 URL（如 `libsql://xxx.turso.io`） |
| TURSO_AUTH_TOKEN | 是 | Turso 鉴权 Token |
| RESEND_API_KEY | 否 | 联系表单邮件 |
| SITE_OWNER_EMAIL | 否 | 站主邮箱（收件） |
| ADMIN_API_KEY | 否 | DELETE 留言接口鉴权 |

### 3. 上线前建表（重要）

在部署前，本地执行一次（使用生产 Turso 凭据）：

```bash
DATABASE_URL="libsql://your-db.turso.io" TURSO_AUTH_TOKEN="xxx" npm run db:init
```

否则留言板、联系表单会报「no such table」错误。

### 4. 构建命令

```bash
npm run build
```

### 5. 产出物

- 输出：standalone
- 静态资源：自动处理

## 本地数据库（开发）

默认使用 `file:./local.db`。首次运行**必须**执行以下命令之一创建表：

```bash
npm run db:push    # 推荐：直接推送 schema
# 或
npm run db:init    # 备用：脚本建表
```

## 静态内容

- `content/resume/data.json` - 履历数据
- `content/portfolio/index.json` - 作品列表
- `content/portfolio/projects/[slug].json` - 作品详情
- `content/links/data.json` - 社交链接

## 简历文件

将 `resume.pdf` 置于 `public/` 目录，或配置 Vercel Blob 提供签名 URL。

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发模式 |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务 |
| `npm run lint` | ESLint 检查 |
| `npm run db:generate` | 生成 Drizzle 迁移 |
| `npm run db:migrate` | 执行迁移 |
| `npm run db:studio` | Drizzle Studio |
