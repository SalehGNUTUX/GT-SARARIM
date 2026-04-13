import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-assets',
      closeBundle() {
        // نسخ الأيقونة إلى dist/
        const srcIcon = path.resolve(__dirname, 'public', 'GT-SARARIM-ICON.png');
        const destDir = path.resolve(__dirname, 'dist');
        if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
        if (existsSync(srcIcon)) {
          copyFileSync(srcIcon, path.join(destDir, 'GT-SARARIM-ICON.png'));
          console.log('✓ تم نسخ الأيقونة');
        }
        // الخطوط في public/ — تُنسخ تلقائياً بواسطة Vite
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    hmr: true,
  },
});
