import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../store/useStore';
import { audioEngine } from '../lib/audioEngine';
import { AMBIENT_SOUNDS, AmbientSound } from '../types';

export function AudioPlayerGlobal() {
  const { settings } = useStore();
  const prevId = useRef<string>('');

  useEffect(() => {
    if (!settings.audioEnabled || settings.selectedAudioId === 'silence') {
      audioEngine.stop();
      prevId.current = '';
      return;
    }
    const sound = AMBIENT_SOUNDS.find(s => s.id === settings.selectedAudioId);
    if (!sound) return;
    if (prevId.current !== settings.selectedAudioId) {
      audioEngine.play(sound.type, settings.audioVolume);
      prevId.current = settings.selectedAudioId;
    } else {
      audioEngine.setVolume(settings.audioVolume);
    }
    return () => { /* keep playing */ };
  }, [settings.audioEnabled, settings.selectedAudioId, settings.audioVolume]);

  return null;
}

/** زر الصوت المختصر في الهيدر */
export function AudioToggleBtn() {
  const { settings, updateSettings } = useStore();
  const [started, setStarted] = useState(false);

  const toggle = () => {
    if (!started) setStarted(true);
    updateSettings({ audioEnabled: !settings.audioEnabled });
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full hover:bg-[#F0F0F0] dark:hover:bg-[#333] transition-colors"
      title={settings.audioEnabled ? 'إِيقَافُ الصَّوْتِ' : 'تَشْغِيلُ الصَّوْتِ'}
    >
      {settings.audioEnabled
        ? <Volume2 className="w-5 h-5 text-[#4CAF50]" />
        : <VolumeX className="w-5 h-5 text-[#B2BEC3]" />
      }
    </button>
  );
}
