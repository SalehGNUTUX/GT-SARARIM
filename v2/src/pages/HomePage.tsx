import { motion } from 'motion/react';
import { BookOpen, Gamepad2, Brain, Star, Trophy, Clock, ChevronLeft, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore, LEVELS } from '../store/useStore';

export default function HomePage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { currentUser, stories, questions, puzzles, settings, getCurrentLevel } = useStore();

  const level = currentUser ? getCurrentLevel(currentUser.id) : 'beginner';
  const levelInfo = LEVELS.find(l => l.id === level) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.findIndex(l => l.id === level) + 1];
  const progressToNext = nextLevel && currentUser
    ? Math.min(100, Math.round(((currentUser.points - levelInfo.requiredPoints) / (nextLevel.requiredPoints - levelInfo.requiredPoints)) * 100))
    : 100;

  const limit = currentUser?.customTimeLimitEnabled && currentUser?.dailyTimeLimit
    ? currentUser.dailyTimeLimit
    : settings.dailyTimeLimit;

  const sections = [
    { id: 'stories',    title: 'قِصَصٌ مُصَوَّرَةٌ',    desc: 'قِصَصٌ مُمْتِعَةٌ وَعِبَرٌ مُفِيدَةٌ',  icon: BookOpen,  color: '#FF9F43', bg: '#FFF5EB', count: `${stories.length} قِصَّةٍ` },
    { id: 'puzzles',    title: 'أَلْغَازٌ ذَكِيَّةٌ',     desc: 'نَشِّطْ عَقْلَكَ مَعَ الْأَلْغَازِ',   icon: Brain,    color: '#54A0FF', bg: '#EBF4FF', count: `${puzzles.length} لُغْزًا` },
    { id: 'activities', title: 'أَنْشِطَةٌ تَعْلِيمِيَّةٌ', desc: 'تَعَلَّمْ وَالْعَبْ فِي آنٍ وَاحِدٍ',  icon: Gamepad2, color: '#FF6B6B', bg: '#FFF0F0', count: `${questions.length} سُؤَالًا` },
  ];

  return (
    <div className="space-y-5">
      {/* Welcome card */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] p-6 text-white shadow-xl">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300"/>
            <p className="text-sm font-medium opacity-90">مَرْحَباً!</p>
          </div>
          <h2 className="text-2xl font-black">{currentUser?.name} 👋</h2>
          <p className="text-sm opacity-85">جَاهِزٌ لِمُغَامَرَةٍ جَدِيدَةٍ الْيَوْمَ؟</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400"/>
              <span className="font-bold text-sm">{currentUser?.points} نُقْطَةٍ</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="text-sm">{levelInfo.icon} {levelInfo.nameAr}</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
        <div className="absolute -left-4 -top-4 w-24 h-24 bg-black/5 rounded-full blur-xl"/>
      </motion.div>

      {/* Level progress */}
      {nextLevel && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="rounded-2xl border-2 dark:border-[#333] bg-white dark:bg-[#222]">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold dark:text-white flex items-center gap-1">{levelInfo.icon} {levelInfo.nameAr}</span>
                <span className="text-[#636E72] dark:text-[#A0A0A0] flex items-center gap-1">{nextLevel.icon} {nextLevel.nameAr} →</span>
              </div>
              <div className="h-2.5 bg-[#F0F0F0] dark:bg-[#333] rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: levelInfo.color }}
                  initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} transition={{ duration: 1, delay: 0.3 }}/>
              </div>
              <p className="text-xs text-[#636E72] dark:text-[#A0A0A0] text-left">{progressToNext}% — يَحْتَاجُ {nextLevel.requiredPoints - (currentUser?.points||0)} نُقْطَةٍ</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Time tracker */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <Card className="rounded-2xl border-2 dark:border-[#333] bg-white dark:bg-[#222]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F0F0] dark:bg-[#333] flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-[#636E72]"/>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-[#636E72] dark:text-[#A0A0A0]">وَقْتُ اللَّعِبِ الْيَوْمَ</p>
              <div className="h-1.5 bg-[#F0F0F0] dark:bg-[#333] rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-[#4CAF50] rounded-full transition-all" style={{ width: `${Math.min(100, ((currentUser?.playTimeToday || 0) / limit) * 100)}%` }}/>
              </div>
            </div>
            <p className="text-sm font-black dark:text-white flex-shrink-0">{currentUser?.playTimeToday || 0}<span className="text-[#636E72] font-normal">/{limit}</span></p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation cards */}
      <div className="grid gap-4">
        {sections.map((sec, i) => {
          const Icon = sec.icon;
          return (
            <motion.div key={sec.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
              <Card className="group cursor-pointer rounded-2xl border-2 border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] hover:shadow-lg transition-all overflow-hidden"
                onClick={() => onNavigate(sec.id)}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: sec.bg }}>
                    <Icon className="w-7 h-7" style={{ color: sec.color }}/>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg dark:text-white">{sec.title}</h3>
                    <p className="text-sm text-[#636E72] dark:text-[#A0A0A0] mt-0.5">{sec.desc}</p>
                    <Badge className="mt-2 text-[10px] text-white" style={{ backgroundColor: sec.color }}>{sec.count}</Badge>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-[#B2BEC3] group-hover:-translate-x-1 transition-transform"/>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
