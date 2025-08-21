#!/bin/bash
set -euo pipefail

# 설정
PROJECT_DIR="/Users/jaden/src/ava/AVA-FE"
DEPLOY_DIR="/opt/homebrew/var/www/avazon.jdn.kr"
NGINX_BIN="/opt/homebrew/bin/nginx"
NGINX_CONF="/opt/homebrew/etc/nginx/nginx.conf"

echo "[1/5] 이동: $PROJECT_DIR"
cd "$PROJECT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm 명령을 찾을 수 없습니다. Node/NPM을 설치해주세요." >&2
  exit 1
fi

echo "[2/5] 의존성 설치 (npm ci → 실패 시 npm install)"
export CI=1
if ! npm ci; then
  echo "npm ci 실패 → npm install로 대체 진행"
  npm install
fi

echo "[3/5] 프로덕션 빌드 (npm run build)"
npm run build

echo "[4/5] 정적 파일 동기화 → $DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
rsync -a --delete "$PROJECT_DIR/build/" "$DEPLOY_DIR/"

echo "[5/5] NGINX 설정 테스트 및 초기화 (sudo)"
sudo "$NGINX_BIN" -t -c "$NGINX_CONF"
if ! sudo "$NGINX_BIN" -s reload; then
  echo "reload 실패 → nginx 시작 시도"
  sudo "$NGINX_BIN" -c "$NGINX_CONF"
fi

echo "배포 완료: https://avazon.jdn.kr (정적 호스팅)"


