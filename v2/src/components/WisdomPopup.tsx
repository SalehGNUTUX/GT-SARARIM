// src/components/WisdomPopup.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Heart } from 'lucide-react';
import { WisdomCard, getWisdomByTime } from '../data/wisdom';
import { Button } from '@/components/ui/button';

interface WisdomPopupProps {
    onClose?: () => void;
}

export const WisdomPopup: React.FC<WisdomPopupProps> = ({ onClose }) => {
    const [wisdom, setWisdom] = useState<WisdomCard | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // جلب حكمة جديدة
        const newWisdom = getWisdomByTime();
        setWisdom(newWisdom);

        // تخزين وقت آخر ظهور في localStorage
        const lastSeen = localStorage.getItem('lastWisdomSeen');
        const today = new Date().toDateString();

        if (lastSeen !== today) {
            localStorage.setItem('lastWisdomSeen', today);
            setIsVisible(true);
        } else {
            // إذا شوهد اليوم، لا نظهر النافذة
            setIsVisible(false);
            onClose?.();
        }
    }, []);

    const getTypeIcon = () => {
        switch (wisdom?.type) {
            case 'hadith': return '📖';
            case 'dhikr': return '🕌';
            case 'ayah': return '📜';
            default: return '💡';
        }
    };

    const getTypeName = () => {
        switch (wisdom?.type) {
            case 'hadith': return 'حديث نبوي شريف';
            case 'dhikr': return 'ذكر';
            case 'ayah': return 'آية قرآنية';
            default: return 'حكمة';
        }
    };

    if (!isVisible || !wisdom) return null;

    return (
        <AnimatePresence>
        <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md"
        >
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 text-white">
        <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="text-xs font-bold opacity-80">بطاقة اليوم</span>
        </div>
        <button onClick={() => { setIsVisible(false); onClose?.(); }} className="hover:bg-white/20 rounded-full p-1 transition">
        <X className="w-4 h-4" />
        </button>
        </div>

        <div className="text-center space-y-3">
        <div className="text-4xl">{getTypeIcon()}</div>
        <div className="text-2xl font-bold leading-relaxed">
        {wisdom.textWithHarakat.split(' ').map((word, i) => (
            <span key={i} className="inline-block mx-1">
            {word}
            {word.match(/[ء-ي]/) && <span className="text-xs opacity-70 block -mt-1">◌</span>}
            </span>
        ))}
        </div>
        {wisdom.source && (
            <p className="text-xs opacity-70">📚 {wisdom.source}</p>
        )}
        <div className="pt-2">
        <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
        {getTypeName()}
        </span>
        </div>
        </div>
        </div>

        <div className="bg-black/20 p-3 text-center text-xs text-white/80 flex items-center justify-center gap-2">
        <Heart className="w-3 h-3" />
        <span>احرص على قراءتها كل يوم</span>
        </div>
        </div>
        </motion.div>
        </AnimatePresence>
    );
};
