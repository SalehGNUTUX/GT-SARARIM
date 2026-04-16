const SALT = 'gt_sararim_secure_2025_v2';

export function simpleHash(str: string): string {
  const input = str.toLowerCase().trim() + SALT;
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h) + input.charCodeAt(i);
    h = h & h;
  }
  return Math.abs(h).toString(36);
}

export function verifyHash(plain: string, hash: string): boolean {
  return simpleHash(plain) === hash;
}

export const SECURITY_QUESTIONS: string[] = [
  'مَا هُوَ تَارِيخُ مِيلَادِ الْأَبِ؟ (مِثَالٌ: 1985)',
  'مَا هُوَ تَارِيخُ مِيلَادِ الْأُمِّ؟ (مِثَالٌ: 1988)',
  'مَا هُوَ اسْمُ مَدِينَةِ السُّكْنَى؟',
  'مَا هُوَ اسْمُ أَوَّلِ طِفْلٍ فِي الْعَائِلَةِ؟',
  'مَا هُوَ اسْمُ أَوَّلِ مَدْرَسَةٍ لِلطِّفْلِ؟',
  'مَا هُوَ الْحَيَوَانُ الْأَلِيفُ فِي الْمَنْزِلِ؟ (أَوِ اكْتُبْ: لَا يُوجَدُ)',
  'مَا هُوَ الرَّقْمُ الْمُفَضَّلُ لِلْعَائِلَةِ؟',
  'مَا هُوَ اسْمُ الْجَدِّ أَوِ الْجَدَّةِ؟',
];

export function backupChildrenData(users: any[], levelProgress: Record<string, any>): string {
  const backup = {
    version: '2.0',
    timestamp: new Date().toISOString(),
    children: users.filter((u: any) => u.role === 'child'),
    levelProgress,
  };
  return JSON.stringify(backup, null, 2);
}

export function downloadAsJSON(data: string, filename: string) {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
