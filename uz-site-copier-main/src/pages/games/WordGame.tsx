import { useState, useCallback } from "react";
import NeonNavbar from "@/components/NeonNavbar";
import { NeonFooter } from "@/components/NeonFooterCTA";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

const wordList = [
  "KITOB", "MAKTAB", "QALAM", "OLMA", "DAFTAR", "GURUCH", "PALOV",
  "GULLAR", "DARYO", "QUYOSH", "OYDIN", "BAHOR", "YULDUZ", "VATANR",
];

const getRandomWord = () => wordList[Math.floor(Math.random() * wordList.length)];

const shuffleWord = (word: string) => word.split("").sort(() => Math.random() - 0.5).join("");

const WordGame = () => {
  const [word, setWord] = useState(getRandomWord);
  const [shuffled, setShuffled] = useState(() => shuffleWord(word));
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [round, setRound] = useState(1);

  const checkGuess = useCallback(() => {
    if (guess.toUpperCase() === word) {
      setScore((s) => s + 1);
      setMessage({ text: "To'g'ri! 🎉", type: "success" });
    } else {
      setMessage({ text: `Noto'g'ri! Javob: ${word}`, type: "error" });
    }
    setTimeout(() => {
      const newWord = getRandomWord();
      setWord(newWord);
      setShuffled(shuffleWord(newWord));
      setGuess("");
      setMessage(null);
      setRound((r) => r + 1);
    }, 1500);
  }, [guess, word]);

  const skip = () => {
    const newWord = getRandomWord();
    setWord(newWord);
    setShuffled(shuffleWord(newWord));
    setGuess("");
    setMessage(null);
    setRound((r) => r + 1);
  };

  return (
    <div className="min-h-screen">
      <NeonNavbar />
      <div className="pt-24 pb-16 container max-w-md">
        <h1 className="text-3xl md:text-4xl font-display font-black text-center mb-8">
          🔤 <span className="text-neon-orange" style={{ textShadow: "0 0 10px hsl(25 100% 55% / 0.5)" }}>SO'Z</span> TOPISH
        </h1>

        <div className="flex justify-between mb-6 text-sm">
          <span className="text-muted-foreground">Raund: <span className="text-neon-cyan font-bold">{round}</span></span>
          <span className="text-muted-foreground">Ball: <span className="text-neon-green font-bold">{score}</span></span>
        </div>

        <div className="neon-card p-8 text-center mb-6">
          <p className="text-sm text-muted-foreground mb-4">Harflardan so'z tuzing:</p>
          <div className="flex justify-center gap-2 flex-wrap mb-6">
            {shuffled.split("").map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="w-12 h-12 rounded-lg border-2 border-neon-orange/50 bg-neon-orange/10 flex items-center justify-center text-xl font-display font-black text-foreground"
              >
                {ch}
              </motion.span>
            ))}
          </div>

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-lg font-bold mb-4 ${message.type === "success" ? "text-neon-green" : "text-destructive"}`}
            >
              {message.text}
            </motion.p>
          )}

          <div className="flex gap-2">
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && checkGuess()}
              placeholder="Javobingiz..."
              className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-center text-foreground font-bold uppercase focus:outline-none focus:border-neon-orange font-display"
            />
            <button onClick={checkGuess} className="neon-btn py-2 px-4 text-sm">TEKSHIRISH</button>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button onClick={skip} className="neon-btn-magenta text-sm py-2 px-4">O'TKAZISH</button>
          <button onClick={() => setShuffled(shuffleWord(word))} className="neon-btn-magenta text-sm py-2 px-4 inline-flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> ARALASHTIRISH
          </button>
        </div>
      </div>
      <NeonFooter />
    </div>
  );
};

export default WordGame;
