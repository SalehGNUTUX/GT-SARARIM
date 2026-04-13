// scripts/build.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const target = args[0] || 'all'; // 'apk', 'linux', 'all'

function log(msg, color = 'white') {
    const colors = { red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m', white: '\x1b[37m' };
    console.log(`${colors[color]}${msg}\x1b[0m`);
}

function run(cmd, cwd = rootDir) {
    log(`> ${cmd}`, 'blue');
    try {
        execSync(cmd, { stdio: 'inherit', cwd });
        return true;
    } catch (e) {
        log(`✗ فشل: ${cmd}`, 'red');
        return false;
    }
}

// بناء الويب أولاً
log('🔨 بناء الويب...', 'yellow');
if (!run('npm run build')) process.exit(1);

if (target === 'apk' || target === 'all') {
    log('📱 بناء APK...', 'yellow');
    if (!run('npx cap copy android')) process.exit(1);
    if (!run('npx cap sync android')) process.exit(1);
    if (!run('cd android && ./gradlew assembleDebug')) process.exit(1);
    const apkSrc = path.join(rootDir, 'android/app/build/outputs/apk/debug/app-debug.apk');
    const apkDest = path.join(rootDir, 'GT-SARARIM.apk');
    if (fs.existsSync(apkSrc)) {
        fs.copyFileSync(apkSrc, apkDest);
        log(`✅ APK تم إنشاؤه: ${apkDest}`, 'green');
    } else {
        log('❌ لم يتم العثور على APK', 'red');
    }
}

if (target === 'linux' || target === 'all') {
    log('🐧 بناء حزم لينكس (DEB + AppImage)...', 'yellow');
    // إنشاء electron-builder.json إذا لم يكن موجوداً
    const configPath = path.join(rootDir, 'electron-builder.json');
    if (!fs.existsSync(configPath)) {
        const config = {
            appId: 'com.gnutux.gtsararim',
            productName: 'GT-SARARIM',
            directories: { output: 'dist_electron' },
            files: ['dist/**/*', 'main.js'],
            linux: {
                target: ['deb', 'AppImage'],
                category: 'Education',
                icon: 'public/GT-SARARIM-ICON.png'
            }
        };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        log('✅ تم إنشاء electron-builder.json', 'green');
    }
    if (!run('npx electron-builder --linux --x64')) process.exit(1);
    const outDir = path.join(rootDir, 'dist_electron');
    if (fs.existsSync(outDir)) {
        const files = fs.readdirSync(outDir).filter(f => f.endsWith('.deb') || f.endsWith('.AppImage'));
        files.forEach(f => {
            const src = path.join(outDir, f);
            const dest = path.join(rootDir, f);
            fs.copyFileSync(src, dest);
            log(`✅ ${f} تم إنشاؤه`, 'green');
        });
    } else {
        log('❌ لم يتم إنشاء الحزم', 'red');
    }
}

log('🎉 عملية البناء اكتملت!', 'green');
