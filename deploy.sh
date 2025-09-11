#!/bin/bash
set -euo pipefail

# 설정
PROJECT_DIR="/Users/jaden/src/ava/AVA-FE"
DEPLOY_DIR="/opt/homebrew/var/www/avazon.jdn.kr"
NGINX_BIN="/opt/homebrew/bin/nginx"
NGINX_CONF="/opt/homebrew/etc/nginx/nginx.conf"

# .env 파일 불러오기
if [ -f "$PROJECT_DIR/.env" ]; then
  echo "[0/7] .env 파일 로드 중..."
  set -a  # 모든 변수를 export
  source "$PROJECT_DIR/.env"
  set +a  # export 설정 해제
  echo ".env 파일이 성공적으로 로드되었습니다."
else
  echo "경고: .env 파일을 찾을 수 없습니다. ($PROJECT_DIR/.env)"
fi

echo "[1/7] 이동: $PROJECT_DIR"
cd "$PROJECT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm 명령을 찾을 수 없습니다. Node/NPM을 설치해주세요." >&2
  exit 1
fi

echo "[2/7] 기존 빌드 및 캐시 정리"
rm -rf build dist node_modules/.cache

echo "[3/7] 의존성 설치 (legacy-peer-deps로 호환성 문제 해결)"
if ! npm ci --legacy-peer-deps; then
  echo "npm ci 실패 → npm install로 대체 진행"
  if ! npm install --legacy-peer-deps; then
    echo "의존성 설치 실패. package.json을 확인해주세요." >&2
    exit 1
  fi
fi

echo "[4/7] 프로덕션 빌드 (Vite 빌드)"
if ! npm run build; then
  echo "빌드 실패. 소스 코드를 확인해주세요." >&2
  exit 1
fi

# Vite는 dist 폴더에 빌드하므로 확인
if [ -d "dist" ] && [ ! -d "build" ]; then
  echo "Vite 빌드 감지: dist → build로 이동"
  mv dist build
fi

if [ ! -d "build" ]; then
  echo "빌드 디렉토리를 찾을 수 없습니다." >&2
  exit 1
fi

echo "[5/7] 정적 파일 동기화 → $DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
if ! rsync -a --delete "$PROJECT_DIR/build/" "$DEPLOY_DIR/"; then
  echo "파일 동기화 실패." >&2
  exit 1
fi

echo "[6/7] NGINX 설정 테스트 및 리로드 (sudo)"
if ! sudo "$NGINX_BIN" -t -c "$NGINX_CONF"; then
  echo "NGINX 설정 테스트 실패." >&2
  exit 1
fi

if ! sudo "$NGINX_BIN" -s reload; then
  echo "reload 실패 → nginx 시작 시도"
  if ! sudo "$NGINX_BIN" -c "$NGINX_CONF"; then
    echo "NGINX 시작 실패." >&2
    exit 1
  fi
fi

echo "[7/7] 배포 완료!"
echo "✅ 배포 완료: https://avazon.jdn.kr"
echo "📁 빌드 파일: $DEPLOY_DIR"
echo "🌐 서비스 상태를 확인하세요."


