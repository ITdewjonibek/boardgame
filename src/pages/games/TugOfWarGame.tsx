import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayoutV5 from "@/components/BaseGameLayoutV5";
import { StageTestOverlay } from "@/components/Games/StageTestSystem/StageTestOverlay";
import { TugOfWarIntro } from "@/components/Games/TugOfWar/TugOfWarIntro";
import { TugOfWarRules } from "@/components/Games/TugOfWar/TugOfWarRules";
import { useGameEngine } from "@/hooks/engines/useGameEngine";
import { useScoreEngine } from "@/hooks/engines/useScoreEngine";
import { useTestActionEngine, GameTest } from "@/hooks/engines/useTestActionEngine";
import { useMegaStore } from "@/lib/mega-store";
import { Activity, BicepsFlexed, Battery, Sword, ShieldAlert, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// --- Types & Config ---
const MAX_STAGES = 5;

const tugOfWarQuestions: GameTest[] = [
  { id: 1, question: "Calculate the tension: 15N + 25N = ?", options: ["35N", "40N", "45N", "50N"], correct: 1, reward_type: "Strength Boost" },
  { id: 2, question: "Force (F) = Mass (m) x ?", options: ["Velocity", "Acceleration", "Energy", "Time"], correct: 1, reward_type: "Tactical Pull" },
  { id: 3, question: "If you pull with 100N and the AI pulls with 80N, result is?", options: ["20N Forward", "20N Backward", "Stationary", "Breaking Rope"], correct: 0, reward_type: "Double Force" },
  { id: 4, question: "Static Friction is ____ Kinetic Friction.", options: ["Less than", "Greater than", "Equal to", "Variable"], correct: 1, reward_type: "Grip Boost" },
  { id: 5, question: "Energy stored in a stretched rope?", options: ["Kinetic", "Potential", "Thermal", "Nuclear"], correct: 1, reward_type: "Stamina Plus" }
];

type CharacterState = 'idle' | 'pulling' | 'struggling' | 'falling' | 'celebrating';

const GameCharacter = ({ team, state, index, isBoss = false }: { team: 'player' | 'enemy', state: CharacterState, index: number, isBoss?: boolean }) => {
  const isPlayer = team === 'player';
  const color = isPlayer ? '#3b82f6' : '#ef4444';

  let rotate = 0;
  let xOffset = 0;
  let yOffset = 0;
  let armRotate = 0;

  switch (state) {
    case 'idle':
      rotate = isPlayer ? 10 : -10;
      break;
    case 'pulling':
      rotate = isPlayer ? -35 : 35;
      xOffset = isPlayer ? -20 : 20;
      armRotate = isPlayer ? 30 : -30;
      break;
    case 'struggling':
      rotate = isPlayer ? 45 : -45;
      xOffset = isPlayer ? 25 : -25;
      break;
    case 'falling':
      rotate = isPlayer ? 90 : -90;
      yOffset = 40;
      xOffset = isPlayer ? 50 : -50;
      break;
    case 'celebrating':
      rotate = 0;
      yOffset = -30;
      armRotate = -100;
      break;
  }

  const baseOffset = isPlayer ? -index * 50 : index * 50;
  const scale = isBoss ? 1.4 : 1;

  return (
    <motion.div
      className="absolute bottom-20 z-10"
      animate={{
        x: baseOffset + xOffset,
        y: yOffset,
        rotate: rotate,
        scale: scale
      }}
      transition={{ type: "spring", stiffness: 150, damping: 12 }}
      style={{
        [isPlayer ? 'right' : 'left']: '48%',
        originX: 0.5,
        originY: 1,
        width: 120,
        height: 180
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 150">
        <circle cx="50" cy="20" r="15" fill={color} />
        <line x1="50" y1="35" x2="50" y2="80" stroke={color} strokeWidth="14" strokeLinecap="round" />
        <line x1="50" y1="80" x2="30" y2="140" stroke={color} strokeWidth="12" strokeLinecap="round" />
        <line x1="50" y1="80" x2="70" y2="140" stroke={color} strokeWidth="12" strokeLinecap="round" />
        <g style={{ transformOrigin: '50px 45px', transform: `rotate(${armRotate}deg)` }}>
          <line x1="50" y1="45" x2="85" y2="65" stroke={color} strokeWidth="10" strokeLinecap="round" />
          <line x1="50" y1="45" x2="15" y2="65" stroke={color} strokeWidth="10" strokeLinecap="round" />
        </g>
      </svg>
    </motion.div>
  );
};

export default function TugOfWarGame() {
  const { damage } = useMegaStore();
  const { status, level, setStatus, nextLevel, resetGame, isBossLevel } = useGameEngine(MAX_STAGES);
  const { score, multiplier, addPoints, resetScore } = useScoreEngine();

  // Physics State
  const [ropePosition, setRopePosition] = useState(0);
  const ropePosRef = useRef(0);

  // Character States
  const [playerState, setPlayerState] = useState<CharacterState>('idle');
  const [enemyState, setEnemyState] = useState<CharacterState>('idle');

  // Action Logic
  const handleGameAction = useCallback((result: 'success' | 'failure') => {
    if (status !== 'playing') return;

    if (result === 'success') {
      const power = 15 + (level * 2);
      ropePosRef.current += power;
      setPlayerState('pulling');
      setEnemyState('struggling');
      addPoints(100 * multiplier);
      toast.success("CRITICAL PULL!");
    } else {
      const penalty = 10 + (level * 2);
      ropePosRef.current -= penalty;
      setPlayerState('struggling');
      setEnemyState('pulling');
      toast.error("STUMBLE! Losing ground.");
    }

    // Reset to idle after animation
    setTimeout(() => {
      if (status === 'playing') {
        setPlayerState('idle');
        setEnemyState('idle');
      }
    }, 1000);
  }, [status, level, multiplier, addPoints]);

  const testEngine = useTestActionEngine({
    onAction: handleGameAction,
    cooldownMs: 800
  });

  // AI Logic
  useEffect(() => {
    if (status !== 'playing' || testEngine.phase !== 'idle') return;

    const aiInterval = setInterval(() => {
      if (testEngine.phase === 'idle') {
        // AI tries to pull
        const aiForce = 1 + (level * 0.5);
        ropePosRef.current -= aiForce;
        setRopePosition(ropePosRef.current);

        // Visual feedback for AI pulling
        setEnemyState('pulling');
        setTimeout(() => setEnemyState('idle'), 500);
      }
    }, 2000);

    return () => clearInterval(aiInterval);
  }, [status, testEngine.phase, level]);

  // Physics & Win Logic
  useEffect(() => {
    if (status !== 'playing') return;

    const checkInterval = setInterval(() => {
      setRopePosition(ropePosRef.current);

      if (ropePosRef.current >= 100) {
        setPlayerState('celebrating');
        setEnemyState('falling');
        clearInterval(checkInterval);
        setTimeout(() => {
          if (level < MAX_STAGES) {
            nextLevel();
            ropePosRef.current = 0;
            setRopePosition(0);
          } else {
            setStatus('victory');
          }
        }, 1500);
      } else if (ropePosRef.current <= -100) {
        setPlayerState('falling');
        setEnemyState('celebrating');
        clearInterval(checkInterval);
        setTimeout(() => {
          setStatus('gameover');
          damage(20);
        }, 1000);
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [status, level, damage, nextLevel, setStatus]);

  // Start logic
  const handleStart = () => {
    resetGame();
    resetScore();
    ropePosRef.current = 0;
    setRopePosition(0);
    setStatus('playing');
    setPlayerState('idle');
    setEnemyState('idle');
  };

  // Trigger first test when playing
  useEffect(() => {
    if (status === 'playing' && testEngine.phase === 'idle') {
      const randomTest = tugOfWarQuestions[Math.floor(Math.random() * tugOfWarQuestions.length)];
      testEngine.startTest(randomTest);
    }
  }, [status, testEngine.phase]);

  const currentStatusDisplay = () => {
    if (status === 'idle' || status === 'intro') {
      return <TugOfWarIntro onStart={handleStart} onShowRules={() => setStatus('rules')} />;
    }
    if (status === 'rules') {
      return <TugOfWarRules onClose={() => setStatus('intro')} />;
    }
    if (status === 'victory' || status === 'gameover') {
      return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-3xl">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center space-y-8">
            {status === 'victory' ? <Trophy className="w-32 h-32 text-primary mx-auto shadow-glow" /> : <Sword className="w-32 h-32 text-red-500 mx-auto" />}
            <h2 className="text-8xl font-display font-black italic text-white tracking-tighter uppercase">{status}</h2>
            <Button onClick={handleStart} variant={status === 'victory' ? "premium" : "destructive"} className="h-20 px-12 text-2xl">
              {status === 'victory' ? 'PLAY_AGAIN' : 'RETRY_MISSION'}
            </Button>
          </motion.div>
        </div>
      );
    }
    return null;
  };

  return (
    <BaseGameLayoutV5
      title="Tactical Tug of War"
      stage={level}
      maxStages={MAX_STAGES}
      mechanics={[
        "TEST -> ACTION System: Solve the prompt to execute a Power Pull.",
        "Precision is mandatory: Incorrect responses result in ground loss.",
        "AI Opponent: The enemy squad will pull incrementally over time.",
        "Sudden Death: Stage 5 features an elite boss with double tension."
      ]}
    >
      <div className="flex-1 flex flex-col relative overflow-hidden h-full items-center justify-between">
        {currentStatusDisplay()}

        {/* HUD */}
        <div className="w-full flex justify-between p-8 z-20 pointer-events-none mt-4">
          <div className="glass-card bg-black/40 border-white/10 px-6 py-4 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">Rope Tension</span>
            <span className={`text-4xl font-display font-black italic ${ropePosition > 0 ? 'text-primary' : 'text-red-500'}`}>
              {Math.abs(Math.floor(ropePosition))}%
            </span>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="glass-card bg-black/40 border-white/10 px-8 py-4 rounded-2xl text-right">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] block mb-1">Total Power</span>
              <span className="text-5xl font-display font-black text-white italic tracking-tighter">{score.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Test UI (Always visible when playing) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-xl px-4 pointer-events-auto">
          <AnimatePresence mode="wait">
            {status === 'playing' && testEngine.phase === 'showing_test' && testEngine.currentTest && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card bg-black/80 border-primary/30 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-8 backdrop-blur-xl"
              >
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">Tactical Prompt Engaged</span>
                  <h2 className="text-4xl font-display font-black italic text-white tracking-widest">{testEngine.currentTest.question}</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  {testEngine.currentTest.options.map((opt, i) => (
                    <Button
                      key={i}
                      onClick={() => testEngine.submitAnswer(i)}
                      className="h-20 text-2xl font-display font-black italic bg-white/[0.05] border-white/10 hover:bg-primary/20 hover:border-primary/50 text-white rounded-2xl transition-all"
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {testEngine.phase === 'evaluating_test' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-6xl font-display font-black italic tracking-tighter ${testEngine.lastResult === 'success' ? 'text-emerald-500' : 'text-red-500'} uppercase`}
              >
                {testEngine.lastResult === 'success' ? 'EXCELLENT' : 'STUMBLE'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Environment */}
        <div className="absolute bottom-0 w-full h-[400px] pointer-events-none">
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1 h-32 bg-white/5" />

          {/* The Rope */}
          <motion.div
            className="absolute bottom-32 left-0 w-[200%] h-4 bg-[#4a3728] border-y-2 border-black/40 z-10"
            style={{ x: `${ropePosition / 2}%` }}
            animate={{ x: `${ropePosition}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-10 w-8 h-12 bg-red-600 border-2 border-white/20" />
          </motion.div>

          {/* Pullers */}
          <div className="relative w-full h-full">
            {/* Player Team */}
            <motion.div animate={{ x: ropePosition }} transition={{ type: "spring" }}>
              <GameCharacter team="player" state={playerState} index={0} />
              <GameCharacter team="player" state={playerState} index={1} />
            </motion.div>

            {/* Enemy Team */}
            <motion.div animate={{ x: ropePosition }} transition={{ type: "spring" }}>
              <GameCharacter team="enemy" state={enemyState} index={0} isBoss={isBossLevel} />
              <GameCharacter team="enemy" state={enemyState} index={1} />
            </motion.div>
          </div>
        </div>

      </div>
    </BaseGameLayoutV5>
  );
}
