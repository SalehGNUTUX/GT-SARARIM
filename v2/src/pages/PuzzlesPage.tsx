import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain, HelpCircle, CheckCircle2, XCircle,
  Trophy, ChevronRight, Lightbulb, Lock, Eye
} from 'lucide-react';
import { useStore, LEVELS } from '../store/useStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import confetti from 'canvas-confetti';
import { ImageViewer } from '../components/ImageViewer';

const LEVEL_COLORS: Record<string, string> = {
  beginner: '#4CAF50', intermediate: '#FF9F43', advanced: '#54A0FF', expert: '#FF6B6B'
};
const LEVEL_NAMES: Record<string, string> = {
  beginner: 'تَمْهِيدِيّ', intermediate: 'مُبْتَدِئ', advanced: 'مُتَوَسِّط', expert: 'مُتَقَدِّم'
};

// توليد 3 إجابات خاطئة منطقية من بين الألغاز الأخرى
function generateWrongOptions(solution: string, allPuzzles: any[]): string[] {
  const wrong = allPuzzles
    .map(p => p.solution)
    .filter(s => {
      const norm = (x: string) => x.replace(/[\u064B-\u065F]/g, '').trim().toLowerCase();
      return norm(s) !== norm(solution) && s.length < 20;
    });
  // shuffle
  for (let i = wrong.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrong[i], wrong[j]] = [wrong[j], wrong[i]];
  }
  return wrong.slice(0, 3);
}

export default function PuzzlesPage() {
  const { puzzles, currentUser, updateUser, getCurrentLevel, localImages } = useStore();
  const [selectedPuzzle, setSelectedPuzzle] = useState<any>(null);
  // استخدام ref للإدخال بدلاً من state لحل مشكلة Android IME العربية
  const answerRef = useRef<HTMLInputElement>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  // multiple-choice hint state
  const [showMCHint, setShowMCHint] = useState(false);
  const [mcHintUsed, setMcHintUsed] = useState(false);
  const [mcOptions, setMcOptions] = useState<string[]>([]);
  const [mcSelected, setMcSelected] = useState<number | null>(null);
  // image reveal
  const [imageRevealed, setImageRevealed] = useState(false);
  const [activeLevel, setActiveLevel] = useState<string>('all');

  const userLevel = currentUser ? getCurrentLevel(currentUser.id) : 'beginner';
  const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
  const userLevelIdx = levelOrder.indexOf(userLevel);

  const isLevelUnlocked = (level: string) => {
    if (!level) return true;
    if (currentUser?.role === 'parent') return true; // الوالدان يرون كل المحتوى
    return levelOrder.indexOf(level) <= userLevelIdx;
  };

  const filteredPuzzles = activeLevel === 'all'
    ? puzzles
    : puzzles.filter(p => (p.level || 'beginner') === activeLevel);

  const openPuzzle = (puzzle: any) => {
    setSelectedPuzzle(puzzle);
    setAnswer('');
    if (answerRef.current) answerRef.current.value = '';
    setFeedback(null);
    setShowHint(false);
    setHintUsed(false);
    setShowMCHint(false);
    setMcHintUsed(false);
    setMcSelected(null);
    setImageRevealed(false);
    // pre-generate MC options
    const wrong = generateWrongOptions(puzzle.solution, puzzles);
    const opts = [puzzle.solution, ...wrong];
    // shuffle
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    setMcOptions(opts);
  };

  const closePuzzle = () => {
    setSelectedPuzzle(null);
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
    setHintUsed(false);
    setShowMCHint(false);
    setMcHintUsed(false);
    setMcSelected(null);
    setImageRevealed(false);
  };

  const norm = (s: string) => s.replace(/[\u064B-\u065F]/g, '').trim().toLowerCase();

  const handleCorrect = (usedMC: boolean) => {
    setFeedback('correct');
    setImageRevealed(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    const pts = usedMC ? 10 : hintUsed ? 12 : 20;
    if (currentUser) updateUser(currentUser.id, { points: currentUser.points + pts });
    setTimeout(() => closePuzzle(), 2500);
  };

  const checkAnswer = () => {
    // اقرأ القيمة من ref مباشرة لدعم Android IME العربي
    const currentAnswer = answerRef.current ? answerRef.current.value : answer;
    if (norm(currentAnswer) === norm(selectedPuzzle.solution)) {
      handleCorrect(false);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1800);
    }
  };

  const handleMCSelect = (opt: string, idx: number) => {
    if (mcSelected !== null) return;
    setMcSelected(idx);
    if (norm(opt) === norm(selectedPuzzle.solution)) {
      setTimeout(() => handleCorrect(true), 400);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1800);
    }
  };

  const activateMCHint = () => {
    setShowMCHint(true);
    setMcHintUsed(true);
    setShowHint(false);
  };

  const activateTextHint = () => {
    setShowHint(true);
    setHintUsed(true);
  };

  // ── Puzzle Detail View ──
  if (selectedPuzzle) {
    const imgId = selectedPuzzle.image;
    const imgSrc = imgId
      ? (imgId.startsWith('data:') ? imgId : localImages[imgId]?.data)
      : null;
    const earnedPts = mcHintUsed ? 10 : hintUsed ? 12 : 20;

    return (
      <div className="space-y-5">
        <Button variant="ghost" onClick={closePuzzle}
          className="dark:text-white flex items-center gap-1">
          <ChevronRight className="w-4 h-4" /> الْعَوْدَةُ
        </Button>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="rounded-3xl border-2 dark:border-[#333] bg-white dark:bg-[#222] shadow-xl">
            <CardContent className="p-6 text-center space-y-5">

              {/* Image: blurred until correct */}
              {imgSrc && (
                <div className="relative w-full h-44 rounded-2xl overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={selectedPuzzle.title}
                    className="w-full h-full object-cover transition-all duration-700"
                    style={{ filter: imageRevealed ? 'none' : 'blur(16px) brightness(0.7)' }}
                  />
                  {!imageRevealed && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <Eye className="w-8 h-8 text-white/80" />
                      <p className="text-white/80 text-xs font-bold">أَجِبْ بِشَكْلٍ صَحِيحٍ لِتَرَى الصُّورَةَ</p>
                    </div>
                  )}
                </div>
              )}

              {!imgSrc && (
                <div className="w-20 h-20 bg-[#54A0FF]/10 rounded-full mx-auto flex items-center justify-center">
                  <Brain className="w-10 h-10 text-[#54A0FF]" />
                </div>
              )}

              <div>
                <h2 className="text-2xl font-black dark:text-white">{selectedPuzzle.title}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge className="text-white"
                    style={{ backgroundColor: LEVEL_COLORS[selectedPuzzle.level || 'beginner'] }}>
                    {LEVEL_NAMES[selectedPuzzle.level || 'beginner']}
                  </Badge>
                  <Badge variant="secondary" className="dark:bg-[#333] dark:text-white">
                    {selectedPuzzle.type === 'logic' ? '🧠 مَنْطِقِيٌّ' : '🎭 لُغْزٌ'}
                  </Badge>
                  {!mcHintUsed && !hintUsed && (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                      🏆 20 نُقَاط
                    </Badge>
                  )}
                </div>
              </div>

              <div className="bg-[#F8F9FA] dark:bg-[#2A2A2A] p-5 rounded-2xl">
                <p className="text-xl font-bold leading-relaxed dark:text-white">
                  {selectedPuzzle.content}
                </p>
              </div>

              {/* Text hint */}
              {showHint && selectedPuzzle.hint && !showMCHint && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-[#FFF8E1] dark:bg-[#332B00] border border-[#FFD700]/40 rounded-2xl p-4 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-[#FFD700] mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium text-[#4A4A4A] dark:text-[#E0E0E0] text-right">
                    {selectedPuzzle.hint}
                  </p>
                </motion.div>
              )}

              {/* Multiple-choice hint */}
              {showMCHint && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-3">
                  <p className="text-sm font-bold text-[#636E72] dark:text-[#A0A0A0] flex items-center justify-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[#FFD700]" />
                    اخْتَرِ الْإِجَابَةَ الصَّحِيحَةَ (10 نُقَاط)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {mcOptions.map((opt, idx) => {
                      const isRight = norm(opt) === norm(selectedPuzzle.solution);
                      let cls = 'border-2 rounded-2xl py-3 px-3 text-sm font-bold transition-all text-center';
                      if (mcSelected === null) {
                        cls += ' border-[#E5E5E5] dark:border-[#444] dark:text-white hover:border-[#54A0FF]';
                      } else if (isRight) {
                        cls += ' bg-[#4CAF50] text-white border-[#4CAF50]';
                      } else if (mcSelected === idx) {
                        cls += ' bg-[#FF6B6B] text-white border-[#FF6B6B]';
                      } else {
                        cls += ' opacity-50 border-[#E5E5E5] dark:border-[#444] dark:text-white';
                      }
                      return (
                        <button key={idx} className={cls}
                          onClick={() => handleMCSelect(opt, idx)}
                          disabled={mcSelected !== null || !!feedback}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Text answer input (only when MC not shown) */}
              {!showMCHint && (
                <div className="space-y-3">
                  <Input
                    ref={answerRef}
                    placeholder="اكتب إجابتك هنا..."
                    defaultValue=""
                    onCompositionEnd={() => {
                      // تحديث state بعد اكتمال التركيب (Android IME)
                      if (answerRef.current) setAnswer(answerRef.current.value);
                    }}
                    onChange={e => setAnswer(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const val = answerRef.current ? answerRef.current.value : answer;
                        if (val.trim()) checkAnswer();
                      }
                    }}
                    className="text-center text-xl py-6 rounded-2xl border-2 focus:border-[#54A0FF] dark:bg-[#333] dark:border-[#444] dark:text-white"
                    disabled={!!feedback}
                    dir="rtl"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  <Button
                    className="w-full py-5 text-lg font-black bg-[#54A0FF] hover:bg-[#2e86de] rounded-2xl"
                    onClick={checkAnswer}
                    disabled={!!feedback}>
                    تَحَقَّقْ مِنَ الْإِجَابَةِ
                  </Button>
                </div>
              )}

              {/* Hint buttons */}
              {!showMCHint && mcOptions.length >= 4 && !mcHintUsed && !feedback && (
                <div className="flex gap-2">
                  {selectedPuzzle.hint && !showHint && !hintUsed && (
                    <Button variant="outline"
                      className="flex-1 py-3 rounded-2xl text-sm border-[#FFD700]/50 text-[#856404] dark:text-[#FFD700] dark:border-[#FFD700]/30"
                      onClick={activateTextHint}>
                      <Lightbulb className="w-4 h-4 ml-1" /> تَلْمِيحٌ نَصِّيٌّ
                    </Button>
                  )}
                  <Button variant="outline"
                    className="flex-1 py-3 rounded-2xl text-sm border-[#54A0FF]/50 text-[#54A0FF] dark:border-[#54A0FF]/30"
                    onClick={activateMCHint}>
                    <HelpCircle className="w-4 h-4 ml-1" /> خَيَارَاتٌ مُتَعَدِّدَةٌ
                  </Button>
                </div>
              )}

              {/* Feedback */}
              <AnimatePresence>
                {feedback === 'correct' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="text-[#4CAF50] flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-12 h-12" />
                    <span className="font-black text-xl">إِجَابَةٌ صَحِيحَةٌ! +{earnedPts} نُقَاط</span>
                  </motion.div>
                )}
                {feedback === 'wrong' && (
                  <motion.div
                    initial={{ x: 0 }} animate={{ x: [-8, 8, -8, 8, 0] }}
                    transition={{ duration: 0.4 }}
                    className="text-[#FF6B6B] flex flex-col items-center gap-1">
                    <XCircle className="w-12 h-12" />
                    <span className="font-black text-xl">حَاوِلْ مَرَّةً أُخْرَى!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ── Puzzle List ──
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black dark:text-white">تَحَدِّي الْأَذْكِيَاءِ</h2>
        <Trophy className="w-6 h-6 text-yellow-500" />
      </div>

      {/* Level filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button onClick={() => setActiveLevel('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeLevel === 'all'
              ? 'bg-[#4A4A4A] text-white'
              : 'bg-white dark:bg-[#333] border border-[#E5E5E5] dark:border-[#444] text-[#636E72] dark:text-white'
          }`}>
          الْكُلُّ
        </button>
        {LEVELS.map(lv => (
          <button key={lv.id} onClick={() => setActiveLevel(lv.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1 ${
              activeLevel === lv.id
                ? 'text-white'
                : 'bg-white dark:bg-[#333] border border-[#E5E5E5] dark:border-[#444] text-[#636E72] dark:text-white'
            }`}
            style={activeLevel === lv.id ? { backgroundColor: lv.color } : {}}>
            {lv.icon} {lv.nameAr}
            {!isLevelUnlocked(lv.id) && <Lock className="w-3 h-3 opacity-70" />}
          </button>
        ))}
      </div>

      {filteredPuzzles.length === 0 && (
        <div className="text-center py-12 space-y-2">
          <Brain className="w-14 h-14 mx-auto text-[#B2BEC3]" />
          <p className="text-[#636E72] dark:text-[#A0A0A0]">لَا تُوجَدُ أَلْغَازٌ فِي هَذَا الْمُسْتَوَى</p>
        </div>
      )}

      <div className="grid gap-4">
        {filteredPuzzles.map((puzzle, i) => {
          const locked = !isLevelUnlocked(puzzle.level || 'beginner');
          const lc = LEVEL_COLORS[puzzle.level || 'beginner'];
          const imgId = puzzle.image;
          const hasImg = imgId && (imgId.startsWith('data:') || localImages[imgId]?.data);

          return (
            <motion.div key={puzzle.id}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <Card
                className={`rounded-3xl border-2 dark:border-[#333] bg-white dark:bg-[#222] transition-all ${
                  locked
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer hover:border-[#54A0FF] hover:shadow-md'
                }`}
                onClick={() => !locked && openPuzzle(puzzle)}>
                <div className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    locked ? 'bg-[#F0F0F0] dark:bg-[#333]' : 'bg-[#54A0FF]/10'
                  }`}>
                    {locked
                      ? <Lock className="w-6 h-6 text-[#B2BEC3]" />
                      : <HelpCircle className="w-6 h-6 text-[#54A0FF]" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base dark:text-white truncate">{puzzle.title}</h3>
                    <p className="text-sm text-[#636E72] dark:text-[#A0A0A0] mt-0.5 line-clamp-1">
                      {puzzle.content.substring(0, 55)}...
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge variant="secondary" className="text-[10px] dark:bg-[#333] dark:text-white">
                        {puzzle.type === 'logic' ? '🧠 مَنْطِقِيٌّ' : '🎭 لُغْزٌ'}
                      </Badge>
                      <Badge className="text-[10px] text-white" style={{ backgroundColor: lc }}>
                        {LEVEL_NAMES[puzzle.level || 'beginner']}
                      </Badge>
                      {puzzle.hint && (
                        <Badge variant="outline" className="text-[10px] text-[#FFD700] border-[#FFD700]/50">
                          <Lightbulb className="w-2.5 h-2.5 ml-1" />تَلْمِيحٌ
                        </Badge>
                      )}
                      {hasImg && (
                        <Badge variant="outline" className="text-[10px] text-[#54A0FF] border-[#54A0FF]/40">
                          <Eye className="w-2.5 h-2.5 ml-1" />صُورَةٌ
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!locked && (
                    <ChevronRight className="w-5 h-5 text-[#B2BEC3] flex-shrink-0"
                      style={{ transform: 'scaleX(-1)' }} />
                  )}
                  {locked && (
                    <p className="text-[10px] text-[#B2BEC3] text-center w-16 flex-shrink-0">
                      اكسب {LEVELS.find(l => l.id === puzzle.level)?.requiredPoints} ن
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
