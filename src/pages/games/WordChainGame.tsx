import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import NeonNavbar from "@/components/NeonNavbar";
import { NeonFooter } from "@/components/NeonFooterCTA";
import { RotateCcw, Link2 } from "lucide-react";

// Uzbek word dictionary
const WORD_DICTIONARY: { [key: string]: string[] } = {
  "A": ["ALMA", "ATLAR", "ARAL", "AQIL"],
  "D": ["DAFTAR", "DAFARI", "DARVO", "DARYO", "DOR"],
  "G": ["GURUCH", "GULLAR", "GUVOH", "GAPI"],
  "K": ["KITOB", "KATAK", "KOLXOZ", "KABOB", "KO'Z"],
  "M": ["MAKTAB", "MUSHUK", "MANIK", "MORUG'"],
  "O": ["OLMA", "OYDIN", "OYLIK", "ODAM"],
  "P": ["PALOV", "PULI", "PARCHA", "POYIZ"],
  "Q": ["QALAM", "QOSH", "QIRQ", "QUYI"],
  "R": ["RANG", "RASM", "RAFIK", "ROJI"],
  "S": ["SO'Z", "SHUTOR", "SANA", "SAROY", "SEKIN"],
  "T": ["TOSH", "TURLI", "TUNGI", "TARAB"],
  "U": ["USTA", "USUL", "UCHUN", "UZUN"],
  "V": ["VATANI", "VILOYAT", "VAQT", "VOSITA"],
  "X": ["XAVFI", "XONADA", "XOTIRA", "XIZMAT"],
  "Y": ["YULDUZ", "YARMA", "YOZGI", "YAZUV"],
  "Z": ["ZANONI", "ZIYODAT", "ZONALI", "ZAMIN"]
};

interface GameRound {
  currentWord: string;
  targetLetter: string;
  round: number;
}

const WordChainGame = () => {
  const [gameState, setGameState] = useState<GameRound>({
    currentWord: "OLMA",
    targetLetter: "A",
    round: 1
  });
  
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [chain, setChain] = useState<string[]>(["OLMA"]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [streak, setStreak] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setGameState({ currentWord: "OLMA", targetLetter: "A", round: 1 });
    setChain(["OLMA"]);
    setScore(0);
    setStreak(0);
  };

  const validateWord = useCallback(() => {
    const word = userInput.toUpperCase().trim();
    
    if (!word) {
      setMessage({ text: "So'z kiriting!", type: "error" });
      return;
    }

    // Check if word starts with target letter
    if (word[0] !== gameState.targetLetter) {
      setMessage({ 
        text: `So'z '${gameState.targetLetter}' harfi bilan boshlanishi kerak!`, 
        type: "error" 
      });
      setStreak(0);
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    // Check if word is in dictionary
    const firstLetter = word[0];
    const wordList = WORD_DICTIONARY[firstLetter] || [];
    
    if (!wordList.includes(word)) {
      setMessage({ 
        text: "Bunday so'z lug'atda yo'q! 📖", 
        type: "error" 
      });
      setStreak(0);
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    // Check if word already used in chain
    if (chain.includes(word)) {
      setMessage({ 
        text: "Bu so'z allaqachon ishlatilgan!", 
        type: "error" 
      });
      setStreak(0);
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    // Valid word!
    const nextLetter = word[word.length - 1];
    const roundPoints = 100 + (streak * 50);
    
    setScore(s => s + roundPoints);
    setStreak(s => s + 1);
    setChain([...chain, word]);
    setMessage({ 
      text: `✅ To'g'ri! +${roundPoints} ball`, 
      type: "success" 
    });

    // Set up next round
    setTimeout(() => {
      if (WORD_DICTIONARY[nextLetter] && WORD_DICTIONARY[nextLetter].length > 0) {
        setGameState({
          currentWord: word,
          targetLetter: nextLetter,
          round: gameState.round + 1
        });
        setUserInput("");
        setMessage(null);
      } else {
        setGameOver(true);
        setMessage({ 
          text: `🎉 O'yin tugadi! '${nextLetter}' harfi bilan boshlanadigan so'z yo'q!`, 
          type: "info" 
        });
      }
    }, 1500);
  }, [userInput, gameState, chain, streak]);

  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);
  };

  const resetGame = () => {
    setGameState({ currentWord: "OLMA", targetLetter: "A", round: 1 });
    setChain(["OLMA"]);
    setUserInput("");
    setScore(0);
    setStreak(0);
    setGameStarted(false);
    setGameOver(false);
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-purple-900/5 relative overflow-hidden">
      {/* Decorative stickers */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-40 right-8 text-5xl z-0">🔤</motion.div>
      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute bottom-32 left-5 text-4xl z-0">⛓️</motion.div>
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute top-1/2 right-1/3 text-5xl z-0">✨</motion.div>
      
      <NeonNavbar />
      <div className="pt-24 pb-16 container max-w-2xl relative z-10">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="text-5xl md:text-6xl font-display font-black mb-4"
          >
            ⛓️ <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-pulse">SO'Z KETGANI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-lg text-purple-300 font-semibold"
          >
            🔤 Oldingi so'zning oxirgi harfi bilan yangi so'z boshla! 🔤
          </motion.p>
        </div>

        {!gameStarted && !gameOver && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="neon-card p-12 text-center mb-6">
            <p className="text-6xl mb-6">⛓️</p>
            <p className="text-muted-foreground mb-4 text-lg">
              O'yinning qoidalari:
            </p>
            <ul className="text-left text-muted-foreground mb-8 space-y-2">
              <li>✅ Birinchi so'z: <strong>OLMA</strong></li>
              <li>✅ Keyingi so'z 'A' harfi bilan boshlanishi kerak</li>
              <li>✅ Har bir so'z chain'da yangi bo'lishi kerak</li>
              <li>✅ Lug'atdagi so'zlarni kiriting</li>
              <li>✅ Ula shutshutkalardan qochib shutshutkalarni to'ldirib boring!</li>
            </ul>
            <button 
              onClick={startGame}
              className="neon-btn text-lg px-12 py-4 w-full"
            >
              🎮 O'YINNI BOSHLASH
            </button>
          </motion.div>
        )}

        {gameStarted && !gameOver && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Raund: <span className="text-purple-400 font-bold text-lg">{gameState.round}</span></span>
              <span className="text-muted-foreground">Ball: <span className="text-purple-300 font-bold text-lg">{score}</span></span>
              <span className="text-muted-foreground">Zanj: <span className="text-purple-200 font-bold text-lg">{streak}</span></span>
            </div>

            {/* Current task */}
            <motion.div 
              key={gameState.round}
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="neon-card p-8 text-center"
            >
              <p className="text-muted-foreground mb-4">Oxirgi so'z:</p>
              <p className="text-5xl font-display font-black text-purple-300 mb-8">{gameState.currentWord}</p>
              
              <p className="text-2xl font-display font-black text-purple-400 mb-2">↓</p>
              
              <p className="text-muted-foreground mb-4">Quyidagi harfi bilan boshla:</p>
              <div className="inline-block px-8 py-4 rounded-2xl border-2 border-purple-500/50 bg-purple-500/10 mb-6">
                <p className="text-6xl font-display font-black text-purple-300">{gameState.targetLetter}</p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && validateWord()}
                  autoFocus
                  placeholder="So'zni kiriting..."
                  className="w-full h-16 bg-muted border-2 border-purple-500/30 rounded-xl px-4 text-2xl text-center text-foreground font-bold focus:outline-none focus:border-purple-500 font-display uppercase"
                />
              </div>

              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 text-lg font-bold ${
                    message.type === "success" ? "text-purple-300" : "text-destructive"
                  }`}
                >
                  {message.text}
                </motion.p>
              )}
            </motion.div>

            {/* Word chain display */}
            <div className="neon-card p-6">
              <p className="text-sm text-muted-foreground mb-4">So'zlar tizimi:</p>
              <div className="flex flex-wrap gap-2">
                {chain.map((word, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-4 py-2 rounded-full border border-purple-500/50 bg-purple-500/10 text-purple-300 font-bold text-sm"
                  >
                    {word}
                    {idx < chain.length - 1 && <Link2 className="w-3 h-3 inline ml-2" />}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex gap-3">
              <button 
                onClick={validateWord}
                className="flex-1 neon-btn py-3 font-bold text-lg"
              >
                ✅ TEKSHIRISH
              </button>
              <button 
                onClick={endGame}
                className="flex-1 neon-btn-magenta py-3 font-bold text-lg inline-flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> TUGATISH
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="neon-card p-12 text-center">
            <p className="text-6xl mb-4">🏆</p>
            <p className="font-display font-black text-purple-300 text-3xl mb-4">O'YIN TUGADI!</p>
            
            <div className="bg-black/30 rounded-xl p-6 mb-8">
              <p className="text-muted-foreground mb-2">Jami Ball:</p>
              <p className="text-5xl font-display font-black text-purple-300">{score}</p>
              
              <p className="text-muted-foreground mt-4 mb-2">O'yinlangan Raundlar:</p>
              <p className="text-3xl font-display font-black text-purple-200">{chain.length}</p>

              <p className="text-muted-foreground mt-4 mb-2">Eng Yaxshi Zanj:</p>
              <p className="text-3xl font-display font-black text-purple-200">{streak}</p>
            </div>

            {score >= 1000 && <p className="text-lg text-purple-300 mb-6">🌟 Ajoyib natija!</p>}
            {score >= 500 && score < 1000 && <p className="text-lg text-purple-300 mb-6">✨ Yaxshi o'yin!</p>}
            {score < 500 && <p className="text-lg text-purple-300 mb-6">💪 Yana urinib ko'ring!</p>}

            <button 
              onClick={resetGame}
              className="neon-btn w-full py-4 text-lg font-bold"
            >
              🎮 QAYTA O'YNASH
            </button>
          </motion.div>
        )}
      </div>
      <NeonFooter />
    </div>
  );
};

export default WordChainGame;
