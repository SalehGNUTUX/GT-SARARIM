#!/bin/bash
echo "🔨 بناء GT-SARARIM للحزم (DEB + AppImage)..."
npm run build
echo "✅ تم بناء الويب"

echo "🐧 بناء حزم لينكس..."
npx electron-builder --linux --x64

if [ -f "release/GT-SARARIM-1.0.0.deb" ]; then
  echo "✅ تم إنشاء DEB: release/GT-SARARIM-1.0.0.deb"
  cp release/GT-SARARIM-1.0.0.deb ./
fi

if [ -f "release/GT-SARARIM-1.0.0.AppImage" ]; then
  echo "✅ تم إنشاء AppImage: release/GT-SARARIM-1.0.0.AppImage"
  cp release/GT-SARARIM-1.0.0.AppImage ./
fi

echo "🎉 اكتمل البناء!"
