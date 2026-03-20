# 腾讯云部署指南 — www.aaron7208.cn

> **编制日期**：2025-03-15  
> **目标域名**：www.aaron7208.cn  
> **云服务商**：腾讯云  
> **推荐方式**：Docker + Nginx 反向代理 + HTTPS  
> **文档性质**：部署执行与验收的单一真相源；面向对象见下文

---

## 面向对象说明

| 对象 | 职责 | 本文档中对应章节 |
|------|------|------------------|
| **开发师** | 执行部署操作：在腾讯云服务器上安装环境、构建镜像、配置 Nginx、建表、绑定域名与证书等 | 第二、三、四、五节 |
| **审查师** | 验收部署结果：核对环境变量、安全配置、证书与访问、数据库与接口是否按规范完成 | 第六节「审查师验收清单」 |

---

## 一、部署架构概要

```
用户 (https://www.aaron7208.cn)
        │
        ▼
   腾讯云服务器
   ┌─────────────────────────────────────────────┐
   │  Nginx (80/443) → 反向代理 → Next.js (3000)  │
   │  Let's Encrypt / 腾讯云 SSL 证书              │
   └─────────────────────────────────────────────┘
        │
        ▼
   Turso（边缘 SQLite，云端，非本机）
```

- **应用**：Next.js 以 Docker 容器运行，监听 3000 端口
- **数据库**：Turso（libsql），需提前创建并建表
- **域名**：www.aaron7208.cn，需在腾讯云 DNSPod 添加 A 记录指向服务器公网 IP
- **HTTPS**：Nginx 终止 TLS，建议使用腾讯云免费 SSL 或 Let's Encrypt

---

## 二、开发师：前置准备（部署前完成）

### 2.1 腾讯云资源

| 资源 | 说明 |
|------|------|
| **云服务器** | 轻量应用服务器或 CVM，系统建议 Ubuntu 22.04，内存 ≥ 1GB |
| **公网 IP** | 记录服务器公网 IP，用于 DNS 解析 |
| **安全组** | 放行入站：22（SSH）、80（HTTP）、443（HTTPS） |

### 2.2 域名与 DNS（腾讯云 DNSPod）

| 操作 | 说明 |
|------|------|
| 域名 | 确认 aaron7208.cn 已在腾讯云完成实名与备案（如需） |
| 解析 | 在 DNSPod 添加 A 记录：`www` → 服务器公网 IP |

### 2.3 Turso 数据库

| 操作 | 说明 |
|------|------|
| 创建库 | 访问 [turso.tech](https://turso.tech) 创建数据库，记录 `DATABASE_URL`（如 `libsql://xxx.turso.io`）与 `TURSO_AUTH_TOKEN` |
| 建表 | 本地或任意环境执行：`DATABASE_URL="libsql://xxx" TURSO_AUTH_TOKEN="xxx" npm run db:init`（或 `db:push`），上线前完成 |

### 2.4 其他服务与密钥

| 项 | 说明 |
|------|------|
| Resend | 联系表单发邮件需 `RESEND_API_KEY`、`SITE_OWNER_EMAIL` |
| 管理接口 | 留言板已关闭（ICP 备案），无管理接口 |
| 详细履历 | 若启用 `/resume/detailed`，需 `RESUME_ACCESS_PASSWORD` |

---

## 三、开发师：服务器环境安装

### 3.1 SSH 登录

```bash
ssh root@<服务器公网IP>
# 或使用密钥：ssh -i your-key.pem ubuntu@<IP>
```

### 3.2 安装 Docker 与 Docker Compose

```bash
# Ubuntu 22.04 示例
apt update && apt install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update && apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### 3.3 安装 Nginx

```bash
apt install -y nginx
```

---

## 四、开发师：应用部署

### 4.1 克隆代码

```bash
cd /opt  # 或你偏好的目录
git clone https://github.com/aaron7208/Aaron-website.git persona
cd persona
```

### 4.2 创建生产环境变量文件

```bash
# 创建 .env.production（不提交到 Git）
cat > .env.production << 'EOF'
DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your-turso-token
RESEND_API_KEY=re_xxxxxxxx
SITE_OWNER_EMAIL=your@email.com
ADMIN_API_KEY=your-admin-secret
NODE_ENV=production
SITE_URL=https://www.aaron7208.cn
EOF
# 编辑上述文件，填入实际值
```

### 4.3 生产用 docker-compose

仓库内已提供 `docker-compose.prod.yml`，无需新建。确认内容为：

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: unless-stopped
```

### 4.4 构建并启动

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### 4.5 确认 Turso 已建表

若建表未在 2.3 完成，可在本机（有 Node 环境）执行：

```bash
DATABASE_URL="libsql://xxx" TURSO_AUTH_TOKEN="xxx" npm run db:init
```

---

## 五、开发师：Nginx 与 HTTPS

### 5.1 创建 Nginx 站点配置

**方式一：使用仓库内配置模板（推荐）**

```bash
# 克隆代码后
cp /opt/persona/deploy/nginx-aaron7208-http-only.conf /etc/nginx/sites-available/aaron7208
ln -sf /etc/nginx/sites-available/aaron7208 /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
# 配置 HTTPS 后，改用 deploy/nginx-aaron7208.conf 并替换证书路径
```

**方式二：手动创建**

```bash
cat > /etc/nginx/sites-available/aaron7208 << 'EOF'
server {
    listen 80;
    server_name www.aaron7208.cn aaron7208.cn;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/aaron7208 /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### 5.2 配置 HTTPS（二选一）

**方式 A：腾讯云免费 SSL 证书**

1. 腾讯云控制台 → SSL 证书 → 申请免费证书
2. 按指引完成验证并下载 Nginx 证书
3. 将证书文件上传到服务器（如 `/etc/nginx/ssl/`）
4. 在站点配置中增加 443 监听：

```nginx
server {
    listen 443 ssl;
    server_name www.aaron7208.cn aaron7208.cn;
    ssl_certificate     /etc/nginx/ssl/xxx.crt;
    ssl_certificate_key /etc/nginx/ssl/xxx.key;
    # ... 其余与上面 location 相同
}
```

**方式 B：Let's Encrypt（certbot）**

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d www.aaron7208.cn -d aaron7208.cn
```

### 5.3 HTTP 跳转 HTTPS（建议）

在 80 端口的 server 块中加入：

```nginx
return 301 https://www.aaron7208.cn$request_uri;
```

---

## 六、审查师验收清单

> **面向审查师**：按以下清单逐项核对，确认部署符合规范。

### 6.1 访问与证书

| 检查项 | 通过标准 |
|--------|----------|
| 首页可访问 | 浏览器访问 https://www.aaron7208.cn 正常展示，无证书警告 |
| HTTP 跳转 | 访问 http://www.aaron7208.cn 自动跳转至 https |
| 证书有效期 | 证书未过期，链完整 |

### 6.2 功能验证

| 检查项 | 通过标准 |
|--------|----------|
| 留言板 | 访问 `/guestbook` 显示「本页面仅用于展示」弹窗，关闭后展示原界面截图（ICP 备案已关闭提交功能） |
| 联系表单 | 可提交，且站主收到 Resend 通知邮件 |
| 简历下载 | `/contact` 页简历下载链接可正常下载 PDF（需 `public/resume.pdf` 存在） |
| 作品集 | 作品列表与详情页正常加载 |

### 6.3 环境与安全

| 检查项 | 通过标准 |
|--------|----------|
| 环境变量 | `.env.production` 未提交到 Git；敏感变量通过 env_file 或 secrets 注入 |
| Nginx 代理头 | `X-Real-IP`、`X-Forwarded-For`、`X-Forwarded-Proto` 已正确传递，应用限流可识别真实 IP |
| Cookie Secure | 生产环境下履历访问 Cookie 含 `Secure` 标志（见 docs/26-安全审查报告） |
| 管理接口 | 留言板已关闭，无管理接口；若恢复留言功能，`DELETE /api/guestbook/[id]` 需 Bearer 鉴权 |

### 6.4 与文档一致性

| 检查项 | 通过标准 |
|--------|----------|
| 建表 | 已用生产 `DATABASE_URL` 执行 `db:init` 或 `db:push`，Turso 中表结构正确 |
| 08 号清单 | 与 `docs/08-上线检查清单.md` 中通用检查项一致 |
| 26 号安全 | 与 `docs/26-安全审查报告.md` 中已修复项与快速修复清单一致 |

---

## 七、常见问题（开发师参考）

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| 502 Bad Gateway | Next.js 容器未启动或 3000 端口未监听 | `docker compose -f docker-compose.prod.yml ps` 检查；`docker compose logs app` 查日志 |
| 联系表单报错 | Turso 未建表或环境变量错误 | 确认 `DATABASE_URL`、`TURSO_AUTH_TOKEN` 正确；重新执行 `db:init`（留言板已关闭，仅联系表单需建表） |
| 无邮件通知 | 未配置 Resend 或 `SITE_OWNER_EMAIL` | 检查 `.env.production` 中 Resend 相关变量 |
| 限流失效 | `X-Forwarded-For` 未正确传递或应用前存在不可信代理 | 确认 Nginx 配置中包含 `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for`；详见 docs/26 |

---

## 八、更新与回滚（开发师参考）

```bash
cd /opt/persona
git pull
docker compose -f docker-compose.prod.yml up -d --build
# 若需回滚：git checkout <旧 commit> 后重新构建
```
