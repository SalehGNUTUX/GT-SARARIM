import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Brain, Palette, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import DotToDotActivity from '../components/DotToDotActivity';
import ColoringActivity from '../components/ColoringActivity';
import ImageQuizActivity from '../components/ImageQuizActivity';

// Quiz (existing activity)
import QuizActivity from './QuizActivity';

const ACTIVITY_TYPES = [
  { id: 'quiz',     nameAr: 'مُسَابَقَةُ الْمَعْلُومَاتِ', icon: Brain,     color: '#FF6B6B', bg: '#FFEBEE', desc: 'أَجِبْ عَلَى الْأَسْئِلَةِ وَاكْسِبِ النُّقَاطَ' },
  { id: 'image',    nameAr: 'تَعَرَّفْ عَلَى الصُّورَةِ',  icon: ImageIcon,  color: '#FF9F43', bg: '#FFF3E0', desc: 'اِخْتَرِ الصُّورَةَ الصَّحِيحَةَ مِنَ الْخِيَارَاتِ' },
  { id: 'dotdot',   nameAr: 'وَصْلُ النِّقَاطِ',           icon: Gamepad2,  color: '#54A0FF', bg: '#E3F2FD', desc: 'صِلِ النِّقَاطَ لِتَرْسُمَ الشَّكْلَ' },
  { id: 'coloring', nameAr: 'التَّلْوِينُ',                 icon: Palette,   color: '#A29BFE', bg: '#EDE7F6', desc: 'لَوِّنِ الصُّوَرَ الْجَمِيلَةَ بِأَلْوَانِكَ' },
];

export default function ActivitiesPage() {
  const [activeActivity, setActiveActivity] = useState<string | null>(null);

  if (activeActivity) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key={activeActivity} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
          <Button variant="ghost" onClick={() => setActiveActivity(null)} className="dark:text-white flex items-center gap-1">
            <ChevronRight className="w-4 h-4" /> الْعَوْدَةُ لِلْأَنْشِطَةِ
          </Button>
          {activeActivity === 'quiz'     && <QuizActivity />}
          {activeActivity === 'image'    && <ImageQuizActivity />}
          {activeActivity === 'dotdot'   && <DotToDotActivity />}
          {activeActivity === 'coloring' && <ColoringActivity />}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-[#2D3436] dark:text-white">مَرْكَزُ الْأَنْشِطَةِ</h2>
        <p className="text-[#636E72] dark:text-[#A0A0A0] text-sm">اِخْتَرِ النَّشَاطَ الَّذِي تُرِيدُ</p>
      </div>

      <div className="grid gap-4">
        {ACTIVITY_TYPES.map((act, i) => {
          const Icon = act.icon;
          return (
            <motion.button key={act.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => setActiveActivity(act.id)}
              className="w-full bg-white dark:bg-[#222] border-2 border-[#E5E5E5] dark:border-[#333] hover:border-current rounded-3xl p-5 flex items-center gap-4 text-right transition-all group"
              style={{ '--hover-color': act.color } as any}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: act.bg }}>
                <Icon className="w-8 h-8" style={{ color: act.color }} />
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-black text-lg text-[#2D3436] dark:text-white">{act.nameAr}</h3>
                <p className="text-sm text-[#636E72] dark:text-[#A0A0A0] mt-1">{act.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#B2BEC3] group-hover:translate-x-[-4px] transition-transform" style={{ transform: 'scaleX(-1)' }} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
