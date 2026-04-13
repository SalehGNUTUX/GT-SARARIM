# GT-SARARIM v2.0 — التثبيت

## التثبيت السريع

```bash
cd gt-sararim-final
bash fix-install.sh   # يحذف node_modules ويثبت من جديد
npm run dev           # يشغل على http://localhost:5173
```

## أو يدوياً

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## إنتاج الحزم

```bash
npm run build
npm run pack:linux    # AppImage + deb
```

## كلمة المرور الافتراضية: admin
