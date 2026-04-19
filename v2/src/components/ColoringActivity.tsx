import { useState, useRef, useCallback, useEffect } from 'react';
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
  svgContent?: string;
  regionCount?: number;
}

const COLORING_SHAPES: ColoringShape[] = [
  {
    id: 'sun', nameAr: 'الشَّمْسُ', emoji: '☀️', viewBox: '0 0 200 200',
    regions: [
      { id: 'sun_center', path: 'M100,60 A40,40 0 1,1 99.9,60Z', defaultFill: '#FFFFFF', label: 'قُرْصُ الشَّمْسِ' },
      { id: 'ray1', path: 'M100,10 L107,40 L93,40 Z', defaultFill: '#FFFFFF' },
      { id: 'ray2', path: 'M150,30 L135,54 L124,43 Z', defaultFill: '#FFFFFF' },
      { id: 'ray3', path: 'M175,80 L148,88 L148,72 Z', defaultFill: '#FFFFFF' },
      { id: 'ray4', path: 'M165,135 L140,120 L148,108 Z', defaultFill: '#FFFFFF' },
      { id: 'ray5', path: 'M120,170 L113,142 L127,142 Z', defaultFill: '#FFFFFF' },
      { id: 'ray6', path: 'M75,170 L80,142 L93,142 Z', defaultFill: '#FFFFFF' },
      { id: 'ray7', path: 'M35,135 L57,119 L63,131 Z', defaultFill: '#FFFFFF' },
      { id: 'ray8', path: 'M25,80 L52,72 L52,88 Z', defaultFill: '#FFFFFF' },
      { id: 'ray9', path: 'M50,30 L70,52 L60,63 Z', defaultFill: '#FFFFFF' },
    ]
  },
  {
    id: 'flower', nameAr: 'الزَّهْرَةُ', emoji: '🌸', viewBox: '0 0 220 230',
    regions: [
      { id: 'petal1', path: 'M110,110 C92,90 92,62 110,62 C128,62 128,90 110,110 Z', defaultFill: '#FFFFFF' },
      { id: 'petal2', path: 'M110,110 C130,90 155,96 152,114 C148,132 122,128 110,110 Z', defaultFill: '#FFFFFF' },
      { id: 'petal3', path: 'M110,110 C130,130 136,155 118,158 C100,162 96,136 110,110 Z', defaultFill: '#FFFFFF' },
      { id: 'petal4', path: 'M110,110 C92,130 92,158 110,158 C128,158 128,130 110,110 Z', defaultFill: '#FFFFFF' },
      { id: 'petal5', path: 'M110,110 C90,130 65,124 68,106 C72,88 98,92 110,110 Z', defaultFill: '#FFFFFF' },
      { id: 'petal6', path: 'M110,110 C90,90 84,65 102,62 C120,58 124,84 110,110 Z', defaultFill: '#FFFFFF' },
      { id: 'center', path: 'M90,110 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0 Z', defaultFill: '#FFFFFF', label: 'مَرْكَزُ الزَّهْرَةِ' },
      { id: 'stem', path: 'M106,152 L114,152 L116,218 L104,218 Z', defaultFill: '#FFFFFF' },
      { id: 'leaf1', path: 'M106,178 C88,165 68,170 65,186 C82,192 100,182 106,178 Z', defaultFill: '#FFFFFF' },
      { id: 'leaf2', path: 'M114,193 C132,180 152,185 155,201 C138,207 120,197 114,193 Z', defaultFill: '#FFFFFF' },
    ]
  },
  {
    id: 'mosque', nameAr: 'الْمَسْجِدُ', emoji: '🕌', viewBox: '0 0 220 200',
    regions: [
      { id: 'dome', path: 'M110,30 A50,50 0 0,1 160,80 L60,80 A50,50 0 0,1 110,30Z', defaultFill: '#FFFFFF', label: 'الْقُبَّةُ' },
      { id: 'main', path: 'M50,80 L170,80 L170,170 L50,170 Z', defaultFill: '#FFFFFF', label: 'جِسْمُ الْمَسْجِدِ' },
      { id: 'door', path: 'M95,140 L125,140 L125,170 L95,170 Z M110,140 A15,20 0 0,1 125,140', defaultFill: '#FFFFFF' },
      { id: 'window1', path: 'M65,100 L85,100 L85,125 L65,125 Z M75,100 A10,12 0 0,1 85,100', defaultFill: '#FFFFFF' },
      { id: 'window2', path: 'M135,100 L155,100 L155,125 L135,125 Z M145,100 A10,12 0 0,1 155,100', defaultFill: '#FFFFFF' },
      { id: 'minaret1', path: 'M35,70 L50,70 L50,170 L35,170 Z', defaultFill: '#FFFFFF' },
      { id: 'minaret1_top', path: 'M42,50 L35,70 L50,70 Z', defaultFill: '#FFFFFF' },
      { id: 'minaret2', path: 'M170,70 L185,70 L185,170 L170,170 Z', defaultFill: '#FFFFFF' },
      { id: 'minaret2_top', path: 'M177,50 L170,70 L185,70 Z', defaultFill: '#FFFFFF' },
      { id: 'ground', path: 'M20,170 L200,170 L200,185 L20,185 Z', defaultFill: '#FFFFFF' },
    ]
  },
  {
    id: 'butterfly', nameAr: 'الْفَرَاشَةُ', emoji: '🦋', viewBox: '0 0 220 180',
    regions: [
      { id: 'body', path: 'M108,40 C112,70 112,120 108,155 C105,150 105,50 108,40Z', defaultFill: '#FFFFFF' },
      { id: 'wing_tl', path: 'M108,70 C95,50 60,35 40,55 C25,75 35,110 60,115 C80,118 100,100 108,90Z', defaultFill: '#FFFFFF' },
      { id: 'wing_tr', path: 'M110,70 C123,50 158,35 178,55 C193,75 183,110 158,115 C138,118 118,100 110,90Z', defaultFill: '#FFFFFF' },
      { id: 'wing_bl', path: 'M108,100 C90,100 60,115 50,135 C45,150 58,165 75,155 C92,148 105,128 108,115Z', defaultFill: '#FFFFFF' },
      { id: 'wing_br', path: 'M110,100 C128,100 158,115 168,135 C173,150 160,165 143,155 C126,148 113,128 110,115Z', defaultFill: '#FFFFFF' },
    ]
  },
  {
    id: 'tree', nameAr: 'شَجَرَةٌ', emoji: '🌳', viewBox: '0 0 200 220',
    regions: [
      { id: 'trunk', path: 'M90,160 L110,160 L110,200 L90,200 Z', defaultFill: '#FFFFFF' },
      { id: 'foliage1', path: 'M100,20 L155,100 L45,100 Z', defaultFill: '#FFFFFF' },
      { id: 'foliage2', path: 'M100,55 L160,140 L40,140 Z', defaultFill: '#FFFFFF' },
      { id: 'foliage3', path: 'M100,90 L162,165 L38,165 Z', defaultFill: '#FFFFFF' },
      { id: 'fruit1', path: 'M80,75 A10,10 0 1,1 79.9,75Z', defaultFill: '#FFFFFF' },
      { id: 'fruit2', path: 'M115,85 A10,10 0 1,1 114.9,85Z', defaultFill: '#FFFFFF' },
      { id: 'fruit3', path: 'M70,120 A9,9 0 1,1 69.9,120Z', defaultFill: '#FFFFFF' },
      { id: 'fruit4', path: 'M130,125 A9,9 0 1,1 129.9,125Z', defaultFill: '#FFFFFF' },
    ]
  },
  {
    id: 'rocket', nameAr: 'صَارُوخٌ', emoji: '🚀', viewBox: '0 0 200 220',
    regions: [
      { id: 'body',    path: 'M100,20 C120,20 135,50 135,90 L135,150 L65,150 L65,90 C65,50 80,20 100,20Z', defaultFill: '#FFFFFF', label: 'جِسْمُ الصَّارُوخِ' },
      { id: 'nose',    path: 'M100,20 L80,50 L120,50Z', defaultFill: '#FFFFFF' },
      { id: 'window',  path: 'M100,80 A18,18 0 1,1 99.9,80Z', defaultFill: '#FFFFFF' },
      { id: 'fin_l',   path: 'M65,120 L30,160 L65,150Z', defaultFill: '#FFFFFF' },
      { id: 'fin_r',   path: 'M135,120 L170,160 L135,150Z', defaultFill: '#FFFFFF' },
      { id: 'exhaust', path: 'M75,150 L65,190 L100,175 L135,190 L125,150Z', defaultFill: '#FFFFFF' },
      { id: 'flame1',  path: 'M85,175 L100,210 L115,175Z', defaultFill: '#FFFFFF' },
      { id: 'stars1',  path: 'M30,40 L33,32 L36,40 L44,40 L38,45 L40,53 L33,48 L26,53 L28,45 L22,40Z', defaultFill: '#FFFFFF' },
      { id: 'stars2',  path: 'M165,70 L168,62 L171,70 L179,70 L173,75 L175,83 L168,78 L161,83 L163,75 L157,70Z', defaultFill: '#FFFFFF' },
    ]
  },
  {
    id: 'castle', nameAr: 'قَلْعَةٌ', emoji: '🏰', viewBox: '0 0 220 200',
    regions: [
      { id: 'base',     path: 'M30,80 L190,80 L190,185 L30,185Z', defaultFill: '#FFFFFF', label: 'الْجِدَارُ' },
      { id: 'tower_l',  path: 'M25,40 L75,40 L75,80 L25,80Z', defaultFill: '#FFFFFF' },
      { id: 'tower_r',  path: 'M145,40 L195,40 L195,80 L145,80Z', defaultFill: '#FFFFFF' },
      { id: 'tower_m',  path: 'M80,20 L140,20 L140,80 L80,80Z', defaultFill: '#FFFFFF' },
      { id: 'merlon_l1',path: 'M25,25 L40,25 L40,40 L25,40Z', defaultFill: '#FFFFFF' },
      { id: 'merlon_l2',path: 'M55,25 L70,25 L70,40 L55,40Z', defaultFill: '#FFFFFF' },
      { id: 'merlon_r1',path: 'M145,25 L160,25 L160,40 L145,40Z', defaultFill: '#FFFFFF' },
      { id: 'merlon_r2',path: 'M175,25 L190,25 L190,40 L175,40Z', defaultFill: '#FFFFFF' },
      { id: 'merlon_m1',path: 'M80,5 L97,5 L97,20 L80,20Z', defaultFill: '#FFFFFF' },
      { id: 'merlon_m2',path: 'M112,5 L130,5 L130,20 L112,20Z', defaultFill: '#FFFFFF' },
      { id: 'gate',     path: 'M90,130 L130,130 L130,185 L90,185Z M110,130 A20,25 0 0,1 130,130', defaultFill: '#FFFFFF' },
      { id: 'window_l', path: 'M42,55 L62,55 L62,70 L42,70Z M52,55 A10,8 0 0,1 62,55', defaultFill: '#FFFFFF' },
      { id: 'window_r', path: 'M155,55 L175,55 L175,70 L155,70Z M165,55 A10,8 0 0,1 175,55', defaultFill: '#FFFFFF' },
      { id: 'flag_m',   path: 'M110,5 L130,12 L110,20Z', defaultFill: '#FFFFFF' },
      { id: 'ground',   path: 'M10,185 L210,185 L210,200 L10,200Z', defaultFill: '#FFFFFF' },
    ]
  },
  {
    id: 'boat', nameAr: 'قَارِبٌ', emoji: '⛵', viewBox: '0 0 220 200',
    regions: [
      { id: 'hull', path: 'M20,140 L200,140 L180,175 L40,175 Z', defaultFill: '#FFFFFF', label: 'هَيْكَلُ الْقَارِبِ' },
      { id: 'sail1', path: 'M110,30 L110,135 L45,135 Z', defaultFill: '#FFFFFF' },
      { id: 'sail2', path: 'M115,50 L115,135 L175,135 Z', defaultFill: '#FFFFFF' },
      { id: 'mast', path: 'M108,20 L113,20 L113,140 L108,140 Z', defaultFill: '#FFFFFF' },
      { id: 'water1', path: 'M10,175 Q55,165 100,175 Q145,185 190,175 L200,185 Q155,195 100,185 Q50,175 10,185 Z', defaultFill: '#FFFFFF' },
      { id: 'water2', path: 'M5,185 Q55,178 100,188 Q150,198 200,185 L215,195 Q160,205 100,198 Q45,190 0,198 Z', defaultFill: '#FFFFFF' },
    ]
  },

  // ── أشكال جديدة ──
  {
    id: 'lion', nameAr: 'أَسَدٌ', emoji: '🦁', viewBox: '0 0 220 200',
    regions: [
      { id: 'mane',  path: 'M40,85 a70,70 0 1,0 140,0 a70,70 0 1,0 -140,0 Z', defaultFill: '#FFFFFF', label: 'لَبْدَةُ الْأَسَدِ' },
      { id: 'face',  path: 'M62,82 a48,48 0 1,0 96,0 a48,48 0 1,0 -96,0 Z', defaultFill: '#FFFFFF', label: 'وَجْهُ الْأَسَدِ' },
      { id: 'eye_l', path: 'M82,68 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 Z', defaultFill: '#FFFFFF' },
      { id: 'eye_r', path: 'M122,68 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 Z', defaultFill: '#FFFFFF' },
      { id: 'nose',  path: 'M103,88 L117,88 L110,98 Z', defaultFill: '#FFFFFF' },
      { id: 'mouth', path: 'M97,108 Q110,120 123,108', defaultFill: '#FFFFFF' },
      { id: 'body',  path: 'M70,148 Q74,128 110,124 Q146,128 150,148 L150,194 L70,194 Z', defaultFill: '#FFFFFF', label: 'جِسْمُ الْأَسَدِ' },
      { id: 'leg_l', path: 'M77,173 L92,173 L92,200 L77,200 Z', defaultFill: '#FFFFFF' },
      { id: 'leg_r', path: 'M128,173 L143,173 L143,200 L128,200 Z', defaultFill: '#FFFFFF' },
      { id: 'tail',  path: 'M150,152 C180,130 192,116 185,103 C178,116 170,130 158,150 Z', defaultFill: '#FFFFFF' },
    ]
  },
  {
    id: 'bird', nameAr: 'طَائِرٌ', emoji: '🐦', viewBox: '0 0 220 180',
    regions: [
      { id: 'body',    path: 'M55,90 Q60,55 90,45 Q130,38 160,55 Q185,72 180,105 Q172,135 140,148 Q110,158 80,148 Q55,135 55,90Z', defaultFill: '#FFFFFF', label: 'جِسْمُ الطَّائِرِ' },
      { id: 'wing_l',  path: 'M55,90 Q28,75 18,55 Q15,38 30,35 Q48,35 70,60 Z', defaultFill: '#FFFFFF', label: 'الْجَنَاحُ الْأَيْسَرُ' },
      { id: 'wing_r',  path: 'M180,90 Q205,72 215,52 Q218,35 202,32 Q185,32 162,58 Z', defaultFill: '#FFFFFF', label: 'الْجَنَاحُ الْأَيْمَنُ' },
      { id: 'head',    path: 'M90,45 Q100,18 120,15 Q140,12 148,30 Q152,48 130,58 Q108,62 90,45Z', defaultFill: '#FFFFFF', label: 'رَأْسُ الطَّائِرِ' },
      { id: 'beak',    path: 'M148,30 L168,36 L148,44 Z', defaultFill: '#FFFFFF', label: 'الْمِنْقَارُ' },
      { id: 'eye',     path: 'M122,32 A6,6 0 1,1 121.9,32Z', defaultFill: '#FFFFFF' },
      { id: 'tail_f',  path: 'M80,148 Q65,165 45,172 Q55,155 62,140 Z', defaultFill: '#FFFFFF' },
      { id: 'tail_b',  path: 'M80,148 Q75,168 60,178 Q72,160 78,148 Z', defaultFill: '#FFFFFF' },
      { id: 'leg_l',   path: 'M95,148 L88,168 L82,185 L90,185 L98,168 L102,148 Z', defaultFill: '#FFFFFF' },
      { id: 'leg_r',   path: 'M118,148 L112,168 L106,185 L114,185 L120,168 L125,148 Z', defaultFill: '#FFFFFF' },
    ]
  },
  {
    id: 'fish', nameAr: 'سَمَكَةٌ', emoji: '🐟', viewBox: '0 0 240 160',
    regions: [
      { id: 'body',    path: 'M40,80 Q55,42 110,35 Q168,30 200,65 Q220,82 200,100 Q168,130 110,125 Q55,118 40,80Z', defaultFill: '#FFFFFF', label: 'جِسْمُ السَّمَكَةِ' },
      { id: 'tail',    path: 'M40,80 L15,50 L8,80 L15,110 Z', defaultFill: '#FFFFFF', label: 'ذَيْلُ السَّمَكَةِ' },
      { id: 'fin_top', path: 'M100,35 Q125,15 155,30 Q135,38 110,38 Z', defaultFill: '#FFFFFF', label: 'زَعْنَفَةٌ عُلْوِيَّةٌ' },
      { id: 'fin_bot', path: 'M110,125 Q130,142 155,128 Q138,122 115,122 Z', defaultFill: '#FFFFFF', label: 'زَعْنَفَةٌ سُفْلِيَّةٌ' },
      { id: 'eye',     path: 'M188,68 A10,10 0 1,1 187.9,68Z', defaultFill: '#FFFFFF' },
      { id: 'scale1',  path: 'M130,60 A12,12 0 0,1 155,60 A12,12 0 0,1 130,60Z', defaultFill: '#FFFFFF' },
      { id: 'scale2',  path: 'M100,70 A12,12 0 0,1 125,70 A12,12 0 0,1 100,70Z', defaultFill: '#FFFFFF' },
      { id: 'scale3',  path: 'M130,90 A12,12 0 0,1 155,90 A12,12 0 0,1 130,90Z', defaultFill: '#FFFFFF' },
      { id: 'scale4',  path: 'M100,100 A12,12 0 0,1 125,100 A12,12 0 0,1 100,100Z', defaultFill: '#FFFFFF' },
    ]
  },
  {
    id: 'elephant', nameAr: 'فِيلٌ', emoji: '🐘', viewBox: '0 0 240 200',
    regions: [
      { id: 'body',   path: 'M78,118 a72,52 0 1,0 144,0 a72,52 0 1,0 -144,0 Z', defaultFill: '#FFFFFF', label: 'جِسْمُ الْفِيلِ' },
      { id: 'head',   path: 'M22,88 a50,46 0 1,0 100,0 a50,46 0 1,0 -100,0 Z', defaultFill: '#FFFFFF', label: 'رَأْسُ الْفِيلِ' },
      { id: 'trunk',  path: 'M42,128 Q24,152 32,176 Q42,196 65,188 Q56,172 48,152 Q40,132 55,124 Z', defaultFill: '#FFFFFF', label: 'خُرْطُومُ الْفِيلِ' },
      { id: 'ear',    path: 'M22,88 Q2,60 10,36 Q22,12 46,22 Q62,30 62,56 Q58,76 44,84 Z', defaultFill: '#FFFFFF', label: 'أُذُنُ الْفِيلِ' },
      { id: 'eye',    path: 'M73,70 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0 Z', defaultFill: '#FFFFFF' },
      { id: 'leg_fl', path: 'M82,168 L98,168 L98,200 L82,200 Z', defaultFill: '#FFFFFF' },
      { id: 'leg_fr', path: 'M110,168 L126,168 L126,200 L110,200 Z', defaultFill: '#FFFFFF' },
      { id: 'leg_bl', path: 'M162,168 L178,168 L178,200 L162,200 Z', defaultFill: '#FFFFFF' },
      { id: 'leg_br', path: 'M186,168 L202,168 L202,200 L186,200 Z', defaultFill: '#FFFFFF' },
      { id: 'tail',   path: 'M220,118 C234,110 236,130 228,140 C222,150 216,140 220,130 Z', defaultFill: '#FFFFFF' },
    ]
  },
  {
    id: 'car', nameAr: 'سَيَّارَةٌ', emoji: '🚗', viewBox: '0 0 240 160',
    regions: [
      { id: 'body',    path: 'M15,95 L15,130 L225,130 L225,95 Z', defaultFill: '#FFFFFF', label: 'هَيْكَلُ السَّيَّارَةِ' },
      { id: 'cabin',   path: 'M55,95 L75,55 L170,55 L190,95 Z', defaultFill: '#FFFFFF', label: 'كَابِينَةُ السَّيَّارَةِ' },
      { id: 'wind_f',  path: 'M165,58 L185,92 L165,92 L155,58 Z', defaultFill: '#FFFFFF', label: 'الزُّجَاجُ الْأَمَامِيُّ' },
      { id: 'wind_b',  path: 'M78,58 L65,92 L85,92 L95,58 Z', defaultFill: '#FFFFFF', label: 'الزُّجَاجُ الْخَلْفِيُّ' },
      { id: 'window',  path: 'M100,58 L100,92 L152,92 L152,58 Z', defaultFill: '#FFFFFF', label: 'النَّافِذَةُ الْجَانِبِيَّةُ' },
      { id: 'wheel_f', path: 'M175,130 A25,25 0 1,1 174.9,130Z', defaultFill: '#FFFFFF', label: 'الْعَجَلَةُ الْأَمَامِيَّةُ' },
      { id: 'wheel_b', path: 'M65,130 A25,25 0 1,1 64.9,130Z', defaultFill: '#FFFFFF', label: 'الْعَجَلَةُ الْخَلْفِيَّةُ' },
      { id: 'light_f', path: 'M215,100 L228,100 L228,118 L215,118 Z', defaultFill: '#FFFFFF' },
      { id: 'light_b', path: 'M12,100 L25,100 L25,118 L12,118 Z', defaultFill: '#FFFFFF' },
      { id: 'stripe',  path: 'M15,118 L225,118 L225,125 L15,125 Z', defaultFill: '#FFFFFF' },
    ]
  },
  {
    id: 'train', nameAr: 'قِطَارٌ', emoji: '🚂', viewBox: '0 0 240 170',
    regions: [
      { id: 'engine',  path: 'M130,45 L210,45 L210,138 L130,138 Z', defaultFill: '#FFFFFF', label: 'الْمَحْرَكُ' },
      { id: 'cabin1',  path: 'M45,65 L125,65 L125,138 L45,138 Z', defaultFill: '#FFFFFF', label: 'الْعَرَبَةُ الْأُولَى' },
      { id: 'cabin2',  path: 'M210,65 L232,65 L232,138 L210,138 Z', defaultFill: '#FFFFFF' },
      { id: 'win_e1',  path: 'M142,55 L170,55 L170,80 L142,80 Z', defaultFill: '#FFFFFF' },
      { id: 'win_e2',  path: 'M175,55 L200,55 L200,80 L175,80 Z', defaultFill: '#FFFFFF' },
      { id: 'win_c1',  path: 'M58,75 L85,75 L85,105 L58,105 Z', defaultFill: '#FFFFFF' },
      { id: 'win_c2',  path: 'M92,75 L118,75 L118,105 L92,105 Z', defaultFill: '#FFFFFF' },
      { id: 'door',    path: 'M80,105 L100,105 L100,138 L80,138 Z', defaultFill: '#FFFFFF' },
      { id: 'chimney', path: 'M155,30 L165,30 L165,48 L155,48 Z', defaultFill: '#FFFFFF', label: 'الْمَدْخَنَةُ' },
      { id: 'smoke',   path: 'M160,15 Q168,8 162,2 Q156,8 152,15 Q148,22 155,28 Q162,22 160,15Z', defaultFill: '#FFFFFF', label: 'الدُّخَانُ' },
      { id: 'wheel_e1',path: 'M150,138 A16,16 0 1,1 149.9,138Z', defaultFill: '#FFFFFF' },
      { id: 'wheel_e2',path: 'M192,138 A16,16 0 1,1 191.9,138Z', defaultFill: '#FFFFFF' },
      { id: 'wheel_c', path: 'M78,138 A16,16 0 1,1 77.9,138Z', defaultFill: '#FFFFFF' },
      { id: 'rail',    path: 'M10,155 L230,155 L230,162 L10,162 Z', defaultFill: '#FFFFFF', label: 'السِّكَّةُ' },
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

// ── Canvas flood-fill helpers ──

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function countColorableRegions(ref: Uint8ClampedArray, W: number, H: number): number {
  const visited = new Uint8Array(W * H);
  let count = 0;
  for (let start = 0; start < W * H; start++) {
    if (visited[start]) continue;
    const ri = start * 4;
    const lum = (ref[ri] * 0.299 + ref[ri + 1] * 0.587 + ref[ri + 2] * 0.114) / 255;
    if (lum < 0.5) { visited[start] = 1; continue; }
    let area = 0;
    const stack = [start];
    visited[start] = 1;
    while (stack.length > 0) {
      const pos = stack.pop()!;
      area++;
      const x = pos % W, y = Math.floor(pos / W);
      if (x > 0 && !visited[pos - 1]) { const ni = (pos-1)*4; if ((ref[ni]*0.299+ref[ni+1]*0.587+ref[ni+2]*0.114)/255 >= 0.5) { visited[pos-1]=1; stack.push(pos-1); } }
      if (x < W-1 && !visited[pos + 1]) { const ni = (pos+1)*4; if ((ref[ni]*0.299+ref[ni+1]*0.587+ref[ni+2]*0.114)/255 >= 0.5) { visited[pos+1]=1; stack.push(pos+1); } }
      if (y > 0 && !visited[pos - W]) { const ni = (pos-W)*4; if ((ref[ni]*0.299+ref[ni+1]*0.587+ref[ni+2]*0.114)/255 >= 0.5) { visited[pos-W]=1; stack.push(pos-W); } }
      if (y < H-1 && !visited[pos + W]) { const ni = (pos+W)*4; if ((ref[ni]*0.299+ref[ni+1]*0.587+ref[ni+2]*0.114)/255 >= 0.5) { visited[pos+W]=1; stack.push(pos+W); } }
    }
    if (area >= 100) count++;
  }
  return count;
}

// ── Canvas coloring component for custom uploaded SVGs ──

interface CanvasColoringViewProps {
  svgContent: string;
  viewBox: string;
  selectedColor: string;
  onReady: (regionCount: number) => void;
  onRegionFilled: (wasNew: boolean) => void;
  resetTrigger: number;
}

function CanvasColoringView({ svgContent, viewBox, selectedColor, onReady, onRegionFilled, resetTrigger }: CanvasColoringViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const refDataRef = useRef<Uint8ClampedArray | null>(null);
  const colorDataRef = useRef<Uint8ClampedArray | null>(null);
  const svgImgRef = useRef<HTMLImageElement | null>(null);
  const readyRef = useRef(false);

  const vbParts = viewBox.split(/[\s,]+/).map(Number);
  const vw = vbParts[2] || 200;
  const vh = vbParts[3] || 200;
  const CANVAS_W = 500;
  const CANVAS_H = Math.max(50, Math.round(CANVAS_W * vh / vw));

  const renderToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !colorDataRef.current || !svgImgRef.current) return;
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(new ImageData(colorDataRef.current.slice(), CANVAS_W, CANVAS_H), 0, 0);
    ctx.drawImage(svgImgRef.current, 0, 0, CANVAS_W, CANVAS_H);
  }, [CANVAS_W, CANVAS_H]);

  useEffect(() => {
    readyRef.current = false;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      svgImgRef.current = img;
      const offscreen = document.createElement('canvas');
      offscreen.width = CANVAS_W;
      offscreen.height = CANVAS_H;
      const ctx = offscreen.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
      refDataRef.current = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H).data.slice() as Uint8ClampedArray;
      const white = new Uint8ClampedArray(CANVAS_W * CANVAS_H * 4);
      for (let i = 0; i < white.length; i += 4) { white[i] = white[i+1] = white[i+2] = white[i+3] = 255; }
      colorDataRef.current = white;
      readyRef.current = true;
      renderToCanvas();
      URL.revokeObjectURL(url);
      onReady(countColorableRegions(refDataRef.current, CANVAS_W, CANVAS_H));
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [svgContent]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!readyRef.current) return;
    const white = new Uint8ClampedArray(CANVAS_W * CANVAS_H * 4);
    for (let i = 0; i < white.length; i += 4) { white[i] = white[i+1] = white[i+2] = white[i+3] = 255; }
    colorDataRef.current = white;
    renderToCanvas();
  }, [resetTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  const doFill = (px: number, py: number) => {
    if (!readyRef.current || !refDataRef.current || !colorDataRef.current) return;
    const ref = refDataRef.current;
    const colorData = colorDataRef.current;
    if (px < 0 || px >= CANVAS_W || py < 0 || py >= CANVAS_H) return;

    const startPos = py * CANVAS_W + px;
    const ri0 = startPos * 4;
    const refLum = (ref[ri0] * 0.299 + ref[ri0+1] * 0.587 + ref[ri0+2] * 0.114) / 255;
    if (refLum < 0.5) return;

    const targetR = colorData[ri0], targetG = colorData[ri0+1], targetB = colorData[ri0+2];
    const wasNew = targetR === 255 && targetG === 255 && targetB === 255;
    const fill = hexToRgb(selectedColor);
    if (!fill) return;
    if (targetR === fill.r && targetG === fill.g && targetB === fill.b) return;

    const visited = new Uint8Array(CANVAS_W * CANVAS_H);
    const stack = [startPos];
    visited[startPos] = 1;

    while (stack.length > 0) {
      const pos = stack.pop()!;
      const ri = pos * 4;
      const rLum = (ref[ri] * 0.299 + ref[ri+1] * 0.587 + ref[ri+2] * 0.114) / 255;
      if (rLum < 0.5) continue;
      if (Math.abs(colorData[ri] - targetR) > 40 || Math.abs(colorData[ri+1] - targetG) > 40 || Math.abs(colorData[ri+2] - targetB) > 40) continue;

      colorData[ri] = fill.r; colorData[ri+1] = fill.g; colorData[ri+2] = fill.b; colorData[ri+3] = 255;

      const x = pos % CANVAS_W, y = Math.floor(pos / CANVAS_W);
      if (x > 0 && !visited[pos-1]) { visited[pos-1] = 1; stack.push(pos-1); }
      if (x < CANVAS_W-1 && !visited[pos+1]) { visited[pos+1] = 1; stack.push(pos+1); }
      if (y > 0 && !visited[pos-CANVAS_W]) { visited[pos-CANVAS_W] = 1; stack.push(pos-CANVAS_W); }
      if (y < CANVAS_H-1 && !visited[pos+CANVAS_W]) { visited[pos+CANVAS_W] = 1; stack.push(pos+CANVAS_W); }
    }

    renderToCanvas();
    onRegionFilled(wasNew);
  };

  const getCoords = (clientX: number, clientY: number): [number, number] => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return [
      Math.floor((clientX - rect.left) * CANVAS_W / rect.width),
      Math.floor((clientY - rect.top) * CANVAS_H / rect.height),
    ];
  };

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      className="w-full"
      style={{ touchAction: 'none', cursor: 'crosshair', display: 'block' }}
      onClick={e => { const [px, py] = getCoords(e.clientX, e.clientY); doFill(px, py); }}
      onTouchEnd={e => {
        e.preventDefault();
        const t = e.changedTouches[0];
        if (t) { const [px, py] = getCoords(t.clientX, t.clientY); doFill(px, py); }
      }}
    />
  );
}

// ── Main coloring activity ──

export default function ColoringActivity() {
  const { currentUser, updateUser } = useStore();
  const customColoringImages = useStore(s => s.customColoringImages);
  const [selectedShape, setSelectedShape] = useState<ColoringShape | null>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [filledRegions, setFilledRegions] = useState<Record<string, string>>({});
  const [coloredCount, setColoredCount] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const selectedColorRef = useRef(COLORS[0]);
  const filledRegionsRef = useRef<Record<string, string>>({});
  const coloredCountRef = useRef(0);
  const canvasTotalRegionsRef = useRef(0);

  selectedColorRef.current = selectedColor;
  filledRegionsRef.current = filledRegions;
  coloredCountRef.current = coloredCount;

  const isCanvasShape = (shape: ColoringShape) => !!shape.svgContent;

  const getTotalRegions = (shape: ColoringShape) => {
    if (isCanvasShape(shape)) return canvasTotalRegionsRef.current;
    return shape.regions.length;
  };

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

  const handleCanvasReady = useCallback((n: number) => {
    canvasTotalRegionsRef.current = n;
  }, []);

  const handleCanvasRegionFilled = useCallback((wasNew: boolean) => {
    if (!wasNew) return;
    const newCount = coloredCountRef.current + 1;
    coloredCountRef.current = newCount;
    setColoredCount(newCount);
    if (canvasTotalRegionsRef.current > 0 && newCount >= canvasTotalRegionsRef.current) {
      triggerCompletion(currentUser);
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setFilledRegions({});
    setColoredCount(0);
    filledRegionsRef.current = {};
    coloredCountRef.current = 0;
    canvasTotalRegionsRef.current = 0;
    setResetTrigger(t => t + 1);
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
  const allColored = totalRegions > 0 && coloredCount >= totalRegions;

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
          مُلَوَّنٌ {coloredCount} / {totalRegions || '…'}
        </p>
      </div>

      {/* Drawing canvas */}
      <div className="bg-white dark:bg-[#F8F8F8] border-2 border-[#E5E5E5] rounded-3xl overflow-hidden">
        {isCanvasShape(selectedShape) ? (
          <CanvasColoringView
            svgContent={selectedShape.svgContent!}
            viewBox={selectedShape.viewBox}
            selectedColor={selectedColor}
            onReady={handleCanvasReady}
            onRegionFilled={handleCanvasRegionFilled}
            resetTrigger={resetTrigger}
          />
        ) : (
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
