import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Trophy, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '../store/useStore';
import confetti from 'canvas-confetti';

interface DotShape {
  id: string;
  name: string;
  nameAr: string;
  level: string;
  points: { x: number; y: number; label: number }[];
  viewBox: string;
  completedPath?: string;
}

const SHAPES: DotShape[] = [
  {
    id: 'star', name: 'Star', nameAr: 'نَجْمَةٌ', level: 'beginner',
    viewBox: '0 0 200 200',
    points: [
      { x: 100, y: 20, label: 1 }, { x: 130, y: 70, label: 2 }, { x: 185, y: 75, label: 3 },
      { x: 145, y: 115, label: 4 }, { x: 160, y: 175, label: 5 }, { x: 100, y: 140, label: 6 },
      { x: 40, y: 175, label: 7 }, { x: 55, y: 115, label: 8 }, { x: 15, y: 75, label: 9 },
      { x: 70, y: 70, label: 10 }
    ],
  },
  {
    id: 'house', name: 'House', nameAr: 'بَيْتٌ', level: 'beginner',
    viewBox: '0 0 200 200',
    points: [
      { x: 100, y: 20, label: 1 }, { x: 170, y: 80, label: 2 }, { x: 160, y: 80, label: 3 },
      { x: 160, y: 180, label: 4 }, { x: 40, y: 180, label: 5 }, { x: 40, y: 80, label: 6 },
      { x: 30, y: 80, label: 7 }
    ],
  },
  {
    id: 'moon', name: 'Moon', nameAr: 'هِلَالٌ', level: 'intermediate',
    viewBox: '0 0 200 200',
    points: [
      { x: 100, y: 20, label: 1 }, { x: 140, y: 30, label: 2 }, { x: 168, y: 60, label: 3 },
      { x: 175, y: 100, label: 4 }, { x: 168, y: 140, label: 5 }, { x: 140, y: 168, label: 6 },
      { x: 100, y: 178, label: 7 }, { x: 75, y: 170, label: 8 }, { x: 60, y: 150, label: 9 },
      { x: 80, y: 130, label: 10 }, { x: 105, y: 100, label: 11 }, { x: 80, y: 70, label: 12 },
      { x: 60, y: 50, label: 13 }, { x: 75, y: 30, label: 14 }
    ],
  },
  {
    id: 'fish', name: 'Fish', nameAr: 'سَمَكَةٌ', level: 'intermediate',
    viewBox: '0 0 220 160',
    points: [
      { x: 30, y: 80, label: 1 }, { x: 30, y: 40, label: 2 }, { x: 10, y: 80, label: 3 },
      { x: 30, y: 120, label: 4 }, { x: 80, y: 140, label: 5 }, { x: 140, y: 140, label: 6 },
      { x: 195, y: 110, label: 7 }, { x: 210, y: 80, label: 8 }, { x: 195, y: 50, label: 9 },
      { x: 140, y: 20, label: 10 }, { x: 80, y: 20, label: 11 }
    ],
  },
  {
    id: 'flower', name: 'Flower', nameAr: 'زَهْرَةٌ', level: 'advanced',
    viewBox: '0 0 200 200',
    points: [
      { x: 100, y: 20, label: 1 }, { x: 130, y: 45, label: 2 }, { x: 175, y: 45, label: 3 },
      { x: 150, y: 75, label: 4 }, { x: 165, y: 120, label: 5 }, { x: 120, y: 100, label: 6 },
      { x: 100, y: 140, label: 7 }, { x: 80, y: 100, label: 8 }, { x: 35, y: 120, label: 9 },
      { x: 50, y: 75, label: 10 }, { x: 25, y: 45, label: 11 }, { x: 70, y: 45, label: 12 },
      { x: 100, y: 155, label: 13 }, { x: 100, y: 190, label: 14 },
    ],
  },

  {
    id: 'rocket', name: 'Rocket', nameAr: 'صَارُوخٌ', level: 'intermediate',
    viewBox: '0 0 200 220',
    points: [
      { x: 100, y: 15, label: 1 }, { x: 130, y: 50, label: 2 }, { x: 135, y: 95, label: 3 },
      { x: 135, y: 150, label: 4 }, { x: 170, y: 175, label: 5 }, { x: 135, y: 165, label: 6 },
      { x: 115, y: 195, label: 7 }, { x: 100, y: 185, label: 8 }, { x: 85, y: 195, label: 9 },
      { x: 65, y: 165, label: 10 }, { x: 30, y: 175, label: 11 }, { x: 65, y: 150, label: 12 },
      { x: 65, y: 95, label: 13 }, { x: 70, y: 50, label: 14 },
    ],
  },
  {
    id: 'heart', name: 'Heart', nameAr: 'قَلْبٌ', level: 'intermediate',
    viewBox: '0 0 200 200',
    points: [
      { x: 100, y: 170, label: 1 }, { x: 40, y: 120, label: 2 }, { x: 15, y: 80, label: 3 },
      { x: 20, y: 50, label: 4 }, { x: 45, y: 30, label: 5 }, { x: 70, y: 30, label: 6 },
      { x: 100, y: 55, label: 7 }, { x: 130, y: 30, label: 8 }, { x: 155, y: 30, label: 9 },
      { x: 180, y: 50, label: 10 }, { x: 185, y: 80, label: 11 }, { x: 160, y: 120, label: 12 },
    ],
  },
  {
    id: 'plane', name: 'Plane', nameAr: 'طَائِرَةٌ', level: 'advanced',
    viewBox: '0 0 240 160',
    points: [
      { x: 20, y: 80, label: 1 }, { x: 60, y: 65, label: 2 }, { x: 100, y: 55, label: 3 },
      { x: 160, y: 50, label: 4 }, { x: 210, y: 60, label: 5 }, { x: 225, y: 75, label: 6 },
      { x: 210, y: 90, label: 7 }, { x: 160, y: 100, label: 8 }, { x: 130, y: 100, label: 9 },
      { x: 120, y: 130, label: 10 }, { x: 90, y: 140, label: 11 }, { x: 90, y: 100, label: 12 },
      { x: 60, y: 100, label: 13 }, { x: 40, y: 120, label: 14 }, { x: 25, y: 120, label: 15 },
      { x: 20, y: 95, label: 16 },
    ],
  },
  {
    id: 'camel', name: 'Camel', nameAr: 'جَمَلٌ', level: 'expert',
    viewBox: '0 0 240 200',
    points: [
      { x: 60, y: 170, label: 1 }, { x: 60, y: 130, label: 2 }, { x: 80, y: 130, label: 3 },
      { x: 80, y: 110, label: 4 }, { x: 90, y: 90, label: 5 }, { x: 95, y: 60, label: 6 },
      { x: 110, y: 40, label: 7 }, { x: 120, y: 60, label: 8 }, { x: 130, y: 55, label: 9 },
      { x: 150, y: 70, label: 10 }, { x: 160, y: 90, label: 11 }, { x: 175, y: 90, label: 12 },
      { x: 190, y: 110, label: 13 }, { x: 195, y: 130, label: 14 }, { x: 180, y: 130, label: 15 },
      { x: 180, y: 170, label: 16 }, { x: 160, y: 170, label: 17 }, { x: 160, y: 130, label: 18 },
      { x: 120, y: 120, label: 19 }, { x: 80, y: 130, label: 20 },
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

    if (dotLabel !== next) return; // must click in order

    const newConnected = [...connectedDots, dotLabel];
    setConnectedDots(newConnected);

    if (newConnected.length > 1) {
      const prev = shape.points.find(p => p.label === newConnected[newConnected.length - 2])!;
      const curr = shape.points.find(p => p.label === dotLabel)!;
      setLines(l => [...l, { x1: prev.x, y1: prev.y, x2: curr.x, y2: curr.y }]);
    }

    if (newConnected.length === shape.points.length) {
      // Close the shape
      const first = shape.points.find(p => p.label === 1)!;
      const last = shape.points.find(p => p.label === shape.points.length)!;
      setLines(l => [...l, { x1: last.x, y1: last.y, x2: first.x, y2: first.y }]);
      setCompleted(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ['#FF9F43', '#4CAF50', '#54A0FF'] });
      if (currentUser) updateUser(currentUser.id, { points: currentUser.points + 25 });
    }
  };

  const reset = () => { setConnectedDots([]); setLines([]); setCompleted(false); };

  if (!selectedShape) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-black text-[#2D3436] dark:text-white text-center">اِخْتَرِ الشَّكْلَ لِلرَّسْمِ</h3>
        <div className="grid grid-cols-2 gap-3">
          {SHAPES.map((shape, i) => (
            <motion.button key={shape.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-[#222] border-2 border-[#E5E5E5] dark:border-[#333] hover:border-[#54A0FF] rounded-2xl p-4 text-center space-y-2 cursor-pointer transition-all"
              onClick={() => { setSelectedShape(shape); reset(); }}
            >
              <div className="text-3xl">{shape.id === 'star' ? '⭐' : shape.id === 'house' ? '🏠' : shape.id === 'moon' ? '🌙' : shape.id === 'fish' ? '🐟' : shape.id === 'flower' ? '🌸' : '🐪'}</div>
              <p className="font-black text-[#2D3436] dark:text-white">{shape.nameAr}</p>
              <Badge className={`text-[10px] ${shape.level === 'beginner' ? 'bg-[#4CAF50]' : shape.level === 'intermediate' ? 'bg-[#FF9F43]' : shape.level === 'advanced' ? 'bg-[#54A0FF]' : 'bg-[#FF6B6B]'} text-white`}>
                {shape.level === 'beginner' ? 'تَمْهِيدِيّ' : shape.level === 'intermediate' ? 'مُبْتَدِئ' : shape.level === 'advanced' ? 'مُتَوَسِّط' : 'مُتَقَدِّم'}
              </Badge>
            </motion.button>
          ))}
        </div>
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
          <p className="font-black dark:text-white">{shape.nameAr}</p>
          <p className="text-xs text-[#636E72]">{connectedDots.length} / {shape.points.length}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={reset} className="dark:text-white"><RefreshCw className="w-4 h-4" /></Button>
      </div>

      <div className="h-2 bg-[#F0F0F0] dark:bg-[#333] rounded-full overflow-hidden">
        <motion.div className="h-full bg-[#54A0FF]" animate={{ width: `${progress}%` }} />
      </div>

      {!completed && (
        <p className="text-center text-sm text-[#636E72] dark:text-[#A0A0A0] font-medium">
          انْقُرْ عَلَى النُّقْطَةِ رَقْمُ <span className="text-[#54A0FF] font-black text-lg">{connectedDots.length + 1}</span>
        </p>
      )}

      <div className="bg-white dark:bg-[#222] border-2 border-[#E5E5E5] dark:border-[#333] rounded-3xl overflow-hidden">
        <svg viewBox={shape.viewBox} className="w-full" style={{ touchAction: 'none' }}>
          {/* Lines */}
          {lines.map((line, i) => (
            <motion.line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
              stroke="#54A0FF" strokeWidth="2.5" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }}
            />
          ))}

          {/* Dots */}
          {shape.points.map((dot) => {
            const isConnected = connectedDots.includes(dot.label);
            const isNext = dot.label === connectedDots.length + 1;
            return (
              <g key={dot.label} onClick={() => handleDotClick(dot.label)} style={{ cursor: isNext && !completed ? 'pointer' : 'default' }}>
                <circle cx={dot.x} cy={dot.y} r={isNext ? 10 : 7}
                  fill={isConnected ? '#54A0FF' : isNext ? '#FF9F43' : '#E5E5E5'}
                  stroke={isNext ? '#FF7800' : '#B2BEC3'} strokeWidth="1.5"
                />
                {isNext && !completed && (
                  <motion.circle cx={dot.x} cy={dot.y} r="13"
                    fill="none" stroke="#FF9F43" strokeWidth="2"
                    animate={{ r: [10, 15, 10] }} transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
                <text x={dot.x} y={dot.y + 1} textAnchor="middle" dominantBaseline="middle"
                  fontSize="7" fontWeight="bold" fill={isConnected ? 'white' : '#636E72'}
                >
                  {dot.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <AnimatePresence>
        {completed && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-r from-[#4CAF50] to-[#2e7d32] rounded-3xl p-6 text-white text-center space-y-3">
            <Trophy className="w-12 h-12 mx-auto text-yellow-300" />
            <p className="text-2xl font-black">أَحْسَنْتَ! رَسَمْتَ {shape.nameAr}!</p>
            <p className="opacity-90">+25 نُقْطَةً</p>
            <div className="flex gap-3">
              <Button className="flex-1 bg-white/20 hover:bg-white/30 rounded-xl" onClick={reset}>إِعَادَةٌ</Button>
              <Button className="flex-1 bg-white/20 hover:bg-white/30 rounded-xl" onClick={() => { setSelectedShape(null); reset(); }}>شَكْلٌ آخَرُ</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
