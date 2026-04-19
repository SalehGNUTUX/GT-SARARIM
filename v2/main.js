const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

// ─── مسار ثابت لبيانات المستخدم — يضمن الحفاظ على البيانات عبر تحديثات AppImage ───
// يجب استدعاؤه قبل app.whenReady() تماماً
app.setPath('userData', path.join(os.homedir(), '.gt-sararim-data'));

// ─── إصلاح دعم الإدخال العربي (IBus/Fcitx) على Linux ───
if (process.platform === 'linux') {
  // دعم طرق الإدخال العربية على Linux
  app.commandLine.appendSwitch('gtk-version', '3');
  app.commandLine.appendSwitch('enable-features', 'UseOzonePlatform');
  // تعطيل sandbox إذا لزم (بعض توزيعات Linux)
  // app.commandLine.appendSwitch('no-sandbox');
}

// ─── ضمان ظهور النصوص العربية بشكل صحيح ───
app.commandLine.appendSwitch('lang', 'ar');

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 820,
    minWidth: 360,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // السماح بحفظ البيانات محلياً بشكل صحيح
      partition: 'persist:gtsararim',
      // دعم مدخلات النصوص
      spellcheck: false,
    },
    icon: path.join(__dirname, 'dist', 'GT-SARARIM-ICON.png'),
    title: 'GT-SARARIM — سارة ريم',
    backgroundColor: '#FDFCF0',
  });

  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    win.loadFile(indexPath);
  } else {
    win.loadURL('data:text/html,<html lang="ar" dir="rtl"><body style="font-family:sans-serif;padding:2em;direction:rtl"><h1>خطأ: يرجى تشغيل npm run build أولاً</h1></body></html>');
  }

  // DevTools فقط في التطوير
  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    win.webContents.openDevTools();
  }

  win.setMenuBarVisibility(false);

  // ─── إصلاح: التأكد أن localStorage يعمل مع file:// في الإنتاج ───
  win.webContents.on('did-finish-load', () => {
    // التحقق من أن localStorage يخزن العربية بشكل صحيح
    win.webContents.executeJavaScript(`
      try {
        const testKey = '__arabic_test__';
        localStorage.setItem(testKey, 'أَحْمَدُ');
        const val = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        if (val !== 'أَحْمَدُ') console.warn('localStorage Arabic encoding issue');
      } catch(e) {
        console.error('localStorage not available:', e);
      }
    `).catch(() => {});
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
