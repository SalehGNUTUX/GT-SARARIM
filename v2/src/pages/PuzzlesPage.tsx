import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, HelpCircle, CheckCircle2, XCircle, Trophy, ChevronRight, Lightbulb, Lock } from 'lucide-react';
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

export default function PuzzlesPage() {
  const { puzzles, currentUser, updateUser, getCurrentLevel, localImages } = useStore();
  const [selectedPuzzle, setSelectedPuzzle] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [activeLevel, setActiveLevel] = useState<string>('all');

  const userLevel = currentUser ? getCurrentLevel(currentUser.id) : 'beginner';
  const levelOrder = ['beginner','intermediate','advanced','expert'];
  const userLevelIdx = levelOrder.indexOf(userLevel);

  const isLevelUnlocked = (level: string) => {
    if (!level) return true;
    return levelOrder.indexOf(level) <= userLevelIdx;
  };

  const filteredPuzzles = activeLevel === 'all' ? puzzles : puzzles.filter(p => (p.level || 'beginner') === activeLevel);

  const checkAnswer = () => {
    const norm = (s: string) => s.trim().replace(/[\u064B-\u065F]/g, '').toLowerCase();
    if (norm(answer) === norm(selectedPuzzle.solution)) {
      setFeedback('correct');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      const pts = hintUsed ? 10 : 20;
      if (currentUser) updateUser(currentUser.id, { points: currentUser.points + pts });
      setTimeout(() => {
        setSelectedPuzzle(null); setAnswer(''); setFeedback(null); setShowHint(false); setHintUsed(false);
      }, 2200);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const useHint = () => { setShowHint(true); setHintUsed(true); };

  if (selectedPuzzle) {
    const locked = !isLevelUnlocked(selectedPuzzle.level || 'beginner');
    return (
      <div className="space-y-5">
        <Button variant="ghost" onClick={() => { setSelectedPuzzle(null); setAnswer(''); setFeedback(null); setShowHint(false); setHintUsed(false); }} className="dark:text-white flex items-center gap-1">
          <ChevronRight className="w-4 h-4"/> الْعَوْدَةُ
        </Button>

        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}>
          <Card className="rounded-3xl border-2 dark:border-[#333] bg-white dark:bg-[#222] shadow-xl">
            <CardContent className="p-8 text-center space-y-6">
              {(() => {
                const imgSrc = selectedPuzzle.image
                  ? (selectedPuzzle.image.startsWith('data:') ? selectedPuzzle.image : localImages[selectedPuzzle.image]?.data)
                  : null;
                return imgSrc ? (
                  <ImageViewer src={imgSrc} alt={selectedPuzzle.title} className="w-full h-52 rounded-2xl overflow-hidden" caption="انقر لتكبير الصورة 🔍"/>
                ) : (
                  <div className="w-20 h-20 bg-[#54A0FF]/10 rounded-full mx-auto flex items-center justify-center">
                    <Brain className="w-10 h-10 text-[#54A0FF]"/>
                  </div>
                );
              })()}
              <div>
                <h2 className="text-2xl font-black dark:text-white">{selectedPuzzle.title}</h2>
                <Badge className="mt-2" style={{ backgroundColor: LEVEL_COLORS[selectedPuzzle.level||'beginner'] }}>
                  {LEVEL_NAMES[selectedPuzzle.level||'beginner']}
                </Badge>
              </div>

              <div className="bg-[#F8F9FA] dark:bg-[#2A2A2A] p-6 rounded-2xl">
                <p className="text-xl font-bold leading-relaxed dark:text-white">{selectedPuzzle.content}</p>
              </div>

              {showHint && selectedPuzzle.hint && (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  className="bg-[#FFF8E1] dark:bg-[#332B00] border border-[#FFD700]/40 rounded-2xl p-4 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-[#FFD700] mt-0.5 flex-shrink-0"/>
                  <p className="text-sm font-medium text-[#4A4A4A] dark:text-[#E0E0E0] text-right">{selectedPuzzle.hint}</p>
                </motion.div>
              )}

              <div className="space-y-3">
                <Input placeholder="اكتب إجابتك هنا..." value={answer} onChange={e => setAnswer(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && checkAnswer()}
                  className="text-center text-xl py-6 rounded-2xl border-2 focus:border-[#54A0FF] dark:bg-[#333] dark:border-[#444] dark:text-white"
                  disabled={!!feedback}
                />
                <div className="flex gap-3">
                  {selectedPuzzle.hint && !showHint && !hintUsed && (
                    <Button variant="outline" className="flex-1 py-5 rounded-2xl border-2 border-[#FFD700]/50 text-[#856404] dark:text-[#FFD700] dark:border-[#FFD700]/30 flex items-center gap-2" onClick={useHint}>
                      <Lightbulb className="w-4 h-4"/> تَلْمِيحٌ (-10ن)
                    </Button>
                  )}
                  <Button className="flex-1 py-5 text-lg font-black bg-[#54A0FF] hover:bg-[#2e86de] rounded-2xl" onClick={checkAnswer} disabled={!answer.trim() || !!feedback}>
                    تَحَقَّقْ مِنَ الْإِجَابَةِ
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {feedback === 'correct' && (
                  <motion.div initial={{ scale:0 }} animate={{ scale:1 }} className="text-[#4CAF50] flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-12 h-12"/>
                    <span className="font-black text-xl">إِجَابَةٌ صَحِيحَةٌ! +{hintUsed?10:20} نُقْطَةً</span>
                  </motion.div>
                )}
                {feedback === 'wrong' && (
                  <motion.div initial={{ x:[-8,8,-8,8,0] }} animate={{ x:0 }} className="text-[#FF6B6B] flex flex-col items-center gap-2">
                    <XCircle className="w-12 h-12"/>
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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black dark:text-white">تَحَدِّي الْأَذْكِيَاءِ</h2>
        <Trophy className="w-6 h-6 text-yellow-500"/>
      </div>

      {/* Level filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button onClick={() => setActiveLevel('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeLevel==='all'?'bg-[#4A4A4A] text-white':'bg-white dark:bg-[#333] border border-[#E5E5E5] dark:border-[#444] text-[#636E72] dark:text-white'}`}>
          الْكُلُّ
        </button>
        {LEVELS.map(lv => (
          <button key={lv.id} onClick={() => setActiveLevel(lv.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1 ${activeLevel===lv.id?'text-white':'bg-white dark:bg-[#333] border border-[#E5E5E5] dark:border-[#444] text-[#636E72] dark:text-white'}`}
            style={activeLevel===lv.id ? { backgroundColor: lv.color } : {}}>
            {lv.icon} {lv.nameAr}
            {!isLevelUnlocked(lv.id) && <Lock className="w-3 h-3 opacity-70"/>}
          </button>
        ))}
      </div>

      {filteredPuzzles.length === 0 && (
        <div className="text-center py-12 space-y-2">
          <Brain className="w-14 h-14 mx-auto text-[#B2BEC3]"/>
          <p className="text-[#636E72] dark:text-[#A0A0A0]">لَا تُوجَدُ أَلْغَازٌ فِي هَذَا الْمُسْتَوَى</p>
        </div>
      )}

      <div className="grid gap-4">
        {filteredPuzzles.map((puzzle, i) => {
          const locked = !isLevelUnlocked(puzzle.level || 'beginner');
          const lc = LEVEL_COLORS[puzzle.level || 'beginner'];
          return (
            <motion.div key={puzzle.id} initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }}>
              <Card className={`rounded-3xl border-2 dark:border-[#333] bg-white dark:bg-[#222] transition-all p-5 ${locked?'opacity-60 cursor-not-allowed':'cursor-pointer hover:border-[#54A0FF] hover:bg-[#EBF4FF] dark:hover:bg-[#1a2530]'}`}
                onClick={() => !locked && setSelectedPuzzle(puzzle)}>
                <div className="flex items-center gap-4">
                  <div className={`w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0 ${locked?'bg-[#F0F0F0] dark:bg-[#333]':'bg-[#54A0FF]/10'}`}>
                    {locked ? <Lock className="w-6 h-6 text-[#B2BEC3]"/> : <HelpCircle className="w-6 h-6 text-[#54A0FF]"/>}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg dark:text-white">{puzzle.title}</h3>
                    <p className="text-sm text-[#636E72] dark:text-[#A0A0A0] mt-0.5 line-clamp-1">{puzzle.content.substring(0, 60)}...</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px] dark:bg-[#333] dark:text-white">{puzzle.type==='logic'?'مَنْطِقٌ':'لُغْزٌ'}</Badge>
                      <Badge className="text-[10px] text-white" style={{ backgroundColor: lc }}>{LEVEL_NAMES[puzzle.level||'beginner']}</Badge>
                      {puzzle.hint && <Badge variant="outline" className="text-[10px] text-[#FFD700] border-[#FFD700]/50"><Lightbulb className="w-2.5 h-2.5 ml-1"/>تَلْمِيحٌ</Badge>}
                    </div>
                  </div>
                  {!locked && <ChevronRight className="w-5 h-5 text-[#B2BEC3]" style={{ transform:'scaleX(-1)' }}/>}
                  {locked && <p className="text-[10px] text-[#B2BEC3] text-center w-16">اِكْسِبْ {LEVELS.find(l=>l.id===puzzle.level)?.requiredPoints} نُقْطَةً</p>}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
