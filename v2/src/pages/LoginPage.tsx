import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, ShieldCheck, UserPlus, LogIn, Lock, KeyRound, Sparkles, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import appIcon from '../../public/GT-SARARIM-ICON.png';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

export default function LoginPage() {
  const { users, setCurrentUser, addUser, settings, theme, toggleTheme, localImages } = useStore();

  const getAvatar = (user: any) => {
    if (!user.avatar) return null;
    if (user.avatar.startsWith('data:')) return user.avatar;
    if (localImages[user.avatar]) return localImages[user.avatar].data;
    return null;
  };
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [childPassword, setChildPassword] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [parentPassword, setParentPassword] = useState('');
  const [showParentLogin, setShowParentLogin] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // ── اكتشاف وضع النظام عند أول تحميل ──
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const stored = localStorage.getItem('gt-sararim-storage-v3');
    if (!stored) {
      // لا توجد بيانات محفوظة → اتبع وضع النظام
      if (prefersDark && theme === 'light') toggleTheme();
      else if (!prefersDark && theme === 'dark') toggleTheme();
    }
    // الاستماع لتغييرات وضع النظام
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches && theme === 'light') toggleTheme();
      else if (!e.matches && theme === 'dark') toggleTheme();
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleLogin = (user: any) => {
    if (user.password && user.password !== '') {
      setSelectedUserId(user.id);
      return;
    }
    setCurrentUser(user);
  };

  const verifyChildPassword = () => {
    const user = users.find(u => u.id === selectedUserId);
    if (user && user.password === childPassword) {
      setCurrentUser(user);
      setSelectedUserId(null); setChildPassword('');
    } else {
      setChildPassword('');
    }
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    const newUser = {
      id: Date.now().toString(), name: name.trim(),
      role: 'child' as const, ageGroup: '6-8' as const,
      points: 0, achievements: [], playTimeToday: 0,
      lastActive: new Date().toISOString(), password: '',
    };
    addUser(newUser); setCurrentUser(newUser);
  };

  const handleGuest = () => {
    setCurrentUser({
      id: 'guest', name: 'ضَيْفٌ', role: 'guest', ageGroup: 'all',
      points: 0, achievements: [], playTimeToday: 0,
      lastActive: new Date().toISOString(),
    });
  };

  const handleParentLogin = () => {
    if (parentPassword === settings.parentPassword) {
      sessionStorage.setItem('parent_auth_ts', Date.now().toString());
      setCurrentUser({
        id: 'parent', name: settings.parentName, role: 'parent', ageGroup: 'all',
        points: 0, achievements: [], playTimeToday: 0,
        lastActive: new Date().toISOString(),
      });
      setShowParentLogin(false);
    } else {
      setParentPassword('');
    }
  };

  // Child password screen
  if (selectedUserId) {
    const u = users.find(u => u.id === selectedUserId);
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDFCF0] to-[#F5F5E8] dark:from-[#1A1A1A] dark:to-[#0D0D0D] flex flex-col items-center justify-center p-6" dir="rtl">
        {/* Theme toggle */}
        <button onClick={toggleTheme} className="absolute top-4 left-4 bg-white/80 dark:bg-black/40 rounded-full p-2 shadow">
          {theme === 'light' ? <Moon className="w-5 h-5 text-[#4A4A4A]"/> : <Sun className="w-5 h-5 text-yellow-400"/>}
        </button>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md space-y-6">
          <Card className="rounded-3xl border-2 dark:border-[#333] bg-white/90 dark:bg-[#222]/90 shadow-2xl">
            <CardHeader><CardTitle className="text-center dark:text-white text-xl">مَرْحَبًا {u?.name}!</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#45a049] flex items-center justify-center shadow-lg">
                  <KeyRound className="w-10 h-10 text-white"/>
                </div>
              </div>
              <Input type="password" placeholder="كَلِمَةُ السِّرِّ..." value={childPassword}
                onChange={e => setChildPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && verifyChildPassword()}
                className="rounded-xl dark:bg-[#333] dark:border-[#444] dark:text-white text-center text-xl py-6"/>
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-[#4CAF50] to-[#45a049] rounded-xl py-6 text-lg font-bold" onClick={verifyChildPassword}>دُخُولٌ</Button>
                <Button variant="ghost" onClick={() => setSelectedUserId(null)} className="dark:text-white">رُجُوعٌ</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFCF0] to-[#F5F5E8] dark:from-[#1A1A1A] dark:to-[#0D0D0D] flex flex-col items-center justify-center p-6 text-right transition-colors" dir="rtl">

      {/* زر تغيير الوضع */}
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={toggleTheme}
        className="fixed top-4 left-4 z-50 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full p-2.5 shadow-lg border border-[#E5E5E5] dark:border-[#333] hover:scale-110 transition-transform">
        {theme === 'light'
          ? <Moon className="w-5 h-5 text-[#4A4A4A]"/>
          : <Sun className="w-5 h-5 text-yellow-400"/>}
      </motion.button>

      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }} className="w-full max-w-md space-y-8">

        {/* Logo */}
        <div className="text-center space-y-3">
          <motion.div whileHover={{ scale: 1.08, rotate: 3 }} whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsLogoHovered(true)} onHoverEnd={() => setIsLogoHovered(false)}
            className="w-28 h-28 rounded-3xl mx-auto flex items-center justify-center shadow-2xl relative overflow-hidden cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #ee5253 100%)' }}>
            <img src={appIcon} alt="GT-SARARIM" className="w-full h-full object-cover"
              onError={e => { e.currentTarget.style.display='none'; const p=e.currentTarget.parentElement; if(p){const s=document.createElement('span');s.className='font-bold text-4xl text-white';s.textContent='GT';p.appendChild(s);} }}/>
            <motion.div animate={{ opacity: isLogoHovered ? 1 : 0 }} className="absolute inset-0 bg-white/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-yellow-300"/>
            </motion.div>
          </motion.div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-[#FF6B6B] to-[#FF9F43] bg-clip-text text-transparent">GT-SARARIM</h1>
          <p className="text-[#636E72] dark:text-[#A0A0A0] font-medium">سارة ريم — عالم المعرفة والمرح</p>
        </div>

        {/* Card */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
          <Card className="border-2 border-[#E5E5E5] dark:border-[#333] shadow-xl rounded-3xl bg-white/90 dark:bg-[#222]/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-[#F8F9FA] to-[#F0F0F0] dark:from-[#2A2A2A] dark:to-[#222] border-b border-[#E5E5E5] dark:border-[#333]">
              <CardTitle className="text-center text-lg font-bold dark:text-white">اخْتَرْ حِسَابَكَ</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {users.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {users.filter(u => u.role !== 'parent').map((user, idx) => (
                    <motion.div key={user.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                      <Button variant="outline" className="h-24 w-full flex flex-col gap-2 rounded-2xl border-2 hover:border-[#4CAF50] hover:bg-[#E8F5E9] dark:hover:bg-[#1B5E20] dark:border-[#444] transition-all group" onClick={() => handleLogin(user)}>
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-[#F0F0F0] to-[#E0E0E0] dark:from-[#333] dark:to-[#2A2A2A] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                          {getAvatar(user) ? (
                            <img src={getAvatar(user)!} className="w-full h-full object-cover" alt={user.name}/>
                          ) : (
                            <User className="w-6 h-6 text-[#4CAF50]"/>
                          )}
                        </div>
                        <span className="font-bold dark:text-white text-sm truncate w-full text-center">{user.name}</span>
                        {user.password && <Lock className="w-3 h-3 text-[#B2BEC3]"/>}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}

              {isCreating ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pt-3 border-t dark:border-[#333]">
                  <Label className="dark:text-white">اسم الطفل</Label>
                  <Input placeholder="أَدْخِلِ اسْمَكَ هُنَا..." value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    className="rounded-xl border-2 focus:border-[#4CAF50] dark:bg-[#333] dark:border-[#444] dark:text-white text-center py-6 text-lg"/>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-[#4CAF50] to-[#45a049] rounded-xl py-5 font-bold" onClick={handleCreate}>إِنْشَاءُ حِسَابٍ</Button>
                    <Button variant="ghost" onClick={() => setIsCreating(false)} className="dark:text-white">إِلْغَاءٌ</Button>
                  </div>
                </motion.div>
              ) : (
                <Button variant="outline" className="w-full py-5 rounded-2xl border-2 border-dashed border-[#B2BEC3] dark:border-[#555] text-[#636E72] dark:text-[#A0A0A0] flex items-center gap-2 hover:border-[#4CAF50] hover:bg-[#F8FFF8] dark:hover:bg-[#1B2A1B] transition-all" onClick={() => setIsCreating(true)}>
                  <UserPlus className="w-5 h-5"/> إِضَافَةُ حِسَابٍ جَدِيدٍ
                </Button>
              )}

              <div className="grid grid-cols-2 gap-3 pt-3 border-t dark:border-[#333]">
                <Button variant="ghost" className="rounded-xl flex items-center gap-2 dark:text-white hover:bg-[#E8F5E9] dark:hover:bg-[#1B5E20] transition-all" onClick={handleGuest}>
                  <LogIn className="w-4 h-4"/> دُخُولٌ كَضَيْفٍ
                </Button>

                <Dialog open={showParentLogin} onOpenChange={setShowParentLogin}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full rounded-xl flex items-center gap-2 text-[#FF6B6B] hover:bg-[#FFF0F0] dark:hover:bg-[#FF6B6B]/10 transition-all">
                      <ShieldCheck className="w-4 h-4"/> لَوْحَةُ الْوَالِدَيْنِ
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-3xl dark:bg-[#222] dark:text-white" dir="rtl">
                    <DialogHeader><DialogTitle className="text-center text-xl">دُخُولُ الْوَالِدَيْنِ</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-3">
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 w-4 h-4 text-[#B2BEC3]"/>
                        <Input type="password" placeholder="كَلِمَةُ السِّرِّ..." className="pr-10 rounded-xl dark:bg-[#333] dark:border-[#444] py-6 text-lg"
                          value={parentPassword}
                          onChange={e => setParentPassword(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleParentLogin()}/>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#ee5253] py-5 rounded-xl font-bold text-lg" onClick={handleParentLogin}>دُخُولٌ</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center text-xs text-[#B2BEC3] dark:text-[#555]">
          الْبَرْنَامَجُ حُرٌّ مَفْتُوحُ الْمَصْدَرِ — رُخْصَةُ غَنُو الْعُمُومِيَّةِ 3
        </motion.p>
      </motion.div>
    </div>
  );
}
