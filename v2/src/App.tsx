import React, { useState, useEffect } from 'react';
import appIcon from '../public/GT-SARARIM-ICON.png';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Gamepad2, Brain, Settings, User, Home as HomeIcon, Lock, Trophy, Moon, Sun, Github, Sparkles } from 'lucide-react';
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
  const { currentUser, setCurrentUser, settings, updateUser, theme, toggleTheme, localImages } = useStore();

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

  // ── اكتشاف وضع النظام عند أول تشغيل ──
  useEffect(() => {
    const stored = localStorage.getItem('gt-sararim-storage-v3');
    if (!stored) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark && theme === 'light') toggleTheme();
      else if (!prefersDark && theme === 'dark') toggleTheme();
    }
  }, []); // runs once

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
    } else {
      // Custom font — inject its face if not already done
      const cf = customFonts.find(f => f.id === family);
      if (cf) {
        document.documentElement.style.setProperty('--app-font-override', `'${family}', 'Ubuntu Arabic', sans-serif`);
      }
    }
  }); // intentionally no deps — re-run on every render to survive navigation

  // Time tracking
  useEffect(() => {
    if (!currentUser || currentUser.role === 'parent') return;
    const limit = currentUser.customTimeLimitEnabled && currentUser.dailyTimeLimit ? currentUser.dailyTimeLimit : settings.dailyTimeLimit;
    const interval = setInterval(() => {
      const newTime = (currentUser.playTimeToday || 0) + 1;
      updateUser(currentUser.id, { playTimeToday: newTime });
      if (newTime >= limit) setIsTimeUp(true);
    }, 60000);
    return () => clearInterval(interval);
  }, [currentUser, settings.dailyTimeLimit]);

  // Wisdom popup
  useEffect(() => {
    if (currentUser && currentUser.role !== 'parent') {
      const key = `wisdom_${currentUser.id}_${new Date().toDateString()}`;
      if (!localStorage.getItem(key)) {
        setTimeout(() => setShowWisdom(true), 1200);
      }
    }
  }, [currentUser]);

  if (!currentUser) return <><BackgroundMusic /><LoginPage /></>;

  if (isTimeUp && currentUser.role !== 'parent') {
    return (
      <div className="min-h-screen bg-[#FDFCF0] dark:bg-[#1A1A1A] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-[#FF6B6B] rounded-full flex items-center justify-center text-white shadow-xl">
          <Lock className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black dark:text-white">انْتَهَى وَقْتُ اللَّعِبِ!</h2>
        <p className="text-[#636E72] dark:text-[#A0A0A0] text-lg">لَقَدِ اسْتَمْتَعْتَ كَثِيرًا الْيَوْمَ، حَانَ وَقْتُ الرَّاحَةِ!</p>
        <Button className="w-full py-6 bg-[#4CAF50] rounded-2xl font-bold" onClick={() => setCurrentUser(null)}>
          تَسْجِيلُ الْخُرُوجِ
        </Button>
      </div>
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

      <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#333] px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl overflow-hidden shadow-lg cursor-pointer bg-[#FF6B6B] flex items-center justify-center"
              onClick={() => setActiveTab('home')}
              onHoverStart={() => setIsLogoHovered(true)} onHoverEnd={() => setIsLogoHovered(false)}>
              <img src={appIcon} alt="GT-SARARIM" className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display='none'; const p=e.currentTarget.parentElement; if(p){const s=document.createElement('span');s.className='font-bold text-xl text-white';s.textContent='GT';p.appendChild(s);} }}/>
            </motion.div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-[#2D3436] dark:text-white cursor-pointer" onClick={() => setActiveTab('home')}>SARARIM</h1>
              <p className="text-[10px] text-[#636E72] dark:text-[#A0A0A0] -mt-1">سارة ريم — عالم المعرفة والمرح</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FontSelector />
            <SoundControls />
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme==='light' ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5 text-yellow-400"/>}
            </Button>
            {currentUser.role==='parent' && (
              <Button variant="ghost" size="icon" onClick={() => setActiveTab('parent')} className={activeTab==='parent'?'bg-[#F0F0F0] dark:bg-[#333]':''}>
                <Settings className="w-5 h-5"/>
              </Button>
            )}
            <Button variant="ghost" className="flex items-center gap-2 px-3 py-1 bg-[#E8F5E9] dark:bg-[#1B5E20] text-[#2E7D32] dark:text-[#A5D6A7] rounded-full" onClick={() => setActiveTab('profile')}>
              <Trophy className="w-4 h-4"/>
              <span className="font-bold">{currentUser.points}</span>
              <div className="w-6 h-6 rounded-full bg-white dark:bg-[#333] flex items-center justify-center overflow-hidden border border-[#A5D6A7]">
                <User className="w-4 h-4 text-[#4CAF50]"/>
              </div>
            </Button>
          </div>
        </div>
      </header>

      <main className="pb-24 pt-4 px-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration: 0.2 }}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#121212] border-t border-[#E5E5E5] dark:border-[#333] px-4 py-2 flex items-center justify-around z-50 max-w-2xl mx-auto rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
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
      </nav>

      <footer className="max-w-2xl mx-auto px-4 py-8 text-center space-y-3 opacity-50 pb-32">
        <p className="text-xs">الْبَرْنَامَجُ حُرٌّ مَفْتُوحُ الْمَصْدَرِ — رُخْصَةُ غَنُو الْعُمُومِيَّةِ 3</p>
        <div className="flex items-center justify-center gap-4">
          <a href="https://github.com/SalehGNUTUX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs hover:text-[#FF6B6B]"><Github className="w-3 h-3"/><span>GNUTUX</span></a>
          <span className="text-xs">•</span><span className="text-xs">v2.0.0</span>
        </div>
      </footer>
    </div>
  );
}
