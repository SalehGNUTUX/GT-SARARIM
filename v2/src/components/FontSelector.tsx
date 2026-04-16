import { useState, useEffect, useRef } from 'react';
import { Type, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';

const BUILTIN_FONTS = [
  { id: 'ubuntu-arabic', label: 'Ubuntu Arabic', sample: 'أَبْجَدٌ' },
  { id: 'noto-arabic',   label: 'Noto Naskh',    sample: 'أَبْجَدٌ' },
];

export function FontSelector() {
  const { settings, updateSettings, localImages } = useStore();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // إغلاق عند النقر خارج القائمة
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  const activeFamily = settings.fontSettings.fontFamily;
  const customFonts: any[] = settings.fontSettings.customFonts || [];
  const allFonts = [
    ...BUILTIN_FONTS,
    ...customFonts.map(f => ({ id: f.id, label: f.name, sample: 'أَبْجَدٌ', isCustom: true }))
  ];
  const active = allFonts.find(f => f.id === activeFamily) || BUILTIN_FONTS[0];

  const select = (id: string) => {
    updateSettings({ fontSettings: { ...settings.fontSettings, fontFamily: id } });
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1 w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 justify-center rounded-full text-sm font-bold border border-[#E5E5E5] dark:border-[#444] bg-white/80 dark:bg-[#222]/80 text-[#4A4A4A] dark:text-[#E0E0E0] hover:border-[#A29BFE] transition-all"
        title="تَغْيِيرُ الْخَطِّ"
      >
        <Type className="w-4 h-4 text-[#A29BFE] shrink-0"/>
        <span className="hidden sm:block max-w-[80px] truncate text-xs">{active.label}</span>
        <span className="hidden sm:block">{open ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            style={{ position: 'fixed', top: '60px', left: 0, right: 0, margin: '0 auto', width: '220px', maxWidth: 'calc(100vw - 32px)', zIndex: 9999 }}
            className="bg-white dark:bg-[#222] border-2 border-[#E5E5E5] dark:border-[#333] rounded-2xl shadow-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-2 space-y-1">
              {allFonts.map(font => {
                const isActive = activeFamily === font.id;
                return (
                  <button key={font.id} onClick={() => select(font.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-right transition-all ${
                      isActive
                        ? 'bg-[#A29BFE]/15 border border-[#A29BFE]/40'
                        : 'hover:bg-[#F0F0F0] dark:hover:bg-[#333]'
                    }`}
                  >
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#4A4A4A] dark:text-white">{font.label}</p>
                      <p className="text-base leading-relaxed text-[#636E72] dark:text-[#A0A0A0] mt-0.5"
                        style={{ fontFamily: font.id === 'ubuntu-arabic' ? "'Ubuntu Arabic'" : font.id === 'noto-arabic' ? "'Noto Naskh Arabic'" : `'${font.id}', 'Ubuntu Arabic', sans-serif` }}>
                        {font.sample}
                      </p>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-[#A29BFE] flex-shrink-0 mr-1"/>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
