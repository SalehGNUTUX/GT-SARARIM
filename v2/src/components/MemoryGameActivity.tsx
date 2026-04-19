import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Bot, User, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '../store/useStore';


interface CardData {
  id: number;
  pairId: number;
  emoji: string;
  label: string;
  flipped: boolean;
  matched: boolean;
}

const CARD_SETS = [
  { level: 1, label: 'سَهْلٌ', pairs: [
    { emoji: '🌙', label: 'الْقَمَرُ' },
    { emoji: '☀️', label: 'الشَّمْسُ' },
    { emoji: '⭐', label: 'النَّجْمُ' },
    { emoji: '🌧️', label: 'الْمَطَرُ' },
    { emoji: '🌳', label: 'الشَّجَرَةُ' },
    { emoji: '🦁', label: 'الْأَسَدُ' },
  ]},
  { level: 2, label: 'مُتَوَسِّطٌ', pairs: [
    { emoji: '📖', label: 'الْكِتَابُ' },
    { emoji: '✏️', label: 'الْقَلَمُ' },
    { emoji: '🕌', label: 'الْمَسْجِدُ' },
    { emoji: '🌊', label: 'الْبَحْرُ' },
    { emoji: '🐝', label: 'النَّحْلَةُ' },
    { emoji: '🌺', label: 'الزَّهْرَةُ' },
    { emoji: '🏔️', label: 'الْجَبَلُ' },
    { emoji: '🌙', label: 'الْهِلَالُ' },
  ]},
  { level: 3, label: 'صَعْبٌ', pairs: [
    { emoji: '🔭', label: 'التِّلِسْكُوبُ' },
    { emoji: '🧲', label: 'الْمِغْنَاطِيسُ' },
    { emoji: '⚡', label: 'الْكَهْرَبَاءُ' },
    { emoji: '🌍', label: 'الْأَرْضُ' },
    { emoji: '🧪', label: 'الْمَعْمَلُ' },
    { emoji: '💡', label: 'الْفِكْرَةُ' },
    { emoji: '🏛️', label: 'الْحَضَارَةُ' },
    { emoji: '📐', label: 'الْهَنْدَسَةُ' },
    { emoji: '🌌', label: 'الْكَوْنُ' },
    { emoji: '🔬', label: 'الْمِجْهَرُ' },
  ]},
];

// مستويات صعوبة الحاسوب
type AIDifficulty = 'easy' | 'medium' | 'hard';

function buildCards(pairList: { emoji: string; label: string }[]): CardData[] {
  const cards: CardData[] = [];
  pairList.forEach((p, i) => {
    cards.push({ id: i * 2,     pairId: i, emoji: p.emoji, label: p.label, flipped: false, matched: false });
    cards.push({ id: i * 2 + 1, pairId: i, emoji: p.emoji, label: p.label, flipped: false, matched: false });
  });
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

// ── ذكاء اصطناعي بسيط للحاسوب ──
class MemoryAI {
  private memory: Map<number, number> = new Map(); // pairId → cardId seen
  private memoryLimit: number;

  constructor(difficulty: AIDifficulty) {
    this.memoryLimit = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 6 : 999;
  }

  observeCard(card: CardData) {
    if (this.memory.size >= this.memoryLimit && !this.memory.has(card.pairId)) {
      // احذف أقدم إدخال عند الامتلاء (easy/medium)
      const firstKey = this.memory.keys().next().value;
      if (firstKey !== undefined) this.memory.delete(firstKey);
    }
    this.memory.set(card.pairId, card.id);
  }

  chooseFirstCard(availableIds: number[], cards: CardData[]): number {
    // تحقق إن كان الحاسوب يعرف زوجاً كاملاً
    for (const [pairId, knownId] of this.memory) {
      const partner = cards.find(c => c.pairId === pairId && c.id !== knownId && !c.matched && !c.flipped);
      if (partner && availableIds.includes(knownId) && !cards.find(c => c.id === knownId)?.matched) {
        return knownId;
      }
    }
    // اختر عشوائياً
    return availableIds[Math.floor(Math.random() * availableIds.length)];
  }

  chooseSecondCard(firstCard: CardData, availableIds: number[], cards: CardData[]): number {
    // هل يعرف الزوج المطابق؟
    const known = this.memory.get(firstCard.pairId);
    if (known !== undefined && known !== firstCard.id && availableIds.includes(known)) {
      return known;
    }
    // اختر عشوائياً
    const filtered = availableIds.filter(id => id !== firstCard.id);
    return filtered[Math.floor(Math.random() * filtered.length)];
  }
}

type GameMode = 'solo' | 'vs_computer';

export default function MemoryGameActivity() {
  const { currentUser, updateUser } = useStore();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [aiDifficulty, setAIDifficulty] = useState<AIDifficulty>('medium');
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [pointsGiven, setPointsGiven] = useState(false);
  // وضع ضد الحاسوب
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [aiThinking, setAiThinking] = useState(false);
  const aiRef = useRef<MemoryAI | null>(null);
  const cardsRef = useRef<CardData[]>([]);

  useEffect(() => { cardsRef.current = cards; }, [cards]);

  const startGame = useCallback((level: number, mode: GameMode, diff: AIDifficulty = 'medium') => {
    const set = CARD_SETS.find(s => s.level === level)!;
    const newCards = buildCards(set.pairs);
    setSelectedLevel(level);
    setGameMode(mode);
    setAIDifficulty(diff);
    setCards(newCards);
    cardsRef.current = newCards;
    setFlippedIds([]);
    setMoves(0);
    setMatchedCount(0);
    setLocked(false);
    setWon(false);
    setPointsGiven(false);
    setIsPlayerTurn(true);
    setPlayerScore(0);
    setAiScore(0);
    setAiThinking(false);
    if (mode === 'vs_computer') {
      aiRef.current = new MemoryAI(diff);
    } else {
      aiRef.current = null;
    }
  }, []);

  const totalPairs = selectedLevel ? CARD_SETS.find(s => s.level === selectedLevel)!.pairs.length : 0;

  useEffect(() => {
    if (matchedCount > 0 && matchedCount === totalPairs && !pointsGiven) {
      setWon(true);
      const pts = selectedLevel === 1 ? 5 : selectedLevel === 2 ? 10 : 15;
      if (currentUser && gameMode === 'solo') updateUser(currentUser.id, { points: currentUser.points + pts });
      if (currentUser && gameMode === 'vs_computer') {
        const winner = playerScore > aiScore ? pts : playerScore === aiScore ? Math.floor(pts / 2) : 0;
        if (winner > 0) updateUser(currentUser.id, { points: currentUser.points + winner });
      }
      setPointsGiven(true);
    }
  }, [matchedCount, totalPairs, selectedLevel, currentUser, updateUser, pointsGiven, gameMode, playerScore, aiScore]);

  // دور الحاسوب
  const runAITurn = useCallback(() => {
    if (!aiRef.current) return;
    const ai = aiRef.current;
    const currentCards = cardsRef.current;
    const available = currentCards.filter(c => !c.flipped && !c.matched).map(c => c.id);
    if (available.length < 2) return;

    setAiThinking(true);
    setLocked(true);

    setTimeout(() => {
      const firstId = ai.chooseFirstCard(available, currentCards);
      const firstCard = currentCards.find(c => c.id === firstId)!;

      setCards(prev => prev.map(c => c.id === firstId ? { ...c, flipped: true } : c));
      ai.observeCard(firstCard);

      setTimeout(() => {
        const available2 = cardsRef.current.filter(c => !c.flipped && !c.matched).map(c => c.id);
        const secondId = ai.chooseSecondCard(firstCard, available2, cardsRef.current);
        const secondCard = cardsRef.current.find(c => c.id === secondId)!;

        setCards(prev => prev.map(c => c.id === secondId ? { ...c, flipped: true } : c));
        ai.observeCard(secondCard);

        setTimeout(() => {
          if (firstCard.pairId === secondCard.pairId) {
            // تطابق!
            setCards(prev => {
              const updated = prev.map(c =>
                (c.id === firstId || c.id === secondId) ? { ...c, matched: true } : c
              );
              cardsRef.current = updated;
              return updated;
            });
            setMatchedCount(m => m + 1);
            setAiScore(s => s + 1);
            setFlippedIds([]);
            setLocked(false);
            setAiThinking(false);
            // الحاسوب يلعب مرة أخرى عند التطابق
            setTimeout(() => runAITurn(), 600);
          } else {
            setTimeout(() => {
              setCards(prev => {
                const updated = prev.map(c =>
                  (c.id === firstId || c.id === secondId) ? { ...c, flipped: false } : c
                );
                cardsRef.current = updated;
                return updated;
              });
              setFlippedIds([]);
              setLocked(false);
              setAiThinking(false);
              setIsPlayerTurn(true);
            }, 800);
          }
        }, 700);
      }, 700);
    }, 900);
  }, []);

  const handleFlip = (cardId: number) => {
    if (locked || !isPlayerTurn) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return;
    if (flippedIds.length === 1 && flippedIds[0] === cardId) return;

    const newFlipped = [...flippedIds, cardId];
    setCards(prev => {
      const updated = prev.map(c => c.id === cardId ? { ...c, flipped: true } : c);
      cardsRef.current = updated;
      return updated;
    });
    // اطّلع الحاسوب على البطاقة المكشوفة
    if (aiRef.current) aiRef.current.observeCard(card);
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [id1, id2] = newFlipped;
      const c1 = cards.find(c => c.id === id1)!;
      const c2 = cards.find(c => c.id === id2)!;

      if (c1.pairId === c2.pairId) {
        setTimeout(() => {
          setCards(prev => {
            const updated = prev.map(c => (c.id === id1 || c.id === id2) ? { ...c, matched: true } : c);
            cardsRef.current = updated;
            return updated;
          });
          setMatchedCount(m => m + 1);
          setPlayerScore(s => s + 1);
          setFlippedIds([]);
          setLocked(false);
        }, 600);
      } else {
        setTimeout(() => {
          setCards(prev => {
            const updated = prev.map(c => (c.id === id1 || c.id === id2) ? { ...c, flipped: false } : c);
            cardsRef.current = updated;
            return updated;
          });
          setFlippedIds([]);
          setLocked(false);
          if (gameMode === 'vs_computer') {
            setIsPlayerTurn(false);
            setTimeout(() => runAITurn(), 500);
          }
        }, 1000);
      }
    }
  };

  // ── شاشة اختيار الوضع ──
  if (gameMode === null) {
    return (
      <div className="space-y-5">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-black text-[#2D3436] dark:text-white">لُعْبَةُ الذَّاكِرَةِ</h3>
          <p className="text-sm text-[#636E72] dark:text-[#A0A0A0]">اخْتَرْ وَضْعَ اللَّعِبِ</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setGameMode('solo')}
            className="bg-white dark:bg-[#222] border-2 border-[#A29BFE] rounded-2xl p-5 text-center space-y-2 shadow-sm">
            <User className="w-10 h-10 mx-auto text-[#A29BFE]"/>
            <p className="font-black text-[#2D3436] dark:text-white">لِاعِبٌ وَاحِدٌ</p>
            <p className="text-xs text-[#636E72] dark:text-[#A0A0A0]">تَحَدَّ نَفْسَكَ</p>
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setGameMode('vs_computer')}
            className="bg-white dark:bg-[#222] border-2 border-[#FF9F43] rounded-2xl p-5 text-center space-y-2 shadow-sm">
            <Swords className="w-10 h-10 mx-auto text-[#FF9F43]"/>
            <p className="font-black text-[#2D3436] dark:text-white">ضِدَّ الْحَاسُوبِ</p>
            <p className="text-xs text-[#636E72] dark:text-[#A0A0A0]">تَنَافَسْ مَعَ الذَّكَاءِ</p>
          </motion.button>
        </div>
      </div>
    );
  }

  // ── اختيار مستوى الصعوبة (للعب ضد الحاسوب) ──
  if (gameMode === 'vs_computer' && selectedLevel === null) {
    return (
      <div className="space-y-5">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-black text-[#2D3436] dark:text-white">اللَّعِبُ ضِدَّ الْحَاسُوبِ</h3>
          <p className="text-sm text-[#636E72] dark:text-[#A0A0A0]">اخْتَرْ صُعُوبَةَ الْحَاسُوبِ</p>
        </div>
        <div className="space-y-3">
          {[
            { diff: 'easy' as AIDifficulty, label: 'سَهْلٌ', desc: 'الْحَاسُوبُ يَنْسَى كَثِيرًا', color: '#4CAF50', icon: '🌱' },
            { diff: 'medium' as AIDifficulty, label: 'مُتَوَسِّطٌ', desc: 'الْحَاسُوبُ يَتَذَكَّرُ بَعْضَ الْبِطَاقَاتِ', color: '#FF9F43', icon: '🧠' },
            { diff: 'hard' as AIDifficulty, label: 'صَعْبٌ', desc: 'الْحَاسُوبُ يَتَذَكَّرُ كُلَّ شَيْءٍ!', color: '#FF6B6B', icon: '🔥' },
          ].map(({ diff, label, desc, color, icon }) => (
            <motion.button key={diff} whileHover={{ x: -4 }} whileTap={{ scale: 0.97 }}
              onClick={() => setAIDifficulty(diff)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-right ${
                aiDifficulty === diff
                  ? 'border-[var(--c)] bg-[var(--c)]/10'
                  : 'border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222]'
              }`}
              style={{ '--c': color } as any}>
              <span className="text-3xl">{icon}</span>
              <div className="flex-1">
                <p className="font-black dark:text-white" style={{ color }}>{label}</p>
                <p className="text-xs text-[#636E72] dark:text-[#A0A0A0]">{desc}</p>
              </div>
              {aiDifficulty === diff && <Bot className="w-5 h-5" style={{ color }}/>}
            </motion.button>
          ))}
        </div>
        <p className="text-center text-sm font-bold text-[#2D3436] dark:text-white mt-2">اخْتَرِ الْمُسْتَوَى:</p>
        <div className="space-y-3">
          {CARD_SETS.map((s, i) => (
            <motion.button key={s.level} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => startGame(s.level, 'vs_computer', aiDifficulty)}
              className="w-full bg-white dark:bg-[#222] border-2 border-[#E5E5E5] dark:border-[#333] hover:border-[#FF9F43] rounded-2xl p-4 flex items-center gap-4 text-right transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#FFF3E0] flex items-center justify-center text-2xl">
                {s.level === 1 ? '⭐' : s.level === 2 ? '⭐⭐' : '⭐⭐⭐'}
              </div>
              <div className="flex-1 text-right">
                <div className="font-black text-[#2D3436] dark:text-white">{s.label}</div>
                <div className="text-xs text-[#636E72] dark:text-[#A0A0A0]">{s.pairs.length} زَوْجًا مِنَ الْبِطَاقَاتِ</div>
              </div>
            </motion.button>
          ))}
        </div>
        <button onClick={() => setGameMode(null)} className="w-full text-sm text-[#636E72] dark:text-[#A0A0A0] py-2">← رُجُوعٌ</button>
      </div>
    );
  }

  // ── اختيار المستوى (لاعب واحد) ──
  if (selectedLevel === null) {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-black text-[#2D3436] dark:text-white">لُعْبَةُ الذَّاكِرَةِ</h3>
          <p className="text-sm text-[#636E72] dark:text-[#A0A0A0]">اِخْتَرِ الْمُسْتَوَى وَطَابِقِ الْبِطَاقَاتِ</p>
        </div>
        <div className="space-y-3">
          {CARD_SETS.map((s, i) => (
            <motion.button key={s.level} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => startGame(s.level, 'solo')}
              className="w-full bg-white dark:bg-[#222] border-2 border-[#E5E5E5] dark:border-[#333] hover:border-[#A29BFE] rounded-2xl p-4 flex items-center gap-4 text-right transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#EDE7F6] flex items-center justify-center text-2xl">
                {s.level === 1 ? '⭐' : s.level === 2 ? '⭐⭐' : '⭐⭐⭐'}
              </div>
              <div className="flex-1 text-right">
                <div className="font-black text-[#2D3436] dark:text-white">{s.label}</div>
                <div className="text-xs text-[#636E72] dark:text-[#A0A0A0]">{s.pairs.length} زَوْجًا مِنَ الْبِطَاقَاتِ</div>
              </div>
            </motion.button>
          ))}
        </div>
        <button onClick={() => setGameMode(null)} className="w-full text-sm text-[#636E72] dark:text-[#A0A0A0] py-2">← رُجُوعٌ</button>
      </div>
    );
  }

  // ── شاشة الفوز ──
  if (won) {
    const pts = selectedLevel === 1 ? 5 : selectedLevel === 2 ? 10 : 15;
    const vsComputer = gameMode === 'vs_computer';
    const playerWon = playerScore > aiScore;
    const tie = playerScore === aiScore;
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-5 py-8">
        <div className="text-7xl">{vsComputer ? (playerWon ? '🏆' : tie ? '🤝' : '🤖') : '🎉'}</div>
        <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />
        <h3 className="text-2xl font-black text-[#2D3436] dark:text-white">
          {vsComputer ? (playerWon ? 'فُزْتَ! أَحْسَنْتَ!' : tie ? 'تَعَادُلٌ!' : 'فَازَ الْحَاسُوبُ!') : 'أَحْسَنْتَ!'}
        </h3>
        {vsComputer ? (
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <User className="w-6 h-6 text-[#A29BFE] mx-auto"/>
              <p className="font-black text-2xl text-[#A29BFE]">{playerScore}</p>
              <p className="text-xs text-[#636E72] dark:text-[#A0A0A0]">أَنْتَ</p>
            </div>
            <div className="text-center">
              <Bot className="w-6 h-6 text-[#FF9F43] mx-auto"/>
              <p className="font-black text-2xl text-[#FF9F43]">{aiScore}</p>
              <p className="text-xs text-[#636E72] dark:text-[#A0A0A0]">الْحَاسُوبُ</p>
            </div>
          </div>
        ) : (
          <p className="text-[#636E72] dark:text-[#A0A0A0]">أَتْمَمْتَ اللُّعْبَةَ فِي <span className="font-bold text-[#A29BFE]">{moves}</span> خُطْوَةً</p>
        )}
        {(!vsComputer || playerWon) && <p className="text-green-500 font-bold">+{vsComputer ? (tie ? Math.floor(pts/2) : pts) : pts} نُقَاطٍ</p>}
        <div className="flex gap-3 justify-center flex-wrap">
          <Button onClick={() => startGame(selectedLevel, gameMode, aiDifficulty)} className="bg-[#A29BFE] hover:bg-[#8c84e2] text-white gap-2">
            <RotateCcw className="w-4 h-4" /> إِعَادَةُ اللُّعْبَةِ
          </Button>
          <Button variant="outline" onClick={() => { setSelectedLevel(null); setGameMode(null); }} className="dark:border-[#444] dark:text-white">
            الْقَائِمَةُ الرَّئِيسِيَّةُ
          </Button>
        </div>
      </motion.div>
    );
  }

  const cols = totalPairs <= 6 ? 3 : 4;
  const vsComputer = gameMode === 'vs_computer';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => { setSelectedLevel(null); setGameMode(null); }} className="dark:text-white text-xs">
          ← رُجُوعٌ
        </Button>
        {vsComputer ? (
          <div className="flex gap-4">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${isPlayerTurn && !aiThinking ? 'bg-[#EDE7F6] text-[#A29BFE]' : 'text-[#636E72] dark:text-[#A0A0A0]'}`}>
              <User className="w-3.5 h-3.5"/><span>{playerScore}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${(!isPlayerTurn || aiThinking) ? 'bg-[#FFF3E0] text-[#FF9F43]' : 'text-[#636E72] dark:text-[#A0A0A0]'}`}>
              <Bot className="w-3.5 h-3.5"/><span>{aiScore}</span>
              {aiThinking && <span className="text-xs animate-pulse">يُفَكِّرُ...</span>}
            </div>
          </div>
        ) : (
          <div className="flex gap-4 text-sm text-[#636E72] dark:text-[#A0A0A0]">
            <span>✅ {matchedCount}/{totalPairs}</span>
            <span>🔄 {moves}</span>
          </div>
        )}
      </div>

      {vsComputer && (
        <div className={`text-center py-1.5 rounded-xl text-sm font-bold ${isPlayerTurn && !aiThinking ? 'bg-[#EDE7F6] text-[#A29BFE]' : 'bg-[#FFF3E0] text-[#FF9F43]'}`}>
          {aiThinking ? '🤖 الْحَاسُوبُ يُفَكِّرُ...' : isPlayerTurn ? '👤 دَوْرُكَ — اِقْلِبْ بِطَاقَتَيْنِ' : '🤖 دَوْرُ الْحَاسُوبِ'}
        </div>
      )}

      <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        <AnimatePresence>
          {cards.map(card => (
            <motion.button key={card.id} onClick={() => handleFlip(card.id)}
              whileTap={{ scale: 0.95 }}
              disabled={!isPlayerTurn || aiThinking || locked}
              className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all text-center
                ${card.matched ? 'bg-green-100 dark:bg-green-900/30 border-green-400' :
                  card.flipped ? 'bg-[#EDE7F6] dark:bg-[#2D2840] border-[#A29BFE]' :
                  'bg-white dark:bg-[#222] border-[#E5E5E5] dark:border-[#333] hover:border-[#A29BFE]'}`}>
              {(card.flipped || card.matched) ? (
                <>
                  <span className="text-2xl">{card.emoji}</span>
                  <span className="text-[10px] font-bold text-[#2D3436] dark:text-white leading-tight px-1">{card.label}</span>
                </>
              ) : (
                <span className="text-3xl">❓</span>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
