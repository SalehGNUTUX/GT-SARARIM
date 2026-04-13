// src/lib/imagePath.ts
export const getImagePath = (path: string): string => {
    // في بيئة Electron (التطبيق المحزم)
    if (typeof window !== 'undefined' && (window as any).electron) {
        return `/assets/${path}`;
    }
    // في بيئة التطوير
    return `/${path}`;
};

export const getAppIcon = (): string => {
    return '/GT-SARARIM-ICON.png';
};
