#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  GT-SARARIM v2.0 — بناء APK للأندرويد
#  يستخدم Capacitor (لا إنترنت مطلوب بعد التثبيت)
# ═══════════════════════════════════════════════════════════════
set -e
BOLD='\033[1m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'

echo -e "${BOLD}${CYAN}══════════════════════════════════════════${NC}"
echo -e "${BOLD}${CYAN}   GT-SARARIM — بناء APK أندرويد       ${NC}"
echo -e "${BOLD}${CYAN}══════════════════════════════════════════${NC}\n"

# ── التحقق من المتطلبات ──
check_req() {
  if ! command -v "$1" &>/dev/null; then
    echo -e "${RED}✗ $2 غير مثبّت${NC}"
    echo -e "  ${YELLOW}→ $3${NC}"
    return 1
  fi
  echo -e "${GREEN}✓ $1 $(${1} --version 2>/dev/null | head -1)${NC}"
}

echo -e "${BOLD}▶ التحقق من المتطلبات...${NC}"
check_req node  "Node.js 18+"    "https://nodejs.org"
check_req java  "Java JDK 17+"   "sudo apt install openjdk-17-jdk"

if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
  echo -e "${RED}✗ ANDROID_HOME غير محدد${NC}"
  echo -e "  ${YELLOW}→ ثبّت Android Studio: https://developer.android.com/studio${NC}"
  echo -e "  ${YELLOW}→ ثم أضف: export ANDROID_HOME=\$HOME/Android/Sdk${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Android SDK: ${ANDROID_HOME:-$ANDROID_SDK_ROOT}${NC}"

# ── تثبيت npm ──
echo -e "\n${YELLOW}▶ تثبيت الحزم...${NC}"
if [ ! -d "node_modules" ]; then
  rm -f package-lock.json
  npm install
fi

# ── بناء Vite ──
echo -e "\n${YELLOW}▶ بناء كود الواجهة...${NC}"
npm run build

# ── إعداد Capacitor ──
echo -e "\n${YELLOW}▶ إعداد Capacitor...${NC}"
if [ ! -d "android" ]; then
  echo "  → إضافة منصة Android (مرة واحدة)..."
  npx cap add android
else
  echo "  → مجلد android موجود مسبقاً"
fi

# ── مزامنة ──
echo -e "\n${YELLOW}▶ مزامنة الملفات مع Android...${NC}"
npx cap sync android

# ── نسخ الأيقونة ──
echo -e "\n${YELLOW}▶ إعداد الأيقونات...${NC}"
ICON_SRC="public/GT-SARARIM-ICON.png"
if [ -f "$ICON_SRC" ]; then
  # res/mipmap directories
  for SIZE_DIR in android/app/src/main/res/mipmap-mdpi \
                  android/app/src/main/res/mipmap-hdpi \
                  android/app/src/main/res/mipmap-xhdpi \
                  android/app/src/main/res/mipmap-xxhdpi \
                  android/app/src/main/res/mipmap-xxxhdpi; do
    mkdir -p "$SIZE_DIR"
    cp "$ICON_SRC" "$SIZE_DIR/ic_launcher.png"
    cp "$ICON_SRC" "$SIZE_DIR/ic_launcher_round.png"
    cp "$ICON_SRC" "$SIZE_DIR/ic_launcher_foreground.png"
  done
  echo -e "${GREEN}  ✓ أيقونات مُضافة${NC}"
fi

# ── بناء APK ──
echo -e "\n${YELLOW}▶ بناء APK...${NC}"
cd android

MODE="${1:-debug}"
if [ "$MODE" = "release" ]; then
  echo "  → وضع الإصدار (release) — يلزم مفتاح توقيع"
  ./gradlew assembleRelease
  APK_PATH="app/build/outputs/apk/release/app-release.apk"
  # إذا وُجد keystore
  if [ -f "../keystore.jks" ]; then
    echo "  → توقيع APK..."
    jarsigner -verbose \
      -keystore ../keystore.jks \
      -storepass "${KEYSTORE_PASS:-android}" \
      "$APK_PATH" alias_name
    zipalign -v 4 "$APK_PATH" "../release/GT-SARARIM-release.apk"
    echo -e "${GREEN}  ✓ APK موقّع: release/GT-SARARIM-release.apk${NC}"
  else
    mkdir -p ../release
    cp "$APK_PATH" "../release/GT-SARARIM-release-unsigned.apk"
    echo -e "${YELLOW}  ⚠ APK غير موقّع: release/GT-SARARIM-release-unsigned.apk${NC}"
    echo -e "  ${YELLOW}→ وقّعه بـ Android Studio أو أنشئ keystore${NC}"
  fi
else
  echo "  → وضع التطوير (debug)"
  ./gradlew assembleDebug
  APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
  cd ..
  mkdir -p release
  cp "android/$APK_PATH" "release/GT-SARARIM-debug.apk" 2>/dev/null || \
  cp "android/app/build/outputs/apk/debug/app-debug.apk" "release/GT-SARARIM-debug.apk"
fi

cd ..

echo -e "\n${GREEN}${BOLD}══════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}✓ اكتمل البناء!${NC}"
echo -e "${BOLD}الحزم في:${NC} release/"
ls -lh release/*.apk 2>/dev/null || true
echo -e "${GREEN}${BOLD}══════════════════════════════════════════${NC}"
