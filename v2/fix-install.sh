#!/bin/bash
echo "🔧 تنظيف التثبيت السابق..."
rm -rf node_modules package-lock.json yarn.lock

echo "📦 تثبيت الحزم..."
npm install

echo ""
echo "✅ تم التثبيت! شغّل: npm run dev"
