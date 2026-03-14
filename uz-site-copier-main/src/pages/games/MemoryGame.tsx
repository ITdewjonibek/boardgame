import { useState, useEffect } from "react";
import NeonNavbar from "@/components/NeonNavbar";
import { NeonFooter } from "@/components/NeonFooterCTA";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

const emojis = ["🍎", "🍊", "🍋", "🍇", "🍓", "🌟", "🎯", "🚀"];

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

const createCards = (): Card[] => {
  const pairs = [...emojis, ...emojis];
  return pairs
    .sort(() => Math.random() - 0.5)
    .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
};

const MemoryGame = () => {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [locked, setLocked] = useState(false);

  const handleClick = (id: number) => {
    if (locked) return;
    const card = cards[id];
    if (card.flipped || card.matched) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const [a, b] = newSelected;
      if (cards[a].emoji === cards[b].emoji) {
        setTimeout(() => {
          const mc = [...newCards];
          mc[a].matched = true;
          mc[b].matched = true;
          setCards(mc);
          setMatched((m) => m + 1);
          setSelected([]);
          setLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          const mc = [...newCards];
          mc[a].flipped = false;
          mc[b].flipped = false;
          setCards(mc);
          setSelected([]);
          setLocked(false);
        }, 800);
      }
    }
  };

  const reset = () => {
    setCards(createCards());
    setSelected([]);
    setMoves(0);
    setMatched(0);
    setLocked(false);
  };

  const won = matched === emojis.length;

  return (
    <div className="min-h-screen">
      <NeonNavbar />
      <div className="pt-24 pb-16 container max-w-xl">
        <h1 className="text-3xl md:text-4xl font-display font-black text-center mb-4">
          🧠 <span className="text-neon-magenta">XOTIRA</span> O'YINI
        </h1>
        <div className="flex justify-center gap-8 mb-6 text-sm">
          <span className="text-muted-foreground">Urinishlar: <span className="text-neon-cyan font-bold">{moves}</span></span>
          <span className="text-muted-foreground">Topilgan: <span className="text-neon-green font-bold">{matched}/{emojis.length}</span></span>
        </div>

        {won && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center mb-6">
            <p className="text-2xl font-display font-black text-neon-green">🎉 TABRIKLAYMIZ!</p>
            <p className="text-muted-foreground">{moves} urinishda topdingiz!</p>
          </motion.div>
        )}

        <div className="grid grid-cols-4 gap-3 mb-6">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleClick(card.id)}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-xl text-3xl md:text-4xl flex items-center justify-center border-2 transition-all duration-300 ${
                card.matched
                  ? "border-neon-green/50 bg-neon-green/10"
                  : card.flipped
                  ? "border-neon-magenta/50 bg-neon-magenta/10"
                  : "border-border bg-muted hover:border-neon-cyan/50 cursor-pointer"
              }`}
            >
              {card.flipped || card.matched ? card.emoji : "?"}
            </motion.button>
          ))}
        </div>

        <div className="text-center">
          <button onClick={reset} className="neon-btn-magenta inline-flex items-center gap-2 text-sm py-2 px-4">
            <RotateCcw className="w-4 h-4" /> QAYTA BOSHLASH
          </button>
        </div>
      </div>
      <NeonFooter />
    </div>
  );
};

export default MemoryGame;
