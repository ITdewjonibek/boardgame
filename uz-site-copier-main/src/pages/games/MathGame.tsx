import { useState, useEffect, useCallback } from "react";
import NeonNavbar from "@/components/NeonNavbar";
import { NeonFooter } from "@/components/NeonFooterCTA";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

const generateProblem = () => {
  const ops = ["+", "-", "×"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;
  switch (op) {
    case "+": a = Math.floor(Math.random() * 50) + 1; b = Math.floor(Math.random() * 50) + 1; answer = a + b; break;
    case "-": a = Math.floor(Math.random() * 50) + 10; b = Math.floor(Math.random() * a); answer = a - b; break;
    case "×": a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; answer = a * b; break;
  }
  return { text: `${a} ${op} ${b} = ?`, answer };
};

const MathGame = () => {
  const [problem, setProblem] = useState(generateProblem);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);

  useEffect(() => {
    if (!started || gameOver) return;
    const t = setInterval(() => {
      setTimeLeft((p) => {
        if (p <= 1) { setGameOver(true); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, gameOver]);

  const submit = useCallback(() => {
    if (!input.trim()) return;
    const num = parseInt(input);
    if (num === problem.answer) {
      setScore((s) => s + 1);
      setFlash("correct");
    } else {
      setFlash("wrong");
    }
    setTimeout(() => setFlash(null), 300);
    setProblem(generateProblem());
    setInput("");
  }, [input, problem.answer]);

  const reset = () => {
    setProblem(generateProblem());
    setInput("");
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setStarted(false);
  };

  return (
    <div className="min-h-screen">
      <NeonNavbar />
      <div className="pt-24 pb-16 container max-w-md">
        <h1 className="text-3xl md:text-4xl font-display font-black text-center mb-8">
          ⚡ <span className="text-neon-yellow" style={{ textShadow: "0 0 10px hsl(55 100% 55% / 0.5)" }}>TEZKOR</span> HISOB
        </h1>

        {!started ? (
          <div className="neon-card p-8 text-center">
            <p className="text-6xl mb-4">🧮</p>
            <p className="text-muted-foreground mb-6">60 soniya ichida imkon qadar ko'p matematik misollarni yeching!</p>
            <button onClick={() => setStarted(true)} className="neon-btn text-lg px-8 py-3">BOSHLASH</button>
          </div>
        ) : gameOver ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="neon-card p-8 text-center">
            <p className="text-5xl mb-4">🏅</p>
            <p className="font-display font-black text-neon-cyan text-xl mb-2">VAQT TUGADI!</p>
            <p className="text-4xl font-display font-black text-neon-green">{score} ball</p>
            <p className="text-muted-foreground mt-2 mb-6">
              {score >= 15 ? "Ajoyib tezlik!" : score >= 8 ? "Yaxshi natija!" : "Mashq qiling!"}
            </p>
            <button onClick={reset} className="neon-btn inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> QAYTA
            </button>
          </motion.div>
        ) : (
          <div>
            <div className="flex justify-between mb-6 text-sm">
              <span className="text-muted-foreground">Ball: <span className="text-neon-green font-bold text-lg">{score}</span></span>
              <span className={`font-display font-bold text-lg ${timeLeft <= 10 ? "text-destructive animate-pulse" : "text-neon-cyan"}`}>{timeLeft}s</span>
            </div>
            <div className="h-1 bg-muted rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-neon-cyan transition-all duration-1000" style={{ width: `${(timeLeft / 60) * 100}%` }} />
            </div>

            <motion.div
              key={problem.text}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`neon-card p-8 text-center mb-6 ${flash === "correct" ? "border-neon-green" : flash === "wrong" ? "border-destructive" : ""}`}
            >
              <p className="text-4xl font-display font-black text-foreground">{problem.text}</p>
            </motion.div>

            <div className="flex gap-3">
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                autoFocus
                placeholder="Javob..."
                className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-xl text-center text-foreground font-bold focus:outline-none focus:border-neon-cyan font-display"
              />
              <button onClick={submit} className="neon-btn px-6">OK</button>
            </div>
          </div>
        )}
      </div>
      <NeonFooter />
    </div>
  );
};

export default MathGame;
