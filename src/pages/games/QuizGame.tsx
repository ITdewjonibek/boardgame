import { useState } from "react";
import NeonNavbar from "@/components/NeonNavbar";
import { NeonFooter } from "@/components/NeonFooterCTA";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle, XCircle } from "lucide-react";

type Question = { q: string; options: string[]; correct: number };

const questions: Question[] = [
  { q: "O'zbekiston poytaxti qaysi shahar?", options: ["Samarqand", "Toshkent", "Buxoro", "Xiva"], correct: 1 },
  { q: "2 + 2 × 3 = ?", options: ["12", "8", "10", "6"], correct: 1 },
  { q: "Eng katta okean qaysi?", options: ["Atlantika", "Hind", "Tinch", "Shimoliy Muz"], correct: 2 },
  { q: "Quyosh sistemasida nechta sayyora bor?", options: ["7", "8", "9", "6"], correct: 1 },
  { q: "O'zbekiston bayrog'i nechta rangdan iborat?", options: ["3", "4", "5", "2"], correct: 1 },
  { q: "Amir Temur qachon tug'ilgan?", options: ["1336", "1370", "1405", "1300"], correct: 0 },
  { q: "H2O nima?", options: ["Tuz", "Suv", "Kislorod", "Vodorod"], correct: 1 },
  { q: "Yerning eng baland nuqtasi?", options: ["K2", "Everest", "Elbrus", "Kilimanjaro"], correct: 1 },
  { q: "Bir yilda necha kun bor?", options: ["364", "365", "366", "360"], correct: 1 },
  { q: "\"Alpomish\" dostoni qaysi xalqqa tegishli?", options: ["Tojik", "O'zbek", "Qozoq", "Qirg'iz"], correct: 1 },
];

const QuizGame = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === questions[current].correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        setFinished(true);
      }
    }, 1200);
  };

  const reset = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
  };

  const q = questions[current];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-neon-green/5 relative overflow-hidden">
      {/* Decorative stickers */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-20 right-5 text-5xl z-0">📚</motion.div>
      <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-40 left-8 text-4xl z-0">🎓</motion.div>
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} className="absolute top-2/3 right-1/4 text-5xl z-0">💡</motion.div>
      
      <NeonNavbar />
      <div className="pt-24 pb-16 container relative z-10">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-5xl md:text-6xl font-display font-black mb-4"
          >
            ❓ <span className="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green bg-clip-text text-transparent animate-pulse">VIKTORINA</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-lg text-neon-cyan font-semibold"
          >
            📚 Savol: {current + 1}/{questions.length} 📚
          </motion.p>
        </div>

        {finished ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="neon-card p-8 text-center">
            <p className="text-5xl mb-4">🏆</p>
            <p className="text-2xl font-display font-black text-neon-cyan mb-2">NATIJA</p>
            <p className="text-4xl font-display font-black text-neon-green">{score}/{questions.length}</p>
            <p className="text-muted-foreground mt-2 mb-6">
              {score >= 8 ? "Ajoyib!" : score >= 5 ? "Yaxshi!" : "Yana urinib ko'ring!"}
            </p>
            <button onClick={reset} className="neon-btn inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> QAYTA BOSHLASH
            </button>
          </motion.div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6 text-sm">
              <span className="text-muted-foreground">Savol <span className="text-neon-cyan font-bold">{current + 1}</span>/{questions.length}</span>
              <span className="text-muted-foreground">Ball: <span className="text-neon-green font-bold">{score}</span></span>
            </div>

            {/* Progress */}
            <div className="h-1 bg-muted rounded-full mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-neon-cyan"
                animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
              />
            </div>

            <motion.div key={current} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="neon-card p-6 mb-6">
              <p className="text-xl font-bold text-foreground">{q.q}</p>
            </motion.div>

            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt, i) => {
                let cls = "border-border hover:border-neon-cyan/50";
                if (showResult) {
                  if (i === q.correct) cls = "border-neon-green bg-neon-green/10";
                  else if (i === selected) cls = "border-destructive bg-destructive/10";
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={showResult}
                    className={`flex items-center gap-3 bg-card border-2 rounded-xl p-4 text-left transition-all ${cls}`}
                  >
                    <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-display font-bold text-muted-foreground">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-foreground font-semibold">{opt}</span>
                    {showResult && i === q.correct && <CheckCircle className="ml-auto text-neon-green w-5 h-5" />}
                    {showResult && i === selected && i !== q.correct && <XCircle className="ml-auto text-destructive w-5 h-5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <NeonFooter />
    </div>
  );
};

export default QuizGame;
