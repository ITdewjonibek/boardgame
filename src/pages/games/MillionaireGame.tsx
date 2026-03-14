import { useState } from "react";
import NeonNavbar from "@/components/NeonNavbar";
import { NeonFooter } from "@/components/NeonFooterCTA";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

type MQuestion = { q: string; options: string[]; correct: number; prize: string };

const mQuestions: MQuestion[] = [
  { q: "O'zbekiston mustaqillik kuni?", options: ["1 Sentyabr", "8 Dekabr", "21 Mart", "9 May"], correct: 0, prize: "100" },
  { q: "1 km necha metr?", options: ["100", "1000", "10000", "500"], correct: 1, prize: "500" },
  { q: "Eng kichik tub son qaysi?", options: ["0", "1", "2", "3"], correct: 2, prize: "1,000" },
  { q: "O'zbekiston aholisi taxminan qancha?", options: ["20 mln", "36 mln", "45 mln", "15 mln"], correct: 1, prize: "5,000" },
  { q: "Eng uzun daryo?", options: ["Nil", "Amazonka", "Missisipi", "Amudayo"], correct: 0, prize: "10,000" },
  { q: "Yorug'lik tezligi qancha?", options: ["300 km/s", "300,000 km/s", "150,000 km/s", "1,000,000 km/s"], correct: 1, prize: "50,000" },
  { q: "Kim \"Nisbiylik nazariyasi\"ni yaratgan?", options: ["Nyuton", "Eynshteyn", "Galiley", "Xoking"], correct: 1, prize: "100,000" },
  { q: "O'zbekistondagi eng baland tog'?", options: ["Chimyon", "Hazrat Sulton", "Beshtor", "Pulotxon"], correct: 1, prize: "500,000" },
  { q: "DNK qisqartmasi nimani bildiradi?", options: ["Dezoksiribonuklein kislota", "Dinamik nuklein kislota", "Dinitrogen kislota", "Dioxid nuklein kislota"], correct: 0, prize: "1,000,000" },
];

const MillionaireGame = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [finalPrize, setFinalPrize] = useState("0");

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);

    setTimeout(() => {
      if (idx === mQuestions[current].correct) {
        if (current + 1 >= mQuestions.length) {
          setWon(true);
          setFinalPrize(mQuestions[current].prize);
          setGameOver(true);
        } else {
          setCurrent((c) => c + 1);
          setSelected(null);
          setShowResult(false);
        }
      } else {
        setFinalPrize(current > 0 ? mQuestions[current - 1].prize : "0");
        setGameOver(true);
      }
    }, 1500);
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setGameOver(false);
    setWon(false);
    setFinalPrize("0");
  };

  const q = mQuestions[current];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-neon-orange/5 relative overflow-hidden">
      {/* Decorative stickers */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-32 right-8 text-5xl z-0">💰</motion.div>
      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute bottom-40 left-10 text-4xl z-0">🏆</motion.div>
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} className="absolute top-1/2 right-1/4 text-5xl z-0">⭐</motion.div>
      
      <NeonNavbar />
      <div className="pt-24 pb-16 container max-w-2xl relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-5xl md:text-6xl font-display font-black text-center mb-8"
        >
          💰 <span className="bg-gradient-to-r from-neon-orange via-yellow-400 to-neon-orange bg-clip-text text-transparent animate-pulse" style={{ textShadow: "0 0 20px hsl(25 100% 55% / 0.8)" }}>MILLIONER</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="text-center text-lg text-orange-300 font-semibold mb-8"
        >
          🏆 YUTUQ OLISH 🏆
        </motion.p>

        {gameOver ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="neon-card p-8 text-center">
            <p className="text-5xl mb-4">{won ? "🎉" : "😔"}</p>
            <p className="font-display font-black text-xl mb-2 text-neon-cyan">{won ? "TABRIKLAYMIZ!" : "O'YIN TUGADI"}</p>
            <p className="text-muted-foreground mb-2">Yutuq:</p>
            <p className="text-4xl font-display font-black text-neon-green">{finalPrize} so'm</p>
            <button onClick={reset} className="neon-btn mt-6 inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> QAYTA
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-[1fr_200px] gap-6">
            <div>
              <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="neon-card p-6 mb-6">
                <p className="text-sm text-neon-yellow font-display mb-2">SAVOL {current + 1} — {q.prize} so'm</p>
                <p className="text-xl font-bold text-foreground">{q.q}</p>
              </motion.div>

              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt, i) => {
                  let borderCls = "border-border hover:border-neon-cyan/50";
                  if (showResult) {
                    if (i === q.correct) borderCls = "border-neon-green bg-neon-green/10";
                    else if (i === selected) borderCls = "border-destructive bg-destructive/10";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={showResult}
                      className={`bg-card border-2 rounded-xl p-4 text-left transition-all ${borderCls}`}
                    >
                      <span className="text-muted-foreground font-display text-sm mr-2">{String.fromCharCode(65 + i)}:</span>
                      <span className="text-foreground font-semibold">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prize ladder */}
            <div className="neon-card p-4 hidden md:block">
              <p className="font-display text-xs text-muted-foreground mb-3 tracking-wider">YUTUQLAR</p>
              <div className="space-y-1">
                {[...mQuestions].reverse().map((mq, i) => {
                  const idx = mQuestions.length - 1 - i;
                  return (
                    <div
                      key={idx}
                      className={`text-xs py-1 px-2 rounded font-display ${
                        idx === current ? "bg-neon-cyan/20 text-neon-cyan font-bold" : idx < current ? "text-neon-green/60" : "text-muted-foreground/40"
                      }`}
                    >
                      {mq.prize}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <NeonFooter />
    </div>
  );
};

export default MillionaireGame;
