import { useEffect } from 'react';
import { useStore } from '../store/useStore';

// ── مشغل صوت الخلفية — يعتمد على ملفات OGG فقط ──
let _audioEl: HTMLAudioElement | null = null;
let _currentId = '';
let _currentVol = 0.5;

function startGlobalSound(soundId: string, vol: number, sounds: any[]) {
  if (_currentId === soundId && _audioEl && !_audioEl.paused) {
    // تحديث مستوى الصوت فقط إذا كان نفس الملف
    _audioEl.volume = Math.max(0, Math.min(1, vol / 100));
    _currentVol = vol;
    return;
  }
  stopGlobalSound();
  const sound = sounds.find((s: any) => s.id === soundId);
  if (!sound) return;
  _currentId = soundId;
  _currentVol = vol;
  const v = Math.max(0, Math.min(1, vol / 100));

  if (sound.audioUrl) {
    // ملف OGG مدمج
    _audioEl = new Audio(sound.audioUrl);
  } else if (sound.audioData) {
    // ملف صوتي مرفوع من المستخدم (base64)
    _audioEl = new Audio(sound.audioData);
  } else {
    return;
  }
  _audioEl.loop = true;
  _audioEl.volume = v;
  _audioEl.play().catch(() => {
    // قد يرفض المتصفح التشغيل قبل تفاعل المستخدم
  });
}

function stopGlobalSound() {
  if (_audioEl) {
    _audioEl.pause();
    _audioEl.src = '';
    _audioEl = null;
  }
  _currentId = '';
}

export function BackgroundMusic() {
  const { settings, backgroundSounds } = useStore();
  const { soundEnabled, backgroundSoundId, soundVolume } = settings;

  useEffect(() => {
    if (soundEnabled && backgroundSoundId) {
      // Small delay to ensure we're in a user-gesture context or AudioContext was already created
      const t = setTimeout(() => {
        startGlobalSound(backgroundSoundId, soundVolume, backgroundSounds || []);
      }, 100);
      return () => clearTimeout(t);
    } else {
      stopGlobalSound();
    }
    // Do NOT return stopGlobalSound here — persist across re-mounts
  }, [soundEnabled, backgroundSoundId, soundVolume]);

  return null;
}

// Export for child sound controls
export { startGlobalSound, stopGlobalSound };
