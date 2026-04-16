import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Trophy, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '../store/useStore';
import { CustomColoringImage } from '../types';
import confetti from 'canvas-confetti';

const COLORS = [
  '#FF6B6B', '#FF9F43', '#FFD700', '#4CAF50', '#54A0FF', '#A29BFE',
  '#FD79A8', '#00B894', '#6C5CE7', '#E17055', '#74B9FF', '#55EFC4',
  '#2D3436', '#636E72', '#FFFFFF', '#B2BEC3',
];

interface ColorRegion {
  id: string;
  path: string;
  defaultFill: string;
  label?: string;
}

interface ColoringShape {
  id: string;
  nameAr: string;
  emoji: string;
  viewBox: string;
  regions: ColorRegion[];
  svgContent?: string;   // raw SVG markup for inline rendering (custom uploads)
  regionCount?: number;  // total path count for custom SVGs
}

const COLORING_SHAPES: ColoringShape[] = [
  {
    id: 'sun', nameAr: 'الشَّمْسُ', emoji: '☀️', viewBox: '0 0 200 200',
    regions: [
      { id: 'sun_center', path: 'M100,60 A40,40 0 1,1 99.9,60Z', defaultFill: '#FFE08A', label: 'قُرْصُ الشَّمْسِ' },
      { id: 'ray1', path: 'M100,10 L107,40 L93,40 Z', defaultFill: '#FFD700' },
      { id: 'ray2', path: 'M150,30 L135,54 L124,43 Z', defaultFill: '#FFD700' },
      { id: 'ray3', path: 'M175,80 L148,88 L148,72 Z', defaultFill: '#FFD700' },
      { id: 'ray4', path: 'M165,135 L140,120 L148,108 Z', defaultFill: '#FFD700' },
      { id: 'ray5', path: 'M120,170 L113,142 L127,142 Z', defaultFill: '#FFD700' },
      { id: 'ray6', path: 'M75,170 L80,142 L93,142 Z', defaultFill: '#FFD700' },
      { id: 'ray7', path: 'M35,135 L57,119 L63,131 Z', defaultFill: '#FFD700' },
      { id: 'ray8', path: 'M25,80 L52,72 L52,88 Z', defaultFill: '#FFD700' },
      { id: 'ray9', path: 'M50,30 L70,52 L60,63 Z', defaultFill: '#FFD700' },
    ]
  },
  {
    id: 'flower', nameAr: 'الزَّهْرَةُ', emoji: '🌸', viewBox: '0 0 220 230',
    regions: [
      { id: 'petal1', path: 'M110,100 Q125,78 110,55 Q95,78 110,100 Z', defaultFill: '#FFB7C5' },
      { id: 'petal2', path: 'M110,100 Q138,102 149,78 Q122,76 110,100 Z', defaultFill: '#FF8FA3' },
      { id: 'petal3', path: 'M110,100 Q122,124 149,123 Q138,98 110,100 Z', defaultFill: '#FFB7C5' },
      { id: 'petal4', path: 'M110,100 Q95,123 110,145 Q125,123 110,100 Z', defaultFill: '#FF8FA3' },
      { id: 'petal5', path: 'M110,100 Q82,98 71,123 Q98,124 110,100 Z', defaultFill: '#FFB7C5' },
      { id: 'petal6', path: 'M110,100 Q98,76 71,78 Q82,102 110,100 Z', defaultFill: '#FF8FA3' },
      { id: 'center', path: 'M92,100 A18,18 0 0,1 128,100 A18,18 0 0,1 92,100 Z', defaultFill: '#FFE08A', label: 'مَرْكَزُ الزَّهْرَةِ' },
      { id: 'stem', path: 'M107,140 L113,140 L115,212 L105,212 Z', defaultFill: '#4CAF50' },
      { id: 'leaf1', path: 'M107,170 C90,158 72,162 68,177 C84,183 100,173 107,170 Z', defaultFill: '#81C784' },
      { id: 'leaf2', path: 'M113,182 C130,170 148,174 152,189 C136,195 120,185 113,182 Z', defaultFill: '#4CAF50' },
    ]
  },
  {
    id: 'mosque', nameAr: 'الْمَسْجِدُ', emoji: '🕌', viewBox: '0 0 220 200',
    regions: [
      { id: 'dome', path: 'M110,30 A50,50 0 0,1 160,80 L60,80 A50,50 0 0,1 110,30Z', defaultFill: '#54A0FF', label: 'الْقُبَّةُ' },
      { id: 'main', path: 'M50,80 L170,80 L170,170 L50,170 Z', defaultFill: '#E8F5E9', label: 'جِسْمُ الْمَسْجِدِ' },
      { id: 'door', path: 'M95,140 L125,140 L125,170 L95,170 Z M110,140 A15,20 0 0,1 125,140', defaultFill: '#A29BFE' },
      { id: 'window1', path: 'M65,100 L85,100 L85,125 L65,125 Z M75,100 A10,12 0 0,1 85,100', defaultFill: '#74B9FF' },
      { id: 'window2', path: 'M135,100 L155,100 L155,125 L135,125 Z M145,100 A10,12 0 0,1 155,100', defaultFill: '#74B9FF' },
      { id: 'minaret1', path: 'M35,70 L50,70 L50,170 L35,170 Z', defaultFill: '#B2BEC3' },
      { id: 'minaret1_top', path: 'M42,50 L35,70 L50,70 Z', defaultFill: '#54A0FF' },
      { id: 'minaret2', path: 'M170,70 L185,70 L185,170 L170,170 Z', defaultFill: '#B2BEC3' },
      { id: 'minaret2_top', path: 'M177,50 L170,70 L185,70 Z', defaultFill: '#54A0FF' },
      { id: 'ground', path: 'M20,170 L200,170 L200,185 L20,185 Z', defaultFill: '#A5D6A7' },
    ]
  },
  {
    id: 'butterfly', nameAr: 'الْفَرَاشَةُ', emoji: '🦋', viewBox: '0 0 220 180',
    regions: [
      { id: 'body', path: 'M108,40 C112,70 112,120 108,155 C105,150 105,50 108,40Z', defaultFill: '#4A4A4A' },
      { id: 'wing_tl', path: 'M108,70 C95,50 60,35 40,55 C25,75 35,110 60,115 C80,118 100,100 108,90Z', defaultFill: '#FF9F43' },
      { id: 'wing_tr', path: 'M110,70 C123,50 158,35 178,55 C193,75 183,110 158,115 C138,118 118,100 110,90Z', defaultFill: '#FF6B6B' },
      { id: 'wing_bl', path: 'M108,100 C90,100 60,115 50,135 C45,150 58,165 75,155 C92,148 105,128 108,115Z', defaultFill: '#FFD700' },
      { id: 'wing_br', path: 'M110,100 C128,100 158,115 168,135 C173,150 160,165 143,155 C126,148 113,128 110,115Z', defaultFill: '#A29BFE' },
    ]
  },
  {
    id: 'tree', nameAr: 'شَجَرَةٌ', emoji: '🌳', viewBox: '0 0 200 220',
    regions: [
      { id: 'trunk', path: 'M90,160 L110,160 L110,200 L90,200 Z', defaultFill: '#8D6E63' },
      { id: 'foliage1', path: 'M100,20 L155,100 L45,100 Z', defaultFill: '#4CAF50' },
      { id: 'foliage2', path: 'M100,55 L160,140 L40,140 Z', defaultFill: '#66BB6A' },
      { id: 'foliage3', path: 'M100,90 L162,165 L38,165 Z', defaultFill: '#81C784' },
      { id: 'fruit1', path: 'M80,75 A10,10 0 1,1 79.9,75Z', defaultFill: '#FF6B6B' },
      { id: 'fruit2', path: 'M115,85 A10,10 0 1,1 114.9,85Z', defaultFill: '#FF9F43' },
      { id: 'fruit3', path: 'M70,120 A9,9 0 1,1 69.9,120Z', defaultFill: '#FF6B6B' },
      { id: 'fruit4', path: 'M130,125 A9,9 0 1,1 129.9,125Z', defaultFill: '#FF9F43' },
    ]
  },

  {
    id: 'rocket', nameAr: 'صَارُوخٌ', emoji: '🚀', viewBox: '0 0 200 220',
    regions: [
      { id: 'body',    path: 'M100,20 C120,20 135,50 135,90 L135,150 L65,150 L65,90 C65,50 80,20 100,20Z', defaultFill: '#54A0FF', label: 'جِسْمُ الصَّارُوخِ' },
      { id: 'nose',    path: 'M100,20 L80,50 L120,50Z', defaultFill: '#FF6B6B' },
      { id: 'window',  path: 'M100,80 A18,18 0 1,1 99.9,80Z', defaultFill: '#74B9FF' },
      { id: 'fin_l',   path: 'M65,120 L30,160 L65,150Z', defaultFill: '#FF6B6B' },
      { id: 'fin_r',   path: 'M135,120 L170,160 L135,150Z', defaultFill: '#FF6B6B' },
      { id: 'exhaust', path: 'M75,150 L65,190 L100,175 L135,190 L125,150Z', defaultFill: '#FF9F43' },
      { id: 'flame1',  path: 'M85,175 L100,210 L115,175Z', defaultFill: '#FFD700' },
      { id: 'stars1',  path: 'M30,40 L33,32 L36,40 L44,40 L38,45 L40,53 L33,48 L26,53 L28,45 L22,40Z', defaultFill: '#FFD700' },
      { id: 'stars2',  path: 'M165,70 L168,62 L171,70 L179,70 L173,75 L175,83 L168,78 L161,83 L163,75 L157,70Z', defaultFill: '#FFD700' },
    ]
  },
  {
    id: 'castle', nameAr: 'قَلْعَةٌ', emoji: '🏰', viewBox: '0 0 220 200',
    regions: [
      { id: 'base',     path: 'M30,80 L190,80 L190,185 L30,185Z', defaultFill: '#B2BEC3', label: 'الْجِدَارُ' },
      { id: 'tower_l',  path: 'M25,40 L75,40 L75,80 L25,80Z', defaultFill: '#636E72' },
      { id: 'tower_r',  path: 'M145,40 L195,40 L195,80 L145,80Z', defaultFill: '#636E72' },
      { id: 'tower_m',  path: 'M80,20 L140,20 L140,80 L80,80Z', defaultFill: '#74B9FF' },
      { id: 'merlon_l1',path: 'M25,25 L40,25 L40,40 L25,40Z', defaultFill: '#636E72' },
      { id: 'merlon_l2',path: 'M55,25 L70,25 L70,40 L55,40Z', defaultFill: '#636E72' },
      { id: 'merlon_r1',path: 'M145,25 L160,25 L160,40 L145,40Z', defaultFill: '#636E72' },
      { id: 'merlon_r2',path: 'M175,25 L190,25 L190,40 L175,40Z', defaultFill: '#636E72' },
      { id: 'merlon_m1',path: 'M80,5 L97,5 L97,20 L80,20Z', defaultFill: '#74B9FF' },
      { id: 'merlon_m2',path: 'M112,5 L130,5 L130,20 L112,20Z', defaultFill: '#74B9FF' },
      { id: 'gate',     path: 'M90,130 L130,130 L130,185 L90,185Z M110,130 A20,25 0 0,1 130,130', defaultFill: '#2D3436' },
      { id: 'window_l', path: 'M42,55 L62,55 L62,70 L42,70Z M52,55 A10,8 0 0,1 62,55', defaultFill: '#74B9FF' },
      { id: 'window_r', path: 'M155,55 L175,55 L175,70 L155,70Z M165,55 A10,8 0 0,1 175,55', defaultFill: '#74B9FF' },
      { id: 'flag_m',   path: 'M110,5 L130,12 L110,20Z', defaultFill: '#FF6B6B' },
      { id: 'ground',   path: 'M10,185 L210,185 L210,200 L10,200Z', defaultFill: '#55EFC4' },
    ]
  },
  {
    id: 'boat', nameAr: 'قَارِبٌ', emoji: '⛵', viewBox: '0 0 220 200',
    regions: [
      { id: 'hull', path: 'M20,140 L200,140 L180,175 L40,175 Z', defaultFill: '#8D6E63', label: 'هَيْكَلُ الْقَارِبِ' },
      { id: 'sail1', path: 'M110,30 L110,135 L45,135 Z', defaultFill: '#FFFFFF' },
      { id: 'sail2', path: 'M115,50 L115,135 L175,135 Z', defaultFill: '#FF6B6B' },
      { id: 'mast', path: 'M108,20 L113,20 L113,140 L108,140 Z', defaultFill: '#4A4A4A' },
      { id: 'water1', path: 'M10,175 Q55,165 100,175 Q145,185 190,175 L200,185 Q155,195 100,185 Q50,175 10,185 Z', defaultFill: '#54A0FF' },
      { id: 'water2', path: 'M5,185 Q55,178 100,188 Q150,198 200,185 L215,195 Q160,205 100,198 Q45,190 0,198 Z', defaultFill: '#2980B9' },
    ]
  },
];

function customToShape(img: CustomColoringImage): ColoringShape {
  return {
    id: img.id, nameAr: img.nameAr, emoji: '🖼️', viewBox: img.viewBox,
    regions: img.regions,
    svgContent: img.svgContent,
    regionCount: img.regionCount,
  };
}

export default function ColoringActivity() {
  const { currentUser, updateUser } = useStore();
  const customColoringImages = useStore(s => s.customColoringImages);
  const [selectedShape, setSelectedShape] = useState<ColoringShape | null>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [filledRegions, setFilledRegions] = useState<Record<string, string>>({});
  const [coloredCount, setColoredCount] = useState(0);
  const selectedColorRef = useRef(COLORS[0]);
  const filledRegionsRef = useRef<Record<string, string>>({});
  const coloredCountRef = useRef(0);

  // Keep refs in sync so the inline SVG click handler always reads fresh values
  selectedColorRef.current = selectedColor;
  filledRegionsRef.current = filledRegions;
  coloredCountRef.current = coloredCount;

  const getTotalRegions = (shape: ColoringShape) =>
    shape.svgContent ? (shape.regionCount || 1) : shape.regions.length;

  const triggerCompletion = (user: typeof currentUser) => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    if (user) updateUser(user.id, { points: user.points + 20 });
  };

  const fillRegion = (regionId: string) => {
    const wasNew = !filledRegions[regionId];
    setFilledRegions(prev => ({ ...prev, [regionId]: selectedColor }));
    if (wasNew) {
      const newCount = coloredCount + 1;
      setColoredCount(newCount);
      if (selectedShape && newCount >= getTotalRegions(selectedShape)) {
        triggerCompletion(currentUser);
      }
    }
  };

  // Click handler for inline SVG (event delegation, reads from refs for freshness)
  const inlineSvgRef = useRef<HTMLDivElement>(null);
  const handleInlineSvgClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as SVGElement;
    const regionId = target.getAttribute('data-region-id');
    if (!regionId) return;
    const color = selectedColorRef.current;
    // Directly update DOM fill for instant feedback
    target.setAttribute('fill', color);
    const wasNew = !filledRegionsRef.current[regionId];
    filledRegionsRef.current = { ...filledRegionsRef.current, [regionId]: color };
    setFilledRegions({ ...filledRegionsRef.current });
    if (wasNew) {
      const newCount = coloredCountRef.current + 1;
      coloredCountRef.current = newCount;
      setColoredCount(newCount);
      if (selectedShape && newCount >= getTotalRegions(selectedShape)) {
        triggerCompletion(currentUser);
      }
    }
  }, [selectedShape, currentUser]);

  const reset = () => {
    // For inline SVGs, reset DOM fills directly
    if (inlineSvgRef.current) {
      inlineSvgRef.current.querySelectorAll('[data-region-id]').forEach(el => {
        (el as SVGElement).removeAttribute('fill');
      });
    }
    setFilledRegions({});
    setColoredCount(0);
    filledRegionsRef.current = {};
    coloredCountRef.current = 0;
  };

  if (!selectedShape) {
    const allShapes: ColoringShape[] = [
      ...COLORING_SHAPES,
      ...customColoringImages.map(customToShape),
    ];
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-black text-[#2D3436] dark:text-white text-center">اِخْتَرِ الصُّورَةَ لِلتَّلْوِينِ</h3>
        <div className="grid grid-cols-2 gap-3">
          {allShapes.map((shape, i) => {
            const isCustom = customColoringImages.some(c => c.id === shape.id);
            return (
              <motion.button key={shape.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-[#222] border-2 border-[#E5E5E5] dark:border-[#333] hover:border-[#A29BFE] rounded-2xl p-4 text-center cursor-pointer transition-all relative"
                onClick={() => { setSelectedShape(shape); reset(); }}
              >
                {isCustom && (
                  <span className="absolute top-1 right-1 text-[9px] bg-[#A29BFE] text-white rounded-full px-1.5 py-0.5 font-bold">مُخَصَّصٌ</span>
                )}
                <div className="text-4xl mb-2">{shape.emoji}</div>
                <p className="font-black text-[#2D3436] dark:text-white text-sm">{shape.nameAr}</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  const totalRegions = getTotalRegions(selectedShape);
  const allColored = coloredCount >= totalRegions;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => { setSelectedShape(null); reset(); }} className="dark:text-white flex items-center gap-1">
          <span className="text-lg">←</span> الْعَوْدَةُ
        </Button>
        <p className="font-black dark:text-white">{selectedShape.nameAr} {selectedShape.emoji}</p>
        <Button variant="ghost" size="icon" onClick={reset}><RefreshCw className="w-4 h-4 dark:text-white" /></Button>
      </div>

      {/* Color palette */}
      <div className="bg-white dark:bg-[#222] rounded-2xl border-2 border-[#E5E5E5] dark:border-[#333] p-3">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4 text-[#636E72]" />
          <span className="text-xs text-[#636E72] font-medium">اِخْتَرِ اللَّوْنَ</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(color => (
            <button key={color} onClick={() => setSelectedColor(color)}
              className="rounded-full transition-transform"
              style={{ width: 28, height: 28, backgroundColor: color, border: selectedColor === color ? '3px solid #4A4A4A' : '2px solid #B2BEC3', transform: selectedColor === color ? 'scale(1.25)' : 'scale(1)' }}
            />
          ))}
        </div>
        <p className="text-xs text-center mt-2 text-[#636E72]">
          مُلَوَّنٌ {coloredCount} / {totalRegions}
        </p>
      </div>

      {/* SVG canvas */}
      <div className="bg-white dark:bg-[#F8F8F8] border-2 border-[#E5E5E5] rounded-3xl overflow-hidden">
        {selectedShape.svgContent ? (
          /* Inline SVG for custom uploaded images — preserves group transforms (Potrace etc.) */
          <div
            ref={inlineSvgRef}
            onClick={handleInlineSvgClick}
            className="w-full"
            style={{ touchAction: 'none', lineHeight: 0 }}
            dangerouslySetInnerHTML={{ __html: selectedShape.svgContent }}
          />
        ) : (
          /* Path-based SVG for built-in coloring shapes */
          <svg viewBox={selectedShape.viewBox} className="w-full" style={{ touchAction: 'none' }}>
            {selectedShape.regions.map(region => (
              <path key={region.id} d={region.path}
                fill={filledRegions[region.id] || region.defaultFill}
                stroke="#4A4A4A" strokeWidth="1.5" strokeLinejoin="round"
                onClick={() => fillRegion(region.id)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
              />
            ))}
          </svg>
        )}
      </div>

      {allColored && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#A29BFE] to-[#6C5CE7] rounded-3xl p-5 text-white text-center space-y-2">
          <Trophy className="w-10 h-10 mx-auto text-yellow-300" />
          <p className="text-xl font-black">لَوَّنْتَ {selectedShape.nameAr} بِشَكْلٍ رَائِعٍ! +20 نُقْطَةً</p>
          <div className="flex gap-3">
            <Button className="flex-1 bg-white/20 hover:bg-white/30 rounded-xl" onClick={reset}>إِعَادَةُ التَّلْوِينِ</Button>
            <Button className="flex-1 bg-white/20 hover:bg-white/30 rounded-xl" onClick={() => setSelectedShape(null)}>صُورَةٌ أُخْرَى</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
