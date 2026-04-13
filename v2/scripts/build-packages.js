#!/bin/bash
# build.sh

echo "اختر نوع البناء:"
echo "1) APK"
echo "2) Linux (DEB + AppImage)"
echo "3) الكل"
read -p "رقم الاختيار: " choice

npm run build

case $choice in
1)
npx cap copy android
npx cap sync android
cd android && ./gradlew assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk ../GT-SARARIM.apk
echo "APK جاهز: GT-SARARIM.apk"
;;
2)
npx electron-builder --linux --x64
cp dist_electron/*.deb ./
cp dist_electron/*.AppImage ./
;;
3)
# APK
npx cap copy android && npx cap sync android
cd android && ./gradlew assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk ../GT-SARARIM.apk
cd ..
# Linux
npx electron-builder --linux --x64
cp dist_electron/*.deb ./
cp dist_electron/*.AppImage ./
;;
*) echo "خروج"; exit ;;
esac
