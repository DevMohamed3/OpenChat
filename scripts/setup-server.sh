#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/opt/zerozone
REPO="devmuhammed3/zerozone"

echo "==> Checking Docker..."
if ! command -v docker &>/dev/null; then
  echo "    Docker not found. Install it manually: https://docs.docker.com/engine/install/"
  echo "    Then re-run this script."
  exit 1
fi

if ! docker compose version &>/dev/null; then
  echo "    docker compose not found. Install Docker Compose plugin."
  exit 1
fi

echo "==> Creating app directory..."
sudo mkdir -p "$APP_DIR"
sudo chown "$USER:$USER" "$APP_DIR"

echo "==> Creating .env file..."
if [ ! -f "$APP_DIR/.env" ]; then
  cat > "$APP_DIR/.env" <<-EOF
DATABASE_URL=postgresql://zerozone:\${POSTGRES_PASSWORD:-changeme}@postgres:5432/zerozone
NODE_ENV=production
JWT_SECRET=change-me
PORT=4000
BASE_URL=https://api.yourdomain.com
ZEROZONE_ALLOWED_ORIGINS=https://yourdomain.com
COOKIE_DOMAIN=.yourdomain.com
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
EOF
  echo "    Created $APP_DIR/.env — edit it with your real values"
else
  echo "    $APP_DIR/.env already exists, keeping it"
fi

echo "==> Creating docker-compose.yml..."
if [ ! -f "$APP_DIR/docker-compose.yml" ]; then
  cat > "$APP_DIR/docker-compose.yml" <<-COMPOSE
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: zerozone
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-changeme}
      POSTGRES_DB: zerozone
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U zerozone"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    image: ghcr.io/$REPO:latest
    ports:
      - "\${PORT:-4000}:4000"
    env_file:
      - .env
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - uploads:/app/uploads
    restart: unless-stopped

volumes:
  pgdata:
  uploads:
COMPOSE
  echo "    Created $APP_DIR/docker-compose.yml"
else
  echo "    $APP_DIR/docker-compose.yml already exists, keeping it"
fi

echo ""
echo "==> Setup complete! Next steps:"
echo "    1. Edit $APP_DIR/.env with your real values (set POSTGRES_PASSWORD, JWT_SECRET, etc.)"
echo "    2. cd $APP_DIR && docker compose pull"
echo "    3. cd $APP_DIR && docker compose run --rm backend npx prisma migrate deploy"
echo "    4. cd $APP_DIR && docker compose up -d"
echo ""
echo "    If port 4000 conflicts with another site, change PORT in .env"
