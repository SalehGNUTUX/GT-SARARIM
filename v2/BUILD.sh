#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  GT-SARARIM v2.0 — سكريبت البناء والتحزيم الكامل
#  يدعم: AppImage · deb · Windows NSIS
# ═══════════════════════════════════════════════════════════════
set -e
BOLD='\033[1m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

echo -e "${BOLD}══════════════════════════════════════${NC}"
echo -e "${BOLD}   GT-SARARIM v2.0 — بناء التطبيق   ${NC}"
echo -e "${BOLD}══════════════════════════════════════${NC}\n"

# ── 1. التحقق من Node.js ──
if ! command -v node &>/dev/null; then
  echo -e "${RED}✗ Node.js غير مثبّت. ثبّته من: https://nodejs.org${NC}"
  exit 1
fi
NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo -e "${RED}✗ يلزم Node.js 18+. الإصدار الحالي: $(node -v)${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# ── 2. تثبيت الحزم ──
echo -e "\n${YELLOW}▶ تثبيت الحزم...${NC}"
rm -rf node_modules package-lock.json
npm install

# ── 3. بناء Vite ──
echo -e "\n${YELLOW}▶ بناء الكود...${NC}"
npm run build
echo -e "${GREEN}✓ تم البناء في dist/${NC}"

# ── 4. التحزيم ──
echo -e "\n${YELLOW}▶ إنتاج الحزم...${NC}"

TARGET="${1:-linux}"

case "$TARGET" in
  linux)
    echo "  📦 Linux: AppImage + deb"
    npx electron-builder --config electron-builder.json --linux
    ;;
  win)
    echo "  📦 Windows: NSIS installer"
    npx electron-builder --config electron-builder.json --win
    ;;
  all)
    echo "  📦 Linux + Windows"
    npx electron-builder --config electron-builder.json --linux --win
    ;;
  *)
    echo -e "${RED}✗ هدف غير معروف: $TARGET (linux/win/all)${NC}"
    exit 1
    ;;
esac

# ── 5. النتيجة ──
echo -e "\n${GREEN}${BOLD}══════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}✓ اكتمل التحزيم!${NC}"
echo -e "${BOLD}الحزم موجودة في:${NC} release/"
echo ""
ls -lh release/ 2>/dev/null || true
echo -e "${GREEN}${BOLD}══════════════════════════════════════${NC}"
