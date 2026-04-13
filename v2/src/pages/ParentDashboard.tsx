import { useState, useRef, useEffect } from 'react';
import {
  Settings, Users, BookOpen, Brain, Gamepad2, ShieldCheck, Plus, Trash2, Edit2,
  RefreshCcw, Clock, Lock, Download, Upload, Key, ImageIcon, Music, Type,
  Eye, EyeOff, Volume2, AlertTriangle, CheckCircle2, X, ChevronDown, Tag,
  Lightbulb, PlayCircle, RotateCcw, HelpCircle, Layers
} from 'lucide-react';
import { useStore, LEVELS } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import { StoryCategory } from '../types';

const LEVEL_NAMES: Record<string, string> = { beginner:'تَمْهِيدِيّ', intermediate:'مُبْتَدِئ', advanced:'مُتَوَسِّط', expert:'مُتَقَدِّم' };
const AGE_GROUPS = [{ v:'4-6', l:'4-6 سَنَوَاتٍ' },{ v:'6-8', l:'6-8 سَنَوَاتٍ' },{ v:'9-12', l:'9-12 سَنَةً' },{ v:'all', l:'الْكُلُّ' }];

// ───────── Undo Toast ─────────
function UndoToast({ message, onUndo, onClose }: { message:string; onUndo:()=>void; onClose:()=>void }) {
  const [secs, setSecs] = useState(10);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => { if(s<=1){ clearInterval(t); onClose(); return 0; } return s-1; }), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:40 }}
      className="fixed bottom-24 left-4 right-4 max-w-md mx-auto bg-[#2D3436] text-white rounded-2xl px-4 py-3 flex items-center gap-3 z-[100] shadow-2xl">
      <AlertTriangle className="w-5 h-5 text-[#FFD700] flex-shrink-0"/>
      <p className="flex-1 text-sm font-medium">{message} ({secs}ث)</p>
      <Button size="sm" className="bg-[#FF9F43] hover:bg-[#e67e22] text-white rounded-lg px-3 h-8" onClick={onUndo}>تَرَاجُعٌ</Button>
    </motion.div>
  );
}

// ───────── Preview Modal ─────────
function PreviewModal({ item, type, onClose }: { item:any; type:string; onClose:()=>void }) {
  const cats = useStore(s => s.settings.storyCategories);
  const localImages = useStore(s => s.localImages);
  const getImg = (imgId: string | undefined) => {
    if (!imgId) return null;
    if (imgId.startsWith('data:')) return imgId;
    if (localImages[imgId]) return localImages[imgId].data;
    return null;
  };
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md dark:bg-[#222] dark:border-[#333]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="dark:text-white">مَعَايَنَةٌ — {type==='story'?'قِصَّةٌ':type==='question'?'سُؤَالٌ':'لُغْزٌ'}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="dark:text-white"><X className="w-4 h-4"/></Button>
          </div>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {type === 'story' && (
            <div className="space-y-3">
              <h3 className="font-black text-lg dark:text-white">{item.title}</h3>
              <Badge style={{ backgroundColor: cats.find((c:StoryCategory) => c.id===item.category)?.color||'#888' }} className="text-white">
                {cats.find((c:StoryCategory) => c.id===item.category)?.name||item.category}
              </Badge>
              <div className="bg-[#F8F9FA] dark:bg-[#2A2A2A] p-4 rounded-xl">
                <p className="text-sm leading-relaxed dark:text-white font-arabic">{item.textWithHarakat||item.content}</p>
              </div>
              {item.exercises?.length > 0 && (
                <div className="space-y-2">
                  <p className="font-bold text-sm dark:text-white">الْأَسْئِلَةُ ({item.exercises.length}):</p>
                  {item.exercises.map((q:any, i:number) => (
                    <div key={i} className="bg-[#F0F0F0] dark:bg-[#333] p-3 rounded-lg">
                      <p className="text-xs font-bold dark:text-white">{q.text}</p>
                      <p className="text-xs text-[#4CAF50] mt-1">✓ {q.options[0]}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {type === 'question' && (
            <div className="space-y-3">
              {getImg(item.image) && (
                <img src={getImg(item.image)!} className="w-full h-40 object-contain rounded-xl bg-[#F0F0F0] dark:bg-[#2A2A2A]" alt=""/>
              )}
              <p className="font-black text-lg dark:text-white">{item.text}</p>
              <div className="space-y-2">
                {item.options.map((opt:string, i:number) => {
                  const COLORS=['#4CAF50','#54A0FF','#FF9F43','#A29BFE'];
                  const ARABIC=['أ','ب','ج','د'];
                  return (
                  <div key={i} className={`p-3 rounded-xl border-2 text-sm font-medium dark:text-white flex items-center gap-2 ${i===0?'border-[#4CAF50] bg-[#E8F5E9] dark:bg-[#1B5E20]':'border-[#E5E5E5] dark:border-[#444]'}`}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0" style={{backgroundColor:COLORS[i]||'#888'}}>{ARABIC[i]||i+1}</span>
                    {i===0&&<span className="text-[#4CAF50] font-bold">✓ </span>}{opt}
                  </div>
                );})}
              </div>
              <p className="text-xs text-[#636E72]">* الْخِيَارَاتُ تُخْلَطُ عِنْدَ الِاخْتِبَارِ</p>
            </div>
          )}
          {type === 'puzzle' && (
            <div className="space-y-3">
              {getImg(item.image) && (
                <img src={getImg(item.image)!} className="w-full h-40 object-contain rounded-xl bg-[#F0F0F0] dark:bg-[#2A2A2A]" alt=""/>
              )}
              <h3 className="font-black dark:text-white">{item.title}</h3>
              <div className="bg-[#F0F0F0] dark:bg-[#333] p-4 rounded-xl">
                <p className="text-sm dark:text-white">{item.content}</p>
              </div>
              {item.hint && <div className="bg-[#FFF8E1] dark:bg-[#332B00] p-3 rounded-xl flex gap-2"><Lightbulb className="w-4 h-4 text-[#FFD700]"/><p className="text-xs dark:text-yellow-200">{item.hint}</p></div>}
              <div className="bg-[#E8F5E9] dark:bg-[#1B5E20] p-3 rounded-xl">
                <p className="text-sm font-bold text-[#4CAF50]">الْإِجَابَةُ: {item.solution}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ParentDashboard() {
  const store = useStore();
  const {
    users, stories, questions, puzzles, settings,
    addUser, updateUser, deleteUser,
    addStory, updateStory,
    addQuestion, updateQuestion,
    updateSettings, resetToDefault, exportData,
    addLocalImage, localImages, deleteLocalImage,
    backgroundSounds, addCustomSound, deleteSound, restoreSound, addFont, removeFont,
    addStoryCategory, updateStoryCategory, deleteStoryCategory,
    scheduledDelete, cancelDelete,
  } = store;

  // ── Auth ──
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(() => {
    const ts = sessionStorage.getItem('parent_auth_ts');
    if (!ts) return false;
    return (Date.now() - Number(ts)) < 5 * 60 * 1000; // 5 دقائق
  });
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotAnswer, setForgotAnswer] = useState('');
  const [newPassAfterForgot, setNewPassAfterForgot] = useState('');
  const [forgotStep, setForgotStep] = useState<'question'|'newpass'>('question');
  const [authError, setAuthError] = useState('');

  // ── Undo ──
  const [undoToast, setUndoToast] = useState<{id:string;msg:string;pendingId:string}|null>(null);

  // ── Password change ──
  const [passDialog, setPassDialog] = useState(false);
  const parentAvatarRef = useRef<HTMLInputElement>(null);
  const [oldPass, setOldPass] = useState(''); const [newPass, setNewPass] = useState(''); const [confPass, setConfPass] = useState(''); const [passErr, setPassErr] = useState('');

  // ── Security question setup ──
  const [secQDialog, setSecQDialog] = useState(false);
  const [secQuestion, setSecQuestion] = useState(settings.securityQuestion?.question||'');
  const [secAnswer, setSecAnswer] = useState('');

  // ── Child form ──
  const [childDialog, setChildDialog] = useState(false);
  const [editChildId, setEditChildId] = useState<string|null>(null);
  const [childForm, setChildForm] = useState({ name:'', ageGroup:'6-8', grade:'', password:'', enablePassword:false, dailyTimeLimit:60, customTimeEnabled:false, avatar:'' });
  const [avatarFile, setAvatarFile] = useState<File|null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // ── Content add/edit dialogs ──
  const [storyDialog, setStoryDialog] = useState(false);
  const [editStoryId, setEditStoryId] = useState<string|null>(null);
  const [storyForm, setStoryForm] = useState({ title:'', content:'', category:'moral', ageGroup:'all', level:'beginner', textWithHarakat:'' });
  const [storyExercises, setStoryExercises] = useState<{text:string;opts:[string,string,string,string];explanation:string}[]>([]);
  const [storyImgFile, setStoryImgFile] = useState<File|null>(null);
  const [storyImgPreview, setStoryImgPreview] = useState('');
  const [storyEmoji, setStoryEmoji] = useState('');
  const [showStoryEmojiPicker, setShowStoryEmojiPicker] = useState(false);

  const [questionDialog, setQuestionDialog] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState<string|null>(null);
  const [qForm, setQForm] = useState({ text:'', opt0:'', opt1:'', opt2:'', opt3:'', category:'', ageGroup:'all', level:'beginner', explanation:'' });
  const [qImgFile, setQImgFile] = useState<File|null>(null);
  const [qImgPreview, setQImgPreview] = useState('');
  const qImgRef = useRef<HTMLInputElement>(null);

  const [puzzleDialog, setPuzzleDialog] = useState(false);
  const [editPuzzleId, setEditPuzzleId] = useState<string|null>(null);
  const [pForm, setPForm] = useState({ title:'', content:'', solution:'', type:'riddle', ageGroup:'all', level:'beginner', hint:'' });
  const [pImgFile, setPImgFile] = useState<File|null>(null);
  const [pImgPreview, setPImgPreview] = useState('');
  const pImgRef = useRef<HTMLInputElement>(null);

  // ── Category dialog ──
  const [catDialog, setCatDialog] = useState(false);
  const [editCatId, setEditCatId] = useState<string|null>(null);
  const [catForm, setCatForm] = useState({ name:'', icon:'📖', color:'#FF9F43' });

  // ── Custom fonts list (persisted in settings) ──
  // customFonts is read inline from settings to always be fresh

  // ── Emoji picker for story category ──
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const COMMON_EMOJIS = ['📖','📚','🕌','⭐','🌟','🏆','🎯','🧠','🔬','🌍','🦁','🐬','🌺','🌙','☀️','🌈','🎨','🎭','🚀','🌊','🏔️','🌴','🦋','🐦','🤲','💡','📝','🎓','🌱','🍎','🌸','🦅','🐋','🦒','🌻','🕊️','🦜','🌾','🏡','🎪'];


  // ── Sound upload ──
  const [soundName, setSoundName] = useState('');
  const [soundFile, setSoundFile] = useState<File|null>(null);
  const soundFileRef = useRef<HTMLInputElement>(null);

  // ── Font settings ──
  const [fontFile, setFontFile] = useState<File|null>(null);
  const fontFileRef = useRef<HTMLInputElement>(null);
  const importFileRef  = useRef<HTMLInputElement>(null);

  // ── Preview ──
  const [preview, setPreview] = useState<{item:any;type:string}|null>(null);

  // ── Reset dialog ──
  const [resetDialog, setResetDialog] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');

  // ── Image file refs ──
  const storyImgRef = useRef<HTMLInputElement>(null);
  const avatarRef   = useRef<HTMLInputElement>(null);

  // ── AUTH ──
  const handleAuth = () => {
    if (password === settings.parentPassword) { setIsAuthorized(true); sessionStorage.setItem('parent_auth_ts', Date.now().toString()); setAuthError(''); }
    else setAuthError('كَلِمَةُ الْمُرُورِ غَيْرُ صَحِيحَةٍ');
  };

  const handleForgotAnswer = () => {
    if (!settings.securityQuestion) { setAuthError('لَمْ يُعَيَّنْ سُؤَالُ الِاسْتِرْدَادِ'); return; }
    const norm = (s:string) => s.trim().toLowerCase().replace(/\s+/g,' ');
    if (norm(forgotAnswer) === norm(settings.securityQuestion.answer)) setForgotStep('newpass');
    else setAuthError('الْإِجَابَةُ غَيْرُ صَحِيحَةٍ');
  };

  const handleSetNewPass = () => {
    if (newPassAfterForgot.length < 4) { setAuthError('كَلِمَةُ الْمُرُورِ قَصِيرَةٌ جِدًّا'); return; }
    updateSettings({ parentPassword: newPassAfterForgot });
    setIsAuthorized(true); sessionStorage.setItem('parent_auth_ts', Date.now().toString()); setForgotMode(false); setForgotStep('question'); setAuthError(''); setNewPassAfterForgot('');
  };

  // ── SAFE DELETE (with 10s undo) ──
  const safeDelete = (type: 'story'|'question'|'puzzle'|'user'|'sound'|'category', id: string, data: any, label: string) => {
    const pid = scheduledDelete(type, id, data);
    setUndoToast({ id, msg: `تَمَّ حَذْفُ "${label}"`, pendingId: pid });
  };

  const handleUndo = () => {
    if (!undoToast) return;
    const pid = undoToast.pendingId;
    if (pid.startsWith('sound_undo_')) {
      const soundData = (window as any)[pid];
      if (soundData) { restoreSound(soundData); delete (window as any)[pid]; }
    } else if (pid.startsWith('font_undo_')) {
      const data = (window as any)[pid];
      if (data?.font && data?.dataUrl) {
        addFont(data.font.id, data.font.name, data.dataUrl);
        delete (window as any)[pid];
      }
    } else {
      cancelDelete(pid);
    }
    setUndoToast(null);
  };

  // ── CHILD ──
  const openChild = (child?: any) => {
    if (child) {
      setEditChildId(child.id);
      setChildForm({ name:child.name, ageGroup:child.ageGroup, grade:child.grade||'', password:child.password||'', enablePassword:!!child.password, dailyTimeLimit:child.dailyTimeLimit||60, customTimeEnabled:child.customTimeLimitEnabled||false, avatar:child.avatar||'' });
      setAvatarPreview(child.avatar && localImages[child.avatar] ? localImages[child.avatar].data : child.avatar||'');
    } else {
      setEditChildId(null);
      setChildForm({ name:'', ageGroup:'6-8', grade:'', password:'', enablePassword:false, dailyTimeLimit:60, customTimeEnabled:false, avatar:'' });
      setAvatarPreview('');
    }
    setAvatarFile(null);
    setChildDialog(true);
  };

  const saveChild = async () => {
    if (!childForm.name.trim()) return;
    let avatarId = childForm.avatar;
    if (avatarFile) { avatarId = Date.now().toString(); await addLocalImage(avatarId, avatarFile); }
    // Fields that are always safe to update
    const editable = {
      name: childForm.name,
      ageGroup: childForm.ageGroup as any,
      grade: childForm.grade,
      password: childForm.enablePassword ? childForm.password : '',
      dailyTimeLimit: childForm.customTimeEnabled ? childForm.dailyTimeLimit : undefined,
      customTimeLimitEnabled: childForm.customTimeEnabled,
      avatar: avatarId,
      role: 'child' as const,
    };
    if (editChildId) {
      // EDIT: never reset points/achievements/playTime
      updateUser(editChildId, editable);
    } else {
      // NEW: create with full defaults
      addUser({
        id: Date.now().toString(),
        ...editable,
        points: 0, achievements: [], playTimeToday: 0,
        lastActive: new Date().toISOString(),
      });
    }
    setChildDialog(false);
  };

  // ── STORY ──
  const openStory = (story?: any) => {
    if (story) {
      setEditStoryId(story.id);
      setStoryForm({ title:story.title, content:story.content, category:story.category||'moral', ageGroup:story.ageGroup||'all', level:story.level||'beginner', textWithHarakat:story.textWithHarakat||'' });
      setStoryExercises((story.exercises||[]).map((e:any) => ({ text:e.text, opts:[e.options[0]||'', e.options[1]||'', e.options[2]||'', e.options[3]||''], explanation:e.explanation||'' })));
      setStoryImgPreview(story.image && localImages[story.image] ? localImages[story.image].data : story.image||'');
    } else {
      setEditStoryId(null);
      setStoryForm({ title:'', content:'', category:'moral', ageGroup:'all', level:'beginner', textWithHarakat:'' });
      setStoryExercises([]);
      setStoryImgPreview('');
    }
    setStoryImgFile(null); setStoryEmoji(''); setShowStoryEmojiPicker(false);
    setStoryDialog(true);
  };

  const addExercise = () => setStoryExercises(e => [...e, { text:'', opts:['','','',''], explanation:'' }]);
  const removeExercise = (i:number) => setStoryExercises(e => e.filter((_,j)=>j!==i));

  const saveStory = async () => {
    if (!storyForm.title.trim() || !storyForm.content.trim()) return;
    let imgId = '';
    if (storyImgFile) {
      imgId = Date.now().toString();
      await addLocalImage(imgId, storyImgFile);
    } else if (storyEmoji && !storyImgPreview) {
      // convert emoji to SVG data URL stored inline
      imgId = `emoji:${storyEmoji}`;
    }
    const exercises = storyExercises.filter(e=>e.text.trim()&&e.opts[0].trim()).map((e,i) => ({
      id: `ex_${Date.now()}_${i}`,
      text: e.text,
      options: e.opts.filter(Boolean),
      correctAnswer: 0, // always index 0
      explanation: e.explanation
    }));
    const data = { ...storyForm, image:imgId||( editStoryId ? stories.find(s=>s.id===editStoryId)?.image||'' : '' ), exercises, ageGroup:storyForm.ageGroup as any, level:storyForm.level as any };
    if (editStoryId) updateStory(editStoryId, data);
    else addStory({ id: Date.now().toString(), ...data });
    setStoryDialog(false);
  };

  // ── QUESTION ──
  const openQuestion = (q?: any) => {
    if (q) {
      setEditQuestionId(q.id);
      setQForm({ text:q.text, opt0:q.options[0]||'', opt1:q.options[1]||'', opt2:q.options[2]||'', opt3:q.options[3]||'', category:q.category, ageGroup:q.ageGroup, level:q.level||'beginner', explanation:q.explanation||'' });
      // تحميل الصورة الموجودة عند التعديل
      if (q.image) {
        const stored = localImages[q.image];
        setQImgPreview(stored ? stored.data : (q.image.startsWith('data:') ? q.image : ''));
      } else {
        setQImgPreview('');
      }
    } else {
      setEditQuestionId(null);
      setQForm({ text:'', opt0:'', opt1:'', opt2:'', opt3:'', category:'', ageGroup:'all', level:'beginner', explanation:'' });
      setQImgPreview('');
    }
    setQImgFile(null);
    setQuestionDialog(true);
  };

  const saveQuestion = async () => {
    if (!qForm.text.trim()||!qForm.opt0.trim()) return;
    const opts = [qForm.opt0, qForm.opt1, qForm.opt2, qForm.opt3].filter(Boolean);

    let imageId: string | undefined;
    if (qImgFile) {
      // صورة جديدة محمّلة
      imageId = Date.now().toString();
      await addLocalImage(imageId, qImgFile);
    } else if (!qImgPreview) {
      // المستخدم حذف الصورة (ضغط ✕) — لا صورة
      imageId = undefined;
    } else if (editQuestionId) {
      // لم تتغير الصورة — احفظ المعرّف القديم
      const existing = questions.find(q => q.id === editQuestionId);
      imageId = existing?.image || undefined;
    }

    const data = { text:qForm.text, options:opts, correctAnswer:0, category:qForm.category||'عَامّ', ageGroup:qForm.ageGroup as any, level:qForm.level as any, explanation:qForm.explanation, image:imageId };
    if (editQuestionId) updateQuestion(editQuestionId, data);
    else store.addQuestion({ id: Date.now().toString(), ...data });
    setQuestionDialog(false);
  };

  // ── PUZZLE ──
  const openPuzzle = (p?: any) => {
    if (p) {
      setEditPuzzleId(p.id);
      setPForm({ title:p.title, content:p.content, solution:p.solution, type:p.type, ageGroup:p.ageGroup, level:p.level||'beginner', hint:p.hint||'' });
      // تحميل الصورة الموجودة عند التعديل
      if (p.image) {
        const stored = localImages[p.image];
        setPImgPreview(stored ? stored.data : (p.image.startsWith('data:') ? p.image : ''));
      } else {
        setPImgPreview('');
      }
    } else {
      setEditPuzzleId(null);
      setPForm({ title:'', content:'', solution:'', type:'riddle', ageGroup:'all', level:'beginner', hint:'' });
      setPImgPreview('');
    }
    setPImgFile(null);
    setPuzzleDialog(true);
  };

  const savePuzzle = async () => {
    if (!pForm.title.trim()||!pForm.content.trim()||!pForm.solution.trim()) return;

    let imageId: string | undefined;
    if (pImgFile) {
      imageId = Date.now().toString();
      await addLocalImage(imageId, pImgFile);
    } else if (!pImgPreview) {
      imageId = undefined;
    } else if (editPuzzleId) {
      const existing = puzzles.find(p => p.id === editPuzzleId);
      imageId = existing?.image || undefined;
    }

    const data = { ...pForm, ageGroup:pForm.ageGroup as any, level:pForm.level as any, image:imageId };
    if (editPuzzleId) store.updatePuzzle(editPuzzleId, data);
    else store.addPuzzle({ id: Date.now().toString(), ...data });
    setPuzzleDialog(false);
  };

  // ── CATEGORY ──
  const openCat = (cat?: any) => {
    if (cat) { setEditCatId(cat.id); setCatForm({ name:cat.name, icon:cat.icon, color:cat.color }); }
    else { setEditCatId(null); setCatForm({ name:'', icon:'📖', color:'#FF9F43' }); }
    setCatDialog(true);
  };

  const saveCat = () => {
    if (!catForm.name.trim()) return;
    if (editCatId) updateStoryCategory(editCatId, catForm);
    else addStoryCategory(catForm);
    setCatDialog(false);
  };

  // ── SOUND ──
  const uploadSound = async () => {
    if (!soundName.trim()||!soundFile) return;
    await addCustomSound(soundName, soundFile);
    setSoundName(''); setSoundFile(null);
  };

  // ── FONT ──
  const uploadFont = async (file: File) => {
    // Validate font file type
    const validExt = /\.(ttf|otf|woff|woff2)$/i.test(file.name);
    const validType = file.type.startsWith('font/') || file.type === 'application/x-font-ttf' || file.type === 'application/font-woff';
    if (!validExt && !validType) {
      alert('الرجاء اختيار ملف خط صالح (TTF, OTF, WOFF, WOFF2) فقط');
      return;
    }
    const dataUrl = await new Promise<string>((res) => {
      const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(file);
    });
    // Extra check: reject HTML/text content masquerading as font
    if (dataUrl.includes('text/html') || dataUrl.includes('text/plain')) {
      alert('الملف المختار ليس خطاً. يرجى اختيار ملف TTF أو OTF أو WOFF فقط.');
      return;
    }
    const fontId   = `font_${Date.now()}`;
    const fontName = file.name.replace(/\.[^.]+$/, '');
    // Store font data in localImages (safe for large binary), only id+name in fontSettings
    addFont(fontId, fontName, dataUrl);
    // Inject @font-face immediately (will also be re-injected by App.tsx on re-render)
    const style = document.createElement('style');
    style.id = `custom-font-${fontId}`;
    style.textContent = `@font-face { font-family: '${fontId}'; src: url('${dataUrl}'); font-display: swap; }`;
    document.getElementById(`custom-font-${fontId}`)?.remove();
    document.head.appendChild(style);
    document.documentElement.style.setProperty('--app-font-override', `'${fontId}', 'Ubuntu Arabic', sans-serif`);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        store.importData(data);
        alert("تَمَّ اسْتِيرَادُ النُّسْخَةِ الِاحْتِيَاطِيَّةِ بِنَجَاحٍ ✓");
      } catch {
        alert("خَطَأٌ: الْمَلَفُّ غَيْرُ صَالِحٍ");
      }
    };
    reader.readAsText(file);
  };

  const resetFont = (fontFamily: string) => {
    const cf = settings.fontSettings.customFonts || [];
    if (fontFamily === 'ubuntu-arabic' || fontFamily === 'noto-arabic') {
      updateSettings({ fontSettings: { ...settings.fontSettings, fontFamily } });
      document.documentElement.style.setProperty('--app-font-override', fontFamily === 'noto-arabic' ? "'Noto Naskh Arabic', serif" : '');
    } else {
      // Activate a custom font from the list
      const font = cf.find((f: any) => f.id === fontFamily);
      if (font) {
        updateSettings({ fontSettings: { ...settings.fontSettings, fontFamily } });
        if (!document.getElementById(`custom-font-${fontFamily}`)) {
          const style = document.createElement('style');
          style.id = `custom-font-${fontFamily}`;
          style.textContent = `@font-face { font-family: '${fontFamily}'; src: url('${font.url}'); font-display: swap; }`;
          document.head.appendChild(style);
        }
        document.documentElement.style.setProperty('--app-font-override', `'${fontFamily}', 'Ubuntu Arabic', sans-serif`);
      }
    }
  };
  const removeCustomFont = (fontId: string) => {
    const font = (settings.fontSettings.customFonts || []).find((f: any) => f.id === fontId);
    const cf = (settings.fontSettings.customFonts || []).filter((f: any) => f.id !== fontId);
    const newFamily = settings.fontSettings.fontFamily === fontId ? 'ubuntu-arabic' : settings.fontSettings.fontFamily;
    updateSettings({ fontSettings: { ...settings.fontSettings, fontFamily: newFamily, customFonts: cf } });
    document.getElementById(`custom-font-${fontId}`)?.remove();
    if (newFamily === 'ubuntu-arabic') document.documentElement.style.removeProperty('--app-font-override');
    // 10s undo
    const pid = `font_undo_${Date.now()}`;
    const fontDataUrl = localImages[`font_${fontId}`]?.data || '';
    (window as any)[pid] = { font, newFamily, fontId, dataUrl: fontDataUrl };
    setUndoToast({ id: fontId, msg: `تَمَّ حَذْفُ الْخَطِّ "${font?.name}"`, pendingId: pid });
  };

  // ── Auth screen ──
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto space-y-6 py-8">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-[#FF6B6B]/10 rounded-full mx-auto flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-[#FF6B6B]"/>
          </div>
          <h2 className="text-2xl font-black dark:text-white">لَوْحَةُ تَحَكُّمِ الْوَالِدَيْنِ</h2>
          <p className="text-[#636E72] dark:text-[#A0A0A0]">أَدْخِلْ كَلِمَةَ الْمُرُورِ لِلدُّخُولِ</p>
        </div>

        {!forgotMode ? (
          <Card className="rounded-3xl border-2 dark:border-[#333] dark:bg-[#222]">
            <CardContent className="p-6 space-y-4">
              <div className="relative">
                <Input type={showPass?'text':'password'} placeholder="كَلِمَةُ الْمُرُورِ" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAuth()}
                  className="py-6 text-lg text-center rounded-2xl dark:bg-[#333] dark:border-[#444] dark:text-white pr-12"/>
                <button onClick={()=>setShowPass(v=>!v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#636E72]">
                  {showPass?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}
                </button>
              </div>
              {authError && <p className="text-[#FF6B6B] text-sm text-center font-medium">{authError}</p>}
              <Button className="w-full py-6 text-lg font-black bg-[#FF6B6B] hover:bg-[#ee5253] rounded-2xl" onClick={handleAuth}>دُخُولٌ</Button>
              <button className="w-full text-sm text-[#636E72] dark:text-[#A0A0A0] hover:text-[#FF6B6B] transition-colors" onClick={()=>{ setForgotMode(true); setAuthError(''); setForgotStep('question'); }}>
                نَسِيتُ كَلِمَةَ الْمُرُورِ؟
              </button>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-3xl border-2 dark:border-[#333] dark:bg-[#222]">
            <CardContent className="p-6 space-y-4">
              <Button variant="ghost" size="sm" className="dark:text-white" onClick={()=>{ setForgotMode(false); setAuthError(''); }}>← رُجُوعٌ</Button>

              {forgotStep === 'question' ? (
                <>
                  {settings.securityQuestion ? (
                    <>
                      <div className="bg-[#F0F8FF] dark:bg-[#1a2530] p-4 rounded-xl">
                        <p className="font-bold text-sm dark:text-white">سُؤَالُ الِاسْتِرْدَادِ:</p>
                        <p className="text-[#636E72] dark:text-[#A0A0A0] mt-1">{settings.securityQuestion.question}</p>
                      </div>
                      <Input placeholder="الْإِجَابَةُ..." value={forgotAnswer} onChange={e=>setForgotAnswer(e.target.value)} className="py-5 rounded-2xl dark:bg-[#333] dark:border-[#444] dark:text-white text-center"/>
                      {authError && <p className="text-[#FF6B6B] text-sm text-center">{authError}</p>}
                      <Button className="w-full py-5 font-black bg-[#54A0FF] hover:bg-[#2e86de] rounded-2xl" onClick={handleForgotAnswer}>تَحَقَّقْ مِنَ الْإِجَابَةِ</Button>
                    </>
                  ) : (
                    <div className="text-center space-y-3 py-4">
                      <AlertTriangle className="w-12 h-12 mx-auto text-[#FF9F43]"/>
                      <p className="font-bold dark:text-white">لَمْ يُضْبَطْ سُؤَالُ الِاسْتِرْدَادِ</p>
                      <p className="text-sm text-[#636E72] dark:text-[#A0A0A0]">يُمْكِنُ إِعَادَةُ ضَبْطِ الْبَرْنَامَجِ (مَعَ حِفْظِ بَيَانَاتِ الْأَبْنَاءِ)</p>
                      <Button className="w-full bg-[#FF6B6B] rounded-xl" onClick={()=>setResetDialog(true)}>إِعَادَةُ الضَّبْطِ</Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="bg-[#E8F5E9] dark:bg-[#1B5E20] p-3 rounded-xl flex gap-2 items-center">
                    <CheckCircle2 className="w-5 h-5 text-[#4CAF50]"/>
                    <p className="text-sm text-[#4CAF50] font-bold">الْإِجَابَةُ صَحِيحَةٌ!</p>
                  </div>
                  <Input type="password" placeholder="كَلِمَةُ الْمُرُورِ الْجَدِيدَةُ" value={newPassAfterForgot} onChange={e=>setNewPassAfterForgot(e.target.value)} className="py-5 rounded-2xl dark:bg-[#333] dark:border-[#444] dark:text-white text-center"/>
                  {authError && <p className="text-[#FF6B6B] text-sm text-center">{authError}</p>}
                  <Button className="w-full py-5 font-black bg-[#4CAF50] hover:bg-[#388e3c] rounded-2xl" onClick={handleSetNewPass}>تَعْيِينُ كَلِمَةِ الْمُرُورِ</Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ──────── MAIN DASHBOARD ────────
  return (
    <div className="space-y-5 pb-4">
      <AnimatePresence>{undoToast && <UndoToast key={undoToast.id} message={undoToast.msg} onUndo={handleUndo} onClose={()=>setUndoToast(null)}/>}</AnimatePresence>
      {preview && <PreviewModal item={preview.item} type={preview.type} onClose={()=>setPreview(null)}/>}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black dark:text-white flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#FF6B6B]"/>لَوْحَةُ الْوَالِدَيْنِ</h2>
        <div className="flex gap-2">
          <>
          <input ref={importFileRef} type="file" accept=".json" className="hidden" onChange={e=>{const f=e.target.files?.[0]; if(f) handleImport(f); e.target.value='';}}/>
          <Button variant="outline" size="sm" className="dark:border-[#444] dark:text-white gap-1 rounded-xl" onClick={()=>importFileRef.current?.click()}><Upload className="w-4 h-4"/>اسْتِيرَادٌ</Button>
          <Button variant="outline" size="sm" className="dark:border-[#444] dark:text-white gap-1 rounded-xl" onClick={exportData}><Download className="w-4 h-4"/>تَصْدِيرٌ</Button>
        </>
          <Button variant="outline" size="sm" className="dark:border-[#444] dark:text-white gap-1 rounded-xl text-[#FF6B6B] border-[#FF6B6B]/50" onClick={()=>setResetDialog(true)}><RefreshCcw className="w-4 h-4"/>إِعَادَةٌ</Button>
        </div>
      </div>

      <Tabs defaultValue="children">
        <TabsList className="grid grid-cols-5 rounded-2xl dark:bg-[#333] h-auto p-1 gap-1">
          {[['children','👦','أَبْنَاءٌ'],['content','📚','مُحْتَوَى'],['settings','⚙️','إِعْدَادَاتٌ'],['sounds','🎵','أَصْوَاتٌ'],['fonts','🔤','خُطُوطٌ']].map(([v,ic,lb])=>(
            <TabsTrigger key={v} value={v} className="rounded-xl flex flex-col gap-0.5 py-2 text-[11px] dark:text-white data-[state=active]:dark:bg-[#222]">
              <span>{ic}</span><span>{lb}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ──────── CHILDREN ──────── */}
        <TabsContent value="children" className="space-y-4 mt-4">
          <Button className="w-full py-5 bg-[#4CAF50] hover:bg-[#388e3c] rounded-2xl font-bold flex gap-2" onClick={()=>openChild()}>
            <Plus className="w-5 h-5"/>إِضَافَةُ طِفْلٍ جَدِيدٍ
          </Button>
          {users.filter(u=>u.role==='child').map(child=>(
            <Card key={child.id} className="rounded-2xl border-2 dark:border-[#333] dark:bg-[#222]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#4CAF50]/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {child.avatar && localImages[child.avatar] ? <img src={localImages[child.avatar].data} className="w-full h-full object-cover" alt=""/> : <span className="text-xl">{child.name.charAt(0)}</span>}
                  </div>
                  <div className="flex-1">
                    <p className="font-black dark:text-white">{child.name}</p>
                    <p className="text-xs text-[#636E72] dark:text-[#A0A0A0]">{child.ageGroup} • {child.points} نُقْطَةً</p>
                    {child.grade && <p className="text-xs text-[#636E72]">{child.grade}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="dark:text-white" onClick={()=>openChild(child)}><Edit2 className="w-4 h-4"/></Button>
                    <Button variant="ghost" size="icon" className="text-[#FF6B6B]" onClick={()=>safeDelete('user', child.id, child, child.name)}><Trash2 className="w-4 h-4"/></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {users.filter(u=>u.role==='child').length===0&&<p className="text-center text-[#636E72] dark:text-[#A0A0A0] py-8">لَمْ يُضَفْ أَطْفَالٌ بَعْدُ</p>}
        </TabsContent>

        {/* ──────── CONTENT ──────── */}
        <TabsContent value="content" className="mt-4">
          <Tabs defaultValue="stories">
            <TabsList className="grid grid-cols-3 rounded-xl dark:bg-[#333] mb-4">
              <TabsTrigger value="stories" className="dark:text-white data-[state=active]:dark:bg-[#222] rounded-lg">قِصَصٌ ({stories.length})</TabsTrigger>
              <TabsTrigger value="questions" className="dark:text-white data-[state=active]:dark:bg-[#222] rounded-lg">أَسْئِلَةٌ ({questions.length})</TabsTrigger>
              <TabsTrigger value="puzzles" className="dark:text-white data-[state=active]:dark:bg-[#222] rounded-lg">أَلْغَازٌ ({puzzles.length})</TabsTrigger>
            </TabsList>

            {/* Stories */}
            <TabsContent value="stories" className="space-y-3">
              {/* Category management */}
              <div className="bg-[#F8F9FA] dark:bg-[#2A2A2A] rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold dark:text-white flex items-center gap-1"><Tag className="w-4 h-4"/>فِئَاتُ الْقِصَصِ</p>
                  <Button size="sm" variant="ghost" className="h-7 text-xs dark:text-white" onClick={()=>openCat()}><Plus className="w-3 h-3 ml-1"/>إِضَافَةٌ</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.storyCategories.map(cat=>(
                    <div key={cat.id} className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: cat.color }}>
                      <span>{cat.icon}</span><span>{cat.name}</span>
                      <button onClick={()=>openCat(cat)} className="opacity-70 hover:opacity-100"><Edit2 className="w-3 h-3"/></button>
                      {!cat.isDefault&&<button onClick={()=>safeDelete('category',cat.id,cat,cat.name)} className="opacity-70 hover:opacity-100"><X className="w-3 h-3"/></button>}
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full py-4 bg-[#FF9F43] hover:bg-[#e67e22] rounded-2xl font-bold flex gap-2" onClick={()=>openStory()}>
                <Plus className="w-5 h-5"/>إِضَافَةُ قِصَّةٍ جَدِيدَةٍ
              </Button>
              {stories.map(story=>(
                <Card key={story.id} className="rounded-2xl border-2 dark:border-[#333] dark:bg-[#222]">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-black dark:text-white truncate">{story.title}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <Badge className="text-[10px] text-white" style={{ backgroundColor: settings.storyCategories.find(c=>c.id===story.category)?.color||'#888' }}>
                          {settings.storyCategories.find(c=>c.id===story.category)?.name||story.category}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] dark:border-[#444] dark:text-white">{story.ageGroup}</Badge>
                        <Badge variant="outline" className="text-[10px] dark:border-[#444] dark:text-white">{LEVEL_NAMES[story.level||'beginner']}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="w-8 h-8 dark:text-white" title="مَعَايَنَةٌ" onClick={()=>setPreview({item:story,type:'story'})}><PlayCircle className="w-4 h-4 text-[#4CAF50]"/></Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 dark:text-white" onClick={()=>openStory(story)}><Edit2 className="w-4 h-4"/></Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-[#FF6B6B]" onClick={()=>safeDelete('story',story.id,story,story.title)}><Trash2 className="w-4 h-4"/></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Questions */}
            <TabsContent value="questions" className="space-y-3">
              <Button className="w-full py-4 bg-[#54A0FF] hover:bg-[#2e86de] rounded-2xl font-bold flex gap-2" onClick={()=>openQuestion()}>
                <Plus className="w-5 h-5"/>إِضَافَةُ سُؤَالٍ جَدِيدٍ
              </Button>
              {questions.map(q=>(
                <Card key={q.id} className="rounded-2xl border-2 dark:border-[#333] dark:bg-[#222]">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm dark:text-white line-clamp-2">{q.text}</p>
                      <p className="text-xs text-[#4CAF50] mt-1">✓ {q.options[0]}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-[10px] dark:border-[#444] dark:text-white">{q.category}</Badge>
                        <Badge variant="outline" className="text-[10px] dark:border-[#444] dark:text-white">{LEVEL_NAMES[q.level||'beginner']}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="w-8 h-8" onClick={()=>setPreview({item:q,type:'question'})}><PlayCircle className="w-4 h-4 text-[#4CAF50]"/></Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 dark:text-white" onClick={()=>openQuestion(q)}><Edit2 className="w-4 h-4"/></Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-[#FF6B6B]" onClick={()=>safeDelete('question',q.id,q,q.text.substring(0,30))}><Trash2 className="w-4 h-4"/></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Puzzles */}
            <TabsContent value="puzzles" className="space-y-3">
              <Button className="w-full py-4 bg-[#A29BFE] hover:bg-[#6c5ce7] rounded-2xl font-bold flex gap-2" onClick={()=>openPuzzle()}>
                <Plus className="w-5 h-5"/>إِضَافَةُ لُغْزٍ جَدِيدٍ
              </Button>
              {puzzles.map(p=>(
                <Card key={p.id} className="rounded-2xl border-2 dark:border-[#333] dark:bg-[#222]">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-black dark:text-white">{p.title}</p>
                      <p className="text-xs text-[#636E72] dark:text-[#A0A0A0] line-clamp-1 mt-0.5">{p.content.substring(0,60)}...</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] dark:border-[#444] dark:text-white">{p.type==='logic'?'مَنْطِقٌ':'لُغْزٌ'}</Badge>
                        <Badge variant="outline" className="text-[10px] dark:border-[#444] dark:text-white">{LEVEL_NAMES[p.level||'beginner']}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="w-8 h-8" onClick={()=>setPreview({item:p,type:'puzzle'})}><PlayCircle className="w-4 h-4 text-[#4CAF50]"/></Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 dark:text-white" onClick={()=>openPuzzle(p)}><Edit2 className="w-4 h-4"/></Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-[#FF6B6B]" onClick={()=>safeDelete('puzzle',p.id,p,p.title)}><Trash2 className="w-4 h-4"/></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ──────── SETTINGS ──────── */}
        <TabsContent value="settings" className="space-y-4 mt-4">
          {/* Time limit */}
          <Card className="rounded-2xl dark:bg-[#222] dark:border-[#333] border-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex gap-2 items-center dark:text-white"><Clock className="w-4 h-4 text-[#54A0FF]"/>وَقْتُ اللَّعِبِ الْيَوْمِيِّ</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Input type="number" min="10" max="180" value={settings.dailyTimeLimit} onChange={e=>updateSettings({ dailyTimeLimit:+e.target.value })} className="w-24 text-center dark:bg-[#333] dark:border-[#444] dark:text-white"/>
                <span className="text-sm dark:text-white">دَقِيقَةٌ</span>
              </div>
            </CardContent>
          </Card>

          {/* Locked sections */}
          <Card className="rounded-2xl dark:bg-[#222] dark:border-[#333] border-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex gap-2 items-center dark:text-white"><Lock className="w-4 h-4 text-[#FF6B6B]"/>أَقْسَامٌ مَقْفُولَةٌ</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[['stories','قِصَصٌ'],['puzzles','أَلْغَازٌ'],['activities','أَنْشِطَةٌ']].map(([k,l])=>(
                <div key={k} className="flex items-center justify-between">
                  <span className="text-sm dark:text-white">{l}</span>
                  <Switch checked={settings.lockedSections.includes(k)} onCheckedChange={v=>updateSettings({ lockedSections: v ? [...settings.lockedSections,k] : settings.lockedSections.filter(s=>s!==k) })}/>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Parent avatar */}
          <Card className="rounded-2xl dark:bg-[#222] dark:border-[#333] border-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex gap-2 items-center dark:text-white"><ImageIcon className="w-4 h-4 text-[#54A0FF]"/>صُورَةُ الْوَالِدَيْنِ</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <input ref={parentAvatarRef} type="file" accept="image/*" className="hidden" onChange={async e=>{
                const f=e.target.files?.[0]; if(!f)return;
                const id='parent_avatar_'+Date.now();
                await addLocalImage(id,f);
                updateSettings({ parentAvatar: id });
              }}/>
              {(() => {
                const av = settings.parentAvatar && localImages[settings.parentAvatar || '']
                  ? localImages[settings.parentAvatar || ''].data : '';
                return av ? (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={av} className="w-20 h-20 rounded-full object-cover border-4 border-[#54A0FF]/40"/>
                      <button onClick={()=>parentAvatarRef.current?.click()} className="absolute bottom-0 right-0 bg-[#54A0FF] text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">✎</button>
                    </div>
                    <p className="text-sm dark:text-white">{settings.parentName}</p>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full dark:border-[#444] dark:text-white rounded-xl" onClick={()=>parentAvatarRef.current?.click()}>
                    <ImageIcon className="w-4 h-4 ml-2"/>رَفْعُ صُورَةٍ لِلْوَالِدَيْنِ
                  </Button>
                );
              })()}
            </CardContent>
          </Card>

          {/* Password */}
          <Card className="rounded-2xl dark:bg-[#222] dark:border-[#333] border-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex gap-2 items-center dark:text-white"><Key className="w-4 h-4 text-[#FF9F43]"/>كَلِمَةُ الْمُرُورِ</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full dark:border-[#444] dark:text-white rounded-xl" onClick={()=>setPassDialog(true)}>تَغْيِيرُ كَلِمَةِ الْمُرُورِ</Button>
              <Button variant="outline" className="w-full dark:border-[#444] dark:text-white rounded-xl flex gap-2" onClick={()=>{ setSecQDialog(true); setSecQuestion(settings.securityQuestion?.question||''); setSecAnswer(''); }}>
                <HelpCircle className="w-4 h-4"/>
                {settings.securityQuestion ? 'تَعْدِيلُ سُؤَالِ الِاسْتِرْدَادِ' : 'إِضَافَةُ سُؤَالِ الِاسْتِرْدَادِ'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ──────── SOUNDS ──────── */}
        <TabsContent value="sounds" className="space-y-4 mt-4">
          <Card className="rounded-2xl dark:bg-[#222] dark:border-[#333] border-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm dark:text-white flex gap-2 items-center"><Volume2 className="w-4 h-4 text-[#4CAF50]"/>تَفْعِيلُ الصَّوْتِ</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-white">صَوْتُ الْخَلْفِيَّةِ</span>
                <Switch checked={settings.soundEnabled} onCheckedChange={v=>updateSettings({ soundEnabled:v })}/>
              </div>
              <div className="space-y-2">
                <Label className="text-xs dark:text-white">مُسْتَوَى الصَّوْتِ: {settings.soundVolume}%</Label>
                <input type="range" min="0" max="100" value={settings.soundVolume} onChange={e=>updateSettings({ soundVolume:+e.target.value })} className="w-full accent-[#4CAF50]"/>
              </div>
              <div className="space-y-2">
                <Label className="text-xs dark:text-white">اِخْتَرِ الصَّوْتَ</Label>
                <div className="grid gap-2">
                  {backgroundSounds.map(s=>(
                    <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${settings.backgroundSoundId===s.id?'border-[#4CAF50] bg-[#E8F5E9] dark:bg-[#1B5E20]':'border-[#E5E5E5] dark:border-[#444]'}`} onClick={()=>updateSettings({ backgroundSoundId:s.id, soundEnabled:true })}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{s.synthType==='stream_birds'?'🌊':s.synthType==='rain'?'🌧️':s.synthType==='nature'?'🌿':s.synthType==='calm'?'🎵':'🎶'}</span>
                        <span className="text-sm font-medium dark:text-white">{s.name}</span>
                      </div>
                      {settings.backgroundSoundId===s.id && <CheckCircle2 className="w-4 h-4 text-[#4CAF50]"/>}
                      {!s.isBuiltIn && <Button variant="ghost" size="icon" className="w-7 h-7 text-[#FF6B6B]"
                        onClick={e=>{
                          e.stopPropagation();
                          const pid = `sound_undo_${Date.now()}`;
                          (window as any)[pid] = s;
                          deleteSound(s.id);
                          setUndoToast({ id: s.id, msg: `تَمَّ حَذْفُ "${s.name}"`, pendingId: pid });
                        }}><Trash2 className="w-3 h-3"/></Button>}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl dark:bg-[#222] dark:border-[#333] border-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm dark:text-white flex gap-2 items-center"><Upload className="w-4 h-4"/>رَفْعُ صَوْتٍ مُخَصَّصٍ</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="اسم الصوت..." value={soundName} onChange={e=>setSoundName(e.target.value)} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>
              <input ref={soundFileRef} type="file" accept="audio/*" className="hidden" onChange={e=>setSoundFile(e.target.files?.[0]||null)}/>
              <Button variant="outline" className="w-full dark:border-[#444] dark:text-white rounded-xl" onClick={()=>soundFileRef.current?.click()}>
                {soundFile ? `📁 ${soundFile.name}` : 'اِخْتَرْ مَلَفَّ صَوْتٍ (mp3, ogg)'}
              </Button>
              <Button className="w-full bg-[#4CAF50] hover:bg-[#388e3c] rounded-xl" onClick={uploadSound} disabled={!soundName.trim()||!soundFile}>رَفْعُ الصَّوْتِ</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ──────── FONTS ──────── */}
        <TabsContent value="fonts" className="space-y-4 mt-4">
          <Card className="rounded-2xl dark:bg-[#222] dark:border-[#333] border-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm dark:text-white flex gap-2 items-center"><Type className="w-4 h-4 text-[#A29BFE]"/>الْخُطُوطُ الْمُتَاحَةُ</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {/* Built-in fonts */}
              {[
                { id:'ubuntu-arabic',  label:'Ubuntu Arabic',      font:"'Ubuntu Arabic', sans-serif" },
                { id:'noto-arabic',    label:'Noto Naskh Arabic',  font:"'Noto Naskh Arabic', serif"  },
              ].map(f => {
                const active = settings.fontSettings.fontFamily === f.id;
                return (
                  <div key={f.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${active?'border-[#A29BFE] bg-[#EDE7F6] dark:bg-[#2D1B69]':'border-[#E5E5E5] dark:border-[#444] hover:border-[#A29BFE]/50'}`}
                    onClick={()=>resetFont(f.id)}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold dark:text-white">{f.label}</span>
                      {active && <CheckCircle2 className="w-4 h-4 text-[#A29BFE]"/>}
                    </div>
                    <p className="mt-1 text-base text-right dark:text-white leading-loose"
                      style={{ fontFamily: f.font }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
                  </div>
                );
              })}

              {/* Custom fonts — read directly from settings */}
              {(settings.fontSettings.customFonts || []).map((font: any) => {
                const active = settings.fontSettings.fontFamily === font.id;
                const dataUrl = localImages[`font_${font.id}`]?.data || '';
                return (
                  <div key={font.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${active?'border-[#A29BFE] bg-[#EDE7F6] dark:bg-[#2D1B69]':'border-[#E5E5E5] dark:border-[#444] hover:border-[#A29BFE]/50'}`}
                    onClick={()=>resetFont(font.id)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold dark:text-white">🔤 {font.name}</span>
                        <p className="text-[10px] text-[#636E72] dark:text-[#A0A0A0]">{active?'✓ مُفَعَّلٌ':'خَطٌّ مُسْتَوْرَدٌ'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {active && <CheckCircle2 className="w-4 h-4 text-[#A29BFE]"/>}
                        <button
                          onClick={e=>{e.stopPropagation();removeCustomFont(font.id);}}
                          className="text-[#FF6B6B] hover:opacity-80 p-1.5 rounded-lg hover:bg-[#FF6B6B]/10 transition-colors">
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    </div>
                    {dataUrl && (
                      <p className="mt-1 text-base text-right dark:text-white leading-loose"
                        style={{ fontFamily: `'${font.id}', 'Ubuntu Arabic', sans-serif` }}>
                        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                      </p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Upload font */}
          <Card className="rounded-2xl dark:bg-[#222] dark:border-[#333] border-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm dark:text-white flex gap-2 items-center"><Upload className="w-4 h-4 text-[#A29BFE]"/>اِسْتِيرَادُ خَطٍّ مُخَصَّصٍ</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-[#636E72] dark:text-[#A0A0A0]">يَدْعَمُ: TTF, OTF, WOFF, WOFF2 · (لَا تَرْفَعْ غَيْرَ ملفات الخطوط)</p>
              <input ref={fontFileRef} type="file" accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2" className="hidden"
                onChange={e=>{ const f=e.target.files?.[0]; if(f) uploadFont(f); e.target.value=''; }}/>
              <Button className="w-full bg-[#A29BFE] hover:bg-[#6c5ce7] rounded-xl flex gap-2" onClick={()=>fontFileRef.current?.click()}>
                <Upload className="w-4 h-4"/>اِخْتَرْ مَلَفَّ خَطٍّ
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ════════ DIALOGS ════════ */}

      {/* Child dialog */}
      <Dialog open={childDialog} onOpenChange={setChildDialog}>
        <DialogContent className="max-w-md dark:bg-[#222] dark:border-[#333]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={()=>setChildDialog(false)} className="dark:text-white order-first"><X className="w-4 h-4"/></Button>
              <DialogTitle className="dark:text-white flex-1 text-center">{editChildId?'تَعْدِيلُ الطِّفْلِ':'إِضَافَةُ طِفْلٍ'}</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative w-20 h-20">
                <div className="w-20 h-20 rounded-full bg-[#F0F0F0] dark:bg-[#333] overflow-hidden flex items-center justify-center cursor-pointer" onClick={()=>avatarRef.current?.click()}>
                  {avatarPreview ? <img src={avatarPreview} className="w-full h-full object-cover" alt=""/> : <ImageIcon className="w-8 h-8 text-[#B2BEC3]"/>}
                </div>
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f){ setAvatarFile(f); const r=new FileReader(); r.onload=()=>setAvatarPreview(r.result as string); r.readAsDataURL(f); }}}/>
              </div>
            </div>
            <Input placeholder="اسم الطفل *" value={childForm.name} onChange={e=>setChildForm(f=>({...f,name:e.target.value}))} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>
            <select value={childForm.ageGroup} onChange={e=>setChildForm(f=>({...f,ageGroup:e.target.value}))} className="w-full p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm">
              {AGE_GROUPS.map(a=><option key={a.v} value={a.v}>{a.l}</option>)}
            </select>
            <Input placeholder="الْمُسْتَوَى الدِّرَاسِيُّ (اخْتِيَارِيٌّ)" value={childForm.grade} onChange={e=>setChildForm(f=>({...f,grade:e.target.value}))} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>
            <div className="flex items-center justify-between p-3 bg-[#F8F9FA] dark:bg-[#2A2A2A] rounded-xl">
              <Label className="text-sm dark:text-white">كَلِمَةُ مُرُورٍ لِلطِّفْلِ</Label>
              <Switch checked={childForm.enablePassword} onCheckedChange={v=>setChildForm(f=>({...f,enablePassword:v}))}/>
            </div>
            {childForm.enablePassword && <Input type="password" placeholder="كَلِمَةُ الْمُرُورِ" value={childForm.password} onChange={e=>setChildForm(f=>({...f,password:e.target.value}))} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>}
            <div className="flex items-center justify-between p-3 bg-[#F8F9FA] dark:bg-[#2A2A2A] rounded-xl">
              <Label className="text-sm dark:text-white">وَقْتٌ خَاصٌّ بِالطِّفْلِ</Label>
              <Switch checked={childForm.customTimeEnabled} onCheckedChange={v=>setChildForm(f=>({...f,customTimeEnabled:v}))}/>
            </div>
            {childForm.customTimeEnabled && (
              <div className="flex items-center gap-3">
                <Input type="number" min="10" max="180" value={childForm.dailyTimeLimit} onChange={e=>setChildForm(f=>({...f,dailyTimeLimit:+e.target.value}))} className="w-24 text-center dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>
                <span className="text-sm dark:text-white">دَقِيقَةٌ</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button className="w-full bg-[#4CAF50] hover:bg-[#388e3c] rounded-xl py-5 font-black" onClick={saveChild}>{editChildId?'حِفْظُ التَّعْدِيلَاتِ':'إِضَافَةُ الطِّفْلِ'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Story dialog */}
      <Dialog open={storyDialog} onOpenChange={setStoryDialog}>
        <DialogContent className="max-w-lg dark:bg-[#222] dark:border-[#333] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={()=>setStoryDialog(false)} className="dark:text-white order-first"><X className="w-4 h-4"/></Button>
              <DialogTitle className="dark:text-white flex-1 text-center">{editStoryId?'تَعْدِيلُ الْقِصَّةِ':'إِضَافَةُ قِصَّةٍ'}</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-3 overflow-y-auto flex-1 pb-2">
            <Input placeholder="عُنْوَانُ الْقِصَّةِ *" value={storyForm.title} onChange={e=>setStoryForm(f=>({...f,title:e.target.value}))} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>

            <div className="grid grid-cols-2 gap-2">
              <select value={storyForm.category} onChange={e=>setStoryForm(f=>({...f,category:e.target.value}))} className="p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm">
                {settings.storyCategories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
              <select value={storyForm.ageGroup} onChange={e=>setStoryForm(f=>({...f,ageGroup:e.target.value}))} className="p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm">
                {AGE_GROUPS.map(a=><option key={a.v} value={a.v}>{a.l}</option>)}
              </select>
            </div>

            <select value={storyForm.level} onChange={e=>setStoryForm(f=>({...f,level:e.target.value}))} className="w-full p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm">
              {LEVELS.map(l=><option key={l.id} value={l.id}>{l.icon} {l.nameAr} — {l.description}</option>)}
            </select>

            <textarea rows={3} placeholder="نَصُّ الْقِصَّةِ *" value={storyForm.content} onChange={e=>setStoryForm(f=>({...f,content:e.target.value}))} className="w-full p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm resize-none"/>

            <textarea rows={3} placeholder="النَّصُّ مَعَ الشَّكْلِ الْكَامِلِ (اخْتِيَارِيٌّ — مُفِيدٌ لِتَعَلُّمِ الْقِرَاءَةِ)" value={storyForm.textWithHarakat} onChange={e=>setStoryForm(f=>({...f,textWithHarakat:e.target.value}))} className="w-full p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm resize-none"/>

            {/* Image or Emoji */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input ref={storyImgRef} type="file" accept="image/*" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f){ setStoryImgFile(f); setStoryEmoji(''); const r=new FileReader(); r.onload=()=>setStoryImgPreview(r.result as string); r.readAsDataURL(f); }}}/>
                <Button variant="outline" className="flex-1 dark:border-[#444] dark:text-white rounded-xl text-sm" onClick={()=>storyImgRef.current?.click()}>
                  <ImageIcon className="w-4 h-4 ml-1"/>رَفْعُ صُورَةٍ
                </Button>
                <Button variant="outline" className="flex-1 dark:border-[#444] dark:text-white rounded-xl text-sm" onClick={()=>setShowStoryEmojiPicker(p=>!p)}>
                  {storyEmoji?<span className="text-xl">{storyEmoji}</span>:'🎨'} رَمْزٌ تَعْبِيرِيٌّ
                </Button>
              </div>
              {showStoryEmojiPicker && (
                <div className="grid grid-cols-8 gap-1 p-2 bg-[#F8F9FA] dark:bg-[#2A2A2A] rounded-xl max-h-28 overflow-y-auto">
                  {COMMON_EMOJIS.map(em=>(
                    <button key={em} type="button" onClick={()=>{setStoryEmoji(em); setStoryImgFile(null); setStoryImgPreview(''); setShowStoryEmojiPicker(false);}}
                      className="text-xl hover:bg-white dark:hover:bg-[#444] rounded-lg p-0.5 transition-colors">{em}</button>
                  ))}
                </div>
              )}
              {storyImgPreview && (
                <div className="relative">
                  <img src={storyImgPreview} className="w-full h-32 object-cover rounded-xl"/>
                  <button onClick={()=>{setStoryImgFile(null); setStoryImgPreview('');}} className="absolute top-2 left-2 bg-[#FF6B6B] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">✕</button>
                </div>
              )}
              {storyEmoji && !storyImgPreview && (
                <div className="relative flex items-center justify-center h-20 bg-[#F8F9FA] dark:bg-[#2A2A2A] rounded-xl">
                  <span className="text-6xl">{storyEmoji}</span>
                  <button onClick={()=>setStoryEmoji('')} className="absolute top-2 left-2 bg-[#FF6B6B] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">✕</button>
                </div>
              )}
            </div>

            {/* Exercises */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold dark:text-white flex items-center gap-1"><Brain className="w-4 h-4"/>أَسْئِلَةُ الْقِصَّةِ</p>
                <Button size="sm" variant="ghost" className="h-7 text-xs dark:text-white" onClick={addExercise}><Plus className="w-3 h-3 ml-1"/>إِضَافَةُ سُؤَالٍ</Button>
              </div>
              <p className="text-[10px] text-[#636E72] dark:text-[#A0A0A0]">⚡ الْحَقْلُ الْأَوَّلُ هُوَ الْإِجَابَةُ الصَّحِيحَةُ — سَتُخْلَطُ عِنْدَ الِاخْتِبَارِ</p>
              {storyExercises.map((ex, i)=>(
                <div key={i} className="bg-[#F8F9FA] dark:bg-[#2A2A2A] rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold dark:text-white">سُؤَالٌ {i+1}</p>
                    <Button variant="ghost" size="icon" className="w-6 h-6 text-[#FF6B6B]" onClick={()=>removeExercise(i)}><X className="w-3 h-3"/></Button>
                  </div>
                  <Input placeholder="نَصُّ السُّؤَالِ *" value={ex.text} onChange={e=>setStoryExercises(se=>se.map((s,j)=>j===i?{...s,text:e.target.value}:s))} className="text-sm dark:bg-[#333] dark:border-[#444] dark:text-white rounded-lg"/>
                  {(['الْإِجَابَةُ الصَّحِيحَةُ ✓ *','الِاخْتِيَارُ 2 *','الِاخْتِيَارُ 3','الِاخْتِيَارُ 4'] as const).map((ph,oi)=>(
                    <Input key={oi} placeholder={ph} value={ex.opts[oi]} onChange={e=>setStoryExercises(se=>se.map((s,j)=>j===i?{...s,opts:s.opts.map((o,k)=>k===oi?e.target.value:o) as [string,string,string,string]}:s))}
                      className={`text-sm dark:bg-[#333] dark:border-[#444] dark:text-white rounded-lg ${oi===0?'border-[#4CAF50] bg-[#F0FFF4] dark:bg-[#1B3B27]':''}`}/>
                  ))}
                  <Input placeholder="تَفْسِيرٌ (اخْتِيَارِيٌّ)" value={ex.explanation} onChange={e=>setStoryExercises(se=>se.map((s,j)=>j===i?{...s,explanation:e.target.value}:s))} className="text-sm dark:bg-[#333] dark:border-[#444] dark:text-white rounded-lg"/>
                </div>
              ))}
            </div>
          </div>
          <Button className="w-full bg-[#FF9F43] hover:bg-[#e67e22] rounded-xl py-5 font-black flex-shrink-0 mt-2" onClick={saveStory}>{editStoryId?'حِفْظُ التَّعْدِيلَاتِ':'إِضَافَةُ الْقِصَّةِ'}</Button>
        </DialogContent>
      </Dialog>

      {/* Question dialog */}
      <Dialog open={questionDialog} onOpenChange={setQuestionDialog}>
        <DialogContent className="max-w-md dark:bg-[#222] dark:border-[#333] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={()=>setQuestionDialog(false)} className="dark:text-white order-first"><X className="w-4 h-4"/></Button>
              <DialogTitle className="dark:text-white flex-1 text-center">{editQuestionId?'تَعْدِيلُ السُّؤَالِ':'إِضَافَةُ سُؤَالٍ'}</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-3 overflow-y-auto flex-1 pb-2">
            <p className="text-[10px] text-[#636E72] dark:text-[#A0A0A0] bg-[#FFF8E1] dark:bg-[#332B00] p-2 rounded-lg">⚡ الْحَقْلُ الْأَوَّلُ = الْإِجَابَةُ الصَّحِيحَةُ — سَتُخْلَطُ أَمَاكِنُ الْإِجَابَاتِ عِنْدَ الِاخْتِبَارِ</p>
            <textarea rows={2} placeholder="نَصُّ السُّؤَالِ *" value={qForm.text} onChange={e=>setQForm(f=>({...f,text:e.target.value}))} className="w-full p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm resize-none"/>
            {[['opt0','الْإِجَابَةُ الصَّحِيحَةُ ✓ *',true],['opt1','الِاخْتِيَارُ 2 *',false],['opt2','الِاخْتِيَارُ 3 (اخْتِيَارِيٌّ)',false],['opt3','الِاخْتِيَارُ 4 (اخْتِيَارِيٌّ)',false]].map(([k,ph,isCorrect])=>(
              <Input key={k as string} placeholder={ph as string} value={(qForm as any)[k as string]} onChange={e=>setQForm(f=>({...f,[k as string]:e.target.value}))}
                className={`dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl ${isCorrect?'border-[#4CAF50] bg-[#F0FFF4] dark:bg-[#1B3B27]':''}`}/>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="الْفِئَةُ (مثل: دِين)" value={qForm.category} onChange={e=>setQForm(f=>({...f,category:e.target.value}))} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl text-sm"/>
              <select value={qForm.ageGroup} onChange={e=>setQForm(f=>({...f,ageGroup:e.target.value}))} className="p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm">
                {AGE_GROUPS.map(a=><option key={a.v} value={a.v}>{a.l}</option>)}
              </select>
            </div>
            <select value={qForm.level} onChange={e=>setQForm(f=>({...f,level:e.target.value}))} className="w-full p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm">
              {LEVELS.map(l=><option key={l.id} value={l.id}>{l.icon} {l.nameAr}</option>)}
            </select>
            <Input placeholder="تَفْسِيرٌ لِلْإِجَابَةِ (اخْتِيَارِيٌّ)" value={qForm.explanation} onChange={e=>setQForm(f=>({...f,explanation:e.target.value}))} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>
            <div>
              <input ref={qImgRef} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0]; if(f){setQImgFile(f); const r=new FileReader(); r.onload=()=>setQImgPreview(r.result as string); r.readAsDataURL(f);}}}/>
              <Button variant="outline" className="w-full dark:border-[#444] dark:text-white rounded-xl text-sm" onClick={()=>qImgRef.current?.click()}>
                <ImageIcon className="w-4 h-4 ml-2"/>{qImgPreview?'تَغْيِيرُ صُورَةِ السُّؤَالِ':'إِضَافَةُ صُورَةٍ لِلسُّؤَالِ (اخْتِيَارِيٌّ)'}
              </Button>
              {qImgPreview && (
                <div className="relative mt-2">
                  <img src={qImgPreview} className="w-full h-28 object-cover rounded-xl"/>
                  <button onClick={()=>{setQImgFile(null); setQImgPreview('');}} className="absolute top-2 left-2 bg-[#FF6B6B] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">✕</button>
                </div>
              )}
            </div>
          </div>
          <Button className="w-full bg-[#54A0FF] hover:bg-[#2e86de] rounded-xl py-5 font-black flex-shrink-0 mt-2" onClick={saveQuestion}>{editQuestionId?'حِفْظُ التَّعْدِيلَاتِ':'إِضَافَةُ السُّؤَالِ'}</Button>
        </DialogContent>
      </Dialog>

      {/* Puzzle dialog */}
      <Dialog open={puzzleDialog} onOpenChange={setPuzzleDialog}>
        <DialogContent className="max-w-md dark:bg-[#222] dark:border-[#333] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={()=>setPuzzleDialog(false)} className="dark:text-white order-first"><X className="w-4 h-4"/></Button>
              <DialogTitle className="dark:text-white flex-1 text-center">{editPuzzleId?'تَعْدِيلُ اللُّغْزِ':'إِضَافَةُ لُغْزٍ'}</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-3 overflow-y-auto flex-1 pb-2">
            <Input placeholder="عُنْوَانُ اللُّغْزِ *" value={pForm.title} onChange={e=>setPForm(f=>({...f,title:e.target.value}))} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>
            <textarea rows={3} placeholder="نَصُّ اللُّغْزِ *" value={pForm.content} onChange={e=>setPForm(f=>({...f,content:e.target.value}))} className="w-full p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm resize-none"/>
            <Input placeholder="الْإِجَابَةُ الصَّحِيحَةُ *" value={pForm.solution} onChange={e=>setPForm(f=>({...f,solution:e.target.value}))} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl border-[#4CAF50] bg-[#F0FFF4] dark:bg-[#1B3B27]"/>
            <Input placeholder="تَلْمِيحٌ (اخْتِيَارِيٌّ — يُكْشَفُ عِنْدَ الطَّلَبِ)" value={pForm.hint} onChange={e=>setPForm(f=>({...f,hint:e.target.value}))} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>
            <div>
              <input ref={pImgRef} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0]; if(f){setPImgFile(f); const r=new FileReader(); r.onload=()=>setPImgPreview(r.result as string); r.readAsDataURL(f);}}}/>
              <Button variant="outline" className="w-full dark:border-[#444] dark:text-white rounded-xl text-sm" onClick={()=>pImgRef.current?.click()}>
                <ImageIcon className="w-4 h-4 ml-2"/>{pImgPreview?'تَغْيِيرُ صُورَةِ اللُّغْزِ':'إِضَافَةُ صُورَةٍ لِلُّغْزِ (اخْتِيَارِيٌّ)'}
              </Button>
              {pImgPreview && (
                <div className="relative mt-2">
                  <img src={pImgPreview} className="w-full h-28 object-cover rounded-xl"/>
                  <button onClick={()=>{setPImgFile(null); setPImgPreview('');}} className="absolute top-2 left-2 bg-[#FF6B6B] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">✕</button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select value={pForm.type} onChange={e=>setPForm(f=>({...f,type:e.target.value}))} className="p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm">
                <option value="riddle">لُغْزٌ</option>
                <option value="logic">مَنْطِقٌ</option>
                <option value="memory">ذَاكِرَةٌ</option>
              </select>
              <select value={pForm.ageGroup} onChange={e=>setPForm(f=>({...f,ageGroup:e.target.value}))} className="p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm">
                {AGE_GROUPS.map(a=><option key={a.v} value={a.v}>{a.l}</option>)}
              </select>
              <select value={pForm.level} onChange={e=>setPForm(f=>({...f,level:e.target.value}))} className="p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm">
                {LEVELS.map(l=><option key={l.id} value={l.id}>{l.nameAr}</option>)}
              </select>
            </div>
          </div>
          <Button className="w-full bg-[#A29BFE] hover:bg-[#6c5ce7] rounded-xl py-5 font-black flex-shrink-0 mt-2" onClick={savePuzzle}>{editPuzzleId?'حِفْظُ التَّعْدِيلَاتِ':'إِضَافَةُ اللُّغْزِ'}</Button>
        </DialogContent>
      </Dialog>

      {/* Category dialog */}
      <Dialog open={catDialog} onOpenChange={setCatDialog}>
        <DialogContent className="max-w-sm dark:bg-[#222] dark:border-[#333]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={()=>setCatDialog(false)} className="dark:text-white order-first"><X className="w-4 h-4"/></Button>
              <DialogTitle className="dark:text-white flex-1 text-center">{editCatId?'تَعْدِيلُ الْفِئَةِ':'إِضَافَةُ فِئَةٍ'}</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="اسم الفئة *" value={catForm.name} onChange={e=>setCatForm(f=>({...f,name:e.target.value}))} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <div className="w-12 h-12 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] flex items-center justify-center text-3xl bg-[#F8F9FA] dark:bg-[#2A2A2A] flex-shrink-0 cursor-pointer"
                  onClick={()=>setShowEmojiPicker(p=>!p)}>{catForm.icon}</div>
                <button type="button" onClick={()=>setShowEmojiPicker(p=>!p)}
                  className="flex-1 p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm text-right hover:bg-[#F0F0F0] dark:hover:bg-[#3A3A3A] transition-colors">
                  {showEmojiPicker ? '▲ إِخْفَاءُ الرُّمُوزِ' : '▼ اِخْتَرْ رَمْزًا تَعْبِيرِيًّا'}
                </button>
              </div>
              {showEmojiPicker && (
                <div className="grid grid-cols-8 gap-1 p-3 bg-[#F8F9FA] dark:bg-[#2A2A2A] rounded-xl border dark:border-[#444] max-h-36 overflow-y-auto">
                  {COMMON_EMOJIS.map(em=>(
                    <button key={em} type="button"
                      onClick={()=>{ setCatForm(f=>({...f,icon:em})); setShowEmojiPicker(false); }}
                      className={`text-2xl hover:bg-white dark:hover:bg-[#444] rounded-lg p-1 transition-colors ${catForm.icon===em?'bg-white dark:bg-[#444] ring-2 ring-[#A29BFE]':''}`}>{em}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs dark:text-white">اللَّوْنُ</Label>
              <input type="color" value={catForm.color} onChange={e=>setCatForm(f=>({...f,color:e.target.value}))} className="w-full h-12 rounded-xl border-2 cursor-pointer"/>
            </div>
            <div className="p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: catForm.color }}>
              <span className="text-2xl">{catForm.icon}</span>
              <span className="text-white font-bold">{catForm.name||'مَعَايَنَةٌ'}</span>
            </div>
          </div>
          <Button className="w-full rounded-xl py-4 font-black text-white" style={{ backgroundColor: catForm.color }} onClick={saveCat}>{editCatId?'حِفْظٌ':'إِضَافَةٌ'}</Button>
        </DialogContent>
      </Dialog>

      {/* Password change dialog */}
      <Dialog open={passDialog} onOpenChange={setPassDialog}>
        <DialogContent className="max-w-sm dark:bg-[#222] dark:border-[#333]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={()=>setPassDialog(false)} className="dark:text-white order-first"><X className="w-4 h-4"/></Button>
              <DialogTitle className="dark:text-white flex-1 text-center">تَغْيِيرُ كَلِمَةِ الْمُرُورِ</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-3">
            <Input type="password" placeholder="كَلِمَةُ الْمُرُورِ الْحَالِيَّةُ" value={oldPass} onChange={e=>setOldPass(e.target.value)} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>
            <Input type="password" placeholder="كَلِمَةُ الْمُرُورِ الْجَدِيدَةُ" value={newPass} onChange={e=>setNewPass(e.target.value)} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>
            <Input type="password" placeholder="تَأْكِيدُ كَلِمَةِ الْمُرُورِ" value={confPass} onChange={e=>setConfPass(e.target.value)} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>
            {passErr && <p className="text-[#FF6B6B] text-sm text-center">{passErr}</p>}
          </div>
          <Button className="w-full bg-[#FF9F43] rounded-xl py-4 font-black" onClick={()=>{
            if(oldPass!==settings.parentPassword){setPassErr('كَلِمَةُ الْمُرُورِ الْحَالِيَّةُ خَاطِئَةٌ');return;}
            if(newPass!==confPass){setPassErr('كَلِمَتَا الْمُرُورِ غَيْرُ مُتَطَابِقَتَيْنِ');return;}
            if(newPass.length<4){setPassErr('كَلِمَةُ الْمُرُورِ قَصِيرَةٌ');return;}
            updateSettings({parentPassword:newPass}); setPassDialog(false); setOldPass(''); setNewPass(''); setConfPass(''); setPassErr('');
          }}>تَغْيِيرٌ</Button>
        </DialogContent>
      </Dialog>

      {/* Security question dialog */}
      <Dialog open={secQDialog} onOpenChange={setSecQDialog}>
        <DialogContent className="max-w-sm dark:bg-[#222] dark:border-[#333]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={()=>setSecQDialog(false)} className="dark:text-white order-first"><X className="w-4 h-4"/></Button>
              <DialogTitle className="dark:text-white flex-1 text-center">سُؤَالُ الِاسْتِرْدَادِ</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-[#636E72] dark:text-[#A0A0A0]">مثال: تَارِيخُ مِيلَادِ الطِّفْلِ الْأَكْبَرِ، اسْمُ مَدِينَةِ الزَّوَاجِ...</p>
            <select value={secQuestion} onChange={e=>setSecQuestion(e.target.value)} className="w-full p-3 rounded-xl border-2 border-[#E5E5E5] dark:border-[#444] dark:bg-[#333] dark:text-white text-sm">
              <option value="">اِخْتَرْ سُؤَالًا...</option>
              {['مَا اسْمُ مَدِينَةِ مَوْلِدِكَ؟','مَا اسْمُ طِفْلِكَ الْأَوَّلِ؟','مَا تَارِيخُ مِيلَادِ زَوْجَتِكَ/زَوْجِكَ؟','مَا اسْمُ حَيِّكَ السُّكَنِيِّ؟','مَا اسْمُ مَدْرَسَةِ طِفْلِكَ؟','اكْتُبْ سُؤَالًا مُخَصَّصًا...'].map(q=><option key={q} value={q}>{q}</option>)}
            </select>
            {secQuestion === 'اكْتُبْ سُؤَالًا مُخَصَّصًا...' && (
              <Input placeholder="نَصُّ السُّؤَالِ الْمُخَصَّصِ" onChange={e=>setSecQuestion(e.target.value)} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>
            )}
            <Input placeholder="الْإِجَابَةُ السِّرِّيَّةُ *" value={secAnswer} onChange={e=>setSecAnswer(e.target.value)} className="dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>
            <p className="text-[10px] text-[#636E72]">⚠️ احْتَفِظْ بِهَذِهِ الْمَعْلُومَاتِ فِي مَكَانٍ آمِنٍ</p>
          </div>
          <Button className="w-full bg-[#54A0FF] rounded-xl py-4 font-black" onClick={()=>{
            if(!secQuestion||!secAnswer.trim())return;
            updateSettings({securityQuestion:{question:secQuestion,answer:secAnswer}}); setSecQDialog(false); setSecAnswer('');
          }}>حِفْظُ السُّؤَالِ</Button>
        </DialogContent>
      </Dialog>

      {/* Reset dialog */}
      <Dialog open={resetDialog} onOpenChange={setResetDialog}>
        <DialogContent className="max-w-sm dark:bg-[#222] dark:border-[#333]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={()=>setResetDialog(false)} className="dark:text-white order-first"><X className="w-4 h-4"/></Button>
              <DialogTitle className="text-[#FF6B6B] flex-1 text-center">تَحْذِيرٌ: إِعَادَةُ الضَّبْطِ</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-3">
            <div className="bg-[#FFF3CD] dark:bg-[#332B00] p-4 rounded-xl space-y-2">
              <AlertTriangle className="w-8 h-8 text-[#FF9F43] mx-auto"/>
              <p className="text-sm text-center font-medium dark:text-white">سَيَتِمُّ مَسْحُ جَمِيعِ الْإِعْدَادَاتِ وَالْمُحْتَوَيَاتِ</p>
              <p className="text-xs text-center text-[#4CAF50]">✓ سَيَتِمُّ حِفْظُ بَيَانَاتِ الْأَبْنَاءِ كَنُسْخَةٍ احْتِيَاطِيَّةٍ وَيُمْكِنُ اسْتِرْجَاعُهَا</p>
            </div>
            <p className="text-sm dark:text-white text-center">اكْتُبْ <span className="font-bold text-[#FF6B6B]">تأكيد</span> لِلْمُتَابَعَةِ</p>
            <Input value={resetConfirmText} onChange={e=>setResetConfirmText(e.target.value)} placeholder="تأكيد" className="text-center dark:bg-[#333] dark:border-[#444] dark:text-white rounded-xl"/>
          </div>
          <div className="space-y-2">
            <Button className="w-full bg-[#FF6B6B] hover:bg-[#ee5253] rounded-xl py-4 font-black" disabled={resetConfirmText!=='تأكيد'} onClick={()=>{ resetToDefault(true); setResetDialog(false); setResetConfirmText(''); setIsAuthorized(false); }}>إِعَادَةُ الضَّبْطِ (مَعَ حِفْظِ الْأَبْنَاءِ)</Button>
            <Button className="w-full bg-[#2D3436] hover:bg-[#4A4A4A] rounded-xl py-3 font-bold text-sm" disabled={resetConfirmText!=='تأكيد'} onClick={()=>{ resetToDefault(false); setResetDialog(false); setResetConfirmText(''); setIsAuthorized(false); }}>إِعَادَةُ الضَّبْطِ الْكَامِلَةُ</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
