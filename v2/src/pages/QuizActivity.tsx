import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle2, XCircle, Timer, RefreshCw, Zap, Sparkles, Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageViewer } from '../components/ImageViewer';
import confetti from 'canvas-confetti';

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

export default function QuizActivity() {
  const { questions, currentUser, updateUser, localImages } = useStore();
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

  const load = () => {
    setShuffled(shuffleArray([...questions]).map(shuffleOptions));
    setIdx(0); setScore(0); setSelected(null); setIsCorrect(null);
    setStreak(0); setShowResult(false); setFeedback(''); setShowMotivation(null);
  };

  useEffect(() => { if (questions.length) load(); }, [questions]);

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
        <Button className="w-full py-6 text-xl font-black bg-[#FF6B6B] hover:bg-[#ee5253] rounded-2xl gap-2" onClick={load}>
          <RefreshCw className="w-5 h-5"/> مُحَاوَلَةٌ جَدِيدَةٌ
        </Button>
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
        <h2 className="text-xl font-black dark:text-white">مُسَابَقَةُ الْمَعْلُومَاتِ</h2>
        <div className="flex gap-2">
          <Badge className="bg-[#FF6B6B] text-white">{idx+1}/{shuffled.length}</Badge>
          <Badge variant="outline" className="dark:border-[#444] dark:text-white text-[10px]">{q.category}</Badge>
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
