#!/bin/bash
set -e

echo "══════════════════════════════════════"
echo "   GT-SARARIM v2.0 — إعداد المشروع   "
echo "══════════════════════════════════════"

# تنظيف أي تثبيت سابق
echo "🧹 تنظيف الملفات السابقة..."
rm -rf node_modules package-lock.json 2>/dev/null || true

# تثبيت الحزم
echo "📦 تثبيت الحزم..."
npm install

echo ""
echo "✅ اكتمل التثبيت!"
echo ""
echo "الأوامر المتاحة:"
echo "  npm run dev        — تشغيل وضع التطوير"
echo "  npm run build      — بناء للإنتاج"
echo "  npm run electron   — تشغيل كتطبيق سطح مكتب"
echo "  npm run pack:linux — إنتاج AppImage + deb"
echo ""
