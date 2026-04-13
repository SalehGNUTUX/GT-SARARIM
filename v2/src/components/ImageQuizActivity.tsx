import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '../store/useStore';
import confetti from 'canvas-confetti';

interface ImageOption {
  id: string;
  label: string;
  svgContent: string;
  color: string;
}

interface ImageQuestion {
  id: string;
  text: string;
  options: ImageOption[];
  correctId: string;
  level: string;
}

const SVG_IMAGES: Record<string, string> = {
  cat: `<svg viewBox="0 0 80 80"><circle cx="40" cy="45" r="25" fill="#FF9F43"/><ellipse cx="40" cy="45" rx="20" ry="18" fill="#FFB74D"/><circle cx="32" cy="40" r="4" fill="#333"/><circle cx="48" cy="40" r="4" fill="#333"/><circle cx="33" cy="39" r="1.5" fill="white"/><circle cx="49" cy="39" r="1.5" fill="white"/><ellipse cx="40" cy="48" rx="4" ry="3" fill="#FF8A65"/><line x1="30" y1="48" x2="15" y2="45" stroke="#888" strokeWidth="1"/><line x1="30" y1="50" x2="15" y2="50" stroke="#888" strokeWidth="1"/><line x1="50" y1="48" x2="65" y2="45" stroke="#888" strokeWidth="1"/><line x1="50" y1="50" x2="65" y2="50" stroke="#888" strokeWidth="1"/><polygon points="28,20 20,10 35,18" fill="#FF9F43"/><polygon points="52,20 60,10 45,18" fill="#FF9F43"/></svg>`,
  dog: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="48" rx="25" ry="20" fill="#A1887F"/><circle cx="40" cy="35" r="18" fill="#BCAAA4"/><circle cx="32" cy="32" r="4" fill="#333"/><circle cx="48" cy="32" r="4" fill="#333"/><circle cx="33" cy="31" r="1.5" fill="white"/><circle cx="49" cy="31" r="1.5" fill="white"/><ellipse cx="40" cy="42" rx="6" ry="4" fill="#EF9A9A"/><ellipse cx="28" cy="22" rx="6" ry="8" fill="#8D6E63"/><ellipse cx="52" cy="22" rx="6" ry="8" fill="#8D6E63"/></svg>`,
  apple: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="45" rx="28" ry="28" fill="#EF5350"/><path d="M38,45 C38,35 30,28 22,32 C28,28 40,25 40,18" fill="none" stroke="#C62828" strokeWidth="2"/><line x1="40" y1="15" x2="40" y2="25" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round"/><path d="M40,20 C45,15 55,18 52,25" fill="#4CAF50" stroke="none"/><circle cx="32" cy="40" r="5" fill="#FFCDD2" opacity="0.5"/></svg>`,
  banana: `<svg viewBox="0 0 80 80"><path d="M15,60 C20,30 50,20 65,30 C55,35 35,45 25,65Z" fill="#FFD700"/><path d="M15,60 C18,55 22,52 28,62" fill="#FFC107"/><path d="M65,30 C68,28 70,25 68,22 L64,24" fill="#8D6E63" strokeWidth="1"/></svg>`,
  sun: `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="16" fill="#FFD700"/><line x1="40" y1="10" x2="40" y2="20" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/><line x1="40" y1="60" x2="40" y2="70" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/><line x1="10" y1="40" x2="20" y2="40" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/><line x1="60" y1="40" x2="70" y2="40" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/><line x1="18" y1="18" x2="25" y2="25" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/><line x1="55" y1="55" x2="62" y2="62" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/><line x1="62" y1="18" x2="55" y2="25" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/><line x1="25" y1="55" x2="18" y2="62" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/></svg>`,
  moon: `<svg viewBox="0 0 80 80"><path d="M50,20 A25,25 0 1,1 50,60 A18,18 0 1,0 50,20Z" fill="#FFF176"/><circle cx="55" cy="35" r="3" fill="#FFF9C4" opacity="0.6"/><circle cx="45" cy="50" r="2" fill="#FFF9C4" opacity="0.6"/></svg>`,
  star: `<svg viewBox="0 0 80 80"><polygon points="40,10 47,32 70,32 52,47 59,70 40,55 21,70 28,47 10,32 33,32" fill="#FFD700" stroke="#FF8F00" strokeWidth="1"/></svg>`,
  tree: `<svg viewBox="0 0 80 80"><rect x="35" y="55" width="10" height="20" fill="#8D6E63"/><polygon points="40,10 60,40 20,40" fill="#4CAF50"/><polygon points="40,25 62,55 18,55" fill="#66BB6A"/><circle cx="30" cy="42" r="5" fill="#EF5350"/><circle cx="50" cy="38" r="5" fill="#EF5350"/></svg>`,
  fish: `<svg viewBox="0 0 80 80"><ellipse cx="38" cy="40" rx="26" ry="16" fill="#54A0FF"/><polygon points="65,40 78,28 78,52" fill="#2980B9"/><circle cx="25" cy="35" r="5" fill="white"/><circle cx="24" cy="35" r="2.5" fill="#333"/><line x1="30" y1="30" x2="30" y2="50" stroke="#2980B9" strokeWidth="1"/><line x1="40" y1="26" x2="40" y2="54" stroke="#2980B9" strokeWidth="1"/><line x1="50" y1="28" x2="50" y2="52" stroke="#2980B9" strokeWidth="1"/></svg>`,

  rocket: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="45" rx="14" ry="20" fill="#54A0FF"/><polygon points="40,10 28,30 52,30" fill="#FF6B6B"/><circle cx="40" cy="45" r="6" fill="#74B9FF"/><polygon points="26,60 18,75 34,65" fill="#FF6B6B"/><polygon points="54,60 62,75 46,65" fill="#FF6B6B"/><ellipse cx="40" cy="70" rx="8" ry="4" fill="#FF9F43"/></svg>`,
  heart: `<svg viewBox="0 0 80 80"><path d="M40,65 C40,65 10,47 10,28 C10,18 18,12 28,12 C33,12 38,15 40,19 C42,15 47,12 52,12 C62,12 70,18 70,28 C70,47 40,65 40,65Z" fill="#FF6B6B"/></svg>`,
  tree2: `<svg viewBox="0 0 80 80"><rect x="36" y="55" width="8" height="22" fill="#8D6E63"/><polygon points="40,8 58,35 22,35" fill="#4CAF50"/><polygon points="40,22 60,50 20,50" fill="#66BB6A"/><polygon points="40,35 62,62 18,62" fill="#81C784"/></svg>`,
  mosque2: `<svg viewBox="0 0 80 80"><rect x="15" y="40" width="50" height="35" fill="#E0E0E0"/><path d="M40,20 A18,18 0 0,1 58,38 L22,38 A18,18 0 0,1 40,20Z" fill="#54A0FF"/><rect x="35" y="52" width="10" height="23" fill="#9575CD"/><rect x="12" y="30" width="8" height="45" fill="#B0BEC5"/><rect x="60" y="30" width="8" height="45" fill="#B0BEC5"/><polygon points="16,28 20,15 24,28" fill="#54A0FF"/><polygon points="60,28 64,15 68,28" fill="#54A0FF"/></svg>`,
  bird: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="45" rx="20" ry="14" fill="#FF9F43"/><circle cx="40" cy="30" r="12" fill="#FFB74D"/><polygon points="40,28 52,32 40,36" fill="#FF8F00"/><circle cx="35" cy="26" r="3" fill="#333"/><circle cx="35.5" cy="25.5" r="1" fill="white"/><path d="M20,40 C15,30 10,25 5,28" fill="none" stroke="#FF9F43" strokeWidth="3" strokeLinecap="round"/><path d="M60,40 C65,30 70,25 75,28" fill="none" stroke="#FF9F43" strokeWidth="3" strokeLinecap="round"/></svg>`,
  book: `<svg viewBox="0 0 80 80"><rect x="10" y="15" width="28" height="50" rx="3" fill="#EF5350"/><rect x="42" y="15" width="28" height="50" rx="3" fill="#FF8A65"/><line x1="40" y1="15" x2="40" y2="65" stroke="#333" strokeWidth="2"/><line x1="18" y1="28" x2="32" y2="28" stroke="white" strokeWidth="2"/><line x1="18" y1="35" x2="32" y2="35" stroke="white" strokeWidth="2"/><line x1="18" y1="42" x2="32" y2="42" stroke="white" strokeWidth="2"/><line x1="48" y1="28" x2="62" y2="28" stroke="#A0522D" strokeWidth="2"/><line x1="48" y1="35" x2="62" y2="35" stroke="#A0522D" strokeWidth="2"/><line x1="48" y1="42" x2="62" y2="42" stroke="#A0522D" strokeWidth="2"/></svg>`,
  house: `<svg viewBox="0 0 80 80"><polygon points="40,10 70,38 10,38" fill="#FF6B6B"/><rect x="18" y="38" width="44" height="35" fill="#FFCCBC"/><rect x="33" y="52" width="14" height="21" rx="7" fill="#8D6E63"/><rect x="22" y="44" width="12" height="12" rx="2" fill="#80DEEA"/><rect x="46" y="44" width="12" height="12" rx="2" fill="#80DEEA"/></svg>`,
};

const IMAGE_QUESTIONS: ImageQuestion[] = [
  {
    id: 'iq1', text: 'أَيُّ هَذِهِ الصُّوَرِ يُصَوِّرُ الشَّمْسَ؟', level: 'beginner',
    correctId: 'sun',
    options: [
      { id: 'sun', label: 'الشَّمْسُ', svgContent: SVG_IMAGES.sun, color: '#FFE082' },
      { id: 'moon', label: 'الْقَمَرُ', svgContent: SVG_IMAGES.moon, color: '#FFF9C4' },
      { id: 'star', label: 'النَّجْمَةُ', svgContent: SVG_IMAGES.star, color: '#FFF3E0' },
      { id: 'tree', label: 'الشَّجَرَةُ', svgContent: SVG_IMAGES.tree, color: '#E8F5E9' },
    ]
  },
  {
    id: 'iq2', text: 'أَيُّ هَذِهِ الْحَيَوَانَاتِ يَعِيشُ فِي الْمَاءِ؟', level: 'beginner',
    correctId: 'fish',
    options: [
      { id: 'cat', label: 'الْقِطَّةُ', svgContent: SVG_IMAGES.cat, color: '#FFF3E0' },
      { id: 'fish', label: 'السَّمَكَةُ', svgContent: SVG_IMAGES.fish, color: '#E3F2FD' },
      { id: 'dog', label: 'الْكَلْبُ', svgContent: SVG_IMAGES.dog, color: '#EFEBE9' },
      { id: 'bird', label: 'الطَّائِرُ', svgContent: SVG_IMAGES.bird, color: '#FFF8E1' },
    ]
  },
  {
    id: 'iq3', text: 'أَيُّ هَذِهِ الصُّوَرِ يُصَوِّرُ فَاكِهَةً؟', level: 'beginner',
    correctId: 'apple',
    options: [
      { id: 'house', label: 'الْبَيْتُ', svgContent: SVG_IMAGES.house, color: '#FCE4EC' },
      { id: 'book', label: 'الْكِتَابُ', svgContent: SVG_IMAGES.book, color: '#FFE0B2' },
      { id: 'apple', label: 'التُّفَّاحَةُ', svgContent: SVG_IMAGES.apple, color: '#FFEBEE' },
      { id: 'tree', label: 'الشَّجَرَةُ', svgContent: SVG_IMAGES.tree, color: '#E8F5E9' },
    ]
  },
  {
    id: 'iq4', text: 'أَيُّ هَذِهِ الصُّوَرِ يُصَوِّرُ الْهِلَالَ؟', level: 'intermediate',
    correctId: 'moon',
    options: [
      { id: 'sun', label: 'الشَّمْسُ', svgContent: SVG_IMAGES.sun, color: '#FFE082' },
      { id: 'star', label: 'النَّجْمَةُ', svgContent: SVG_IMAGES.star, color: '#FFF3E0' },
      { id: 'moon', label: 'الْهِلَالُ', svgContent: SVG_IMAGES.moon, color: '#FFF9C4' },
      { id: 'bird', label: 'الطَّائِرُ', svgContent: SVG_IMAGES.bird, color: '#FFF8E1' },
    ]
  },
  {
    id: 'iq5', text: 'أَيُّ صُورَةٍ تُمَثِّلُ الطَّائِرَ؟', level: 'beginner',
    correctId: 'bird',
    options: [
      { id: 'fish', label: 'السَّمَكَةُ', svgContent: SVG_IMAGES.fish, color: '#E3F2FD' },
      { id: 'bird', label: 'الطَّائِرُ', svgContent: SVG_IMAGES.bird, color: '#FFF8E1' },
      { id: 'cat', label: 'الْقِطَّةُ', svgContent: SVG_IMAGES.cat, color: '#FFF3E0' },
      { id: 'banana', label: 'الْمَوْزُ', svgContent: SVG_IMAGES.banana, color: '#FFFDE7' },
    ]
  },

  {
    id: 'iq7', text: 'أَيُّ صُورَةٍ تُمَثِّلُ الصَّارُوخَ؟', level: 'intermediate',
    correctId: 'rocket',
    options: [
      { id: 'rocket', label: 'صَارُوخٌ', svgContent: SVG_IMAGES.rocket || '', color: '#E3F2FD' },
      { id: 'bird',   label: 'طَائِرٌ',  svgContent: SVG_IMAGES.bird,          color: '#FFF8E1' },
      { id: 'fish',   label: 'سَمَكَةٌ', svgContent: SVG_IMAGES.fish,          color: '#E3F2FD' },
      { id: 'tree2',  label: 'شَجَرَةٌ', svgContent: SVG_IMAGES.tree2 || '',   color: '#E8F5E9' },
    ]
  },
  {
    id: 'iq8', text: 'أَيُّ صُورَةٍ تُمَثِّلُ الْقَلْبَ؟', level: 'beginner',
    correctId: 'heart',
    options: [
      { id: 'star',   label: 'نَجْمَةٌ',  svgContent: SVG_IMAGES.star,         color: '#FFF3E0' },
      { id: 'heart',  label: 'قَلْبٌ',    svgContent: SVG_IMAGES.heart || '',  color: '#FCE4EC' },
      { id: 'moon',   label: 'هِلَالٌ',   svgContent: SVG_IMAGES.moon,         color: '#FFF9C4' },
      { id: 'apple',  label: 'تُفَّاحَةٌ', svgContent: SVG_IMAGES.apple,        color: '#FFEBEE' },
    ]
  },
  {
    id: 'iq9', text: 'أَيُّ صُورَةٍ تُمَثِّلُ الْمَسْجِدَ؟', level: 'beginner',
    correctId: 'mosque2',
    options: [
      { id: 'house',   label: 'بَيْتٌ',   svgContent: SVG_IMAGES.house,          color: '#FCE4EC' },
      { id: 'mosque2', label: 'مَسْجِدٌ',  svgContent: SVG_IMAGES.mosque2 || '',  color: '#E8EAF6' },
      { id: 'tree2',   label: 'شَجَرَةٌ',  svgContent: SVG_IMAGES.tree2 || '',    color: '#E8F5E9' },
      { id: 'rocket',  label: 'صَارُوخٌ', svgContent: SVG_IMAGES.rocket || '',   color: '#E3F2FD' },
    ]
  },
  {
    id: 'iq6', text: 'أَيُّ صُورَةٍ تُمَثِّلُ الْكِتَابَ؟', level: 'beginner',
    correctId: 'book',
    options: [
      { id: 'house', label: 'الْبَيْتُ', svgContent: SVG_IMAGES.house, color: '#FCE4EC' },
      { id: 'tree', label: 'الشَّجَرَةُ', svgContent: SVG_IMAGES.tree, color: '#E8F5E9' },
      { id: 'book', label: 'الْكِتَابُ', svgContent: SVG_IMAGES.book, color: '#FFE0B2' },
      { id: 'moon', label: 'الْقَمَرُ', svgContent: SVG_IMAGES.moon, color: '#FFF9C4' },
    ]
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ImageQuizActivity() {
  const { currentUser, updateUser } = useStore();
  const [questions] = useState(() => shuffleArray(IMAGE_QUESTIONS).map(q => ({ ...q, options: shuffleArray(q.options) })));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);

  const handleSelect = useCallback((optionId: string) => {
    if (selected) return;
    setSelected(optionId);
    const isCorrect = optionId === questions[currentIdx].correctId;
    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      if (streak + 1 >= 3) confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } else {
      setStreak(0);
    }
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1);
        setSelected(null);
      } else {
        setFinished(true);
        if (currentUser) {
          const pts = (score + (isCorrect ? 1 : 0)) * 15;
          updateUser(currentUser.id, { points: currentUser.points + pts });
        }
      }
    }, 1400);
  }, [selected, currentIdx, score, streak, questions, currentUser]);

  const reset = () => {
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setStreak(0);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-5 py-8">
        <div className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center border-8 border-white dark:border-[#333] shadow-xl ${pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}>
          <Trophy className="w-14 h-14 text-white" />
        </div>
        <h2 className="text-3xl font-black dark:text-white">{pct >= 70 ? 'مُمْتَازٌ! 🎉' : pct >= 40 ? 'جَيِّدٌ! 👍' : 'حَاوِلْ مُجَدَّدًا! 💪'}</h2>
        <p className="text-xl text-[#636E72] dark:text-[#A0A0A0]">{score} / {questions.length} إِجَابَةٌ صَحِيحَةٌ</p>
        <p className="text-[#4CAF50] font-black text-2xl">+{score * 15} نُقْطَةً</p>
        <Button className="w-full py-6 text-xl font-black bg-[#FF9F43] hover:bg-[#e67e22] rounded-2xl flex items-center justify-center gap-2" onClick={reset}>
          <RefreshCw className="w-5 h-5" /> مُحَاوَلَةٌ جَدِيدَةٌ
        </Button>
      </motion.div>
    );
  }

  const q = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black dark:text-white">اِخْتَبِرِ الصُّوَرَ</h3>
        <div className="flex items-center gap-2">
          <Badge className="bg-[#FF9F43] text-white">{currentIdx + 1}/{questions.length}</Badge>
          {streak >= 2 && <Badge className="bg-orange-500 text-white"><Sparkles className="w-3 h-3 ml-1" />{streak}</Badge>}
        </div>
      </div>

      <div className="h-2 bg-[#F0F0F0] dark:bg-[#333] rounded-full">
        <motion.div className="h-full bg-[#FF9F43] rounded-full" animate={{ width: `${progress}%` }} />
      </div>

      <div className="bg-[#FFF5E6] dark:bg-[#2A2218] border-2 border-[#FF9F43]/30 rounded-2xl p-5">
        <p className="text-xl font-black text-center dark:text-white leading-relaxed">{q.text}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt) => {
          let borderColor = 'border-[#E5E5E5] dark:border-[#333]';
          let bg = 'bg-white dark:bg-[#222]';
          if (selected) {
            if (opt.id === q.correctId) { borderColor = 'border-[#4CAF50]'; bg = 'bg-[#E8F5E9] dark:bg-[#1B5E20]'; }
            else if (opt.id === selected && opt.id !== q.correctId) { borderColor = 'border-[#FF6B6B]'; bg = 'bg-[#FFEBEE] dark:bg-[#4E1414]'; }
          }
          return (
            <motion.button key={opt.id} whileHover={!selected ? { scale: 1.03 } : {}} whileTap={!selected ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(opt.id)}
              disabled={!!selected}
              className={`${bg} ${borderColor} border-2 rounded-2xl p-3 text-center space-y-2 cursor-pointer transition-all`}
            >
              <div className="w-full h-20 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: opt.svgContent.replace('<svg', '<svg width="70" height="70"') }} />
              <p className="text-sm font-bold dark:text-white">{opt.label}</p>
              {selected && opt.id === q.correctId && <CheckCircle2 className="w-5 h-5 text-[#4CAF50] mx-auto" />}
              {selected && opt.id === selected && opt.id !== q.correctId && <XCircle className="w-5 h-5 text-[#FF6B6B] mx-auto" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
