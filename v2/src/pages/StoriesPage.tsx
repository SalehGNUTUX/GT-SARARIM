import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronRight, Star, CheckCircle2, PlayCircle, Brain, Trophy, Sparkles, Award } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function StoriesPage() {
  const { stories, currentUser, updateUser, localImages, settings } = useStore();
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [exerciseMode, setExerciseMode] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answerFeedback, setAnswerFeedback] = useState<{ show: boolean; correct: boolean; msg: string }>({ show: false, correct: false, msg: '' });
  const [motivation, setMotivation] = useState<'correct' | 'streak' | 'perfect' | null>(null);
  // Shuffled exercise options for current session
  const [shuffledExercises, setShuffledExercises] = useState<any[]>([]);
  const [fontSize, setFontSize] = useState(18); // px

  const categories = settings.storyCategories;

  const getStoryImage = (story: any) => {
    if (story.image && story.image.startsWith('emoji:')) {
      const em = story.image.replace('emoji:', '');
      const enc = encodeURIComponent(em);
      const cat = categories.find((c: any) => c.id === story.category);
      const bg = encodeURIComponent(cat?.color || '#FF9F43');
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='${bg}'/%3E%3Ctext x='50' y='62' font-size='45' text-anchor='middle' fill='white'%3E${enc}%3C/text%3E%3C/svg%3E`;
    }
    if (story.image && story.image.startsWith('data:')) return story.image;
    if (story.image && localImages[story.image]) return localImages[story.image].data;
    const cat = categories.find((c: any) => c.id === story.category);
    if (cat) {
      const enc = encodeURIComponent(cat.icon || '📖');
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='${encodeURIComponent(cat.color || '#FF9F43')}'/%3E%3Ctext x='50' y='60' font-size='40' text-anchor='middle' fill='white'%3E${enc}%3C/text%3E%3C/svg%3E`;
    }
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23FF9F43'/%3E%3Ctext x='50' y='60' font-size='40' text-anchor='middle' fill='white'%3E%F0%9F%93%96%3C/text%3E%3C/svg%3E`;
  };

  const triggerConfetti = () => confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#FF9F43', '#4CAF50', '#54A0FF'] });

  const startExercise = (story: any) => {
    const exs = (story.exercises || []).map((ex: any) => {
      const correct = ex.options[ex.correctAnswer];
      const shuffled = shuffleArray([...ex.options]);
      return { ...ex, options: shuffled, correctAnswer: shuffled.indexOf(correct) };
    });
    setShuffledExercises(exs);
    setCurrentQ(0); setScore(0); setStreak(0);
    setAnswerFeedback({ show: false, correct: false, msg: '' });
    setMotivation(null);
    setExerciseMode(true);
  };

  const handleFinish = () => {
    const pts = score * 10;
    if (currentUser) updateUser(currentUser.id, { points: currentUser.points + pts });
    setExerciseMode(false);
    setSelectedStory(null);
    setCurrentQ(0); setScore(0); setStreak(0);
  };

  const handleAnswer = (idx: number) => {
    const ex = shuffledExercises[currentQ];
    const correct = idx === ex.correctAnswer;
    const GOOD = ['أَحْسَنْتَ! 🌟', 'مُمْتَازٌ! 🎉', 'رَائِعٌ! 💪', 'مَاشَاءَ اللَّهُ! 🤲'];
    const BAD  = ['حَاوِلْ مُجَدَّدًا! 💪', 'لَا تَيْأَسْ! 🌟', 'قَرِيبٌ! 🎯'];

    if (correct) {
      const ns = streak + 1;
      setStreak(ns); setScore(s => s + 1);
      setMotivation('correct');
      setTimeout(() => setMotivation(null), 1400);
      if (ns === 3) { setTimeout(() => { setMotivation('streak'); triggerConfetti(); setTimeout(() => setMotivation(null), 2000); }, 500); }
      else if (ns === 5) { setTimeout(() => { setMotivation('perfect'); triggerConfetti(); setTimeout(() => setMotivation(null), 2500); }, 800); }
    } else {
      setStreak(0);
    }

    setAnswerFeedback({ show: true, correct, msg: correct ? GOOD[Math.floor(Math.random() * GOOD.length)] : BAD[Math.floor(Math.random() * BAD.length)] });

    setTimeout(() => {
      setAnswerFeedback({ show: false, correct: false, msg: '' });
      if (currentQ < shuffledExercises.length - 1) setCurrentQ(i => i + 1);
      else handleFinish();
    }, 1500);
  };

  // ── Story reading view ──
  if (selectedStory) {
    return (
      <div className="space-y-5">
        <AnimatePresence>
          {motivation && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
              <div className={`rounded-2xl p-6 text-white text-center min-w-[280px] shadow-2xl bg-gradient-to-r ${motivation === 'correct' ? 'from-green-500 to-emerald-600' : motivation === 'streak' ? 'from-orange-500 to-red-500' : 'from-purple-500 to-pink-500'}`}>
                {motivation === 'correct' && <><Sparkles className="w-12 h-12 mx-auto text-yellow-300 mb-2"/><p className="text-xl font-black">أَحْسَنْتَ! +10 نُقَاطٍ</p></>}
                {motivation === 'streak'  && <><Award className="w-14 h-14 mx-auto text-yellow-300 mb-2"/><p className="text-xl font-black">🔥 3 إِجَابَاتٍ مُتَتَالِيَةٍ!</p></>}
                {motivation === 'perfect' && <><Trophy className="w-16 h-16 mx-auto text-yellow-300 mb-2"/><p className="text-xl font-black">🏆 5 مُتَتَالِيَةٍ! خُرَافِيٌّ!</p></>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => { setSelectedStory(null); setExerciseMode(false); }} className="flex items-center gap-2 dark:text-white">
            <ChevronRight className="w-4 h-4"/> الْعَوْدَةُ
          </Button>
          {!exerciseMode && (
            <div className="flex items-center gap-2 bg-[#F8F9FA] dark:bg-[#2A2A2A] rounded-2xl px-3 py-1.5">
              <button onClick={() => setFontSize(s => Math.max(14, s - 2))} className="w-7 h-7 rounded-full bg-white dark:bg-[#333] shadow flex items-center justify-center font-black text-[#4A4A4A] dark:text-white hover:bg-[#F0F0F0] dark:hover:bg-[#444] transition-colors text-lg">−</button>
              <span className="text-sm font-bold dark:text-white w-8 text-center">{fontSize}</span>
              <button onClick={() => setFontSize(s => Math.min(30, s + 2))} className="w-7 h-7 rounded-full bg-white dark:bg-[#333] shadow flex items-center justify-center font-black text-[#4A4A4A] dark:text-white hover:bg-[#F0F0F0] dark:hover:bg-[#444] transition-colors text-lg">+</button>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!exerciseMode ? (
            <motion.div key="story" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <img src={getStoryImage(selectedStory)} alt={selectedStory.title} className="w-full h-56 object-cover rounded-3xl shadow-lg border-4 border-white dark:border-[#333]"/>
              <Card className="rounded-3xl border-2 border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222]">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-2xl font-black dark:text-white leading-tight">{selectedStory.title}</CardTitle>
                    {(() => {
                      const cat = categories.find((c: any) => c.id === selectedStory.category);
                      return cat ? (
                        <Badge className="text-white flex-shrink-0 mt-1" style={{ backgroundColor: cat.color }}>
                          {cat.icon} {cat.name}
                        </Badge>
                      ) : null;
                    })()}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="leading-loose text-[#4A4A4A] dark:text-[#E0E0E0] whitespace-pre-wrap font-arabic text-right" dir="rtl"
                    style={{ fontSize: `${fontSize}px` }}>
                    {selectedStory.textWithHarakat || selectedStory.content}
                  </div>
                </CardContent>
              </Card>

              {selectedStory.exercises?.length > 0 && (
                <Button className="w-full py-7 text-xl font-black bg-[#FF9F43] hover:bg-[#FF8C1A] rounded-2xl shadow-lg" onClick={() => startExercise(selectedStory)}>
                  إِبْدَأِ التَّمَارِينَ! 🚀
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div key="exercise" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xl dark:text-white">اخْتَبِرْ مَعْلُومَاتِكَ!</h3>
                <div className="flex gap-2">
                  <Badge className="bg-[#FF9F43] text-white"><Trophy className="w-3 h-3 ml-1"/>{score}/{shuffledExercises.length}</Badge>
                  <Badge variant="outline" className="dark:border-[#444] dark:text-white">{currentQ + 1}/{shuffledExercises.length}</Badge>
                </div>
              </div>

              <div className="h-2 bg-[#F0F0F0] dark:bg-[#333] rounded-full">
                <motion.div className="h-full bg-[#FF9F43] rounded-full" animate={{ width: `${((currentQ) / shuffledExercises.length) * 100}%` }}/>
              </div>

              <Card className="rounded-3xl border-2 border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] p-6 space-y-5">
                <p className="text-xl font-black dark:text-white leading-relaxed">{shuffledExercises[currentQ]?.text}</p>
                <div className="grid gap-3">
                  {shuffledExercises[currentQ]?.options.map((opt: string, i: number) => (
                    <Button key={i} variant="outline"
                      className="py-6 text-lg rounded-2xl border-2 dark:border-[#444] dark:text-white text-right justify-start gap-3 transition-all"
                      style={{ borderColor: `${['#4CAF50','#54A0FF','#FF9F43','#A29BFE'][i]}30` }}
                      onClick={() => handleAnswer(i)} disabled={answerFeedback.show}>
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                        style={{ backgroundColor: ['#4CAF50','#54A0FF','#FF9F43','#A29BFE'][i] }}>
                        {['أ','ب','ج','د'][i]}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </Button>
                  ))}
                </div>
                <AnimatePresence>
                  {answerFeedback.show && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className={`p-4 rounded-2xl text-center font-bold ${answerFeedback.correct ? 'bg-[#4CAF50]/20 text-[#4CAF50]' : 'bg-[#FF6B6B]/20 text-[#FF6B6B]'}`}>
                      {answerFeedback.correct
                        ? <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5"/>{answerFeedback.msg}</span>
                        : <span>❌ {answerFeedback.msg}</span>
                      }
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Stories list ──
  const groupedStories = stories.reduce((acc: Record<string, any[]>, story) => {
    const cat = story.category || 'educational';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(story);
    return acc;
  }, {});

  if (stories.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <BookOpen className="w-16 h-16 mx-auto text-[#B2BEC3]"/>
        <p className="text-[#636E72] dark:text-[#A0A0A0]">لَا تُوجَدُ قِصَصٌ حَالِيًا</p>
        <p className="text-sm text-[#B2BEC3]">يُمْكِنُ لِلْوَالِدَيْنِ إِضَافَةُ قِصَصٍ جَدِيدَةٍ مِنْ لَوْحَةِ التَّحَكُّمِ</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedStories).map(([catId, catStories]) => {
        const cat = categories.find((c: any) => c.id === catId) || { name: catId, icon: '📖', color: '#FF9F43', id: catId };
        return (
          <div key={catId} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{cat.icon}</span>
                <h2 className="text-xl font-black dark:text-white" style={{ color: cat.color }}>{cat.name}</h2>
              </div>
              <Badge variant="outline" className="dark:border-[#444] dark:text-white">{catStories.length} قِصَّةٍ</Badge>
            </div>

            <div className="grid gap-4">
              {catStories.map((story, idx) => (
                <motion.div key={story.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                  <Card className="group cursor-pointer rounded-2xl border-2 border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] hover:shadow-md transition-all overflow-hidden"
                    style={{ ['--hover-color' as any]: cat.color }}
                    onClick={() => setSelectedStory(story)}>
                    <div className="flex h-28">
                      <div className="w-28 h-full overflow-hidden flex-shrink-0">
                        <img src={getStoryImage(story)} alt={story.title} className="w-full h-full object-cover"/>
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="font-black text-md dark:text-white line-clamp-1">{story.title}</h3>
                          <p className="text-xs text-[#636E72] dark:text-[#A0A0A0] line-clamp-2 mt-1 leading-relaxed">
                            {(story.textWithHarakat || story.content).substring(0, 80)}...
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <Badge className="text-[10px] text-white" style={{ backgroundColor: cat.color }}>
                            {story.ageGroup === 'all' ? 'الْكُلُّ' : story.ageGroup}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs" style={{ color: cat.color }}>
                            <PlayCircle className="w-3 h-3"/>
                            <span>اقْرَأِ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
