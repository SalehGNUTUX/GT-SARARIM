#!/bin/bash
set -e
echo "🏗️  بناء GT-SARARIM v2.0..."

# بناء Vite
echo "⚡ بناء Vite..."
npm run build

# إنتاج حزم Linux
echo "📦 إنتاج حزم Linux..."
npx electron-builder --config electron-builder.json --linux

echo ""
echo "✅ اكتمل البناء! الحزم موجودة في: release/"
ls -lh release/ 2>/dev/null || true
