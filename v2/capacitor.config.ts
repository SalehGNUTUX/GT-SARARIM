import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gnutux.gtsararim',
  appName: 'GT-SARARIM',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // تشغيل بالكامل بدون إنترنت
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,        // دعم لوحة مفاتيح عربية
    webContentsDebuggingEnabled: false,
    backgroundColor: '#FDFCF0',
    // دعم الشاشات الكبيرة والأجهزة اللوحية
    useLegacyBridge: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FDFCF0',
      showSpinner: false,
      androidSpinnerStyle: 'small',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
