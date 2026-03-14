import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayoutV5 from "@/components/BaseGameLayoutV5";
import AssessmentCore from "@/components/AssessmentCore";
import { useMegaStore } from "@/lib/mega-store";
import { useScoreManager } from "@/lib/score-manager";
import { Cpu, ShieldAlert, Zap, Radio, Globe2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Game Config
const MAX_STAGES = 10;
const BOSS_STAGES = [5, 10];

type PlayerType = 'player' | 'ai' | null;

interface Node {
  x: number;
  y: number;
  owner: PlayerType;
  charges: number;
  capacity: number;
  isBlackHole: boolean; // Boss mechanic
}

export default function QuantumChainReactionV5() {
  const { status, level, damage, nextLevel, triggerTest, testActive, setStatus } = useMegaStore();
  const { addPoints, incrementCombo, breakCombo } = useScoreManager();

  const isBossStage = BOSS_STAGES.includes(level);
  const gridSize = isBossStage ? 8 : (level >= 6 ? 7 : 6);

  const [grid, setGrid] = useState<Node[][]>([]);
  const [turn, setTurn] = useState<PlayerType>('player');
  const [gameStarted, setGameStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize Grid
  const initGrid = useCallback(() => {
    const newGrid: Node[][] = [];
    for (let y = 0; y < gridSize; y++) {
      const row: Node[] = [];
      for (let x = 0; x < gridSize; x++) {
        // Capacity is based on neighbors (corners=2, edges=3, mid=4)
        let neighbors = 0;
        if (y > 0) neighbors++;
        if (y < gridSize - 1) neighbors++;
        if (x > 0) neighbors++;
        if (x < gridSize - 1) neighbors++;

        const isBlackHole = isBossStage && Math.random() < 0.05 && neighbors === 4;

        row.push({
          x, y,
          owner: null,
          charges: 0,
          capacity: isBlackHole ? 99 : neighbors,
          isBlackHole
        });
      }
      newGrid.push(row);
    }

    // Start positions
    newGrid[0][0].owner = 'player';
    newGrid[0][0].charges = 1;

    newGrid[gridSize - 1][gridSize - 1].owner = 'ai';
    newGrid[gridSize - 1][gridSize - 1].charges = 1;

    if (isBossStage) {
      newGrid[0][gridSize - 1].owner = 'ai';
      newGrid[0][gridSize - 1].charges = 1;
    }

    setGrid(newGrid);
    setTurn('player');
    setGameStarted(true);
    setIsProcessing(false);
  }, [gridSize, isBossStage]);

  useEffect(() => {
    if (status === 'playing' && !gameStarted) {
      initGrid();
    }
  }, [status, gameStarted, initGrid]);

  const checkWinCondition = useCallback((currentGrid: Node[][]) => {
    let pCount = 0;
    let aiCount = 0;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (currentGrid[y][x].owner === 'player') pCount++;
        if (currentGrid[y][x].owner === 'ai') aiCount++;
      }
    }

    // Need at least 2 moves passed before win check is valid 
    // (Actually, start positions guarantee > 0, so if one is 0, they lost)
    if (pCount === 0) {
      damage(isBossStage ? 40 : 20);
      breakCombo();
      toast.error("CHAIN_COLLAPSE: Quantum State Lost");
      initGrid();
      return true;
    }
    if (aiCount === 0) {
      toast.success(`SECTOR_CLEARED: AI Eliminated`);
      addPoints(3000 * level, 'bonus');
      if (level % 5 === 0) triggerTest(true);
      else { nextLevel(); setGameStarted(false); }
      return true;
    }
    return false;
  }, [gridSize, level, isBossStage, damage, breakCombo, initGrid, addPoints, triggerTest, nextLevel]);

  // Recursively process explosions
  const processExplosions = async (initialGrid: Node[][], owner: PlayerType) => {
    setIsProcessing(true);
    let currentGrid = JSON.parse(JSON.stringify(initialGrid)) as Node[][];
    let exploring = true;
    let chainCount = 0;

    while (exploring) {
      exploring = false;
      let newGrid = JSON.parse(JSON.stringify(currentGrid)) as Node[][];

      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          if (newGrid[y][x].charges >= newGrid[y][x].capacity && !newGrid[y][x].isBlackHole) {
            exploring = true;
            chainCount++;

            // Reset this node
            newGrid[y][x].charges -= newGrid[y][x].capacity;
            if (newGrid[y][x].charges === 0) newGrid[y][x].owner = null;

            // Distribute to neighbors
            const neighbors = [
              { nx: x, ny: y - 1 },
              { nx: x, ny: y + 1 },
              { nx: x - 1, ny: y },
              { nx: x + 1, ny: y }
            ];

            for (let n of neighbors) {
              if (n.ny >= 0 && n.ny < gridSize && n.nx >= 0 && n.nx < gridSize) {
                const target = newGrid[n.ny][n.nx];
                if (target.isBlackHole) {
                  // Absorbs charge, ownership lost
                  target.charges++;
                } else {
                  target.owner = owner;
                  target.charges++;
                }
              }
            }
          }
        }
      }

      if (exploring) {
        setGrid(newGrid);
        currentGrid = newGrid;
        // Visual delay for explosion chain
        await new Promise(r => setTimeout(r, 200));
      }
    }

    if (owner === 'player' && chainCount > 0) {
      addPoints(chainCount * 150, isBossStage ? 'boss' : 'combo');
      if (chainCount > 3) {
        incrementCombo();
        toast.success(`COMBO_CHAIN: x${chainCount} Reactions`);
      }
    }

    setIsProcessing(false);

    const gameEnded = checkWinCondition(currentGrid);
    if (!gameEnded) {
      setTurn(owner === 'player' ? 'ai' : 'player');
    }
  };

  const placeCharge = async (x: number, y: number, player: PlayerType) => {
    const newGrid = JSON.parse(JSON.stringify(grid)) as Node[][];
    const node = newGrid[y][x];

    if (node.isBlackHole) {
      if (player === 'player') toast.error("VOID_ANOMALY: Charge Absorbed");
      node.charges++;
    } else {
      node.owner = player;
      node.charges++;
    }

    setGrid(newGrid);
    await processExplosions(newGrid, player);
  };

  const handleCellClick = (x: number, y: number) => {
    if (turn !== 'player' || isProcessing || !gameStarted || testActive) return;
    const node = grid[y][x];

    // Can only place on empty or own nodes
    if (node.owner !== null && node.owner !== 'player') return;

    placeCharge(x, y, 'player');
  };

  // AI Logic
  useEffect(() => {
    if (turn !== 'ai' || isProcessing || status !== 'playing' || testActive || !gameStarted) return;

    const timer = setTimeout(() => {
      // AI Logic: Find best move
      // Priority 1: Explode own node that will capture player nodes
      // Priority 2: Place on own node near player
      // Priority 3: Random empty or own node
      const validMoves: { x: number, y: number }[] = [];
      const explodingMoves: { x: number, y: number }[] = [];

      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const node = grid[y][x];
          if ((node.owner === 'ai' || node.owner === null) && !node.isBlackHole) {
            validMoves.push({ x, y });
            if (node.charges === node.capacity - 1) {
              explodingMoves.push({ x, y });
            }
          }
        }
      }

      let move;
      if (explodingMoves.length > 0 && Math.random() > 0.2) {
        move = explodingMoves[Math.floor(Math.random() * explodingMoves.length)];
      } else if (validMoves.length > 0) {
        move = validMoves[Math.floor(Math.random() * validMoves.length)];
      }

      if (move) {
        placeCharge(move.x, move.y, 'ai');
      }
    }, 600);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, isProcessing, status, testActive, gameStarted, grid, gridSize]);

  const handleTestComplete = (bonusScore: number, isCustom: boolean) => {
    if (bonusScore > 0) addPoints(bonusScore, 'bonus');
    triggerTest(false);
    if (level >= MAX_STAGES) {
      toast.success("MEGA_SYSTEM_CLEARED: Quantum Dominance");
      setStatus('victory');
    } else {
      nextLevel();
      setGameStarted(false);
    }
  };

  const defaultTestQuestions = [
    {
      id: 1,
      text: "In nuclear physics, what is 'Critical Mass'?",
      options: ["The maximum weight of a reactor", "The minimum amount of fissile material needed to maintain a nuclear chain reaction", "The point where particles disappear", "The mass of a black hole"],
      correct: 1,
      explanation: "Critical mass is the smallest amount of fissile material needed for a sustained nuclear chain reaction, much like reaching capacity on a node.",
      difficulty: "medium" as const
    },
    {
      id: 2,
      text: "A 'Black Hole' in astrophysics is characterized by:",
      options: ["Emitting massive amounts of light", "A gravitational field so strong that nothing, not even light, can escape", "Being completely hollow", "Having zero mass"],
      correct: 1,
      explanation: "A black hole absorbs everything that crosses its event horizon, identical to the anomaly nodes in Boss Phases.",
      difficulty: "easy" as const
    },
    {
      id: 3,
      text: "What defines an exponential chain reaction?",
      options: ["Linear growth over time", "Each step triggers multiple subsequent steps, leading to rapid scaling", "Reactions that immediately stop after one step", "Reactions that reverse themselves"],
      correct: 1,
      explanation: "An exponential chain reaction multiplies in scale at each iteration, rapidly expanding across the grid.",
      difficulty: "hard" as const
    }
  ];

  return (
    <BaseGameLayoutV5
      title="Quantum Chain Reaction V5"
      stage={level}
      maxStages={MAX_STAGES}
      mechanics={[
        "Place Quantum Charges on empty nodes or your own nodes.",
        "When a node reaches Critical Capacity, it explodes, capturing adjacent nodes.",
        "Chain reactions are key: Exploding nodes can trigger secondary explosions.",
        "Eliminate all Enemy AI nodes from the grid to secure the sector.",
        "Boss Phases (5 & 10): Larger grid and Black Hole Anomaly nodes that absorb charges."
      ]}
    >
      <div className="flex-1 flex flex-col p-8 lg:p-12 relative overflow-hidden h-full items-center justify-center">

        {/* Boss Warning */}
        <AnimatePresence>
          {isBossStage && gameStarted && !testActive && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-12 py-3 rounded-full bg-red-500/10 border-2 border-red-500/50 flex items-center gap-4 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
            >
              <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
              <span className="text-sm font-black tracking-[0.5em] text-red-500 uppercase">Boss Phase: Void Anomalies Detected</span>
              <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Indicators */}
        <div className="absolute top-8 left-8 right-8 flex justify-between z-20">
          <div className="glass-card bg-primary/10 border-primary/30 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-widest text-primary uppercase">Player Node</span>
              <span className="text-sm font-black text-white italic">{turn === 'player' ? 'AWAITING INPUT' : 'STANDBY'}</span>
            </div>
          </div>

          <div className="glass-card bg-red-500/10 border-red-500/30 p-4 rounded-2xl flex flex-row-reverse items-center gap-4 text-right">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">Enemy Net</span>
              <span className="text-sm font-black text-white italic">{turn === 'ai' ? 'COMPUTING...' : 'STANDBY'}</span>
            </div>
          </div>
        </div>

        {/* The Grid Core */}
        <div className="relative z-10 mt-12 w-full max-w-3xl aspect-square flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
            <Globe2 className="w-[800px] h-[800px] text-primary animate-pulse" />
          </div>

          <motion.div
            className="grid gap-[2px] sm:gap-1 p-4 sm:p-6 glass-card bg-black/40 border border-white/10 rounded-[3rem] shadow-2xl backdrop-blur-3xl relative w-full h-full"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
            }}
          >
            {grid.map((row, y) => row.map((node, x) => {
              const isPlayer = node.owner === 'player';
              const isAI = node.owner === 'ai';

              return (
                <button
                  key={`${x}-${y}`}
                  onClick={() => handleCellClick(x, y)}
                  disabled={turn !== 'player' || isProcessing || (node.owner !== null && !isPlayer) || node.isBlackHole}
                  className={`
                                relative rounded-xl sm:rounded-2xl border flex items-center justify-center transition-all duration-300
                                ${isPlayer ? 'bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.3)] z-10' : ''}
                                ${isAI ? 'bg-red-500/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] z-10' : ''}
                                ${!node.owner && !node.isBlackHole ? 'bg-white/[0.02] border-white/5 hover:border-white/20 cursor-pointer' : ''}
                                ${node.isBlackHole ? 'bg-black border-purple-900 shadow-[inset_0_0_20px_rgba(88,28,135,1)] cursor-not-allowed overflow-hidden' : ''}
                            `}
                >
                  {/* Black Hole VFX */}
                  {node.isBlackHole && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,black_30%,transparent_70%)] rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <div className="w-full h-full border-2 border-purple-500/20 rounded-full animate-spin-slow opacity-50" />
                    </div>
                  )}

                  {/* Charges rendering */}
                  <div className="grid grid-cols-2 gap-1 p-2 sm:p-3 relative z-10 w-full h-full place-items-center">
                    {Array.from({ length: node.charges }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full shadow-lg
                                            ${isPlayer ? 'bg-primary shadow-primary/50' : ''}
                                            ${isAI ? 'bg-red-500 shadow-red-500/50' : ''}
                                            ${node.isBlackHole ? 'bg-purple-500 shadow-purple-500/50' : ''}
                                        `}
                      />
                    ))}
                  </div>

                  {/* Critical warning */}
                  {node.charges === node.capacity - 1 && node.owner && !node.isBlackHole && (
                    <div className="absolute inset-0 border-2 rounded-xl sm:rounded-2xl animate-pulse pointer-events-none
                                    ${isPlayer ? 'border-primary/50' : 'border-red-500/50'}
                                " />
                  )}
                </button>
              );
            }))}
          </motion.div>
        </div>

      </div>

      <AnimatePresence>
        {testActive && (
          <AssessmentCore
            gameId="chain-v5"
            defaultQuestions={defaultTestQuestions}
            onComplete={handleTestComplete}
          />
        )}
      </AnimatePresence>
    </BaseGameLayoutV5>
  );
}
