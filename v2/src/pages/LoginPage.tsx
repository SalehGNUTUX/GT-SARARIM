import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, ShieldCheck, UserPlus, LogIn, Lock, KeyRound, Sparkles, Moon, Sun, RefreshCw, ArrowRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import appIcon from '../../public/GT-SARARIM-ICON.png';

export default function LoginPage() {
  const { users, setCurrentUser, addUser, updateUser, updateSettings, settings, theme, toggleTheme, localImages } = useStore();

  const getAvatar = (user: any) => {
    if (!user.avatar) return null;
    if (user.avatar.startsWith('data:')) return user.avatar;
    if (localImages[user.avatar]) return localImages[user.avatar].data;
    return null;
  };
  const [name, setName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null); // لحل مشكلة Android IME
  const [isCreating, setIsCreating] = useState(false);
  const [childPassword, setChildPassword] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [parentPassword, setParentPassword] = useState('');
  const [parentPwdError, setParentPwdError] = useState(false);
  // 'main' | 'parent' | 'parent-recovery'
  const [screen, setScreen] = useState<'main' | 'parent' | 'parent-recovery'>('main');
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  // استعادة كلمة مرور الطفل
  const [showResetPwd, setShowResetPwd] = useState(false);
  const [resetParentPwd, setResetParentPwd] = useState('');
  const [resetNewPwd, setResetNewPwd] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  // استعادة كلمة مرور الوالد
  const [parentRecoveryAnswer, setParentRecoveryAnswer] = useState('');
  const [parentNewPwd, setParentNewPwd] = useState('');
  const [parentRecoveryError, setParentRecoveryError] = useState('');
  const [parentRecoverySuccess, setParentRecoverySuccess] = useState(false);

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

  const handleResetPassword = () => {
    if (resetParentPwd !== settings.parentPassword) {
      setResetError('كَلِمَةُ مُرُورِ الْوَالِدَيْنِ خَاطِئَةٌ');
      return;
    }
    updateUser(selectedUserId!, { password: resetNewPwd });
    setResetSuccess(true);
    setResetError('');
    setTimeout(() => {
      setShowResetPwd(false);
      setResetParentPwd(''); setResetNewPwd(''); setResetSuccess(false);
    }, 1500);
  };

  const handleCreate = () => {
    // اقرأ من ref مباشرة لدعم Android IME العربي
    const finalName = (nameInputRef.current?.value ?? name).trim();
    if (!finalName) return;
    const newUser = {
      id: Date.now().toString(), name: finalName,
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
      setScreen('main');
      setParentPassword('');
      setParentPwdError(false);
    } else {
      setParentPwdError(true);
      setParentPassword('');
      setTimeout(() => setParentPwdError(false), 1500);
    }
  };

  const handleParentRecovery = () => {
    const sq = settings.securityQuestion;
    if (sq && parentRecoveryAnswer.trim().toLowerCase() === sq.answer.trim().toLowerCase()) {
      const newPwd = parentNewPwd.trim() || 'admin';
      updateSettings({ parentPassword: newPwd });
      setParentRecoverySuccess(true);
      setParentRecoveryError('');
      setTimeout(() => {
        setScreen('parent');
        setParentRecoveryAnswer(''); setParentNewPwd('');
        setParentRecoverySuccess(false);
      }, 1800);
    } else {
      setParentRecoveryError('الْإِجَابَةُ غَيْرُ صَحِيحَةٍ');
    }
  };

  const handleResetParentToDefault = () => {
    updateSettings({ parentPassword: 'admin' });
    setParentRecoverySuccess(true);
    setTimeout(() => {
      setScreen('parent');
      setParentRecoverySuccess(false);
    }, 1800);
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
              {/* زر نسيت كلمة المرور */}
              <button
                onClick={() => { setShowResetPwd(true); setResetError(''); setResetSuccess(false); }}
                className="w-full text-xs text-[#636E72] dark:text-[#A0A0A0] hover:text-[#FF6B6B] transition-colors flex items-center justify-center gap-1 py-1">
                <RefreshCw className="w-3 h-3"/> نَسِيتُ كَلِمَةَ الْمُرُورِ
              </button>
            </CardContent>
          </Card>

          {/* مربع حوار استعادة كلمة المرور */}
          {showResetPwd && (
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
              <Card className="rounded-3xl border-2 border-[#FF6B6B]/40 dark:border-[#FF6B6B]/30 bg-white/90 dark:bg-[#222]/90 shadow-2xl">
                <CardHeader><CardTitle className="text-center text-base dark:text-white">إِعَادَةُ تَعْيِينِ كَلِمَةِ الْمُرُورِ</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {resetSuccess ? (
                    <p className="text-center text-[#4CAF50] font-bold py-4">✓ تَمَّ تَغْيِيرُ كَلِمَةِ الْمُرُورِ</p>
                  ) : (
                    <>
                      <div>
                        <Label className="text-xs dark:text-white mb-1 block">كَلِمَةُ مُرُورِ الْوَالِدَيْنِ</Label>
                        <Input type="password" placeholder="أَدْخِلْ كَلِمَةَ مُرُورِ الْوَالِدَيْنِ..." value={resetParentPwd}
                          onChange={e => setResetParentPwd(e.target.value)}
                          className="rounded-xl dark:bg-[#333] dark:border-[#444] dark:text-white text-center py-4"/>
                      </div>
                      <div>
                        <Label className="text-xs dark:text-white mb-1 block">كَلِمَةُ الْمُرُورِ الْجَدِيدَةُ (اتْرُكْهَا فَارِغَةً لِإِزَالَتِهَا)</Label>
                        <Input type="password" placeholder="كَلِمَةُ مُرُورٍ جَدِيدَةٌ..." value={resetNewPwd}
                          onChange={e => setResetNewPwd(e.target.value)}
                          className="rounded-xl dark:bg-[#333] dark:border-[#444] dark:text-white text-center py-4"/>
                      </div>
                      {resetError && <p className="text-xs text-red-500 text-center">{resetError}</p>}
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-[#FF6B6B] rounded-xl py-4 font-bold" onClick={handleResetPassword}>تَأْكِيدٌ</Button>
                        <Button variant="ghost" onClick={() => setShowResetPwd(false)} className="dark:text-white">إِلْغَاءٌ</Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
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

              {settings.childRegistrationEnabled !== false && (
                isCreating ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pt-3 border-t dark:border-[#333]">
                    <Label className="dark:text-white">اسم الطفل</Label>
                    <Input
                      ref={nameInputRef}
                      placeholder="أَدْخِلِ اسْمَكَ هُنَا..."
                      defaultValue=""
                      onCompositionEnd={() => {
                        if (nameInputRef.current) setName(nameInputRef.current.value);
                      }}
                      onChange={e => setName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCreate()}
                      className="rounded-xl border-2 focus:border-[#4CAF50] dark:bg-[#333] dark:border-[#444] dark:text-white text-center py-6 text-lg"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      dir="rtl"
                    />
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-gradient-to-r from-[#4CAF50] to-[#45a049] rounded-xl py-5 font-bold" onClick={handleCreate}>إِنْشَاءُ حِسَابٍ</Button>
                      <Button variant="ghost" onClick={() => setIsCreating(false)} className="dark:text-white">إِلْغَاءٌ</Button>
                    </div>
                  </motion.div>
                ) : (
                  <Button variant="outline" className="w-full py-5 rounded-2xl border-2 border-dashed border-[#B2BEC3] dark:border-[#555] text-[#636E72] dark:text-[#A0A0A0] flex items-center gap-2 hover:border-[#4CAF50] hover:bg-[#F8FFF8] dark:hover:bg-[#1B2A1B] transition-all" onClick={() => setIsCreating(true)}>
                    <UserPlus className="w-5 h-5"/> إِضَافَةُ حِسَابٍ جَدِيدٍ
                  </Button>
                )
              )}

              <div className={`grid gap-3 pt-3 border-t dark:border-[#333] ${settings.guestEnabled !== false ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {settings.guestEnabled !== false && (
                  <Button variant="ghost" className="rounded-xl flex items-center gap-2 dark:text-white hover:bg-[#E8F5E9] dark:hover:bg-[#1B5E20] transition-all" onClick={handleGuest}>
                    <LogIn className="w-4 h-4"/> دُخُولٌ كَضَيْفٍ
                  </Button>
                )}
                <Button variant="ghost" className="w-full rounded-xl flex items-center gap-2 text-[#FF6B6B] hover:bg-[#FFF0F0] dark:hover:bg-[#FF6B6B]/10 transition-all"
                  onClick={() => { setScreen('parent'); setParentPassword(''); setParentPwdError(false); }}>
                  <ShieldCheck className="w-4 h-4"/> لَوْحَةُ الْوَالِدَيْنِ
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center text-xs text-[#B2BEC3] dark:text-[#555]">
          الْبَرْنَامَجُ حُرٌّ مَفْتُوحُ الْمَصْدَرِ — رُخْصَةُ غَنُو الْعُمُومِيَّةِ 3
        </motion.p>
      </motion.div>

      {/* ── شاشة دخول الوالدين (overlay) ── */}
      <AnimatePresence>
        {screen !== 'main' && (
          <motion.div
            key="parent-overlay"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            dir="rtl"
          >
            <div className="w-full max-w-sm">
              {/* شاشة كلمة مرور الوالد */}
              {screen === 'parent' && (
                <Card className="rounded-3xl border-2 border-[#FF6B6B]/40 dark:border-[#FF6B6B]/30 bg-white dark:bg-[#1E1E1E] shadow-2xl">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setScreen('main')} className="p-1.5 rounded-full hover:bg-[#F0F0F0] dark:hover:bg-[#333] transition-colors">
                        <ArrowRight className="w-4 h-4 text-[#636E72] dark:text-[#A0A0A0]"/>
                      </button>
                      <CardTitle className="text-center flex-1 text-lg dark:text-white">دُخُولُ الْوَالِدَيْنِ</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pb-5">
                    <div className="flex justify-center py-2">
                      <div className="w-16 h-16 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-[#FF6B6B]"/>
                      </div>
                    </div>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B2BEC3]"/>
                      <Input
                        type="password"
                        placeholder="كَلِمَةُ السِّرِّ..."
                        className={`pr-10 rounded-xl dark:bg-[#333] dark:border-[#444] dark:text-white py-6 text-lg text-center transition-colors ${parentPwdError ? 'border-red-400 dark:border-red-500' : ''}`}
                        value={parentPassword}
                        autoFocus
                        onChange={e => { setParentPassword(e.target.value); setParentPwdError(false); }}
                        onKeyDown={e => e.key === 'Enter' && handleParentLogin()}
                      />
                    </div>
                    {parentPwdError && (
                      <p className="text-xs text-red-500 text-center">كَلِمَةُ الْمُرُورِ غَيْرُ صَحِيحَةٍ</p>
                    )}
                    <p className="text-xs text-center text-[#B2BEC3] dark:text-[#555]">
                      كَلِمَةُ الْمُرُورِ الِافْتِرَاضِيَّةُ: <span className="font-mono font-bold text-[#FF6B6B]">admin</span>
                    </p>
                    <Button
                      className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#ee5253] py-5 rounded-xl font-bold text-lg"
                      onClick={handleParentLogin}>
                      دُخُولٌ
                    </Button>
                    {/* رابط نسيت كلمة المرور */}
                    <button
                      onClick={() => { setScreen('parent-recovery'); setParentRecoveryAnswer(''); setParentNewPwd(''); setParentRecoveryError(''); setParentRecoverySuccess(false); }}
                      className="w-full text-xs text-[#636E72] dark:text-[#A0A0A0] hover:text-[#FF6B6B] transition-colors flex items-center justify-center gap-1 py-1">
                      <HelpCircle className="w-3 h-3"/> نَسِيتُ كَلِمَةَ الْمُرُورِ؟
                    </button>
                  </CardContent>
                </Card>
              )}

              {/* شاشة استرجاع كلمة مرور الوالد */}
              {screen === 'parent-recovery' && (
                <Card className="rounded-3xl border-2 border-[#FF9F43]/40 dark:border-[#FF9F43]/30 bg-white dark:bg-[#1E1E1E] shadow-2xl">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setScreen('parent')} className="p-1.5 rounded-full hover:bg-[#F0F0F0] dark:hover:bg-[#333] transition-colors">
                        <ArrowRight className="w-4 h-4 text-[#636E72] dark:text-[#A0A0A0]"/>
                      </button>
                      <CardTitle className="text-center flex-1 text-base dark:text-white">اسْتِرْجَاعُ كَلِمَةِ الْمُرُورِ</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pb-5">
                    {parentRecoverySuccess ? (
                      <div className="py-6 text-center space-y-2">
                        <p className="text-3xl">✓</p>
                        <p className="text-[#4CAF50] font-bold dark:text-[#A5D6A7]">تَمَّ تَعْيِينُ كَلِمَةِ الْمُرُورِ</p>
                      </div>
                    ) : settings.securityQuestion ? (
                      <>
                        <div className="bg-[#FFF8E1] dark:bg-[#FF9F43]/10 rounded-2xl p-3">
                          <p className="text-xs text-[#856404] dark:text-[#FF9F43] font-bold mb-1">السُّؤَالُ الْأَمْنِيُّ:</p>
                          <p className="text-sm dark:text-white">{settings.securityQuestion.question}</p>
                        </div>
                        <Input
                          placeholder="أَدْخِلِ الْإِجَابَةَ..."
                          value={parentRecoveryAnswer}
                          onChange={e => { setParentRecoveryAnswer(e.target.value); setParentRecoveryError(''); }}
                          className="rounded-xl dark:bg-[#333] dark:border-[#444] dark:text-white text-center py-5"
                          dir="rtl"
                        />
                        <div>
                          <Label className="text-xs dark:text-[#A0A0A0] mb-1 block">كَلِمَةُ الْمُرُورِ الْجَدِيدَةُ</Label>
                          <Input
                            type="password"
                            placeholder="اتْرُكْهَا فَارِغَةً لِاسْتِخْدَامِ الِافْتِرَاضِيَّةِ (admin)"
                            value={parentNewPwd}
                            onChange={e => setParentNewPwd(e.target.value)}
                            className="rounded-xl dark:bg-[#333] dark:border-[#444] dark:text-white text-center py-5"
                          />
                        </div>
                        {parentRecoveryError && <p className="text-xs text-red-500 text-center">{parentRecoveryError}</p>}
                        <Button className="w-full bg-[#FF9F43] hover:bg-[#e08e2e] rounded-xl py-4 font-bold" onClick={handleParentRecovery}>
                          تَأْكِيدٌ
                        </Button>
                      </>
                    ) : (
                      // لا يوجد سؤال أمني → خيار إعادة التعيين إلى admin
                      <>
                        <div className="bg-[#FFF3F3] dark:bg-[#FF6B6B]/10 rounded-2xl p-4 text-center space-y-2">
                          <p className="text-sm dark:text-white">لَمْ يُضْبَطْ سُؤَالٌ أَمْنِيٌّ لِهَذَا الْحِسَابِ.</p>
                          <p className="text-xs text-[#636E72] dark:text-[#A0A0A0]">يُمْكِنُ إِعَادَةُ كَلِمَةِ الْمُرُورِ إِلَى الْقِيمَةِ الِافْتِرَاضِيَّةِ <span className="font-mono font-bold text-[#FF6B6B]">admin</span></p>
                        </div>
                        {parentRecoverySuccess ? (
                          <p className="text-center text-[#4CAF50] font-bold py-2">✓ تَمَّتِ الْإِعَادَةُ إِلَى admin</p>
                        ) : (
                          <Button className="w-full bg-[#FF6B6B] hover:bg-[#ee5253] rounded-xl py-4 font-bold" onClick={handleResetParentToDefault}>
                            إِعَادَةُ التَّعْيِينِ إِلَى admin
                          </Button>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
