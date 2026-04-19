import React, { useState, useEffect, useRef } from 'react';
import appIcon from '../public/GT-SARARIM-ICON.png';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Gamepad2, Brain, Settings, User, Home as HomeIcon, Lock, Trophy, Moon, Sun, Github, Sparkles, ShieldCheck, Share2, X as XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

const APP_URL = 'https://salehgnutux.github.io/GT-SARARIM/';

async function closeApp() {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (Capacitor.isNativePlatform()) {
      const { App: CapApp } = await import('@capacitor/app');
      CapApp.exitApp();
      return;
    }
  } catch { /* ignore */ }
  window.close();
}

const APP_SHARE_TEXT = '🌟 جَرِّبْ تَطْبِيقَ GT-SARARIM التَّعْلِيمِيَّ لِأَطْفَالِكَ! قِصَصٌ إِسْلَامِيَّةٌ وَأَلْغَازٌ وَأَسْئِلَةٌ تَفَاعُلِيَّةٌ. حُرٌّ وَمَفْتُوحُ الْمَصْدَرِ وَبِدُونِ إِنْتَرْنَتَ 📱';

async function shareApp() {
  const shareText = `${APP_SHARE_TEXT}\n${APP_URL}`;
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (Capacitor.isNativePlatform()) {
      const { Share } = await import('@capacitor/share');
      await Share.share({ title: 'GT-SARARIM', text: shareText, dialogTitle: 'مشاركة التطبيق' });
      return;
    }
  } catch (e: any) { if (e?.name === 'AbortError') return; }
  if (navigator.share) {
    try { await navigator.share({ title: 'GT-SARARIM', text: shareText }); return; }
    catch (e: any) { if (e?.name === 'AbortError') return; }
  }
  try { await navigator.clipboard.writeText(shareText); } catch { window.open(APP_URL, '_blank'); }
}

// ── شاشة انتهاء الوقت ──
function TimeUpScreen({ onLogout, onParentUnlock, theme }: { onLogout: () => void; onParentUnlock: (pwd: string) => void; theme: string }) {
  const [showUnlock, setShowUnlock] = useState(false);
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);
  const handleUnlock = () => {
    onParentUnlock(pwd);
    setError(true);
    setPwd('');
    setTimeout(() => setError(false), 1500);
  };
  return (
    <div className="min-h-screen bg-[#FDFCF0] dark:bg-[#1A1A1A] flex flex-col items-center justify-center p-6 text-center space-y-6" dir="rtl">
      <div className="w-24 h-24 bg-[#FF6B6B] rounded-full flex items-center justify-center text-white shadow-xl">
        <Lock className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-black dark:text-white">انْتَهَى وَقْتُ اللَّعِبِ!</h2>
      <p className="text-[#636E72] dark:text-[#A0A0A0] text-lg">لَقَدِ اسْتَمْتَعْتَ كَثِيرًا الْيَوْمَ، حَانَ وَقْتُ الرَّاحَةِ!</p>
      {showUnlock ? (
        <div className="w-full max-w-xs space-y-3">
          <p className="text-sm text-[#636E72] dark:text-[#A0A0A0]">أَدْخِلْ كَلِمَةَ مُرُورِ الْوَالِدَيْنِ لِرَفْعِ الْحَظْرِ</p>
          <Input type="password" placeholder="كَلِمَةُ الْمُرُورِ..." value={pwd}
            onChange={e => setPwd(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUnlock()}
            className={`text-center py-5 rounded-2xl dark:bg-[#333] dark:text-white ${error ? 'border-red-400' : ''}`}/>
          <div className="flex gap-2">
            <Button className="flex-1 bg-[#FF6B6B] rounded-2xl font-bold" onClick={handleUnlock}>تَأْكِيدٌ</Button>
            <Button variant="ghost" onClick={() => setShowUnlock(false)} className="dark:text-white">إِلْغَاءٌ</Button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xs space-y-3">
          <Button className="w-full py-6 bg-[#4CAF50] rounded-2xl font-bold text-lg" onClick={onLogout}>تَسْجِيلُ الْخُرُوجِ</Button>
          <Button variant="outline" className="w-full py-4 rounded-2xl flex items-center gap-2 justify-center dark:border-[#444] dark:text-white" onClick={() => setShowUnlock(true)}>
            <ShieldCheck className="w-4 h-4 text-[#FF6B6B]"/> رَفْعُ الْحَظْرِ (الْوَالِدَيْنِ)
          </Button>
          <Button variant="outline" className="w-full py-3 rounded-2xl flex items-center gap-2 justify-center dark:border-[#444] dark:text-white text-sm" onClick={shareApp}>
            <Share2 className="w-4 h-4 text-[#4CAF50]"/> شَارِكْ هَذَا التَّطْبِيقَ مَعَ الْأَصْدِقَاءِ
          </Button>
        </div>
      )}
    </div>
  );
}
import { useStore } from './store/useStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WisdomPopup } from './components/WisdomPopup';
import { BackgroundMusic } from './components/BackgroundMusic';
import { SoundControls } from './components/SoundControls';
import { FontSelector } from './components/FontSelector';

import HomePage from './pages/HomePage';
import StoriesPage from './pages/StoriesPage';
import PuzzlesPage from './pages/PuzzlesPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ParentDashboard from './pages/ParentDashboard';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const { currentUser, setCurrentUser, settings, updateUser, theme, themeIsDefault, setTheme, toggleTheme, localImages } = useStore();
  const importData = useStore(s => s.importData);
  const [openFileDialog, setOpenFileDialog] = useState<{json: string} | null>(null);

  // ── فتح ملف نسخة احتياطية من مدير الملفات (أندرويد) ──
  useEffect(() => {
    const checkPending = () => {
      try {
        const bridge = (window as any).GTNativeBridge;
        if (!bridge) return;
        const json = bridge.getPendingFileJson();
        if (json) setOpenFileDialog({ json });
      } catch { /* ignore */ }
    };
    // فحص عند الإطلاق
    const t = setTimeout(checkPending, 800);
    // وعند استقبال حدث من النظام الأصلي
    window.addEventListener('gt-open-backup', checkPending);
    return () => { clearTimeout(t); window.removeEventListener('gt-open-backup', checkPending); };
  }, []);

  const getHeaderAvatar = () => {
    if (!currentUser) return null;
    if (currentUser.role === 'parent') {
      const pid = settings.parentAvatar;
      return pid && localImages[pid] ? localImages[pid].data : null;
    }
    if (currentUser.avatar) {
      if (currentUser.avatar.startsWith('data:')) return currentUser.avatar;
      if (localImages[currentUser.avatar]) return localImages[currentUser.avatar].data;
    }
    return null;
  };
  const [activeTab, setActiveTab] = useState('home');
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showWisdom, setShowWisdom] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // ── اكتشاف وضع النظام — يُشغَّل عند كل وصول ما لم يختر المستخدم يدوياً ──
  // setTheme لا تُغيّر themeIsDefault → الكشف التلقائي يبقى فعّالاً عبر فتحات التطبيق
  useEffect(() => {
    if (!themeIsDefault) return;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!themeIsDefault) return;
      setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [themeIsDefault]);

  // RTL + theme + font
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Apply font from settings — runs on every render (no dep array)
  // Font DATA lives in localImages[`font_${id}`], not in fontSettings.customFonts[].url
  useEffect(() => {
    const { fontSettings } = settings;
    const customFonts: any[] = fontSettings.customFonts || [];

    // Re-inject @font-face for every custom font (safe: checks for existing style tag)
    customFonts.forEach((font) => {
      const styleId = `custom-font-${font.id}`;
      if (!document.getElementById(styleId)) {
        const dataUrl = localImages[`font_${font.id}`]?.data || font.url || '';
        if (dataUrl) {
          const style = document.createElement('style');
          style.id = styleId;
          style.textContent = `@font-face { font-family: '${font.id}'; src: url('${dataUrl}'); font-display: swap; }`;
          document.head.appendChild(style);
        }
      }
    });

    // Apply the active font
    const family = fontSettings.fontFamily;
    if (!family || family === 'ubuntu-arabic') {
      document.documentElement.style.removeProperty('--app-font-override');
    } else if (family === 'noto-arabic') {
      document.documentElement.style.setProperty('--app-font-override', "'Noto Naskh Arabic', serif");
    } else if (family === 'noto-sans-arabic') {
      document.documentElement.style.setProperty('--app-font-override', "'Noto Sans Arabic', sans-serif");
    } else {
      // Custom font — inject its face if not already done
      const cf = customFonts.find(f => f.id === family);
      if (cf) {
        document.documentElement.style.setProperty('--app-font-override', `'${family}', 'Ubuntu Arabic', sans-serif`);
      }
    }
  }); // intentionally no deps — re-run on every render to survive navigation

  // إعادة تعيين وقت اللعب عند تغيُّر اليوم
  useEffect(() => {
    if (!currentUser || currentUser.role === 'parent') return;
    const today = new Date().toDateString();
    const lastDate = currentUser.lastActive ? new Date(currentUser.lastActive).toDateString() : '';
    if (lastDate && lastDate !== today && (currentUser.playTimeToday || 0) > 0) {
      updateUser(currentUser.id, { playTimeToday: 0, lastActive: new Date().toISOString() });
    }
  }, [currentUser?.id]);

  // تتبع الوقت وفرض الحد اليومي (فقط إذا كان الحد مُفعَّلاً)
  useEffect(() => {
    if (!currentUser || currentUser.role === 'parent') return;
    // تحديد ما إذا كان الحد الزمني مُفعَّلاً لهذا المستخدم
    const limitEnabled = currentUser.customTimeLimitEnabled
      ? true
      : (settings.timeLimitEnabled === true);
    if (!limitEnabled) return;
    const limit = currentUser.customTimeLimitEnabled && currentUser.dailyTimeLimit
      ? currentUser.dailyTimeLimit
      : settings.dailyTimeLimit;
    const interval = setInterval(() => {
      const newTime = (currentUser.playTimeToday || 0) + 1;
      updateUser(currentUser.id, { playTimeToday: newTime });
      if (newTime >= limit) setIsTimeUp(true);
    }, 60000);
    return () => clearInterval(interval);
  }, [currentUser?.id, settings.timeLimitEnabled, settings.dailyTimeLimit]);

  // Wisdom popup
  useEffect(() => {
    if (currentUser && currentUser.role !== 'parent') {
      const key = `wisdom_${currentUser.id}_${new Date().toDateString()}`;
      if (!localStorage.getItem(key)) {
        setTimeout(() => setShowWisdom(true), 1200);
      }
    }
  }, [currentUser]);

  // زر الرجوع على أندرويد — listener واحد فقط مع ref لتجنب نافذة العمى عند إعادة التسجيل
  const activeTabRef = useRef(activeTab);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }, [activeTab]);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    (async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return;
        const { App: CapApp } = await import('@capacitor/app');
        const handle = await CapApp.addListener('backButton', () => {
          if (activeTabRef.current !== 'home') {
            setActiveTab('home');
            return;
          }
          setShowExitConfirm(true);
        });
        unsub = () => handle.remove();
      } catch { /* ignore */ }
    })();
    return () => { unsub?.(); };
  }, []); // listener واحد طوال دورة حياة التطبيق

  if (!currentUser) return (
    <>
      <BackgroundMusic />
      <LoginPage onShare={shareApp} onClose={() => setShowExitConfirm(true)} />
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 p-6" dir="rtl">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#222] rounded-3xl p-6 w-full max-w-xs shadow-2xl space-y-4 text-center">
              <div className="text-4xl">👋</div>
              <h3 className="text-lg font-black dark:text-white">هَلْ تُرِيدُ الْخُرُوجَ؟</h3>
              <p className="text-sm text-[#636E72] dark:text-[#A0A0A0]">سَيُغْلَقُ التَّطْبِيقُ</p>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 rounded-2xl border-2 border-[#E5E5E5] dark:border-[#444] font-bold dark:text-white">
                  إِلْغَاءٌ
                </button>
                <button onClick={() => { setShowExitConfirm(false); closeApp(); }}
                  className="flex-1 py-3 rounded-2xl bg-[#FF6B6B] text-white font-bold">
                  خُرُوجٌ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  if (isTimeUp && currentUser.role !== 'parent') {
    const handleParentUnlock = (pwd: string) => {
      if (pwd === settings.parentPassword) {
        updateUser(currentUser.id, { playTimeToday: 0 });
        setIsTimeUp(false);
      }
    };
    return (
      <TimeUpScreen
        onLogout={() => setCurrentUser(null)}
        onParentUnlock={handleParentUnlock}
        theme={theme}
      />
    );
  }

  const isLocked = (section: string) => settings.lockedSections.includes(section) && currentUser.role !== 'parent';

  const renderPage = () => {
    if (isLocked(activeTab)) {
      return (
        <div className="py-20 text-center space-y-4">
          <Lock className="w-16 h-16 mx-auto text-[#B2BEC3]" />
          <h3 className="text-xl font-bold dark:text-white">هَذَا الْقِسْمُ مَقْفُولٌ</h3>
          <p className="text-[#636E72] dark:text-[#A0A0A0]">اطْلُبْ مِنْ وَالِدَيْكَ فَتْحَهُ</p>
        </div>
      );
    }
    switch (activeTab) {
      case 'home':       return <HomePage onNavigate={(tab) => { if (!isLocked(tab)) setActiveTab(tab); }} />;
      case 'stories':    return <StoriesPage />;
      case 'puzzles':    return <PuzzlesPage />;
      case 'activities': return <ActivitiesPage />;
      case 'parent':     return <ParentDashboard />;
      case 'profile':    return <ProfilePage />;
      default:           return <HomePage onNavigate={setActiveTab} />;
    }
  };

  const navItems = [
    { id: 'home',       label: 'الرَّئِيسِيَّةُ', icon: HomeIcon,  color: '#4CAF50' },
    { id: 'stories',   label: 'قِصَصٌ',          icon: BookOpen,   color: '#FF9F43' },
    { id: 'puzzles',   label: 'أَلْغَازٌ',         icon: Brain,      color: '#54A0FF' },
    { id: 'activities',label: 'أَنْشِطَةٌ',        icon: Gamepad2,   color: '#FF6B6B' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF0] dark:bg-[#1A1A1A] text-[#4A4A4A] dark:text-[#E0E0E0] font-sans selection:bg-[#FFD700] selection:text-black transition-colors duration-300" style={{ fontFamily: 'var(--app-font-override, var(--font-sans))' }}>
      <BackgroundMusic />
      {showWisdom && currentUser.role !== 'parent' && (
        <WisdomPopup onClose={() => { setShowWisdom(false); localStorage.setItem(`wisdom_${currentUser.id}_${new Date().toDateString()}`, '1'); }} />
      )}

      <header
        className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#333] px-3 py-2"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '42rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          {/* ── يسار: شعار + عنوان ── */}
          <div className="flex items-center gap-2 min-w-0 shrink-0">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl overflow-hidden shadow-lg cursor-pointer bg-[#FF6B6B] flex items-center justify-center shrink-0"
              onClick={() => setActiveTab('home')}
              onHoverStart={() => setIsLogoHovered(true)} onHoverEnd={() => setIsLogoHovered(false)}>
              <img src={appIcon} alt="GT-SARARIM" className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display='none'; const p=e.currentTarget.parentElement; if(p){const s=document.createElement('span');s.className='font-bold text-lg text-white';s.textContent='GT';p.appendChild(s);} }}/>
            </motion.div>
            <div className="hidden sm:block min-w-0">
              <h1 className="font-bold text-lg tracking-tight text-[#2D3436] dark:text-white cursor-pointer leading-tight" onClick={() => setActiveTab('home')}>SARARIM</h1>
              <p className="text-[9px] text-[#636E72] dark:text-[#A0A0A0]">سارة ريم — عالم المعرفة والمرح</p>
            </div>
            <div className="sm:hidden flex flex-col leading-none cursor-pointer" onClick={() => setActiveTab('home')}>
              <span className="font-bold text-[10px] tracking-tight text-[#2D3436] dark:text-white">SARA</span>
              <span className="font-bold text-[10px] tracking-tight text-[#2D3436] dark:text-white">RIM</span>
            </div>
          </div>

          {/* ── يمين: أدوات التحكم ── */}
          <div className="flex items-center gap-1 shrink-0">
            <FontSelector />
            <SoundControls />
            <Button variant="ghost" size="icon" onClick={shareApp} className="rounded-full w-8 h-8" title="مشاركة التطبيق">
              <Share2 className="w-4 h-4 text-[#4CAF50]"/>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full w-8 h-8">
              {theme==='light' ? <Moon className="w-4 h-4"/> : <Sun className="w-4 h-4 text-yellow-400"/>}
            </Button>
            {currentUser.role==='parent' && (
              <Button variant="ghost" size="icon" onClick={() => setActiveTab('parent')} className={`w-8 h-8 ${activeTab==='parent'?'bg-[#F0F0F0] dark:bg-[#333]':''}`}>
                <Settings className="w-4 h-4"/>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setShowExitConfirm(true)} className="rounded-full w-8 h-8" title="إغلاق التطبيق">
              <XIcon className="w-4 h-4 text-[#FF6B6B]"/>
            </Button>
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-1.5 px-2 py-1 bg-[#E8F5E9] dark:bg-[#1B5E20] text-[#2E7D32] dark:text-[#A5D6A7] rounded-full text-sm font-bold">
              <Trophy className="w-3.5 h-3.5 shrink-0"/>
              <span>{currentUser.points}</span>
              <div className="w-5 h-5 rounded-full bg-white dark:bg-[#333] flex items-center justify-center overflow-hidden border border-[#A5D6A7] shrink-0">
                <User className="w-3 h-3 text-[#4CAF50]"/>
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="pb-24 px-4 max-w-2xl mx-auto" style={{ paddingTop: '56px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration: 0.2 }}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav
        className="bg-white dark:bg-[#121212] border-t border-[#E5E5E5] dark:border-[#333] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '0.5rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }} className="rounded-t-3xl">
          {navItems.map(item => {
            const isActive = activeTab===item.id;
            const Icon = item.icon;
            return (
              <motion.button key={item.id} onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative"
                whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} animate={isActive?{y:-2}:{y:0}}
                style={{ color: isActive ? item.color : (theme==='dark'?'#A0A0A0':'#636E72') }}>
                <Icon className="w-5 h-5" fill={isActive?`${item.color}20`:'none'}/>
                <span className="text-[11px] font-bold">{item.label}</span>
                {isActive && (
                  <motion.div layoutId="activeTab" className="absolute -bottom-[2px] w-12 h-0.5 rounded-full" style={{ backgroundColor: item.color }} transition={{ type:'spring', stiffness:500, damping:30 }}/>
                )}
              </motion.button>
            );
          })}
          {currentUser.role==='parent' && (
            <motion.button onClick={() => setActiveTab('parent')} className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl relative"
              whileHover={{ y:-3 }} whileTap={{ scale:0.95 }}
              style={{ color: activeTab==='parent'?'#FF6B6B':(theme==='dark'?'#A0A0A0':'#636E72') }}>
              <Settings className="w-5 h-5"/>
              <span className="text-[11px] font-bold">الْوَالِدَانِ</span>
              {activeTab==='parent' && <motion.div layoutId="activeTab" className="absolute -bottom-[2px] w-12 h-0.5 bg-[#FF6B6B] rounded-full"/>}
            </motion.button>
          )}
        </div>
      </nav>

      {/* حوار تأكيد الخروج */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 p-6" dir="rtl">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#222] rounded-3xl p-6 w-full max-w-xs shadow-2xl space-y-4 text-center">
              <div className="text-4xl">👋</div>
              <h3 className="text-lg font-black dark:text-white">هَلْ تُرِيدُ الْخُرُوجَ؟</h3>
              <p className="text-sm text-[#636E72] dark:text-[#A0A0A0]">سَيُغْلَقُ التَّطْبِيقُ</p>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 rounded-2xl border-2 border-[#E5E5E5] dark:border-[#444] font-bold dark:text-white">
                  إِلْغَاءٌ
                </button>
                <button onClick={() => { setShowExitConfirm(false); setCurrentUser(null); closeApp(); }}
                  className="flex-1 py-3 rounded-2xl bg-[#FF6B6B] text-white font-bold">
                  خُرُوجٌ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="max-w-2xl mx-auto px-4 py-8 text-center space-y-3 opacity-50 pb-32">
        <p className="text-xs">الْبَرْنَامَجُ حُرٌّ مَفْتُوحُ الْمَصْدَرِ — رُخْصَةُ غَنُو الْعُمُومِيَّةِ 3</p>
        <div className="flex items-center justify-center gap-4">
          <a href="https://github.com/SalehGNUTUX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs hover:text-[#FF6B6B]"><Github className="w-3 h-3"/><span>GNUTUX</span></a>
          <span className="text-xs">•</span><span className="text-xs">v2.3.0</span>
        </div>
      </footer>

      {/* حوار استيراد النسخة الاحتياطية عند فتح ملف من مدير الملفات */}
      {openFileDialog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4" dir="rtl">
          <div className="bg-white dark:bg-[#222] rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <h2 className="text-lg font-black text-center dark:text-white">اسْتِيرَادُ نُسْخَةٍ احْتِيَاطِيَّةٍ</h2>
            <p className="text-sm text-center text-[#636E72] dark:text-[#A0A0A0]">
              تَمَّ الْعُثُورُ عَلَى مَلَفِّ نُسْخَةٍ احْتِيَاطِيَّةٍ. هَلْ تُرِيدُ اسْتِيرَادَهُ؟
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 bg-[#4CAF50] text-white rounded-xl py-3 font-bold"
                onClick={() => {
                  try {
                    const data = JSON.parse(openFileDialog.json);
                    importData(data);
                    alert('✓ تَمَّ الِاسْتِيرَادُ بِنَجَاحٍ');
                  } catch { alert('خَطَأٌ: الْمَلَفُّ غَيْرُ صَالِحٍ'); }
                  setOpenFileDialog(null);
                }}>
                اسْتِيرَادٌ
              </button>
              <button
                className="flex-1 bg-[#636E72] text-white rounded-xl py-3 font-bold"
                onClick={() => setOpenFileDialog(null)}>
                إِلْغَاءٌ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
