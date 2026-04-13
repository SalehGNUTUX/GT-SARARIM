import { motion } from 'motion/react';
import { User, Trophy, Star, Award, LogOut, BookOpen, Brain, Zap } from 'lucide-react';
import { useStore, LEVELS } from '../store/useStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { currentUser, setCurrentUser, getCurrentLevel, localImages } = useStore();

  const settings = useStore(s => s.settings);

  const getAvatar = (user: any) => {
    // Parent avatar is stored in settings.parentAvatar
    if (user?.role === 'parent') {
      const pid = settings.parentAvatar;
      if (pid && localImages[pid]) return localImages[pid].data;
      return null;
    }
    if (!user?.avatar) return null;
    if (user.avatar.startsWith('data:')) return user.avatar;
    if (localImages[user.avatar]) return localImages[user.avatar].data;
    return null;
  };

  if (!currentUser) return null;

  const level = getCurrentLevel(currentUser.id);
  const levelInfo = LEVELS.find(l => l.id === level) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.findIndex(l => l.id === level) + 1];
  const progressToNext = nextLevel
    ? Math.min(100, Math.round(((currentUser.points - levelInfo.requiredPoints) / (nextLevel.requiredPoints - levelInfo.requiredPoints)) * 100))
    : 100;

  const ACHIEVEMENT_BADGES = [
    { id: 'reader', title: 'قَارِئٌ مُتَمَيِّزٌ', icon: <BookOpen className="w-4 h-4"/>, color: '#FF9F43', needed: 50 },
    { id: 'puzzle', title: 'بَطَلُ الْأَلْغَازِ',  icon: <Brain className="w-4 h-4"/>,   color: '#54A0FF', needed: 100 },
    { id: 'star',   title: 'الْمُثَقَّفُ الصَّغِيرُ', icon: <Star className="w-4 h-4"/>,   color: '#FFD700', needed: 500 },
    { id: 'award',  title: 'بَطَلُ الْمَعْرِفَةِ',  icon: <Award className="w-4 h-4"/>,  color: '#FF6B6B', needed: 1000 },
    { id: 'zap',    title: 'الْعَبْقَرِيُّ',         icon: <Zap className="w-4 h-4"/>,   color: '#A29BFE', needed: 3000 },
  ];

  const earned = ACHIEVEMENT_BADGES.filter(b => currentUser.points >= b.needed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center space-y-3 py-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#81C784] border-4 border-white dark:border-[#333] shadow-xl flex items-center justify-center overflow-hidden">
            {getAvatar(currentUser) ? (
              <img src={getAvatar(currentUser)!} className="w-full h-full object-cover" alt={currentUser.name}/>
            ) : (
              <User className="w-12 h-12 text-white"/>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-1.5 rounded-full shadow">
            <Trophy className="w-4 h-4"/>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black dark:text-white">{currentUser.name}</h2>
          <p className="text-sm text-[#636E72] dark:text-[#A0A0A0]">
            {currentUser.role === 'parent' ? 'الْوَالِدَانِ' : currentUser.ageGroup === 'all' ? 'ضَيْفٌ' : `${currentUser.ageGroup} سَنَةً`}
          </p>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-3xl border-2 bg-[#E8F5E9] dark:bg-[#1B5E20]/20 border-[#A5D6A7] dark:border-[#2E7D32]">
          <CardContent className="p-4 text-center">
            <p className="text-xs font-bold text-[#2E7D32] dark:text-[#A5D6A7]">نُقَاطِي</p>
            <p className="text-3xl font-black text-[#1B5E20] dark:text-[#4CAF50]">{currentUser.points}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 bg-[#FFF3E0] dark:bg-[#BF360C]/20 border-[#FFCC80] dark:border-[#E65100]">
          <CardContent className="p-4 text-center">
            <p className="text-xs font-bold text-[#E65100] dark:text-[#FFCC80]">إِنْجَازَاتِي</p>
            <p className="text-3xl font-black text-[#BF360C] dark:text-[#FF6B6B]">{earned.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Level progress */}
      <Card className="rounded-3xl border-2 dark:border-[#333] bg-white dark:bg-[#222]">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{levelInfo.icon}</span>
              <div>
                <p className="font-black dark:text-white">{levelInfo.nameAr}</p>
                <p className="text-xs text-[#636E72] dark:text-[#A0A0A0]">{levelInfo.description}</p>
              </div>
            </div>
            {nextLevel && (
              <div className="text-right">
                <p className="text-xs text-[#636E72] dark:text-[#A0A0A0]">التَّالِي</p>
                <p className="font-bold text-sm dark:text-white">{nextLevel.icon} {nextLevel.nameAr}</p>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#636E72] dark:text-[#A0A0A0]">
              <span>{currentUser.points} نُقْطَةٍ</span>
              {nextLevel && <span>{nextLevel.requiredPoints} نُقْطَةٍ</span>}
            </div>
            <div className="h-3 bg-[#F0F0F0] dark:bg-[#333] rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ backgroundColor: levelInfo.color }}
                initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} transition={{ duration: 0.8 }}/>
            </div>
          </div>
          {!nextLevel && <p className="text-center text-sm font-bold text-[#FF6B6B]">🏆 لَقَدْ بَلَغْتَ أَعْلَى مُسْتَوَى!</p>}
        </CardContent>
      </Card>

      {/* Achievements */}
      {ACHIEVEMENT_BADGES.length > 0 && (
        <Card className="rounded-3xl border-2 dark:border-[#333] bg-white dark:bg-[#222]">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-black dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FFD700]"/> الْإِنْجَازَاتُ
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {ACHIEVEMENT_BADGES.map(badge => {
                const unlocked = currentUser.points >= badge.needed;
                return (
                  <div key={badge.id} className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${unlocked ? 'border-transparent' : 'border-[#E5E5E5] dark:border-[#333] opacity-40'}`}
                    style={unlocked ? { backgroundColor: `${badge.color}20`, borderColor: `${badge.color}40` } : {}}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${unlocked ? 'text-white' : 'bg-[#F0F0F0] dark:bg-[#333] text-[#B2BEC3]'}`}
                      style={unlocked ? { backgroundColor: badge.color } : {}}>
                      {badge.icon}
                    </div>
                    <p className="text-[10px] font-bold text-center dark:text-white leading-tight">{badge.title}</p>
                    {!unlocked && <p className="text-[9px] text-[#B2BEC3]">{badge.needed} ن</p>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logout */}
      <Button variant="outline" className="w-full py-5 rounded-2xl border-2 text-[#FF6B6B] border-[#FF6B6B]/40 hover:bg-[#FFF0F0] dark:hover:bg-[#FF6B6B]/10 flex items-center justify-center gap-2 font-bold"
        onClick={() => setCurrentUser(null)}>
        <LogOut className="w-5 h-5"/> تَسْجِيلُ الْخُرُوجِ
      </Button>
    </div>
  );
}
