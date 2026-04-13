# توقيع APK للنشر (Release)

## 1. إنشاء مفتاح التوقيع (مرة واحدة)

```bash
keytool -genkey -v \
  -keystore keystore.jks \
  -alias gtsararim \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=GNUTUX, OU=Education, O=GNUTUX, L=Morocco, S=Rabat, C=MA" \
  -storepass YOUR_PASSWORD \
  -keypass YOUR_PASSWORD
```

## 2. بناء Release APK موقّع

```bash
# ضع keystore.jks في مجلد المشروع ثم:
KEYSTORE_PASS=YOUR_PASSWORD bash BUILD-ANDROID.sh release
```

## 3. أو التوقيع يدوياً

```bash
# بناء APK
bash BUILD-ANDROID.sh release

# توقيع
jarsigner -verbose \
  -keystore keystore.jks \
  -storepass YOUR_PASSWORD \
  android/app/build/outputs/apk/release/app-release.apk \
  gtsararim

# ضغط ومحاذاة
zipalign -v 4 \
  android/app/build/outputs/apk/release/app-release.apk \
  release/GT-SARARIM-release.apk
```

## 4. نشر على Google Play / F-Droid
- Google Play يقبل AAB (Android App Bundle):
  ```bash
  cd android && ./gradlew bundleRelease
  # الناتج: android/app/build/outputs/bundle/release/app-release.aab
  ```
- F-Droid يقبل APK موقّع.
