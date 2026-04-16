import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Trophy, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '../store/useStore';
import confetti from 'canvas-confetti';

interface DotShape {
  id: string;
  nameAr: string;
  emoji: string;
  level: string;
  points: { x: number; y: number; label: number }[];
  viewBox: string;
  completedPath: string;
  completedColor: string;
  completedParts?: { path: string; fill: string }[];
}

// Helper: build polygon path from points array
const poly = (pts: {x:number;y:number}[]) =>
  pts.map((p,i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ') + ' Z';

const SHAPES: DotShape[] = [
  // ── تمهيدي ──
  {
    id: 'star', nameAr: 'نَجْمَةٌ', emoji: '⭐', level: 'beginner',
    viewBox: '0 0 200 200',
    points: [
      {x:100,y:18,label:1}, {x:128,y:68,label:2}, {x:183,y:72,label:3},
      {x:142,y:112,label:4}, {x:157,y:170,label:5}, {x:100,y:138,label:6},
      {x:43,y:170,label:7}, {x:58,y:112,label:8}, {x:17,y:72,label:9},
      {x:72,y:68,label:10},
    ],
    completedPath: 'M100,18 L128,68 L183,72 L142,112 L157,170 L100,138 L43,170 L58,112 L17,72 L72,68 Z',
    completedColor: '#FFD700',
  },
  {
    id: 'house', nameAr: 'بَيْتٌ', emoji: '🏠', level: 'beginner',
    viewBox: '0 0 200 200',
    points: [
      {x:100,y:22,label:1},  // سقف
      {x:178,y:88,label:2},  // حافة السقف يمين
      {x:168,y:88,label:3},  // بداية الجدار يمين
      {x:168,y:182,label:4}, // ركن أسفل يمين
      {x:118,y:182,label:5}, // باب أسفل يمين
      {x:118,y:128,label:6}, // باب أعلى يمين
      {x:82,y:128,label:7},  // باب أعلى يسار
      {x:82,y:182,label:8},  // باب أسفل يسار
      {x:32,y:182,label:9},  // ركن أسفل يسار
      {x:32,y:88,label:10},  // بداية الجدار يسار
      {x:22,y:88,label:11},  // حافة السقف يسار
    ],
    completedPath: 'M100,22 L178,88 L168,88 L168,182 L118,182 L118,128 L82,128 L82,182 L32,182 L32,88 L22,88 Z',
    completedColor: '#FF9F43',
    completedParts: [
      {path:'M100,22 L178,88 L22,88 Z', fill:'#e07b39'},
      {path:'M32,88 L168,88 L168,182 L82,182 L82,128 L118,128 L118,182 L32,182 Z', fill:'#FF9F43'},
    ],
  },
  {
    id: 'apple', nameAr: 'تُفَّاحَةٌ', emoji: '🍎', level: 'beginner',
    viewBox: '0 0 200 220',
    points: [
      {x:100,y:25,label:1},  // عنق
      {x:120,y:15,label:2},  // ورقة
      {x:155,y:50,label:3},  // أعلى يمين
      {x:175,y:90,label:4},
      {x:172,y:140,label:5},
      {x:150,y:180,label:6},
      {x:110,y:200,label:7}, // أسفل وسط
      {x:75,y:195,label:8},
      {x:45,y:172,label:9},
      {x:28,y:138,label:10},
      {x:26,y:90,label:11},
      {x:45,y:50,label:12},
      {x:80,y:22,label:13},  // أعلى يسار
    ],
    completedPath: 'M100,25 L120,15 L155,50 L175,90 L172,140 L150,180 L110,200 L75,195 L45,172 L28,138 L26,90 L45,50 L80,22 Z',
    completedColor: '#FF6B6B',
  },

  // ── مبتدئ ──
  {
    id: 'moon', nameAr: 'هِلَالٌ', emoji: '🌙', level: 'intermediate',
    viewBox: '0 0 200 200',
    points: [
      {x:100,y:18,label:1}, {x:138,y:28,label:2}, {x:165,y:56,label:3},
      {x:175,y:98,label:4}, {x:165,y:140,label:5}, {x:138,y:168,label:6},
      {x:100,y:178,label:7},{x:78,y:170,label:8}, {x:64,y:152,label:9},
      {x:84,y:132,label:10},{x:108,y:100,label:11},{x:84,y:68,label:12},
      {x:64,y:48,label:13},{x:78,y:28,label:14},
    ],
    completedPath: 'M100,18 L138,28 L165,56 L175,98 L165,140 L138,168 L100,178 L78,170 L64,152 L84,132 L108,100 L84,68 L64,48 L78,28 Z',
    completedColor: '#C8A0FF',
  },
  {
    id: 'fish', nameAr: 'سَمَكَةٌ', emoji: '🐟', level: 'intermediate',
    viewBox: '0 0 220 160',
    points: [
      {x:30,y:80,label:1},  {x:25,y:42,label:2},  {x:10,y:80,label:3},
      {x:25,y:118,label:4}, {x:72,y:140,label:5}, {x:135,y:142,label:6},
      {x:190,y:112,label:7},{x:210,y:80,label:8}, {x:190,y:48,label:9},
      {x:135,y:18,label:10},{x:72,y:20,label:11},
    ],
    completedPath: 'M30,80 L25,42 L10,80 L25,118 L72,140 L135,142 L190,112 L210,80 L190,48 L135,18 L72,20 Z',
    completedColor: '#54A0FF',
    completedParts: [
      {path:'M30,80 L25,42 L10,80 L25,118 Z', fill:'#2e86de'}, // ذيل
      {path:'M30,80 L72,20 L135,18 L190,48 L210,80 L190,112 L135,142 L72,140 Z', fill:'#54A0FF'},
    ],
  },
  {
    id: 'heart', nameAr: 'قَلْبٌ', emoji: '❤️', level: 'intermediate',
    viewBox: '0 0 200 190',
    points: [
      {x:100,y:172,label:1},{x:38,y:118,label:2},{x:14,y:78,label:3},
      {x:18,y:48,label:4}, {x:42,y:28,label:5}, {x:68,y:26,label:6},
      {x:100,y:52,label:7},{x:132,y:26,label:8},{x:158,y:28,label:9},
      {x:182,y:48,label:10},{x:186,y:78,label:11},{x:162,y:118,label:12},
    ],
    completedPath: 'M100,172 L38,118 L14,78 L18,48 L42,28 L68,26 L100,52 L132,26 L158,28 L182,48 L186,78 L162,118 Z',
    completedColor: '#FF6B6B',
  },

  // ── متوسط ──
  {
    id: 'rocket', nameAr: 'صَارُوخٌ', emoji: '🚀', level: 'advanced',
    viewBox: '0 0 200 230',
    points: [
      {x:100,y:15,label:1}, {x:130,y:52,label:2}, {x:138,y:98,label:3},
      {x:138,y:152,label:4},{x:172,y:178,label:5},{x:138,y:168,label:6},
      {x:118,y:200,label:7},{x:100,y:190,label:8},{x:82,y:200,label:9},
      {x:62,y:168,label:10},{x:28,y:178,label:11},{x:62,y:152,label:12},
      {x:62,y:98,label:13},{x:70,y:52,label:14},
    ],
    completedPath: 'M100,15 L130,52 L138,98 L138,152 L172,178 L138,168 L118,200 L100,190 L82,200 L62,168 L28,178 L62,152 L62,98 L70,52 Z',
    completedColor: '#4CAF50',
    completedParts: [
      {path:'M100,15 L130,52 L70,52 Z', fill:'#FF6B6B'},
      {path:'M70,52 L62,98 L62,152 L138,152 L138,98 L130,52 Z', fill:'#4CAF50'},
      {path:'M62,152 L28,178 L62,168 Z', fill:'#FF9F43'},
      {path:'M138,152 L172,178 L138,168 Z', fill:'#FF9F43'},
      {path:'M62,168 L82,200 L100,190 L118,200 L138,168 L100,185 Z', fill:'#FF6B6B'},
    ],
  },
  {
    id: 'flower', nameAr: 'زَهْرَةٌ', emoji: '🌸', level: 'advanced',
    viewBox: '0 0 200 215',
    points: [
      {x:100,y:43,label:1},
      {x:114,y:71,label:2},
      {x:145,y:69,label:3},
      {x:128,y:95,label:4},
      {x:145,y:121,label:5},
      {x:114,y:119,label:6},
      {x:100,y:147,label:7},
      {x:86,y:119,label:8},
      {x:55,y:121,label:9},
      {x:72,y:95,label:10},
      {x:55,y:69,label:11},
      {x:86,y:71,label:12},
    ],
    completedPath: 'M100,43 L114,71 L145,69 L128,95 L145,121 L114,119 L100,147 L86,119 L55,121 L72,95 L55,69 L86,71 Z',
    completedColor: '#FF6B9D',
    completedParts: [
      {path:'M100,43 L114,71 L145,69 L128,95 L145,121 L114,119 L100,147 L86,119 L55,121 L72,95 L55,69 L86,71 Z', fill:'#FF6B9D'},
      {path:'M98,147 L102,147 L104,205 L96,205 Z', fill:'#4CAF50'},
      {path:'M98,180 C82,168 64,172 60,187 C76,193 94,183 98,180 Z', fill:'#81C784'},
      {path:'M102,192 C118,180 136,184 140,199 C124,205 106,195 102,192 Z', fill:'#4CAF50'},
    ],
  },

  // ── متقدم ──
  {
    id: 'plane', nameAr: 'طَائِرَةٌ', emoji: '✈️', level: 'expert',
    viewBox: '0 0 240 160',
    points: [
      {x:20,y:80,label:1},  {x:58,y:65,label:2},  {x:98,y:55,label:3},
      {x:158,y:50,label:4}, {x:208,y:62,label:5}, {x:224,y:78,label:6},
      {x:208,y:94,label:7}, {x:158,y:105,label:8},{x:128,y:105,label:9},
      {x:118,y:132,label:10},{x:88,y:142,label:11},{x:88,y:105,label:12},
      {x:58,y:105,label:13},{x:38,y:122,label:14},{x:24,y:122,label:15},
      {x:20,y:96,label:16},
    ],
    completedPath: 'M20,80 L58,65 L98,55 L158,50 L208,62 L224,78 L208,94 L158,105 L128,105 L118,132 L88,142 L88,105 L58,105 L38,122 L24,122 L20,96 Z',
    completedColor: '#54A0FF',
    completedParts: [
      {path:'M98,55 L158,50 L208,62 L224,78 L208,94 L158,105 L98,105 Z', fill:'#54A0FF'},
      {path:'M20,80 L58,65 L98,55 L98,105 L58,105 L20,96 Z', fill:'#2e86de'},
      {path:'M128,105 L118,132 L88,142 L88,105 Z', fill:'#54A0FF'},
      {path:'M58,105 L38,122 L24,122 L20,96 L58,105 Z', fill:'#FF9F43'},
    ],
  },
  {
    id: 'camel', nameAr: 'جَمَلٌ', emoji: '🐪', level: 'expert',
    viewBox: '0 0 260 210',
    points: [
      {x:40,y:185,label:1},  // رِجل أمامية أسفل يسار
      {x:40,y:148,label:2},
      {x:58,y:138,label:3},
      {x:60,y:115,label:4},
      {x:68,y:88,label:5},
      {x:72,y:62,label:6},   // قاعدة السنام الأول
      {x:88,y:38,label:7},   // قمة السنام الأول
      {x:108,y:58,label:8},
      {x:118,y:62,label:9},  // بين السنامين
      {x:138,y:42,label:10}, // قمة السنام الثاني
      {x:158,y:62,label:11},
      {x:168,y:88,label:12},
      {x:178,y:115,label:13},
      {x:185,y:138,label:14},
      {x:200,y:148,label:15},
      {x:200,y:185,label:16},// رِجل خلفية أسفل يمين
      {x:178,y:185,label:17},
      {x:178,y:148,label:18},
      {x:138,y:130,label:19},// بطن
      {x:58,y:148,label:20},
    ],
    completedPath: 'M40,185 L40,148 L58,138 L60,115 L68,88 L72,62 L88,38 L108,58 L118,62 L138,42 L158,62 L168,88 L178,115 L185,138 L200,148 L200,185 L178,185 L178,148 L138,130 L58,148 Z',
    completedColor: '#C8A06B',
    completedParts: [
      {path:'M40,185 L40,148 L58,148 L58,185 Z', fill:'#b8904b'},
      {path:'M178,148 L200,148 L200,185 L178,185 Z', fill:'#b8904b'},
      {path:'M58,148 L60,115 L68,88 L72,62 L88,38 L108,58 L118,62 L138,42 L158,62 L168,88 L178,115 L185,138 L178,148 L138,130 L58,148 Z', fill:'#C8A06B'},
      {path:'M40,148 L58,138 L60,115 L40,148 Z', fill:'#b8904b'},
    ],
  },
];

export default function DotToDotActivity() {
  const { currentUser, updateUser } = useStore();
  const [selectedShape, setSelectedShape] = useState<DotShape | null>(null);
  const [connectedDots, setConnectedDots] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  const handleDotClick = (dotLabel: number) => {
    if (completed) return;
    const shape = selectedShape!;
    const next = connectedDots.length + 1;
    if (dotLabel !== next) return;

    const newConnected = [...connectedDots, dotLabel];
    setConnectedDots(newConnected);

    if (newConnected.length > 1) {
      const prev = shape.points.find(p => p.label === newConnected[newConnected.length - 2])!;
      const curr = shape.points.find(p => p.label === dotLabel)!;
      setLines(l => [...l, { x1: prev.x, y1: prev.y, x2: curr.x, y2: curr.y }]);
    }

    if (newConnected.length === shape.points.length) {
      const first = shape.points.find(p => p.label === 1)!;
      const last = shape.points.find(p => p.label === shape.points.length)!;
      setLines(l => [...l, { x1: last.x, y1: last.y, x2: first.x, y2: first.y }]);
      setCompleted(true);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 }, colors: ['#FF9F43', '#4CAF50', '#54A0FF', '#FF6B6B', '#FFD700'] });
      if (currentUser) updateUser(currentUser.id, { points: currentUser.points + 25 });
    }
  };

  const reset = () => { setConnectedDots([]); setLines([]); setCompleted(false); };

  if (!selectedShape) {
    const levels = ['beginner','intermediate','advanced','expert'];
    const levelNames: Record<string,string> = { beginner:'تَمْهِيدِيّ', intermediate:'مُبْتَدِئ', advanced:'مُتَوَسِّط', expert:'مُتَقَدِّم' };
    const levelColors: Record<string,string> = { beginner:'#4CAF50', intermediate:'#FF9F43', advanced:'#54A0FF', expert:'#FF6B6B' };
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-black text-[#2D3436] dark:text-white text-center">اِخْتَرِ الشَّكْلَ لِلرَّسْمِ</h3>
        {levels.map(lv => {
          const shapes = SHAPES.filter(s => s.level === lv);
          if (!shapes.length) return null;
          return (
            <div key={lv}>
              <p className="text-xs font-bold mb-2" style={{ color: levelColors[lv] }}>{levelNames[lv]}</p>
              <div className="grid grid-cols-3 gap-3">
                {shapes.map((shape, i) => (
                  <motion.button key={shape.id}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                    className="bg-white dark:bg-[#222] border-2 border-[#E5E5E5] dark:border-[#333] hover:border-[#54A0FF] rounded-2xl p-3 text-center space-y-1 cursor-pointer transition-all"
                    onClick={() => { setSelectedShape(shape); reset(); }}
                  >
                    <div className="text-3xl">{shape.emoji}</div>
                    <p className="font-black text-[#2D3436] dark:text-white text-sm">{shape.nameAr}</p>
                    <Badge className="text-[9px] text-white" style={{ backgroundColor: levelColors[lv] }}>{levelNames[lv]}</Badge>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const shape = selectedShape;
  const progress = (connectedDots.length / shape.points.length) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => { setSelectedShape(null); reset(); }} className="dark:text-white flex items-center gap-1">
          <ChevronRight className="w-4 h-4" /> الْعَوْدَةُ
        </Button>
        <div className="text-center">
          <p className="font-black dark:text-white">{shape.emoji} {shape.nameAr}</p>
          <p className="text-xs text-[#636E72]">{connectedDots.length} / {shape.points.length}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={reset} className="dark:text-white"><RefreshCw className="w-4 h-4" /></Button>
      </div>

      <div className="h-2 bg-[#F0F0F0] dark:bg-[#333] rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: '#54A0FF' }} animate={{ width: `${progress}%` }} />
      </div>

      {!completed && (
        <p className="text-center text-sm text-[#636E72] dark:text-[#A0A0A0] font-medium">
          انْقُرْ عَلَى النُّقْطَةِ رَقْمُ <span className="text-[#54A0FF] font-black text-lg">{connectedDots.length + 1}</span>
        </p>
      )}

      <div className="bg-white dark:bg-[#222] border-2 border-[#E5E5E5] dark:border-[#333] rounded-3xl overflow-hidden">
        <svg viewBox={shape.viewBox} className="w-full" style={{ touchAction: 'none' }}>

          {/* الرسم الملوّن النهائي عند الاكتمال */}
          {completed && (
            <AnimatePresence>
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {shape.completedParts ? (
                  shape.completedParts.map((part, i) => (
                    <motion.path
                      key={i}
                      d={part.path}
                      fill={part.fill}
                      stroke={shape.completedColor}
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      style={{ transformOrigin: 'center' }}
                    />
                  ))
                ) : (
                  <motion.path
                    d={shape.completedPath}
                    fill={shape.completedColor}
                    fillOpacity="0.85"
                    stroke={shape.completedColor}
                    strokeWidth="2"
                    strokeLinejoin="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                {/* تأثير لمعان */}
                <motion.path
                  d={shape.completedPath}
                  fill="white"
                  fillOpacity="0"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  animate={{ fillOpacity: [0, 0.25, 0], strokeOpacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.5, repeat: 2 }}
                />
              </motion.g>
            </AnimatePresence>
          )}

          {/* الخطوط المرسومة */}
          {lines.map((line, i) => (
            <motion.line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
              stroke={completed ? 'white' : '#54A0FF'} strokeWidth={completed ? '1.5' : '2.5'} strokeLinecap="round"
              strokeOpacity={completed ? 0.5 : 1}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25 }}
            />
          ))}

          {/* النقاط */}
          {!completed && shape.points.map((dot) => {
            const isConnected = connectedDots.includes(dot.label);
            const isNext = dot.label === connectedDots.length + 1;
            return (
              <g key={dot.label} onClick={() => handleDotClick(dot.label)}
                style={{ cursor: isNext ? 'pointer' : 'default' }}>
                <circle cx={dot.x} cy={dot.y} r={isNext ? 11 : 8}
                  fill={isConnected ? '#54A0FF' : isNext ? '#FF9F43' : '#F0F0F0'}
                  stroke={isNext ? '#FF7800' : '#B2BEC3'} strokeWidth="2"
                />
                {isNext && (
                  <motion.circle cx={dot.x} cy={dot.y} r="14"
                    fill="none" stroke="#FF9F43" strokeWidth="2.5"
                    animate={{ r: [11, 17, 11], opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  />
                )}
                <text x={dot.x} y={dot.y+1} textAnchor="middle" dominantBaseline="middle"
                  fontSize="7.5" fontWeight="bold" fill={isConnected ? 'white' : '#636E72'}
                  style={{ userSelect: 'none', pointerEvents: 'none' }}>
                  {dot.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <AnimatePresence>
        {completed && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl p-6 text-white text-center space-y-3"
            style={{ background: `linear-gradient(135deg, ${shape.completedColor}, ${shape.completedColor}88)` }}>
            <div className="text-5xl">{shape.emoji}</div>
            <p className="text-2xl font-black">أَحْسَنْتَ! رَسَمْتَ {shape.nameAr}!</p>
            <p className="opacity-90 text-lg">+25 نُقْطَةً 🎉</p>
            <div className="flex gap-3">
              <Button className="flex-1 bg-white/20 hover:bg-white/30 rounded-xl font-bold" onClick={reset}>إِعَادَةٌ</Button>
              <Button className="flex-1 bg-white/20 hover:bg-white/30 rounded-xl font-bold"
                onClick={() => { setSelectedShape(null); reset(); }}>شَكْلٌ آخَرُ</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
