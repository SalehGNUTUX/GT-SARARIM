/**
 * ضغط الصور عبر Canvas API - يعمل بالكامل دون إنترنت
 * يحافظ على جودة مقبولة مع تقليص حجم الملف بشكل كبير
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  mimeType?: string;
}

const DEFAULTS: Required<CompressionOptions> = {
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.75,
  mimeType: 'image/jpeg',
};

export async function compressImage(file: File, opts: CompressionOptions = {}): Promise<string> {
  const { maxWidth, maxHeight, quality, mimeType } = { ...DEFAULTS, ...opts };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // احسب الأبعاد الجديدة مع الحفاظ على النسبة
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }

        // جودة تصيير أعلى
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const result = canvas.toDataURL(mimeType, quality);
        resolve(result);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getBase64Size(base64: string): string {
  const bytes = (base64.length * 3) / 4;
  if (bytes < 1024) return `${bytes.toFixed(0)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
