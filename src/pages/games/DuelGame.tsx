import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayoutV5 from "@/components/BaseGameLayoutV5";
import AssessmentCore from "@/components/AssessmentCore";
import { useMegaStore } from "@/lib/mega-store";
import { useScoreManager } from "@/lib/score-manager";
import { Zap, ShieldAlert, Cpu, Swords, Binary, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Game Config
const MAX_STAGES = 10;
const BOSS_STAGES = [5, 10];
const WIN_SCORE = 10;

interface DuelQuestion {
  expression: string;
  isTrue: boolean;
}

const generateLogicExpression = (level: number, isBoss: boolean): DuelQuestion => {
  const A = Math.random() > 0.5;
  const B = Math.random() > 0.5;
  const C = Math.random() > 0.5;

  const basicOps = ['AND', 'OR', 'XOR'];

  if (level <= 3) {
    const op = basicOps[Math.floor(Math.random() * basicOps.length)];
    let res = false;
    if (op === 'AND') res = A && B;
    if (op === 'OR') res = A || B;
    if (op === 'XOR') res = A !== B;

    return {
      expression: `${A ? 'TRUE' : 'FALSE'} ${op} ${B ? 'TRUE' : 'FALSE'}`,
      isTrue: res
    };
  }

  if (level <= 7 && !isBoss) {
    const op1 = basicOps[Math.floor(Math.random() * basicOps.length)];
    const op2 = basicOps[Math.floor(Math.random() * basicOps.length)];

    let r1 = false;
    if (op1 === 'AND') r1 = A && B;
    if (op1 === 'OR') r1 = A || B;
    if (op1 === 'XOR') r1 = A !== B;

    let finalRes = false;
    if (op2 === 'AND') finalRes = r1 && C;
    if (op2 === 'OR') finalRes = r1 || C;
    if (op2 === 'XOR') finalRes = r1 !== C;

    return {
      expression: `(${A ? '1' : '0'} ${op1} ${B ? '1' : '0'}) ${op2} ${C ? '1' : '0'}`,
      isTrue: finalRes
    };
  }

  // Boss or Level 8+
  const op1 = basicOps[Math.floor(Math.random() * basicOps.length)];
  const op2 = basicOps[Math.floor(Math.random() * basicOps.length)];
  const useNot1 = Math.random() > 0.5;
  const useNot2 = Math.random() > 0.5;
  const useGlobalNot = isBoss && Math.random() > 0.5;

  const valA = useNot1 ? !A : A;
  const valB = useNot2 ? !B : B;

  let r1 = false;
  if (op1 === 'AND') r1 = valA && valB;
  if (op1 === 'OR') r1 = valA || valB;
  if (op1 === 'XOR') r1 = valA !== valB;

  let finalRes = false;
  if (op2 === 'AND') finalRes = r1 && C;
  if (op2 === 'OR') finalRes = r1 || C;
  if (op2 === 'XOR') finalRes = r1 !== C;

  if (useGlobalNot) finalRes = !finalRes;

  const strA = `${useNot1 ? 'NOT(' : ''}${A ? 'T' : 'F'}${useNot1 ? ')' : ''}`;
  const strB = `${useNot2 ? 'NOT(' : ''}${B ? 'T' : 'F'}${useNot2 ? ')' : ''}`;

  return {
    expression: `${useGlobalNot ? 'NOT [' : ''}(${strA} ${op1} ${strB}) ${op2} ${C ? 'T' : 'F'}${useGlobalNot ? ']' : ''}`,
    isTrue: finalRes
  };
};

export default function QuantumLogicDuelV5() {
  const { status, level, damage, nextLevel, triggerTest, testActive, setStatus } = useMegaStore();
  const { addPoints, incrementCombo, breakCombo } = useScoreManager();

  const isBossStage = BOSS_STAGES.includes(level);

  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [currentQuery, setCurrentQuery] = useState<DuelQuestion | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Visual states
  const [flashWinner, setFlashWinner] = useState<'player' | 'ai' | null>(null);
  const [glitchActive, setGlitchActive] = useState(false);

  // AI Timer ref
  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);

  const spawnQuery = useCallback(() => {
    const q = generateLogicExpression(level, isBossStage);
    setCurrentQuery(q);
    setFlashWinner(null);

    // Boss glitch
    if (isBossStage && Math.random() < 0.3) {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 800);
    }

    // Schedule AI answer
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);

    // AI Reaction time decreases as level goes up. Boss is very fast.
    const aiBaseSpeed = isBossStage ? 1500 : Math.max(2000, 4500 - (level * 250));
    const aiVariance = Math.random() * 800 - 400; // +/- 400ms
    const aiTime = Math.max(800, aiBaseSpeed + aiVariance);

    aiTimerRef.current = setTimeout(() => {
      handleAiAnswer(q);
    }, aiTime);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, isBossStage]);

  useEffect(() => {
    if (status === 'playing' && !gameStarted) {
      setPlayerScore(0);
      setAiScore(0);
      setGameStarted(true);
      setTimeout(spawnQuery, 1000);
    }
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [status, gameStarted, spawnQuery]);

  const handleLevelComplete = useCallback((winner: 'player' | 'ai') => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    setCurrentQuery(null);

    if (winner === 'player') {
      addPoints(3000 * level, 'bonus');
      toast.success("DUEL_VICTORY: Enemy Node Offline");
      if (level % 5 === 0) triggerTest(true);
      else { nextLevel(); setGameStarted(false); }
    } else {
      damage(isBossStage ? 40 : 25);
      breakCombo();
      toast.error("DUEL_DEFEAT: You were outcomputed");
      // Reset scores for retry
      setPlayerScore(0);
      setAiScore(0);
      setTimeout(spawnQuery, 2000);
    }
  }, [level, isBossStage, addPoints, triggerTest, nextLevel, damage, breakCombo, spawnQuery]);

  useEffect(() => {
    if (playerScore >= WIN_SCORE) handleLevelComplete('player');
    else if (aiScore >= WIN_SCORE) handleLevelComplete('ai');
  }, [playerScore, aiScore, handleLevelComplete]);

  const handleAiAnswer = (q: DuelQuestion) => {
    if (playerScore >= WIN_SCORE || aiScore >= WIN_SCORE) return;

    // AI correctness based on level
    const accuracy = isBossStage ? 0.95 : Math.min(0.9, 0.5 + level * 0.05);
    const isCorrect = Math.random() < accuracy;

    if (isCorrect) {
      setAiScore(prev => prev + 1);
      setFlashWinner('ai');
      toast.error("AI First!", { duration: 500, icon: <Cpu className="text-red-500" /> });
    } else {
      // AI guessed wrong, player gets point
      setPlayerScore(prev => prev + 1);
      setFlashWinner('player');
      toast.success("AI Error!", { duration: 500 });
    }

    setTimeout(spawnQuery, 1500);
  };

  const handlePlayerAnswer = (answer: boolean) => {
    if (!currentQuery || flashWinner !== null || playerScore >= WIN_SCORE || aiScore >= WIN_SCORE) return;

    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);

    if (answer === currentQuery.isTrue) {
      setPlayerScore(prev => prev + 1);
      setFlashWinner('player');
      addPoints(150, isBossStage ? 'boss' : 'standard');
      incrementCombo();
      toast.success("Fast Sync!", { duration: 500 });
    } else {
      setAiScore(prev => prev + 1);
      setFlashWinner('ai');
      damage(5);
      breakCombo();
      toast.error("Logic Fault!", { duration: 500 });
    }

    setTimeout(spawnQuery, 1500);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentQuery || flashWinner !== null) return;
      if (e.key === 'ArrowLeft') handlePlayerAnswer(true);
      if (e.key === 'ArrowRight') handlePlayerAnswer(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuery, flashWinner, handlePlayerAnswer]);

  const handleTestComplete = (bonusScore: number, isCustom: boolean) => {
    if (bonusScore > 0) addPoints(bonusScore, 'bonus');
    triggerTest(false);
    if (level >= MAX_STAGES) {
      toast.success("MEGA_SYSTEM_CLEARED: Quantum Legend");
      setStatus('victory');
    } else {
      nextLevel();
      setGameStarted(false);
    }
  };

  const defaultTestQuestions = [
    {
      id: 1,
      text: "Which logic gate represents the hardware equivalent of a boolean 'NOT' operation?",
      options: ["Multiplier", "Inverter", "Buffer", "Transducer"],
      correct: 1,
      explanation: "An inverter takes an input and outputs the opposite state (1 becomes 0, 0 becomes 1).",
      difficulty: "easy" as const
    },
    {
      id: 2,
      text: "Evaluate: NOT (TRUE AND FALSE) OR FALSE",
      options: ["TRUE", "FALSE", "Syntax Error", "Null"],
      correct: 0,
      explanation: "TRUE AND FALSE = FALSE. NOT FALSE = TRUE. TRUE OR FALSE = TRUE.",
      difficulty: "medium" as const
    },
    {
      id: 3,
      text: "According to De Morgan's laws, the expression NOT (A OR B) is logically equivalent to:",
      options: ["(NOT A) OR (NOT B)", "(NOT A) AND (NOT B)", "A AND B", "NOT A XOR NOT B"],
      correct: 1,
      explanation: "De Morgan's laws state that the negation of a disjunction is the conjunction of the negations.",
      difficulty: "hard" as const
    }
  ];

  return (
    <BaseGameLayoutV5
      title="Quantum Logic Duel V5"
      stage={level}
      maxStages={MAX_STAGES}
      mechanics={[
        "Face-Off: You are competing against an Advanced AI in real-time.",
        "A boolean logic expression will appear. Evaluate if it's TRUE or FALSE.",
        "Whoever answers correctly FIRST scores a point. First to 10 wins.",
        "If you answer incorrectly, the AI is immediately awarded the point.",
        "Boss Phases (5 & 10): Deeply nested expressions. Glitched UI. Lethal AI speeds."
      ]}
    >
      <div className="flex-1 flex flex-col p-4 relative overflow-hidden h-full">

        {/* Boss Warning */}
        <AnimatePresence>
          {isBossStage && gameStarted && !testActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-6 py-2 rounded-full bg-red-500/10 border-2 border-red-500/50 flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              <Swords className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="text-xs font-black tracking-[0.3em] text-red-500 uppercase">Boss Phase: Lethal Combat</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Split Screen Container */}
        <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-4 relative z-10 pt-12 md:pt-4 pb-4">

          {/* Player Side */}
          <div className={`flex-1 rounded-[3rem] border-2 relative overflow-hidden transition-all duration-500 flex flex-col items-center justify-between p-8
                ${flashWinner === 'player' ? 'bg-primary/20 border-primary shadow-[0_0_50px_rgba(var(--primary),0.3)] scale-105 z-20' : 'bg-black/60 border-white/10'}
                ${flashWinner === 'ai' ? 'opacity-50 scale-95' : ''}
            `}>
            <div className="w-full flex justify-between items-start">
              <span className="text-[10px] font-black tracking-widest text-primary uppercase">Player Node</span>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-8xl md:text-9xl font-display font-black italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {playerScore}
              </span>
              <span className="text-xs font-black tracking-widest text-white/30 uppercase mt-2">/ {WIN_SCORE} Reqd</span>
            </div>

            <div className="w-full flex gap-4">
              <Button
                onClick={() => handlePlayerAnswer(true)}
                disabled={!currentQuery || flashWinner !== null}
                className="flex-1 h-20 text-2xl font-black bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 border-2 border-emerald-500 hover:text-black transition-all"
              >
                TRUE
              </Button>
              <Button
                onClick={() => handlePlayerAnswer(false)}
                disabled={!currentQuery || flashWinner !== null}
                className="flex-1 h-20 text-2xl font-black bg-red-500/20 text-red-400 hover:bg-red-500 border-2 border-red-500 hover:text-black transition-all"
              >
                FALSE
              </Button>
            </div>

            {/* Mobile Hint */}
            <span className="text-[8px] font-black tracking-widest text-white/20 uppercase mt-4">Keyboard: &lt; Left (TRUE) | Right (FALSE) &gt;</span>
          </div>

          {/* VS Divider */}
          <div className="hidden md:flex flex-col items-center justify-center -mx-8 z-30">
            <div className="w-16 h-16 rounded-full bg-black border-4 border-white/10 flex items-center justify-center drop-shadow-2xl">
              <Swords className="w-8 h-8 text-white/50" />
            </div>
          </div>

          {/* AI Side */}
          <div className={`flex-1 rounded-[3rem] border-2 relative overflow-hidden transition-all duration-500 flex flex-col items-center justify-between p-8
                ${flashWinner === 'ai' ? 'bg-red-500/20 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)] scale-105 z-20' : 'bg-[#020617]/80 border-white/10'}
                ${flashWinner === 'player' ? 'opacity-50 scale-95' : ''}
            `}>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />

            <div className="w-full flex justify-between items-start flex-row-reverse">
              <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">Enemy Net</span>
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-red-500" />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-8xl md:text-9xl font-display font-black italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {aiScore}
              </span>
              <span className="text-xs font-black tracking-widest text-white/30 uppercase mt-2">/ {WIN_SCORE} Reqd</span>
            </div>

            <div className="w-full h-20 rounded-2xl border-2 border-red-500/20 bg-red-500/5 flex items-center justify-center relative overflow-hidden">
              {currentQuery && !flashWinner && (
                <div className="flex items-center gap-3 text-red-500 animate-pulse">
                  <Activity className="w-5 h-5" />
                  <span className="font-mono font-black tracking-widest uppercase">Computing...</span>
                </div>
              )}
              {flashWinner === 'ai' && (
                <span className="font-display font-black text-2xl italic tracking-widest text-red-500">
                  INTERCEPTED
                </span>
              )}
            </div>

            <span className="text-[8px] font-black tracking-widest text-white/20 uppercase mt-4">AI Reaction Time Scaling: Active</span>
          </div>

        </div>

        {/* Central Data Stream (The Question) */}
        <AnimatePresence>
          {currentQuery && !flashWinner && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
            >
              <div className={`glass-card bg-black/90 border-2 py-6 px-12 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 transition-all duration-300
                        ${glitchActive ? 'border-primary/50 skew-x-[-10deg] filter invert hue-rotate-180' : 'border-white/20'}
                    `}>
                <div className="flex items-center gap-2 text-primary opacity-50 absolute -top-3 bg-black px-4 rounded-full border border-primary/30">
                  <Binary className="w-3 h-3" />
                  <span className="text-[8px] font-black tracking-widest uppercase">Data Stream</span>
                </div>
                <span className={`text-3xl md:text-5xl lg:text-6xl font-display font-black italic tracking-tighter text-white whitespace-nowrap drop-shadow-lg ${glitchActive ? 'font-mono tracking-widest' : ''}`}>
                  {currentQuery.expression}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <AnimatePresence>
        {testActive && (
          <AssessmentCore
            gameId="duel-v5"
            defaultQuestions={defaultTestQuestions}
            onComplete={handleTestComplete}
          />
        )}
      </AnimatePresence>
    </BaseGameLayoutV5>
  );
}
