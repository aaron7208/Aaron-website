#!/bin/bash
# ===========================================
# 腾讯云服务器一键部署脚本 — www.aaron7208.cn
# 用法：SSH 登录服务器后，下载并执行此脚本
#   curl -fsSL https://raw.githubusercontent.com/aaron7208/Aaron-website/main/deploy/run-on-server.sh | bash
# 或：克隆后执行
#   cd /opt/persona && bash deploy/run-on-server.sh
# ===========================================
set -e

REPO_URL="https://github.com/aaron7208/Aaron-website.git"
INSTALL_DIR="/opt/persona"
APP_DIR="${INSTALL_DIR}"

echo "===== 1. 安装 Docker ====="
if ! command -v docker &>/dev/null; then
  apt update && apt install -y ca-certificates curl gnupg
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt update && apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
else
  echo "Docker 已安装"
fi

echo "===== 2. 安装 Nginx ====="
apt install -y nginx 2>/dev/null || true

echo "===== 3. 克隆/更新代码 ====="
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"
  git fetch origin && git reset --hard origin/main
else
  mkdir -p "$(dirname $APP_DIR)"
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

echo "===== 4. 创建 .env.production ====="
if [ ! -f .env.production ]; then
  cat > .env.production << 'ENVEOF'
DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
RESEND_API_KEY=re_xxxx
SITE_OWNER_EMAIL=your@email.com
NODE_ENV=production
SITE_URL=https://www.aaron7208.cn
ENVEOF
  echo "请编辑 $APP_DIR/.env.production 填入真实值后，重新运行本脚本或执行："
  echo "  cd $APP_DIR && docker compose -f docker-compose.prod.yml up -d --build"
  exit 1
fi

echo "===== 5. 构建并启动 ====="
docker compose -f docker-compose.prod.yml up -d --build

echo "===== 6. 配置 Nginx（HTTP） ====="
cp deploy/nginx-aaron7208-http-only.conf /etc/nginx/sites-available/aaron7208
ln -sf /etc/nginx/sites-available/aaron7208 /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo "===== 部署完成 ====="
echo "应用运行在 http://127.0.0.1:3000"
echo "Nginx 已配置，请确保 DNS 已解析到本机 IP"
echo "配置 HTTPS：运行 certbot --nginx -d www.aaron7208.cn -d aaron7208.cn"
echo "或手动替换为 deploy/nginx-aaron7208.conf 并填入证书路径"
