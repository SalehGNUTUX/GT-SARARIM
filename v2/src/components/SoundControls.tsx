import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';

export function SoundControls() {
  const { settings, updateSettings, backgroundSounds } = useStore();
  const { soundEnabled, backgroundSoundId, soundVolume } = settings;
  const [expanded, setExpanded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // إغلاق عند النقر خارج القائمة
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded]);

  const toggle = () => updateSettings({ soundEnabled: !soundEnabled });
  const setSound = (id: string) => updateSettings({ backgroundSoundId: id, soundEnabled: true });

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setExpanded(e => !e)}
        className={`flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:gap-1.5 sm:px-3 sm:py-1.5 rounded-full text-sm font-bold transition-all ${
          soundEnabled
            ? 'bg-[#4CAF50]/15 text-[#4CAF50] border border-[#4CAF50]/30'
            : 'bg-[#F0F0F0] dark:bg-[#333] text-[#636E72] dark:text-[#A0A0A0] border border-[#E5E5E5] dark:border-[#444]'
        }`}
        title="التحكم في الصوت"
      >
        {soundEnabled ? <Volume2 className="w-4 h-4 shrink-0"/> : <VolumeX className="w-4 h-4 shrink-0"/>}
        <span className="hidden sm:block">{expanded ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            style={{ position: 'fixed', top: '60px', left: 0, right: 0, margin: '0 auto', width: '260px', maxWidth: 'calc(100vw - 32px)', zIndex: 9999 }}
            className="bg-white dark:bg-[#222] border-2 border-[#E5E5E5] dark:border-[#333] rounded-2xl shadow-xl p-3"
            onClick={e => e.stopPropagation()}
          >
            {/* Toggle */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b dark:border-[#333]">
              <span className="text-sm font-bold dark:text-white">صَوْتُ الْخَلْفِيَّةِ</span>
              <button
                onClick={toggle}
                className={`w-10 h-5 rounded-full relative transition-colors ${soundEnabled ? 'bg-[#4CAF50]' : 'bg-[#E5E5E5] dark:bg-[#444]'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${soundEnabled ? 'right-0.5' : 'left-0.5'}`}/>
              </button>
            </div>

            {/* Volume */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Volume2 className="w-3 h-3 text-[#636E72]"/>
                <span className="text-xs text-[#636E72] dark:text-[#A0A0A0]">{soundVolume}%</span>
              </div>
              <input type="range" min="0" max="100" value={soundVolume}
                onChange={e => updateSettings({ soundVolume: +e.target.value })}
                className="w-full accent-[#4CAF50] h-1.5"/>
            </div>

            {/* Sound list */}
            <div className="space-y-1">
              {(backgroundSounds || []).map((s: any) => (
                <button key={s.id}
                  onClick={() => setSound(s.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-sm transition-all text-right ${
                    backgroundSoundId === s.id && soundEnabled
                      ? 'bg-[#4CAF50]/10 text-[#4CAF50] font-bold'
                      : 'hover:bg-[#F0F0F0] dark:hover:bg-[#333] text-[#4A4A4A] dark:text-[#E0E0E0]'
                  }`}
                >
                  <span className="flex-1">{s.name}</span>
                  {backgroundSoundId === s.id && soundEnabled && <span className="text-xs">▶</span>}
                </button>
              ))}
              <button
                onClick={() => updateSettings({ soundEnabled: false })}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-sm hover:bg-[#F0F0F0] dark:hover:bg-[#333] text-[#636E72] dark:text-[#A0A0A0]"
              >
                <VolumeX className="w-4 h-4"/>
                <span>إِيقَافُ الصَّوْتِ</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
