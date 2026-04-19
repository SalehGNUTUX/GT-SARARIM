import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '../store/useStore';
import confetti from 'canvas-confetti';

interface ImageOption {
  id: string;
  label: string;
  svgContent: string;
  color: string;
}

interface ImageQuestion {
  id: string;
  text: string;
  options: ImageOption[];
  correctId: string;
  level: string;
  hint?: string;
}

const SVG_IMAGES: Record<string, string> = {
  cat: `<svg viewBox="0 0 80 80"><circle cx="40" cy="45" r="25" fill="#FF9F43"/><ellipse cx="40" cy="45" rx="20" ry="18" fill="#FFB74D"/><circle cx="32" cy="40" r="4" fill="#333"/><circle cx="48" cy="40" r="4" fill="#333"/><circle cx="33" cy="39" r="1.5" fill="white"/><circle cx="49" cy="39" r="1.5" fill="white"/><ellipse cx="40" cy="48" rx="4" ry="3" fill="#FF8A65"/><line x1="30" y1="48" x2="15" y2="45" stroke="#888" strokeWidth="1"/><line x1="30" y1="50" x2="15" y2="50" stroke="#888" strokeWidth="1"/><line x1="50" y1="48" x2="65" y2="45" stroke="#888" strokeWidth="1"/><line x1="50" y1="50" x2="65" y2="50" stroke="#888" strokeWidth="1"/><polygon points="28,20 20,10 35,18" fill="#FF9F43"/><polygon points="52,20 60,10 45,18" fill="#FF9F43"/></svg>`,
  dog: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="48" rx="25" ry="20" fill="#A1887F"/><circle cx="40" cy="35" r="18" fill="#BCAAA4"/><circle cx="32" cy="32" r="4" fill="#333"/><circle cx="48" cy="32" r="4" fill="#333"/><circle cx="33" cy="31" r="1.5" fill="white"/><circle cx="49" cy="31" r="1.5" fill="white"/><ellipse cx="40" cy="42" rx="6" ry="4" fill="#EF9A9A"/><ellipse cx="28" cy="22" rx="6" ry="8" fill="#8D6E63"/><ellipse cx="52" cy="22" rx="6" ry="8" fill="#8D6E63"/></svg>`,
  apple: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="45" rx="28" ry="28" fill="#EF5350"/><path d="M38,45 C38,35 30,28 22,32 C28,28 40,25 40,18" fill="none" stroke="#C62828" strokeWidth="2"/><line x1="40" y1="15" x2="40" y2="25" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round"/><path d="M40,20 C45,15 55,18 52,25" fill="#4CAF50" stroke="none"/><circle cx="32" cy="40" r="5" fill="#FFCDD2" opacity="0.5"/></svg>`,
  banana: `<svg viewBox="0 0 80 80"><path d="M15,60 C20,30 50,20 65,30 C55,35 35,45 25,65Z" fill="#FFD700"/><path d="M15,60 C18,55 22,52 28,62" fill="#FFC107"/><path d="M65,30 C68,28 70,25 68,22 L64,24" fill="#8D6E63" strokeWidth="1"/></svg>`,
  sun: `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="16" fill="#FFD700"/><line x1="40" y1="10" x2="40" y2="20" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/><line x1="40" y1="60" x2="40" y2="70" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/><line x1="10" y1="40" x2="20" y2="40" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/><line x1="60" y1="40" x2="70" y2="40" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/><line x1="18" y1="18" x2="25" y2="25" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/><line x1="55" y1="55" x2="62" y2="62" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/><line x1="62" y1="18" x2="55" y2="25" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/><line x1="25" y1="55" x2="18" y2="62" stroke="#FF9800" strokeWidth="3" strokeLinecap="round"/></svg>`,
  moon: `<svg viewBox="0 0 80 80"><path d="M50,20 A25,25 0 1,1 50,60 A18,18 0 1,0 50,20Z" fill="#FFF176"/><circle cx="55" cy="35" r="3" fill="#FFF9C4" opacity="0.6"/><circle cx="45" cy="50" r="2" fill="#FFF9C4" opacity="0.6"/></svg>`,
  star: `<svg viewBox="0 0 80 80"><polygon points="40,10 47,32 70,32 52,47 59,70 40,55 21,70 28,47 10,32 33,32" fill="#FFD700" stroke="#FF8F00" strokeWidth="1"/></svg>`,
  tree: `<svg viewBox="0 0 80 80"><rect x="35" y="55" width="10" height="20" fill="#8D6E63"/><polygon points="40,10 60,40 20,40" fill="#4CAF50"/><polygon points="40,25 62,55 18,55" fill="#66BB6A"/><circle cx="30" cy="42" r="5" fill="#EF5350"/><circle cx="50" cy="38" r="5" fill="#EF5350"/></svg>`,
  fish: `<svg viewBox="0 0 80 80"><ellipse cx="38" cy="40" rx="26" ry="16" fill="#54A0FF"/><polygon points="65,40 78,28 78,52" fill="#2980B9"/><circle cx="25" cy="35" r="5" fill="white"/><circle cx="24" cy="35" r="2.5" fill="#333"/><line x1="30" y1="30" x2="30" y2="50" stroke="#2980B9" strokeWidth="1"/><line x1="40" y1="26" x2="40" y2="54" stroke="#2980B9" strokeWidth="1"/><line x1="50" y1="28" x2="50" y2="52" stroke="#2980B9" strokeWidth="1"/></svg>`,
  rocket: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="45" rx="14" ry="20" fill="#54A0FF"/><polygon points="40,10 28,30 52,30" fill="#FF6B6B"/><circle cx="40" cy="45" r="6" fill="#74B9FF"/><polygon points="26,60 18,75 34,65" fill="#FF6B6B"/><polygon points="54,60 62,75 46,65" fill="#FF6B6B"/><ellipse cx="40" cy="70" rx="8" ry="4" fill="#FF9F43"/></svg>`,
  heart: `<svg viewBox="0 0 80 80"><path d="M40,65 C40,65 10,47 10,28 C10,18 18,12 28,12 C33,12 38,15 40,19 C42,15 47,12 52,12 C62,12 70,18 70,28 C70,47 40,65 40,65Z" fill="#FF6B6B"/></svg>`,
  tree2: `<svg viewBox="0 0 80 80"><rect x="36" y="55" width="8" height="22" fill="#8D6E63"/><polygon points="40,8 58,35 22,35" fill="#4CAF50"/><polygon points="40,22 60,50 20,50" fill="#66BB6A"/><polygon points="40,35 62,62 18,62" fill="#81C784"/></svg>`,
  mosque2: `<svg viewBox="0 0 80 80"><rect x="15" y="40" width="50" height="35" fill="#E0E0E0"/><path d="M40,20 A18,18 0 0,1 58,38 L22,38 A18,18 0 0,1 40,20Z" fill="#54A0FF"/><rect x="35" y="52" width="10" height="23" fill="#9575CD"/><rect x="12" y="30" width="8" height="45" fill="#B0BEC5"/><rect x="60" y="30" width="8" height="45" fill="#B0BEC5"/><polygon points="16,28 20,15 24,28" fill="#54A0FF"/><polygon points="60,28 64,15 68,28" fill="#54A0FF"/></svg>`,
  bird: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="45" rx="20" ry="14" fill="#FF9F43"/><circle cx="40" cy="30" r="12" fill="#FFB74D"/><polygon points="40,28 52,32 40,36" fill="#FF8F00"/><circle cx="35" cy="26" r="3" fill="#333"/><circle cx="35.5" cy="25.5" r="1" fill="white"/><path d="M20,40 C15,30 10,25 5,28" fill="none" stroke="#FF9F43" strokeWidth="3" strokeLinecap="round"/><path d="M60,40 C65,30 70,25 75,28" fill="none" stroke="#FF9F43" strokeWidth="3" strokeLinecap="round"/></svg>`,
  book: `<svg viewBox="0 0 80 80"><rect x="10" y="15" width="28" height="50" rx="3" fill="#EF5350"/><rect x="42" y="15" width="28" height="50" rx="3" fill="#FF8A65"/><line x1="40" y1="15" x2="40" y2="65" stroke="#333" strokeWidth="2"/><line x1="18" y1="28" x2="32" y2="28" stroke="white" strokeWidth="2"/><line x1="18" y1="35" x2="32" y2="35" stroke="white" strokeWidth="2"/><line x1="18" y1="42" x2="32" y2="42" stroke="white" strokeWidth="2"/><line x1="48" y1="28" x2="62" y2="28" stroke="#A0522D" strokeWidth="2"/><line x1="48" y1="35" x2="62" y2="35" stroke="#A0522D" strokeWidth="2"/><line x1="48" y1="42" x2="62" y2="42" stroke="#A0522D" strokeWidth="2"/></svg>`,
  house: `<svg viewBox="0 0 80 80"><polygon points="40,10 70,38 10,38" fill="#FF6B6B"/><rect x="18" y="38" width="44" height="35" fill="#FFCCBC"/><rect x="33" y="52" width="14" height="21" rx="7" fill="#8D6E63"/><rect x="22" y="44" width="12" height="12" rx="2" fill="#80DEEA"/><rect x="46" y="44" width="12" height="12" rx="2" fill="#80DEEA"/></svg>`,
  // SVGs إضافية
  car: `<svg viewBox="0 0 80 80"><rect x="8" y="40" width="64" height="24" rx="6" fill="#54A0FF"/><path d="M18,40 L28,22 L52,22 L62,40Z" fill="#74B9FF"/><circle cx="22" cy="66" r="8" fill="#333"/><circle cx="58" cy="66" r="8" fill="#333"/><circle cx="22" cy="66" r="4" fill="#999"/><circle cx="58" cy="66" r="4" fill="#999"/><rect x="30" y="26" width="12" height="12" rx="2" fill="#B3E5FC"/><rect x="44" y="26" width="10" height="12" rx="2" fill="#B3E5FC"/><circle cx="68" cy="48" r="3" fill="#FFD700"/></svg>`,
  train: `<svg viewBox="0 0 80 80"><rect x="10" y="28" width="60" height="30" rx="8" fill="#FF6B6B"/><rect x="14" y="32" width="16" height="14" rx="2" fill="#B3E5FC"/><rect x="32" y="32" width="16" height="14" rx="2" fill="#B3E5FC"/><rect x="50" y="32" width="16" height="14" rx="2" fill="#B3E5FC"/><circle cx="20" cy="62" r="7" fill="#333"/><circle cx="60" cy="62" r="7" fill="#333"/><circle cx="20" cy="62" r="3" fill="#777"/><circle cx="60" cy="62" r="3" fill="#777"/><rect x="5" y="20" width="10" height="10" rx="3" fill="#FF9F43"/><line x1="5" y1="70" x2="75" y2="70" stroke="#555" strokeWidth="3" strokeLinecap="round"/></svg>`,
  ship: `<svg viewBox="0 0 80 80"><path d="M10,55 L20,40 L60,40 L70,55 L40,68Z" fill="#54A0FF"/><rect x="30" y="20" width="6" height="22" fill="#8D6E63"/><polygon points="36,20 36,35 55,28" fill="#FF6B6B"/><rect x="18" y="44" width="10" height="8" rx="2" fill="#FFF"/><rect x="35" y="44" width="10" height="8" rx="2" fill="#FFF"/><path d="M5,60 Q20,68 40,60 Q60,52 75,60" fill="none" stroke="#54A0FF" strokeWidth="3"/></svg>`,
  plane: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="40" rx="30" ry="10" fill="#B0BEC5"/><polygon points="40,40 70,40 75,35 70,30 40,40" fill="#90A4AE"/><polygon points="40,40 10,40 5,35 10,30 40,40" fill="#CFD8DC"/><polygon points="30,40 20,55 38,47" fill="#B0BEC5"/><polygon points="50,40 60,55 42,47" fill="#B0BEC5"/><ellipse cx="70" cy="40" rx="5" ry="4" fill="#FF6B6B"/><rect x="55" y="37" width="6" height="6" rx="2" fill="#B3E5FC"/></svg>`,
  cloud: `<svg viewBox="0 0 80 80"><ellipse cx="38" cy="42" rx="26" ry="18" fill="#B0BEC5"/><circle cx="24" cy="44" r="14" fill="#CFD8DC"/><circle cx="52" cy="42" r="16" fill="#ECEFF1"/><circle cx="38" cy="32" r="14" fill="#ECEFF1"/></svg>`,
  rain: `<svg viewBox="0 0 80 80"><ellipse cx="38" cy="34" rx="24" ry="16" fill="#90A4AE"/><circle cx="24" cy="36" r="12" fill="#B0BEC5"/><circle cx="50" cy="34" r="14" fill="#CFD8DC"/><circle cx="38" cy="26" r="12" fill="#CFD8DC"/><line x1="22" y1="52" x2="18" y2="68" stroke="#54A0FF" strokeWidth="2.5" strokeLinecap="round"/><line x1="38" y1="52" x2="34" y2="68" stroke="#54A0FF" strokeWidth="2.5" strokeLinecap="round"/><line x1="54" y1="52" x2="50" y2="68" stroke="#54A0FF" strokeWidth="2.5" strokeLinecap="round"/><line x1="30" y1="55" x2="26" y2="71" stroke="#54A0FF" strokeWidth="2.5" strokeLinecap="round"/><line x1="46" y1="55" x2="42" y2="71" stroke="#54A0FF" strokeWidth="2.5" strokeLinecap="round"/></svg>`,
  lightning: `<svg viewBox="0 0 80 80"><polygon points="48,10 20,45 38,45 32,70 60,35 42,35" fill="#FFD700" stroke="#FF8F00" strokeWidth="1.5"/></svg>`,
  kaaba: `<svg viewBox="0 0 80 80"><rect x="15" y="25" width="50" height="48" fill="#222"/><rect x="15" y="25" width="50" height="15" fill="#888755"/><rect x="30" y="52" width="20" height="21" rx="2" fill="#5D4037"/><line x1="15" y1="40" x2="65" y2="40" stroke="#FFD700" strokeWidth="1.5"/><line x1="20" y1="73" x2="10" y2="73" stroke="#888" strokeWidth="2"/><line x1="60" y1="73" x2="70" y2="73" stroke="#888" strokeWidth="2"/><rect x="10" y="22" width="60" height="3" fill="#888755"/></svg>`,
  scissors: `<svg viewBox="0 0 80 80"><circle cx="22" cy="55" r="12" fill="none" stroke="#888" strokeWidth="3"/><circle cx="22" cy="55" r="6" fill="#EEE"/><circle cx="58" cy="55" r="12" fill="none" stroke="#888" strokeWidth="3"/><circle cx="58" cy="55" r="6" fill="#EEE"/><line x1="30" y1="48" x2="50" y2="30" stroke="#888" strokeWidth="3" strokeLinecap="round"/><line x1="30" y1="62" x2="50" y2="25" stroke="#888" strokeWidth="3" strokeLinecap="round"/></svg>`,
  pencil: `<svg viewBox="0 0 80 80"><rect x="32" y="12" width="16" height="52" rx="3" fill="#FFD700"/><polygon points="32,64 48,64 40,76" fill="#EF5350"/><rect x="32" y="12" width="16" height="10" rx="3" fill="#FFB74D"/><rect x="34" y="20" width="12" height="4" fill="#FF9F43"/></svg>`,
  ruler: `<svg viewBox="0 0 80 80"><rect x="8" y="30" width="64" height="20" rx="4" fill="#4CAF50"/><line x1="18" y1="30" x2="18" y2="42" stroke="white" strokeWidth="1.5"/><line x1="28" y1="30" x2="28" y2="38" stroke="white" strokeWidth="1.5"/><line x1="38" y1="30" x2="38" y2="42" stroke="white" strokeWidth="1.5"/><line x1="48" y1="30" x2="48" y2="38" stroke="white" strokeWidth="1.5"/><line x1="58" y1="30" x2="58" y2="42" stroke="white" strokeWidth="1.5"/><line x1="68" y1="30" x2="68" y2="38" stroke="white" strokeWidth="1.5"/></svg>`,
  watermelon: `<svg viewBox="0 0 80 80"><path d="M12,40 A28,28 0 0,1 68,40Z" fill="#4CAF50"/><path d="M15,40 A25,25 0 0,1 65,40Z" fill="#EF5350"/><path d="M20,40 A22,22 0 0,1 60,40Z" fill="#FF6B6B"/><circle cx="32" cy="35" r="2.5" fill="#333"/><circle cx="42" cy="32" r="2.5" fill="#333"/><circle cx="52" cy="35" r="2.5" fill="#333"/><line x1="40" y1="15" x2="40" y2="40" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round"/></svg>`,
  grapes: `<svg viewBox="0 0 80 80"><circle cx="34" cy="50" r="9" fill="#9C27B0"/><circle cx="46" cy="50" r="9" fill="#9C27B0"/><circle cx="28" cy="38" r="9" fill="#AB47BC"/><circle cx="40" cy="38" r="9" fill="#AB47BC"/><circle cx="52" cy="38" r="9" fill="#AB47BC"/><circle cx="34" cy="26" r="9" fill="#CE93D8"/><circle cx="46" cy="26" r="9" fill="#CE93D8"/><circle cx="40" cy="62" r="7" fill="#7B1FA2"/><line x1="40" y1="12" x2="40" y2="20" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round"/><path d="M40,14 C50,8 60,12 58,20" fill="none" stroke="#4CAF50" strokeWidth="1.5"/></svg>`,
  triangle: `<svg viewBox="0 0 80 80"><polygon points="40,10 70,65 10,65" fill="#FF9F43" stroke="#E67E22" strokeWidth="2"/></svg>`,
  square: `<svg viewBox="0 0 80 80"><rect x="15" y="15" width="50" height="50" rx="4" fill="#54A0FF" stroke="#2980B9" strokeWidth="2"/></svg>`,
  circle_shape: `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="30" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2"/></svg>`,
  diamond: `<svg viewBox="0 0 80 80"><polygon points="40,8 70,40 40,72 10,40" fill="#FF6B6B" stroke="#C62828" strokeWidth="2"/></svg>`,
  bee: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="45" rx="18" ry="22" fill="#FFD700"/><ellipse cx="40" cy="38" rx="13" ry="10" fill="#FFA000"/><line x1="30" y1="35" x2="50" y2="35" stroke="#5D4037" strokeWidth="2"/><line x1="28" y1="43" x2="52" y2="43" stroke="#5D4037" strokeWidth="2"/><line x1="30" y1="51" x2="50" y2="51" stroke="#5D4037" strokeWidth="2"/><circle cx="35" cy="32" r="3" fill="#333"/><circle cx="45" cy="32" r="3" fill="#333"/><path d="M28,38 C15,28 12,20 20,16" fill="none" stroke="#B3E5FC" strokeWidth="2" opacity="0.7"/><path d="M52,38 C65,28 68,20 60,16" fill="none" stroke="#B3E5FC" strokeWidth="2" opacity="0.7"/><ellipse cx="40" cy="62" rx="6" ry="4" fill="#F57F17"/></svg>`,
  butterfly: `<svg viewBox="0 0 80 80"><path d="M40,40 C30,30 10,20 8,35 C6,50 25,55 40,48Z" fill="#FF9F43"/><path d="M40,40 C50,30 70,20 72,35 C74,50 55,55 40,48Z" fill="#FF9F43"/><path d="M40,48 C30,55 12,65 15,75 C25,70 38,58 40,55Z" fill="#FFB74D"/><path d="M40,48 C50,55 68,65 65,75 C55,70 42,58 40,55Z" fill="#FFB74D"/><ellipse cx="40" cy="47" rx="4" ry="10" fill="#5D4037"/><circle cx="36" cy="40" r="2" fill="#333"/><circle cx="44" cy="40" r="2" fill="#333"/></svg>`,
  elephant: `<svg viewBox="0 0 80 80"><ellipse cx="42" cy="45" rx="28" ry="22" fill="#9E9E9E"/><circle cx="30" cy="30" r="18" fill="#BDBDBD"/><ellipse cx="22" cy="22" rx="6" ry="9" fill="#9E9E9E"/><path d="M18,45 C10,55 8,65 15,70 C18,68 20,60 22,55" fill="#BDBDBD"/><circle cx="26" cy="26" r="4" fill="#333"/><circle cx="26.5" cy="25.5" r="1.5" fill="white"/><ellipse cx="55" cy="62" rx="8" ry="5" fill="#9E9E9E"/><ellipse cx="38" cy="67" rx="8" ry="5" fill="#9E9E9E"/></svg>`,
  lion: `<svg viewBox="0 0 80 80"><circle cx="40" cy="42" r="28" fill="#FF9F43" opacity="0.5"/><circle cx="40" cy="40" r="20" fill="#FF9F43"/><circle cx="40" cy="42" r="16" fill="#FFB74D"/><circle cx="33" cy="38" r="4" fill="#333"/><circle cx="47" cy="38" r="4" fill="#333"/><circle cx="34" cy="37" r="1.5" fill="white"/><circle cx="48" cy="37" r="1.5" fill="white"/><ellipse cx="40" cy="46" rx="5" ry="3.5" fill="#FF8A65"/><line x1="30" y1="46" x2="15" y2="43" stroke="#8D6E63" strokeWidth="1"/><line x1="30" y1="48" x2="15" y2="48" stroke="#8D6E63" strokeWidth="1"/><line x1="50" y1="46" x2="65" y2="43" stroke="#8D6E63" strokeWidth="1"/><line x1="50" y1="48" x2="65" y2="48" stroke="#8D6E63" strokeWidth="1"/></svg>`,
  flower: `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="10" fill="#FFD700"/><ellipse cx="40" cy="22" rx="8" ry="12" fill="#FF9F43"/><ellipse cx="40" cy="58" rx="8" ry="12" fill="#FF9F43"/><ellipse cx="22" cy="40" rx="12" ry="8" fill="#FF9F43"/><ellipse cx="58" cy="40" rx="12" ry="8" fill="#FF9F43"/><ellipse cx="27" cy="27" rx="8" ry="12" fill="#FFB74D" transform="rotate(-45 27 27)"/><ellipse cx="53" cy="27" rx="8" ry="12" fill="#FFB74D" transform="rotate(45 53 27)"/><ellipse cx="27" cy="53" rx="8" ry="12" fill="#FFB74D" transform="rotate(45 27 53)"/><ellipse cx="53" cy="53" rx="8" ry="12" fill="#FFB74D" transform="rotate(-45 53 53)"/><rect x="37" y="68" width="6" height="10" fill="#4CAF50"/></svg>`,
  doctor: `<svg viewBox="0 0 80 80"><circle cx="40" cy="22" r="14" fill="#FFCCBC"/><rect x="26" y="36" width="28" height="30" rx="5" fill="white"/><rect x="28" y="36" width="24" height="8" fill="#EF5350"/><line x1="40" y1="44" x2="40" y2="62" stroke="#EF5350" strokeWidth="2"/><line x1="33" y1="53" x2="47" y2="53" stroke="#EF5350" strokeWidth="2"/><ellipse cx="25" cy="60" rx="8" ry="6" fill="#FFCCBC"/><ellipse cx="55" cy="60" rx="8" ry="6" fill="#FFCCBC"/><circle cx="36" cy="20" r="3" fill="#333"/><circle cx="44" cy="20" r="3" fill="#333"/></svg>`,
  teacher: `<svg viewBox="0 0 80 80"><circle cx="40" cy="20" r="12" fill="#FFCCBC"/><rect x="28" y="32" width="24" height="28" rx="4" fill="#54A0FF"/><rect x="8" y="45" width="20" height="6" rx="3" fill="#EEE"/><rect x="4" y="35" width="6" height="18" rx="3" fill="#FFCCBC"/><line x1="10" y1="44" x2="28" y2="48" stroke="#4CAF50" strokeWidth="1.5"/><rect x="52" y="35" width="20" height="26" rx="3" fill="#FFF9C4" stroke="#FFD700" strokeWidth="2"/><line x1="56" y1="42" x2="68" y2="42" stroke="#333" strokeWidth="1.5"/><line x1="56" y1="48" x2="68" y2="48" stroke="#333" strokeWidth="1.5"/></svg>`,
  ball: `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="28" fill="#FF6B6B"/><path d="M25,20 C35,30 45,30 55,20" fill="none" stroke="white" strokeWidth="2"/><path d="M15,38 C25,32 35,45 40,40 C45,35 55,48 65,42" fill="none" stroke="white" strokeWidth="2"/><path d="M25,60 C35,50 45,50 55,60" fill="none" stroke="white" strokeWidth="2"/></svg>`,
};

const IMAGE_QUESTIONS: ImageQuestion[] = [
  // ── مجموعة 1: تعرف على الأشكال الطبيعية ──
  {
    id: 'iq1', text: 'أَيُّ هَذِهِ الصُّوَرِ يُصَوِّرُ الشَّمْسَ؟', level: 'beginner',
    correctId: 'sun',
    options: [
      { id: 'sun', label: 'الشَّمْسُ', svgContent: SVG_IMAGES.sun, color: '#FFE082' },
      { id: 'moon', label: 'الْقَمَرُ', svgContent: SVG_IMAGES.moon, color: '#FFF9C4' },
      { id: 'star', label: 'النَّجْمَةُ', svgContent: SVG_IMAGES.star, color: '#FFF3E0' },
      { id: 'cloud', label: 'السَّحَابَةُ', svgContent: SVG_IMAGES.cloud, color: '#ECEFF1' },
    ]
  },
  {
    id: 'iq2', text: 'أَيُّ هَذِهِ الْحَيَوَانَاتِ يَعِيشُ فِي الْمَاءِ؟', level: 'beginner',
    correctId: 'fish',
    options: [
      { id: 'cat', label: 'الْقِطَّةُ', svgContent: SVG_IMAGES.cat, color: '#FFF3E0' },
      { id: 'fish', label: 'السَّمَكَةُ', svgContent: SVG_IMAGES.fish, color: '#E3F2FD' },
      { id: 'dog', label: 'الْكَلْبُ', svgContent: SVG_IMAGES.dog, color: '#EFEBE9' },
      { id: 'lion', label: 'الْأَسَدُ', svgContent: SVG_IMAGES.lion, color: '#FFF8E1' },
    ]
  },
  {
    id: 'iq3', text: 'أَيُّ هَذِهِ الصُّوَرِ يُصَوِّرُ فَاكِهَةً حَمْرَاءَ؟', level: 'beginner',
    correctId: 'apple',
    options: [
      { id: 'house', label: 'الْبَيْتُ', svgContent: SVG_IMAGES.house, color: '#FCE4EC' },
      { id: 'banana', label: 'الْمَوْزُ', svgContent: SVG_IMAGES.banana, color: '#FFFDE7' },
      { id: 'apple', label: 'التُّفَّاحَةُ', svgContent: SVG_IMAGES.apple, color: '#FFEBEE' },
      { id: 'tree', label: 'الشَّجَرَةُ', svgContent: SVG_IMAGES.tree, color: '#E8F5E9' },
    ]
  },
  {
    id: 'iq4', text: 'أَيُّ هَذِهِ الصُّوَرِ يُصَوِّرُ الْهِلَالَ؟', level: 'intermediate',
    correctId: 'moon',
    options: [
      { id: 'sun', label: 'الشَّمْسُ', svgContent: SVG_IMAGES.sun, color: '#FFE082' },
      { id: 'star', label: 'النَّجْمَةُ', svgContent: SVG_IMAGES.star, color: '#FFF3E0' },
      { id: 'moon', label: 'الْهِلَالُ', svgContent: SVG_IMAGES.moon, color: '#FFF9C4' },
      { id: 'lightning', label: 'الْبَرْقُ', svgContent: SVG_IMAGES.lightning, color: '#FFFDE7' },
    ]
  },
  {
    id: 'iq5', text: 'أَيُّ صُورَةٍ تُمَثِّلُ الطَّائِرَ؟', level: 'beginner',
    correctId: 'bird',
    options: [
      { id: 'fish', label: 'السَّمَكَةُ', svgContent: SVG_IMAGES.fish, color: '#E3F2FD' },
      { id: 'bird', label: 'الطَّائِرُ', svgContent: SVG_IMAGES.bird, color: '#FFF8E1' },
      { id: 'cat', label: 'الْقِطَّةُ', svgContent: SVG_IMAGES.cat, color: '#FFF3E0' },
      { id: 'bee', label: 'النَّحْلَةُ', svgContent: SVG_IMAGES.bee, color: '#FFFDE7' },
    ]
  },
  {
    id: 'iq7', text: 'أَيُّ صُورَةٍ تُمَثِّلُ الصَّارُوخَ؟', level: 'intermediate',
    correctId: 'rocket',
    options: [
      { id: 'rocket', label: 'صَارُوخٌ', svgContent: SVG_IMAGES.rocket, color: '#E3F2FD' },
      { id: 'plane', label: 'طَائِرَةٌ', svgContent: SVG_IMAGES.plane, color: '#ECEFF1' },
      { id: 'ship', label: 'سَفِينَةٌ', svgContent: SVG_IMAGES.ship, color: '#E8F5E9' },
      { id: 'train', label: 'قِطَارٌ', svgContent: SVG_IMAGES.train, color: '#FBE9E7' },
    ]
  },
  {
    id: 'iq8', text: 'أَيُّ صُورَةٍ تُمَثِّلُ الْقَلْبَ؟', level: 'beginner',
    correctId: 'heart',
    options: [
      { id: 'star', label: 'نَجْمَةٌ', svgContent: SVG_IMAGES.star, color: '#FFF3E0' },
      { id: 'heart', label: 'قَلْبٌ', svgContent: SVG_IMAGES.heart, color: '#FCE4EC' },
      { id: 'diamond', label: 'مُعَيَّنٌ', svgContent: SVG_IMAGES.diamond, color: '#FFEBEE' },
      { id: 'circle_shape', label: 'دَائِرَةٌ', svgContent: SVG_IMAGES.circle_shape, color: '#E8F5E9' },
    ]
  },
  {
    id: 'iq9', text: 'أَيُّ صُورَةٍ تُمَثِّلُ الْمَسْجِدَ؟', level: 'beginner',
    correctId: 'mosque2',
    options: [
      { id: 'house', label: 'بَيْتٌ', svgContent: SVG_IMAGES.house, color: '#FCE4EC' },
      { id: 'mosque2', label: 'مَسْجِدٌ', svgContent: SVG_IMAGES.mosque2, color: '#E8EAF6' },
      { id: 'kaaba', label: 'الْكَعْبَةُ', svgContent: SVG_IMAGES.kaaba, color: '#EEEEEE' },
      { id: 'tree2', label: 'شَجَرَةٌ', svgContent: SVG_IMAGES.tree2, color: '#E8F5E9' },
    ]
  },
  {
    id: 'iq6', text: 'أَيُّ صُورَةٍ تُمَثِّلُ الْكِتَابَ؟', level: 'beginner',
    correctId: 'book',
    options: [
      { id: 'pencil', label: 'قَلَمٌ', svgContent: SVG_IMAGES.pencil, color: '#FFFDE7' },
      { id: 'ruler', label: 'مِسْطَرَةٌ', svgContent: SVG_IMAGES.ruler, color: '#E8F5E9' },
      { id: 'book', label: 'الْكِتَابُ', svgContent: SVG_IMAGES.book, color: '#FFE0B2' },
      { id: 'scissors', label: 'مِقَصٌّ', svgContent: SVG_IMAGES.scissors, color: '#F3E5F5' },
    ]
  },
  // ── مجموعة 2: تحديات إدراكية ──
  {
    id: 'iq10', text: 'أَيُّ هَذِهِ الصُّوَرِ يُمَثِّلُ وَسِيلَةَ نَقْلٍ بَرِّيَّةً؟', level: 'intermediate',
    correctId: 'car',
    options: [
      { id: 'car', label: 'سَيَّارَةٌ', svgContent: SVG_IMAGES.car, color: '#E3F2FD' },
      { id: 'ship', label: 'سَفِينَةٌ', svgContent: SVG_IMAGES.ship, color: '#E8F5E9' },
      { id: 'plane', label: 'طَائِرَةٌ', svgContent: SVG_IMAGES.plane, color: '#ECEFF1' },
      { id: 'rocket', label: 'صَارُوخٌ', svgContent: SVG_IMAGES.rocket, color: '#E3F2FD' },
    ]
  },
  {
    id: 'iq11', text: 'أَيُّ هَذِهِ الصُّوَرِ يُمَثِّلُ ظَاهِرَةً جَوِّيَّةً؟', level: 'intermediate',
    correctId: 'rain',
    options: [
      { id: 'sun', label: 'الشَّمْسُ', svgContent: SVG_IMAGES.sun, color: '#FFE082' },
      { id: 'rain', label: 'الْمَطَرُ', svgContent: SVG_IMAGES.rain, color: '#E3F2FD' },
      { id: 'flower', label: 'الزَّهْرَةُ', svgContent: SVG_IMAGES.flower, color: '#FCE4EC' },
      { id: 'tree', label: 'الشَّجَرَةُ', svgContent: SVG_IMAGES.tree, color: '#E8F5E9' },
    ]
  },
  {
    id: 'iq12', text: 'أَيُّ هَذِهِ الصُّوَرِ يُمَثِّلُ الْكَعْبَةَ الْمُشَرَّفَةَ؟', level: 'beginner',
    correctId: 'kaaba',
    options: [
      { id: 'mosque2', label: 'مَسْجِدٌ', svgContent: SVG_IMAGES.mosque2, color: '#E8EAF6' },
      { id: 'kaaba', label: 'الْكَعْبَةُ', svgContent: SVG_IMAGES.kaaba, color: '#EEEEEE' },
      { id: 'house', label: 'بَيْتٌ', svgContent: SVG_IMAGES.house, color: '#FCE4EC' },
      { id: 'book', label: 'كِتَابٌ', svgContent: SVG_IMAGES.book, color: '#FFE0B2' },
    ]
  },
  {
    id: 'iq13', text: 'أَيُّ هَذِهِ الصُّوَرِ هُوَ شَكْلٌ هَنْدَسِيٌّ ثُلَاثِيٌّ؟', level: 'intermediate',
    correctId: 'triangle',
    options: [
      { id: 'circle_shape', label: 'دَائِرَةٌ', svgContent: SVG_IMAGES.circle_shape, color: '#E8F5E9' },
      { id: 'square', label: 'مُرَبَّعٌ', svgContent: SVG_IMAGES.square, color: '#E3F2FD' },
      { id: 'triangle', label: 'مُثَلَّثٌ', svgContent: SVG_IMAGES.triangle, color: '#FFF3E0' },
      { id: 'diamond', label: 'مُعَيَّنٌ', svgContent: SVG_IMAGES.diamond, color: '#FFEBEE' },
    ]
  },
  {
    id: 'iq14', text: 'أَيُّ هَذِهِ الصُّوَرِ يُمَثِّلُ حَشَرَةً تُنْتِجُ الْعَسَلَ؟', level: 'beginner',
    correctId: 'bee',
    options: [
      { id: 'butterfly', label: 'فَرَاشَةٌ', svgContent: SVG_IMAGES.butterfly, color: '#FFF3E0' },
      { id: 'bee', label: 'نَحْلَةٌ', svgContent: SVG_IMAGES.bee, color: '#FFFDE7' },
      { id: 'bird', label: 'طَائِرٌ', svgContent: SVG_IMAGES.bird, color: '#FFF8E1' },
      { id: 'fish', label: 'سَمَكَةٌ', svgContent: SVG_IMAGES.fish, color: '#E3F2FD' },
    ]
  },
  {
    id: 'iq15', text: 'أَيُّ هَذِهِ الصُّوَرِ يُمَثِّلُ أَكْبَرَ حَيَوَانٍ بَرِّيٍّ؟', level: 'intermediate',
    correctId: 'elephant',
    options: [
      { id: 'cat', label: 'قِطَّةٌ', svgContent: SVG_IMAGES.cat, color: '#FFF3E0' },
      { id: 'dog', label: 'كَلْبٌ', svgContent: SVG_IMAGES.dog, color: '#EFEBE9' },
      { id: 'elephant', label: 'فِيلٌ', svgContent: SVG_IMAGES.elephant, color: '#ECEFF1' },
      { id: 'lion', label: 'أَسَدٌ', svgContent: SVG_IMAGES.lion, color: '#FFF8E1' },
    ]
  },
  {
    id: 'iq16', text: 'أَيُّ هَذِهِ الصُّوَرِ يُمَثِّلُ أَدَوَاتِ الرَّسْمِ؟', level: 'beginner',
    correctId: 'pencil',
    options: [
      { id: 'ball', label: 'كُرَةٌ', svgContent: SVG_IMAGES.ball, color: '#FFEBEE' },
      { id: 'pencil', label: 'قَلَمُ رَصَاصٍ', svgContent: SVG_IMAGES.pencil, color: '#FFFDE7' },
      { id: 'car', label: 'سَيَّارَةٌ', svgContent: SVG_IMAGES.car, color: '#E3F2FD' },
      { id: 'fish', label: 'سَمَكَةٌ', svgContent: SVG_IMAGES.fish, color: '#E3F2FD' },
    ]
  },
  {
    id: 'iq17', text: 'أَيُّ هَذِهِ الصُّوَرِ تُمَثِّلُ فَاكِهَةً أُرْجُوَانِيَّةَ اللَّوْنِ؟', level: 'intermediate',
    correctId: 'grapes',
    options: [
      { id: 'apple', label: 'تُفَّاحَةٌ', svgContent: SVG_IMAGES.apple, color: '#FFEBEE' },
      { id: 'banana', label: 'مَوْزٌ', svgContent: SVG_IMAGES.banana, color: '#FFFDE7' },
      { id: 'watermelon', label: 'بِطِّيخٌ', svgContent: SVG_IMAGES.watermelon, color: '#E8F5E9' },
      { id: 'grapes', label: 'عِنَبٌ', svgContent: SVG_IMAGES.grapes, color: '#F3E5F5' },
    ]
  },
  {
    id: 'iq18', text: 'مَا هُوَ الشَّكْلُ الَّذِي لَهُ أَرْبَعَةُ أَضْلَاعٍ مُتَسَاوِيَةٍ؟', level: 'intermediate',
    correctId: 'square',
    options: [
      { id: 'triangle', label: 'مُثَلَّثٌ', svgContent: SVG_IMAGES.triangle, color: '#FFF3E0' },
      { id: 'circle_shape', label: 'دَائِرَةٌ', svgContent: SVG_IMAGES.circle_shape, color: '#E8F5E9' },
      { id: 'square', label: 'مُرَبَّعٌ', svgContent: SVG_IMAGES.square, color: '#E3F2FD' },
      { id: 'diamond', label: 'مُعَيَّنٌ', svgContent: SVG_IMAGES.diamond, color: '#FFEBEE' },
    ]
  },
  {
    id: 'iq19', text: 'أَيُّ هَذِهِ الصُّوَرِ يُمَثِّلُ الْفَرَاشَةَ؟', level: 'beginner',
    correctId: 'butterfly',
    options: [
      { id: 'bee', label: 'نَحْلَةٌ', svgContent: SVG_IMAGES.bee, color: '#FFFDE7' },
      { id: 'butterfly', label: 'فَرَاشَةٌ', svgContent: SVG_IMAGES.butterfly, color: '#FFF3E0' },
      { id: 'bird', label: 'طَائِرٌ', svgContent: SVG_IMAGES.bird, color: '#FFF8E1' },
      { id: 'fish', label: 'سَمَكَةٌ', svgContent: SVG_IMAGES.fish, color: '#E3F2FD' },
    ]
  },
  {
    id: 'iq20', text: 'أَيُّ هَذِهِ الْوَسَائِلِ تَسِيرُ عَلَى الْمَاءِ؟', level: 'intermediate',
    correctId: 'ship',
    options: [
      { id: 'car', label: 'سَيَّارَةٌ', svgContent: SVG_IMAGES.car, color: '#E3F2FD' },
      { id: 'train', label: 'قِطَارٌ', svgContent: SVG_IMAGES.train, color: '#FBE9E7' },
      { id: 'ship', label: 'سَفِينَةٌ', svgContent: SVG_IMAGES.ship, color: '#E8F5E9' },
      { id: 'plane', label: 'طَائِرَةٌ', svgContent: SVG_IMAGES.plane, color: '#ECEFF1' },
    ]
  },
  {
    id: 'iq21', text: 'أَيُّ هَذِهِ الصُّوَرِ يُمَثِّلُ الشَّكْلَ الَّذِي لَا زَوَايَا لَهُ؟', level: 'advanced',
    correctId: 'circle_shape',
    options: [
      { id: 'triangle', label: 'مُثَلَّثٌ', svgContent: SVG_IMAGES.triangle, color: '#FFF3E0' },
      { id: 'square', label: 'مُرَبَّعٌ', svgContent: SVG_IMAGES.square, color: '#E3F2FD' },
      { id: 'diamond', label: 'مُعَيَّنٌ', svgContent: SVG_IMAGES.diamond, color: '#FFEBEE' },
      { id: 'circle_shape', label: 'دَائِرَةٌ', svgContent: SVG_IMAGES.circle_shape, color: '#E8F5E9' },
    ]
  },
  {
    id: 'iq22', text: 'أَيُّ هَذِهِ الصُّوَرِ يُمَثِّلُ فَاكِهَةً خَضْرَاءَ وَحَمْرَاءَ مَعًا؟', level: 'intermediate',
    correctId: 'watermelon',
    options: [
      { id: 'apple', label: 'تُفَّاحَةٌ', svgContent: SVG_IMAGES.apple, color: '#FFEBEE' },
      { id: 'grapes', label: 'عِنَبٌ', svgContent: SVG_IMAGES.grapes, color: '#F3E5F5' },
      { id: 'watermelon', label: 'بِطِّيخٌ', svgContent: SVG_IMAGES.watermelon, color: '#E8F5E9' },
      { id: 'banana', label: 'مَوْزٌ', svgContent: SVG_IMAGES.banana, color: '#FFFDE7' },
    ]
  },
  {
    id: 'iq23', text: 'أَيُّ صُورَةٍ تُمَثِّلُ الْأَسَدَ مَلِكَ الْغَابَةِ؟', level: 'beginner',
    correctId: 'lion',
    options: [
      { id: 'cat', label: 'قِطَّةٌ', svgContent: SVG_IMAGES.cat, color: '#FFF3E0' },
      { id: 'dog', label: 'كَلْبٌ', svgContent: SVG_IMAGES.dog, color: '#EFEBE9' },
      { id: 'lion', label: 'أَسَدٌ', svgContent: SVG_IMAGES.lion, color: '#FFF8E1' },
      { id: 'elephant', label: 'فِيلٌ', svgContent: SVG_IMAGES.elephant, color: '#ECEFF1' },
    ]
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LEVELS = [
  { id: 'beginner',     label: 'مُبْتَدِئٌ',   emoji: '⭐',   color: '#4CAF50' },
  { id: 'intermediate', label: 'مُتَوَسِّطٌ',  emoji: '⭐⭐',  color: '#FF9F43' },
  { id: 'advanced',     label: 'مُتَقَدِّمٌ',  emoji: '⭐⭐⭐', color: '#FF6B6B' },
];

export default function ImageQuizActivity() {
  const { currentUser, updateUser } = useStore();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [questions, setQuestions] = useState<(typeof IMAGE_QUESTIONS[0] & { options: typeof IMAGE_QUESTIONS[0]['options'] })[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);

  const startQuiz = useCallback((level: string) => {
    const filtered = IMAGE_QUESTIONS.filter(q => q.level === level);
    setQuestions(shuffleArray(filtered).map(q => ({ ...q, options: shuffleArray(q.options) })));
    setSelectedLevel(level);
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setStreak(0);
  }, []);

  const handleSelect = useCallback((optionId: string) => {
    if (selected) return;
    setSelected(optionId);
    const isCorrect = optionId === questions[currentIdx].correctId;
    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      if (streak + 1 >= 3) confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } else {
      setStreak(0);
    }
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1);
        setSelected(null);
      } else {
        setFinished(true);
        if (currentUser) {
          const pts = (score + (isCorrect ? 1 : 0)) * 15;
          updateUser(currentUser.id, { points: currentUser.points + pts });
        }
      }
    }, 1400);
  }, [selected, currentIdx, score, streak, questions, currentUser, updateUser]);

  const reset = () => {
    setSelectedLevel(null);
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setStreak(0);
  };

  if (!selectedLevel) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 py-4">
        <div className="text-center space-y-2">
          <div className="text-5xl">🖼️</div>
          <h3 className="text-xl font-black dark:text-white">اِخْتَبِرِ الصُّوَرَ</h3>
          <p className="text-sm text-[#636E72] dark:text-[#A0A0A0]">اِخْتَرِ الْمُسْتَوَى لِتَبْدَأَ</p>
        </div>
        <div className="space-y-3">
          {LEVELS.map(lv => {
            const count = IMAGE_QUESTIONS.filter(q => q.level === lv.id).length;
            return (
              <motion.button key={lv.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => startQuiz(lv.id)}
                className="w-full flex items-center justify-between bg-white dark:bg-[#222] border-2 rounded-2xl p-4 transition-all"
                style={{ borderColor: lv.color }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lv.emoji}</span>
                  <span className="font-black text-lg dark:text-white">{lv.label}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: lv.color }}>{count} سُؤَالٌ</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-5 py-8">
        <div className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center border-8 border-white dark:border-[#333] shadow-xl ${pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}>
          <Trophy className="w-14 h-14 text-white" />
        </div>
        <h2 className="text-3xl font-black dark:text-white">{pct >= 70 ? 'مُمْتَازٌ! 🎉' : pct >= 40 ? 'جَيِّدٌ! 👍' : 'حَاوِلْ مُجَدَّدًا! 💪'}</h2>
        <p className="text-xl text-[#636E72] dark:text-[#A0A0A0]">{score} / {questions.length} إِجَابَةٌ صَحِيحَةٌ</p>
        <p className="text-[#4CAF50] font-black text-2xl">+{score * 15} نُقْطَةً</p>
        <div className="flex gap-3 w-full">
          <Button className="flex-1 py-6 text-base font-black bg-[#FF9F43] hover:bg-[#e67e22] rounded-2xl flex items-center justify-center gap-2" onClick={() => selectedLevel && startQuiz(selectedLevel)}>
            <RefreshCw className="w-5 h-5" /> إِعَادَةٌ
          </Button>
          <Button className="flex-1 py-6 text-base font-black bg-[#4CAF50] hover:bg-[#388e3c] rounded-2xl flex items-center justify-center gap-2" onClick={reset}>
            تَغْيِيرُ الْمُسْتَوَى
          </Button>
        </div>
      </motion.div>
    );
  }

  const q = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black dark:text-white">اِخْتَبِرِ الصُّوَرَ</h3>
        <div className="flex items-center gap-2">
          <Badge className="bg-[#FF9F43] text-white">{currentIdx + 1}/{questions.length}</Badge>
          {streak >= 2 && <Badge className="bg-orange-500 text-white"><Sparkles className="w-3 h-3 ml-1" />{streak}</Badge>}
        </div>
      </div>

      <div className="h-2 bg-[#F0F0F0] dark:bg-[#333] rounded-full">
        <motion.div className="h-full bg-[#FF9F43] rounded-full" animate={{ width: `${progress}%` }} />
      </div>

      <div className="bg-[#FFF5E6] dark:bg-[#2A2218] border-2 border-[#FF9F43]/30 rounded-2xl p-5">
        <p className="text-xl font-black text-center dark:text-white leading-relaxed">{q.text}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt) => {
          let borderColor = 'border-[#E5E5E5] dark:border-[#333]';
          let bg = 'bg-white dark:bg-[#222]';
          if (selected) {
            if (opt.id === q.correctId) { borderColor = 'border-[#4CAF50]'; bg = 'bg-[#E8F5E9] dark:bg-[#1B5E20]'; }
            else if (opt.id === selected && opt.id !== q.correctId) { borderColor = 'border-[#FF6B6B]'; bg = 'bg-[#FFEBEE] dark:bg-[#4E1414]'; }
          }
          return (
            <motion.button key={opt.id} whileHover={!selected ? { scale: 1.03 } : {}} whileTap={!selected ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(opt.id)}
              disabled={!!selected}
              className={`${bg} ${borderColor} border-2 rounded-2xl p-3 text-center space-y-2 cursor-pointer transition-all`}
            >
              <div className="w-full h-20 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: opt.svgContent.replace('<svg', '<svg width="70" height="70"') }} />
              <p className="text-sm font-bold dark:text-white">{opt.label}</p>
              {selected && opt.id === q.correctId && <CheckCircle2 className="w-5 h-5 text-[#4CAF50] mx-auto" />}
              {selected && opt.id === selected && opt.id !== q.correctId && <XCircle className="w-5 h-5 text-[#FF6B6B] mx-auto" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
