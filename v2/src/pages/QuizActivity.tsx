import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle2, XCircle, RefreshCw, Zap, Sparkles, Trophy, ChevronDown, Lock, Timer, Check } from 'lucide-react';
import { useStore, LEVELS } from '../store/useStore';

const CATEGORY_NAMES: Record<string, string> = {
  prophets:        'قِصَصُ الْأَنْبِيَاءِ',
  companions:      'قِصَصُ الصَّحَابَةِ الْكِرَامِ',
  imams:           'أَئِمَّةُ الْمَذَاهِبِ الْأَرْبَعَةِ',
  islamic_figures: 'شَخْصِيَّاتٌ إِسْلَامِيَّةٌ',
  quran:           'الْقُرْآنُ الْكَرِيمُ',
  hadith:          'الْحَدِيثُ النَّبَوِيُّ',
  fiqh:            'الْفِقْهُ وَالْعِبَادَاتُ',
  history:         'التَّارِيخُ الْإِسْلَامِيُّ',
  educational:     'تَعْلِيمِيٌّ عَامٌّ',
  science:         'الْعُلُومُ',
  animals:         'الْحَيَوَانَاتُ',
  nature:          'الطَّبِيعَةُ',
};
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageViewer } from '../components/ImageViewer';
import confetti from 'canvas-confetti';

const LEVEL_COLORS: Record<string, string> = { beginner:'#4CAF50', intermediate:'#FF9F43', advanced:'#54A0FF', expert:'#FF6B6B' };
const LEVEL_NAMES: Record<string, string> = { beginner:'تَمْهِيدِيّ', intermediate:'مُبْتَدِئ', advanced:'مُتَوَسِّط', expert:'مُتَقَدِّم' };
const AGE_LABELS: Record<string, string> = { 'all':'الْكُلُّ', '4-6':'4-6 سنوات', '6-8':'6-8 سنوات', '9-12':'9-12 سنة' };

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleOptions(q: any): any {
  const opts = [...q.options];
  const correct = opts[q.correctAnswer];
  const shuffled = shuffleArray(opts);
  return { ...q, options: shuffled, correctAnswer: shuffled.indexOf(correct) };
}

// قائمة منسدلة للاختيار المتعدد
function MultiSelectDropdown({ categories, selected, onChange }: {
  categories: string[];
  selected: string[];
  onChange: (cats: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCat = (cat: string) => {
    if (selected.includes(cat)) onChange(selected.filter(c => c !== cat));
    else onChange([...selected, cat]);
  };
  const toggleAll = () => onChange(selected.length === 0 ? [...categories] : []);
  const allSelected = selected.length === 0;
  const label = allSelected ? 'جَمِيعُ الْمَوَاضِيعِ' : selected.length === 1 ? (CATEGORY_NAMES[selected[0]] || selected[0]) : `${selected.length} مَوَاضِيعَ`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] bg-white dark:bg-[#2a2a2a] text-sm font-bold dark:text-white transition-all hover:border-[#FF9F43]">
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 text-[#636E72] transition-transform ${open ? 'rotate-180' : ''}`}/>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full bg-white dark:bg-[#2a2a2a] border border-[#E5E5E5] dark:border-[#444] rounded-2xl shadow-xl overflow-hidden max-h-56 overflow-y-auto">
            {/* اختيار الكل */}
            <button
              type="button"
              onClick={toggleAll}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold border-b border-[#E5E5E5] dark:border-[#333] transition-colors ${allSelected ? 'bg-[#FF9F43]/10 text-[#FF9F43]' : 'dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#333]'}`}>
              <span>جَمِيعُ الْمَوَاضِيعِ</span>
              {allSelected && <Check className="w-4 h-4"/>}
            </button>
            {categories.map(cat => {
              const active = selected.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCat(cat)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${active ? 'bg-[#FF9F43]/10 text-[#FF9F43] font-bold' : 'dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#333]'}`}>
                  <span>{CATEGORY_NAMES[cat] || cat}</span>
                  {active && <Check className="w-4 h-4"/>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// شاشة اختيار الفلاتر قبل بدء المسابقة
function QuizFilters({ questions, onStart }: { questions: any[]; onStart: (filtered: any[]) => void }) {
  const { currentUser, getCurrentLevel } = useStore();
  const [activeLevel, setActiveLevel] = useState('all');
  const [activeAge, setActiveAge] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const userLevel = currentUser ? getCurrentLevel(currentUser.id) : 'beginner';
  const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
  const userLevelIdx = levelOrder.indexOf(userLevel);
  const isLevelUnlocked = (l: string) => currentUser?.role === 'parent' || levelOrder.indexOf(l) <= userLevelIdx;

  const categories = useMemo(() => {
    const cats = new Set<string>();
    questions.forEach(q => { if (q.category) cats.add(q.category); });
    return Array.from(cats).sort();
  }, [questions]);

  const filtered = useMemo(() => questions.filter(q => {
    if (activeLevel !== 'all' && (q.level || 'beginner') !== activeLevel) return false;
    if (activeAge !== 'all' && q.ageGroup !== 'all' && q.ageGroup !== activeAge) return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(q.category)) return false;
    return true;
  }), [questions, activeLevel, activeAge, selectedCategories]);

  return (
    <div className="space-y-5 py-2">
      <h2 className="text-xl font-black dark:text-white text-center">مُسَابَقَةُ الْمَعْلُومَاتِ</h2>

      {/* فلتر المستوى */}
      <div className="space-y-2">
        <p className="text-sm font-bold text-[#636E72] dark:text-[#A0A0A0]">الْمُسْتَوَى</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveLevel('all')}
            className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all border-2 ${activeLevel==='all'?'bg-[#2D3436] text-white border-[#2D3436] dark:bg-white dark:text-black':'border-[#E5E5E5] dark:border-[#444] dark:text-white'}`}>
            الْكُلُّ
          </button>
          {LEVELS.map(lv => (
            <button key={lv.id} onClick={() => isLevelUnlocked(lv.id) && setActiveLevel(lv.id)}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all border-2 relative ${!isLevelUnlocked(lv.id)?'opacity-40 cursor-not-allowed':''} ${activeLevel===lv.id?'text-white border-transparent':'border-[#E5E5E5] dark:border-[#444] dark:text-white'}`}
              style={activeLevel===lv.id?{backgroundColor:LEVEL_COLORS[lv.id],borderColor:LEVEL_COLORS[lv.id]}:{}}>
              {lv.icon} {LEVEL_NAMES[lv.id]}
            </button>
          ))}
        </div>
      </div>

      {/* فلتر الفئة العمرية */}
      <div className="space-y-2">
        <p className="text-sm font-bold text-[#636E72] dark:text-[#A0A0A0]">الْفِئَةُ الْعُمُرِيَّةُ</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(AGE_LABELS).map(([k, v]) => (
            <button key={k} onClick={() => setActiveAge(k)}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all border-2 ${activeAge===k?'bg-[#54A0FF] text-white border-[#54A0FF]':'border-[#E5E5E5] dark:border-[#444] dark:text-white'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* فلتر الموضوع — قائمة منسدلة متعددة الاختيار */}
      <div className="space-y-2">
        <p className="text-sm font-bold text-[#636E72] dark:text-[#A0A0A0]">الْمَوْضُوعُ</p>
        <MultiSelectDropdown categories={categories} selected={selectedCategories} onChange={setSelectedCategories}/>
      </div>

      <div className="bg-[#F0F4FF] dark:bg-[#1a2a4a] rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="font-bold dark:text-white">{filtered.length} سُؤَالٍ</p>
          <p className="text-xs text-[#636E72] dark:text-[#A0A0A0]">تُخْلَطُ الْخِيَارَاتُ عِنْدَ التَّشْغِيلِ</p>
        </div>
        <ChevronDown className="w-5 h-5 text-[#636E72] rotate-[-90deg]"/>
      </div>

      <Button
        disabled={filtered.length === 0}
        onClick={() => onStart(filtered)}
        className="w-full py-6 text-xl font-black bg-[#FF6B6B] hover:bg-[#ee5253] rounded-2xl gap-2">
        <Trophy className="w-5 h-5"/> ابْدَأِ الْمُسَابَقَةَ ({filtered.length})
      </Button>
    </div>
  );
}

export default function QuizActivity() {
  const { questions, currentUser, updateUser, localImages } = useStore();
  const [started, setStarted] = useState(false);
  const [shuffled, setShuffled] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showMotivation, setShowMotivation] = useState<{type:'correct'|'streak'|'perfect';pts?:number;streak?:number}|null>(null);

  const ENCOURAGE = ['أَحْسَنْتَ! 🌟','مُمْتَازٌ! 🎉','رَائِعٌ! 💪','عَمَلٌ جَيِّدٌ! 👍','ذَكِيٌّ! 🧠','مَاشَاءَ اللَّهُ! 🤲'];
  const WRONG     = ['حَاوِلْ مُجَدَّدًا! 💪','لَا تَيْأَسْ! 🌟','قَرِيبٌ! 🎯','فَكِّرْ... 🤔'];

  const load = (filtered?: any[]) => {
    const pool = filtered || questions;
    setShuffled(shuffleArray([...pool]).map(shuffleOptions));
    setIdx(0); setScore(0); setSelected(null); setIsCorrect(null);
    setStreak(0); setShowResult(false); setFeedback(''); setShowMotivation(null);
    setStarted(true);
  };

  // لا تبدأ تلقائياً — انتظر اختيار الفلاتر
  useEffect(() => { /* لا شيء */ }, [questions]);

  const triggerConfetti = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  const handleAnswer = (i: number) => {
    if (selected !== null || !shuffled.length) return;
    const q = shuffled[idx];
    setSelected(i);
    const correct = i === q.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      const ns = streak + 1;
      setStreak(ns); setScore(s => s + 1);
      setFeedback(ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)]);
      setShowMotivation({ type: 'correct', pts: 15, streak: ns });
      setTimeout(() => setShowMotivation(null), 1800);
      if (ns === 3) { setTimeout(() => { setShowMotivation({ type: 'streak', streak: 3 }); triggerConfetti(); setTimeout(() => setShowMotivation(null), 2500); }, 600); }
      else if (ns === 5) { setTimeout(() => { setShowMotivation({ type: 'perfect', streak: 5 }); triggerConfetti(); setTimeout(() => setShowMotivation(null), 3000); }, 600); }
    } else {
      setStreak(0);
      setFeedback(WRONG[Math.floor(Math.random() * WRONG.length)]);
    }

    setTimeout(() => {
      if (idx < shuffled.length - 1) {
        setIdx(i => i + 1); setSelected(null); setIsCorrect(null); setFeedback('');
      } else {
        setShowResult(true);
        if (currentUser) {
          const pts = (score + (correct ? 1 : 0)) * 15;
          updateUser(currentUser.id, { points: currentUser.points + pts });
        }
      }
    }, 1500);
  };

  // helper: get image src for a question (supports localImages, data URLs)
  const getQuestionImage = (q: any): string | null => {
    if (!q.image || q.image === '') return null;
    if (q.image.startsWith('data:')) return q.image;
    if (localImages[q.image]?.data) return localImages[q.image].data;
    return null;
  };

  // عرض شاشة الفلاتر إذا لم تبدأ المسابقة بعد
  if (!started) return <QuizFilters questions={questions} onStart={load} />;

  if (showResult) {
    const pct = Math.round((score / shuffled.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-8">
        <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center shadow-xl border-8 border-white dark:border-[#333] ${pct>=70?'bg-green-500':pct>=40?'bg-yellow-500':'bg-red-500'}`}>
          <Star className="w-16 h-16 text-white fill-white" />
        </div>
        <h2 className="text-3xl font-black dark:text-white">{pct>=70?'مُمْتَازٌ! 🎉':pct>=40?'جَيِّدٌ جِدًّا! 👍':'لَا بَأْسَ، حَاوِلْ! 💪'}</h2>
        <p className="text-xl text-[#636E72] dark:text-[#A0A0A0]">{score} / {shuffled.length}</p>
        <div className="bg-white dark:bg-[#222] p-5 rounded-3xl border-2 shadow-sm">
          <p className="text-[#4CAF50] font-black text-2xl">+{score * 15} نُقْطَةً</p>
        </div>
        <div className="flex gap-3">
          <Button className="flex-1 py-4 font-black bg-[#FF6B6B] hover:bg-[#ee5253] rounded-2xl gap-2" onClick={() => load(shuffled)}>
            <RefreshCw className="w-5 h-5"/> مُجَدَّدًا
          </Button>
          <Button variant="outline" className="flex-1 py-4 font-black rounded-2xl dark:border-[#444] dark:text-white" onClick={() => setStarted(false)}>
            تَغْيِيرُ الْفِلْتَرِ
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!shuffled.length) return (
    <div className="text-center py-16 space-y-3">
      <p className="text-lg text-[#636E72] dark:text-[#A0A0A0]">لَا تُوجَدُ أَسْئِلَةٌ حَالِيًا</p>
    </div>
  );

  const q = shuffled[idx];
  const progress = (idx / shuffled.length) * 100;
  const qImage = getQuestionImage(q);

  return (
    <div className="space-y-5">
      <AnimatePresence>
        {showMotivation && (
          <motion.div initial={{ scale: 0, opacity: 0, y: -40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className={`rounded-2xl p-6 shadow-2xl text-white text-center min-w-[280px] bg-gradient-to-r ${showMotivation.type==='correct'?'from-green-500 to-emerald-600':showMotivation.type==='streak'?'from-orange-500 to-red-500':'from-purple-500 to-pink-500'}`}>
              {showMotivation.type==='correct'   && <><Sparkles className="w-12 h-12 mx-auto text-yellow-300 mb-2"/><p className="text-xl font-black">أَحْسَنْتَ! +{showMotivation.pts} نُقْطَةً</p></>}
              {showMotivation.type==='streak'    && <><Zap className="w-14 h-14 mx-auto text-yellow-300 mb-2"/><p className="text-xl font-black">🔥 {showMotivation.streak} إِجَابَاتٍ مُتَتَالِيَةٍ! 🔥</p></>}
              {showMotivation.type==='perfect'   && <><Trophy className="w-16 h-16 mx-auto text-yellow-300 mb-2"/><p className="text-xl font-black">🏆 5 مُتَتَالِيَةٍ! خُرَافِيٌّ! 🏆</p></>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <button className="text-xl font-black dark:text-white hover:opacity-70" onClick={() => setStarted(false)}>مُسَابَقَةُ الْمَعْلُومَاتِ</button>
        <div className="flex gap-2 items-center">
          <Badge className="bg-[#FF6B6B] text-white">{idx+1}/{shuffled.length}</Badge>
          <Badge variant="outline" className="dark:border-[#444] dark:text-white text-[10px]">{CATEGORY_NAMES[q.category] || q.category}</Badge>
          {streak>0 && <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full"><Zap className="w-3 h-3 text-orange-500"/><span className="text-xs font-bold text-orange-600 dark:text-orange-400">{streak}</span></div>}
        </div>
      </div>

      <div className="h-2 bg-[#F0F0F0] dark:bg-[#333] rounded-full overflow-hidden">
        <motion.div className="h-full bg-[#FF6B6B]" animate={{ width: `${progress}%` }} />
      </div>

      <Card className="rounded-3xl border-2 dark:border-[#333] bg-white dark:bg-[#222] shadow-lg">
        <CardContent className="p-6 space-y-5">
          {/* Question image */}
          {qImage && (
            <ImageViewer
              src={qImage}
              alt={q.text}
              className="w-full h-48 rounded-2xl overflow-hidden"
              caption="انقر للتكبير 🔍"
            />
          )}
          <p className="text-xl font-black text-center dark:text-white leading-relaxed">{q.text}</p>
          <div className="grid gap-3">
            {q.options.map((opt: string, i: number) => {
              const COLORS = ['#4CAF50','#54A0FF','#FF9F43','#A29BFE'];
              const ARABIC = ['أ','ب','ج','د'];
              const col = COLORS[i] || '#636E72';
              let btnCls = 'border-2 dark:text-white transition-all justify-start gap-3 py-6 text-lg rounded-2xl';
              let circleCls = `w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0`;
              let circleStyle: any = { backgroundColor: col };
              if (selected===i) {
                btnCls += isCorrect ? ' bg-[#4CAF50] text-white border-[#4CAF50]' : ' bg-[#FF6B6B] text-white border-[#FF6B6B]';
                circleStyle = { backgroundColor: 'rgba(255,255,255,0.3)' };
              } else if (selected!==null && i===q.correctAnswer) {
                btnCls += ' bg-[#4CAF50] text-white border-[#4CAF50]';
                circleStyle = { backgroundColor: 'rgba(255,255,255,0.3)' };
              } else {
                btnCls += ' dark:border-[#444]';
              }
              return (
                <Button key={i} variant="outline" className={btnCls}
                  style={selected===null ? { borderColor: `${col}40` } : {}}
                  onClick={() => handleAnswer(i)} disabled={selected!==null}>
                  <span className={circleCls} style={circleStyle}>{ARABIC[i]}</span>
                  <span className="flex-1 text-right">{opt}</span>
                  {selected===i && (isCorrect ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>)}
                </Button>
              );
            })}
          </div>
          {feedback && <motion.p initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className={`text-center font-bold text-lg ${isCorrect?'text-[#4CAF50]':'text-[#FF6B6B]'}`}>{feedback}</motion.p>}
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-2 text-[#636E72] dark:text-[#A0A0A0] text-sm">
        <Timer className="w-4 h-4"/><span>فَكِّرْ جَيِّدًا قَبْلَ الْإِجَابَةِ!</span>
      </div>
    </div>
  );
}
