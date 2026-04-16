#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  GT-SARARIM — build-all.sh
#  يبني نسخ Linux (AppImage + deb) و Windows (NSIS) و Android (APK)
#  الاستخدام:
#    ./build-all.sh              ← Linux + Windows + Android
#    ./build-all.sh linux        ← Linux فقط
#    ./build-all.sh windows      ← Windows فقط
#    ./build-all.sh android      ← Android فقط (debug)
#    ./build-all.sh android release ← Android release
#    ./build-all.sh desktop      ← Linux + Windows فقط
# ═══════════════════════════════════════════════════════════════
set -e

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
DIM='\033[2m'
NC='\033[0m'

TARGET="${1:-all}"   # all | linux | windows | android | desktop
ANDROID_MODE="${2:-debug}"  # debug | release

# ─────────────────────────────────────────────
# دوال مساعدة
# ─────────────────────────────────────────────
ok()   { echo -e "  ${GREEN}✓${NC} $*"; }
warn() { echo -e "  ${YELLOW}⚠${NC}  $*"; }
fail() { echo -e "  ${RED}✗${NC}  $*"; }
step() { echo -e "\n${BOLD}▶ $*${NC}"; }

print_header() {
  echo -e "${BOLD}${CYAN}"
  echo "  ╔══════════════════════════════════════╗"
  echo "  ║     GT-SARARIM — بناء الحزم         ║"
  echo "  ╚══════════════════════════════════════╝"
  echo -e "${NC}"
}

# ─────────────────────────────────────────────
# 1. فحص اعتماديات سطح المكتب
# ─────────────────────────────────────────────
check_desktop_deps() {
  step "فحص اعتماديات سطح المكتب..."
  local fail_count=0

  # Node.js (يلزم >= 18)
  if command -v node &>/dev/null; then
    local node_ver
    node_ver=$(node -e "process.stdout.write(process.version)" 2>/dev/null)
    local node_major
    node_major=$(echo "$node_ver" | sed 's/v\([0-9]*\).*/\1/')
    if [ "$node_major" -ge 18 ]; then
      ok "Node.js $node_ver"
    else
      warn "Node.js $node_ver — يُنصح بـ 18 أو أحدث"
    fi
  else
    fail "Node.js غير مثبت  →  https://nodejs.org"
    (( fail_count++ ))
  fi

  # npm
  if command -v npm &>/dev/null; then
    ok "npm $(npm --version)"
  else
    fail "npm غير مثبت"
    (( fail_count++ ))
  fi

  # node_modules
  if [ -d "node_modules" ]; then
    ok "node_modules موجودة"
  else
    warn "node_modules غير موجودة — سيتم تثبيتها تلقائياً"
  fi

  # wine فقط إذا كنا نبني لـ Windows على Linux
  if [[ "$TARGET" == "all" || "$TARGET" == "desktop" || "$TARGET" == "windows" ]]; then
    if [[ "$(uname)" == "Linux" ]]; then
      if command -v wine &>/dev/null; then
        ok "wine $(wine --version 2>/dev/null | head -1)"
      else
        warn "wine غير مثبت — بناء Windows على Linux قد يفشل"
        warn "  التثبيت:  sudo apt install wine"
      fi
    fi
  fi

  if [ "$fail_count" -gt 0 ]; then
    echo -e "\n${RED}${BOLD}أُوقف البناء: يرجى تثبيت الاعتماديات المطلوبة أعلاه.${NC}"
    exit 1
  fi
}

# ─────────────────────────────────────────────
# 2. فحص اعتماديات Android
# ─────────────────────────────────────────────
check_android_deps() {
  step "فحص اعتماديات Android..."
  local fail_count=0

  # Java
  if command -v java &>/dev/null; then
    ok "java $(java --version 2>/dev/null | head -1)"
  else
    fail "Java JDK غير مثبت  →  sudo apt install openjdk-17-jdk"
    (( fail_count++ ))
  fi

  # Android SDK
  if [ -n "$ANDROID_HOME" ] || [ -n "$ANDROID_SDK_ROOT" ]; then
    ok "Android SDK: ${ANDROID_HOME:-$ANDROID_SDK_ROOT}"
  else
    fail "ANDROID_HOME غير محدد"
    fail "  ثبّت Android Studio ثم أضف: export ANDROID_HOME=\$HOME/Android/Sdk"
    (( fail_count++ ))
  fi

  if [ "$fail_count" -gt 0 ]; then
    echo -e "\n${RED}${BOLD}أُوقف بناء Android: يرجى تثبيت الاعتماديات المطلوبة أعلاه.${NC}"
    return 1
  fi
  return 0
}

# ─────────────────────────────────────────────
# 3. تثبيت الحزم إذا لزم
# ─────────────────────────────────────────────
install_deps() {
  if [ ! -d "node_modules" ]; then
    step "تثبيت حزم npm..."
    npm install
    ok "اكتمل التثبيت"
  fi
}

# ─────────────────────────────────────────────
# 4. بناء Vite (مشترك لجميع الأهداف)
# ─────────────────────────────────────────────
build_vite() {
  step "بناء واجهة Vite..."
  npm run build 2>&1 | grep -v "Some chunks are larger" \
                     | grep -v "Using dynamic import" \
                     | grep -v "Use build.rollupOptions" \
                     | grep -v "Adjust chunk size"
  ok "اكتمل بناء Vite  →  dist/"
}

# ─────────────────────────────────────────────
# 5. بناء حزم Linux
# ─────────────────────────────────────────────
build_linux() {
  step "بناء حزم Linux (AppImage + deb)..."
  npx electron-builder --config electron-builder.json --linux 2>&1 \
    | grep -v "^  •" | grep -E "error|Error|✓|AppImage|deb|✗|warn|Cannot" \
    || true
  ok "اكتمل بناء Linux"
}

# ─────────────────────────────────────────────
# 6. بناء حزم Windows
# ─────────────────────────────────────────────
build_windows() {
  step "بناء حزمة Windows (NSIS installer)..."
  if [[ "$(uname)" == "Linux" ]]; then
    echo -e "  ${DIM}(البناء المتقاطع عبر wine...)${NC}"
  fi
  npx electron-builder --config electron-builder.json --win 2>&1 \
    | grep -v "^  •" | grep -E "error|Error|✓|nsis|exe|✗|warn|Cannot" \
    || true
  ok "اكتمل بناء Windows"
}

# ─────────────────────────────────────────────
# 7. بناء APK Android
# ─────────────────────────────────────────────
build_android() {
  step "بناء APK Android (${ANDROID_MODE})..."

  # إعداد Capacitor
  if [ ! -d "android" ]; then
    echo -e "  → إضافة منصة Android..."
    npx cap add android
  else
    echo -e "  ${DIM}→ مجلد android موجود مسبقاً${NC}"
  fi

  # مزامنة الملفات
  echo -e "  → مزامنة الملفات مع Android..."
  npx cap sync android 2>&1 | grep -v "^$" | sed 's/^/  /'

  # نسخ الأيقونات
  local ICON_SRC="public/GT-SARARIM-ICON.png"
  if [ -f "$ICON_SRC" ]; then
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
    ok "أيقونات Android جاهزة"
  fi

  # تشغيل Gradle
  mkdir -p release
  if [ "$ANDROID_MODE" = "release" ]; then
    echo -e "  → وضع الإصدار (release) — يلزم مفتاح توقيع"
    (cd android && ./gradlew assembleRelease 2>&1 | tail -5)
    local APK="android/app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK" ]; then
      if [ -f "keystore.jks" ]; then
        jarsigner -verbose \
          -keystore keystore.jks \
          -storepass "${KEYSTORE_PASS:-android}" \
          "$APK" alias_name
        zipalign -v 4 "$APK" "release/GT-SARARIM-release.apk"
        ok "APK موقّع  →  release/GT-SARARIM-release.apk"
      else
        cp "$APK" "release/GT-SARARIM-release-unsigned.apk"
        warn "APK غير موقّع  →  release/GT-SARARIM-release-unsigned.apk"
        warn "  وقّعه بـ Android Studio أو أنشئ keystore.jks"
      fi
    fi
  else
    (cd android && ./gradlew assembleDebug 2>&1 | tail -5)
    cp "android/app/build/outputs/apk/debug/app-debug.apk" \
       "release/GT-SARARIM-debug.apk" 2>/dev/null || true
    ok "APK جاهز  →  release/GT-SARARIM-debug.apk"
  fi
}

# ─────────────────────────────────────────────
# 8. ملخص الحزم المنتجة
# ─────────────────────────────────────────────
print_summary() {
  echo -e "\n${BOLD}${GREEN}══════════════════════════════════════════${NC}"
  echo -e "${BOLD}${GREEN}  ✓  اكتمل البناء بنجاح!${NC}"
  echo -e "${BOLD}${GREEN}══════════════════════════════════════════${NC}"
  echo -e "\n${BOLD}الحزم المنتجة في  release/ :${NC}"
  local found=0
  for ext in AppImage deb exe apk; do
    if ls release/*.$ext 2>/dev/null | head -5; then
      found=1
    fi
  done
  if [ "$found" -eq 0 ]; then
    echo -e "  ${YELLOW}لم تُعثر على حزم في release/${NC}"
  else
    echo ""
    ls -lh release/*.AppImage release/*.deb release/*.exe release/*.apk 2>/dev/null \
      | awk '{printf "  %-50s %s\n", $NF, $5}' || true
  fi
  echo ""
}

# ─────────────────────────────────────────────
# التنفيذ الرئيسي
# ─────────────────────────────────────────────
print_header

cd "$(dirname "$0")"

case "$TARGET" in
  android)
    if check_android_deps; then
      install_deps
      build_vite
      build_android
    fi
    ;;
  linux)
    check_desktop_deps
    install_deps
    build_vite
    build_linux
    print_summary
    ;;
  windows)
    check_desktop_deps
    install_deps
    build_vite
    build_windows
    print_summary
    ;;
  desktop)
    check_desktop_deps
    install_deps
    build_vite
    build_linux
    build_windows
    print_summary
    ;;
  all|*)
    check_desktop_deps
    install_deps
    build_vite
    build_linux
    build_windows
    # Android اختياري — يُنفَّذ فقط إذا توفّر Android SDK
    if check_android_deps 2>/dev/null; then
      build_android
    else
      warn "تم تخطي بناء Android (ANDROID_HOME غير محدد أو Java مفقود)"
    fi
    print_summary
    ;;
esac
