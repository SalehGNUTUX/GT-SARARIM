import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WISDOMS = [
  { text: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ وَمُسْلِمَةٍ', source: 'حَدِيثٌ شَرِيفٌ' },
  { text: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ', source: 'حَدِيثٌ شَرِيفٌ' },
  { text: 'اقْرَأْ وَرَبُّكَ الْأَكْرَمُ الَّذِي عَلَّمَ بِالْقَلَمِ', source: 'سُورَةُ الْعَلَقِ' },
  { text: 'وَقُلْ رَبِّ زِدْنِي عِلْمًا', source: 'سُورَةُ طه' },
  { text: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', source: 'حَدِيثٌ شَرِيفٌ' },
  { text: 'الْعِلْمُ نُورٌ وَالْجَهْلُ ظُلْمَةٌ', source: 'حِكْمَةٌ' },
];

interface Props { onClose: () => void; }

export function WisdomPopup({ onClose }: Props) {
  const [wisdom] = useState(() => WISDOMS[Math.floor(Math.random() * WISDOMS.length)]);

  useEffect(() => {
    const key = `wisdom_${new Date().toDateString()}`;
    localStorage.setItem(key, '1');
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.7, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.7, y: 50 }}
          className="bg-gradient-to-br from-[#FF9F43] to-[#FF6B6B] rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-white"
        >
          <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="text-center space-y-4 pt-2">
            <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold opacity-80 mb-2">حِكْمَةُ الْيَوْمِ</p>
              <p className="text-xl font-black leading-relaxed">{wisdom.text}</p>
              <p className="text-sm opacity-75 mt-2">— {wisdom.source}</p>
            </div>
            <Button
              className="w-full bg-white text-[#FF6B6B] font-black rounded-2xl py-5 hover:bg-white/90"
              onClick={onClose}
            >
              ابْدَأْ يَوْمَكَ بِسْمِ اللَّهِ 🌟
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
