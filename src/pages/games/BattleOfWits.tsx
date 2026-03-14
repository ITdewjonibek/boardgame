import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayoutV5 from "@/components/BaseGameLayoutV5";
import AssessmentCore from "@/components/AssessmentCore";
import { useMegaStore } from "@/lib/mega-store";
import { useScoreManager } from "@/lib/score-manager";
import { Cpu, ShieldAlert, Crosshair, Map as MapIcon, Shield, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Game Config
const MAX_STAGES = 10;
const BOSS_STAGES = [5, 10];

interface GridNode {
    id: number;
    value: number;
    owner: 'player' | 'ai' | null;
    isTrap: boolean;
    isHidden: boolean;
}

export default function StrategyGridWarV5() {
    const { status, level, damage, heal, nextLevel, triggerTest, testActive, setStatus } = useMegaStore();
    const { addPoints, incrementCombo, breakCombo, sessionCombo } = useScoreManager();

    const isBossStage = BOSS_STAGES.includes(level);
    const gridSize = isBossStage ? 8 : (level >= 6 ? 7 : 6); // 6x6, 7x7, 8x8

    const [grid, setGrid] = useState<GridNode[]>([]);
    const [turn, setTurn] = useState<'player' | 'ai'>('player');
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [turnsLeft, setTurnsLeft] = useState(0);

    const initGrid = useCallback(() => {
        const nodes: GridNode[] = [];
        const total = gridSize * gridSize;

        for (let i = 0; i < total; i++) {
            const isTrap = isBossStage && Math.random() < 0.15;
            const isHidden = isBossStage && Math.random() < 0.3; // Boss hides 30% of nodes
            const valBase = Math.floor(Math.random() * 90) + 10;

            nodes.push({
                id: i,
                value: isTrap ? -(valBase * 2) : valBase,
                owner: null,
                isTrap,
                isHidden
            });
        }

        setGrid(nodes);
        setTurn('player');
        setPlayerScore(0);
        setAiScore(0);
        setTurnsLeft(Math.floor(total / 2)); // Each gets half the board to play
        setGameStarted(true);
    }, [gridSize, isBossStage]);

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            initGrid();
        }
    }, [status, gameStarted, initGrid]);

    const checkEndGame = useCallback((pScore: number, aScore: number) => {
        if (turnsLeft <= 0) {
            if (pScore > aScore) {
                toast.success(`GRID_SECURED: Enemy AI Overpowered`);
                addPoints(2000 * level, 'bonus');
                if (level % 5 === 0) triggerTest(true);
                else { nextLevel(); setGameStarted(false); }
            } else {
                damage(isBossStage ? 40 : 20);
                breakCombo();
                toast.error("STRATEGY_FAILURE: Grid Lost to AI");
                initGrid(); // Retry level
            }
        }
    }, [turnsLeft, level, isBossStage, addPoints, triggerTest, nextLevel, damage, breakCombo, initGrid]);

    useEffect(() => {
        if (turnsLeft === 0 && gameStarted) checkEndGame(playerScore, aiScore);
    }, [turnsLeft, gameStarted, checkEndGame, playerScore, aiScore]);

    // AI Turn Logic
    useEffect(() => {
        if (status !== 'playing' || testActive || turn !== 'ai' || turnsLeft <= 0) return;

        const timer = setTimeout(() => {
            // Very smart AI: picks highest value available node that isn't a trap
            // In Boss stage, AI might also "cheat" and see hidden nodes to avoid traps.
            const available = grid.filter(n => n.owner === null);
            if (available.length === 0) return;

            let bestNode = available[0];
            for (let n of available) {
                if (n.value > bestNode.value) {
                    bestNode = n;
                }
            }

            // If AI only sees traps (or highly negative), it'll be forced to pick one
            // Add some randomness to lower levels
            if (!isBossStage && Math.random() < (0.8 - (level * 0.1))) {
                bestNode = available[Math.floor(Math.random() * available.length)];
            }

            setGrid(prev => prev.map(n => n.id === bestNode.id ? { ...n, owner: 'ai', isHidden: false } : n));
            setAiScore(prev => prev + bestNode.value);
            setTurn('player');
            setTurnsLeft(prev => prev - 1);

        }, 800 + Math.random() * 700); // 0.8s to 1.5s delay to feel like "thinking"

        return () => clearTimeout(timer);
    }, [turn, grid, status, testActive, turnsLeft, level, isBossStage]);

    const handleNodeClick = (id: number) => {
        if (turn !== 'player' || status !== 'playing' || testActive || turnsLeft <= 0) return;

        const node = grid.find(n => n.id === id);
        if (!node || node.owner !== null) return;

        setGrid(prev => prev.map(n => n.id === id ? { ...n, owner: 'player', isHidden: false } : n));

        if (node.value > 0) {
            setPlayerScore(prev => prev + node.value);
            addPoints(node.value * 10, isBossStage ? 'boss' : 'standard');
            incrementCombo();
        } else {
            // Hit a trap
            setPlayerScore(prev => prev + node.value);
            damage(10);
            breakCombo();
            toast.error("TRAP_ACTIVATED: Data Corrupted");
        }

        setTurn('ai');
    };

    const handleTestComplete = (bonusScore: number, isCustom: boolean) => {
        if (bonusScore > 0) addPoints(bonusScore, 'bonus');
        triggerTest(false);
        if (level >= MAX_STAGES) {
            toast.success("MEGA_SYSTEM_CLEARED: Grand Strategist");
            setStatus('victory');
        } else {
            nextLevel();
            setGameStarted(false);
        }
    };

    const defaultTestQuestions = [
        {
            id: 1,
            text: "In game theory, a 'zero-sum game' is a mathematical representation of a situation in which:",
            options: ["Both participants can win", "Participant's gain/loss is exactly balanced by the others' loss/gain", "No one wins", "Only the AI wins"],
            correct: 1,
            explanation: "A zero-sum game implies that wealth is neither created nor destroyed, merely transferred.",
            difficulty: "medium" as const
        },
        {
            id: 2,
            text: "Which algorithm is commonly used for AI decision-making in turn-based strategy games like Chess or Grid War?",
            options: ["A* Search", "Minimax Algorithm", "Dijkstra's Algorithm", "Binary Search"],
            correct: 1,
            explanation: "Minimax is a decision rule used for minimizing the possible loss for a worst case scenario, common in 2-player turn-based games.",
            difficulty: "hard" as const
        },
        {
            id: 3,
            text: "If a Grid Node has a value of -50 (Trap), capturing it means:",
            options: ["You gain 50 points", "The AI loses 50 points", "You lose 50 points from your total", "The game ends immediately"],
            correct: 2,
            explanation: "Negative value nodes subtract from your accumulated points and damage your hull.",
            difficulty: "easy" as const
        }
    ];

    return (
        <BaseGameLayoutV5
            title="Strategy Grid War V5"
            stage={level}
            maxStages={MAX_STAGES}
            mechanics={[
                "Turn-Based Combat: Claim a Data Node on the grid. The AI will then claim one.",
                "Secure more total data value than the AI before turns run out.",
                "Capturing positive nodes builds your Combo Chain.",
                "Watch for Traps (Negative Value) which cause immediate hull damage and break combos.",
                "Boss Phases (5 & 10): Grid expands. 30% of nodes hide their true values. High risk of hidden traps."
            ]}
        >
            <div className="flex-1 flex flex-col p-8 lg:p-12 relative overflow-hidden h-full">

                {/* Boss Warning */}
                <AnimatePresence>
                    {isBossStage && gameStarted && !testActive && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-12 py-3 rounded-full bg-red-500/10 border-2 border-red-500/50 flex items-center gap-4"
                        >
                            <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                            <span className="text-sm font-black tracking-[0.5em] text-red-500 uppercase">Boss Phase: Fog of War Enabled</span>
                            <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* HUD: Scores & Turns */}
                <div className="flex justify-between items-center mb-8 relative z-20">
                    {/* Player Stats */}
                    <div className="glass-card bg-primary/10 border-primary/30 p-4 rounded-3xl min-w-[200px] flex items-center gap-4 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                            <Crosshair className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black tracking-widest text-primary uppercase block mb-1">Operative Sec</span>
                            <span className="text-3xl font-display font-black text-white italic">{playerScore}</span>
                        </div>
                    </div>

                    {/* Turn Indicator */}
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase mb-2">Remaining Ops</span>
                        <div className="text-4xl font-display font-black text-white italic bg-white/5 px-6 py-2 rounded-2xl border border-white/10">
                            {turnsLeft}
                        </div>
                        <div className={`mt-4 px-6 py-1 rounded-full text-xs font-black tracking-widest uppercase transition-colors ${turn === 'player' ? 'bg-primary text-black' : 'bg-red-500 text-white animate-pulse'}`}>
                            {turn === 'player' ? 'Your Turn' : 'AI Computing...'}
                        </div>
                    </div>

                    {/* AI Stats */}
                    <div className="glass-card bg-red-500/10 border-red-500/30 p-4 rounded-3xl min-w-[200px] flex justify-end items-center gap-4 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                        <div className="text-right">
                            <span className="text-[10px] font-black tracking-widest text-red-500 uppercase block mb-1">Enemy Net</span>
                            <span className="text-3xl font-display font-black text-white italic">{aiScore}</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
                            <Cpu className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* The Grid Core */}
                <div className="flex-1 flex justify-center items-center relative z-10 w-full">
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                        <MapIcon className="w-[600px] h-[600px] text-white" />
                    </div>

                    <motion.div
                        className="grid gap-2 sm:gap-4 p-6 glass-card bg-black/50 border border-white/10 rounded-[3rem] shadow-2xl backdrop-blur-3xl relative"
                        style={{
                            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
                        }}
                    >
                        <AnimatePresence>
                            {grid.map(node => {
                                const isCapturedPlayer = node.owner === 'player';
                                const isCapturedAI = node.owner === 'ai';
                                const showHidden = node.isHidden && node.owner === null;

                                return (
                                    <motion.button
                                        key={node.id}
                                        onClick={() => handleNodeClick(node.id)}
                                        disabled={turn !== 'player' || node.owner !== null || turnsLeft <= 0}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`
                                    w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl border-2 flex flex-col items-center justify-center relative transition-all duration-300 group
                                    ${isCapturedPlayer ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(var(--primary),0.5)] z-10' : ''}
                                    ${isCapturedAI ? 'bg-red-500/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] z-10' : ''}
                                    ${!node.owner ? 'bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/10 cursor-pointer' : 'cursor-not-allowed'}
                                `}
                                    >
                                        {/* Icons overlay */}
                                        {isCapturedPlayer && <Shield className="absolute text-primary/30 w-full h-full p-2 lg:p-4 rotate-12" />}
                                        {isCapturedAI && <Swords className="absolute text-red-500/30 w-full h-full p-2 lg:p-4 -rotate-12" />}

                                        <span className={`text-lg sm:text-xl lg:text-3xl font-display font-black italic tracking-tighter relative z-10
                                    ${isCapturedPlayer ? 'text-primary' : isCapturedAI ? 'text-red-500' : 'text-white/60'}
                                    ${node.isTrap && !node.isHidden ? 'text-red-500' : ''}
                                `}>
                                            {showHidden ? '??' : node.value}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                </div>

            </div>

            <AnimatePresence>
                {testActive && (
                    <AssessmentCore
                        gameId="grid-war-v5"
                        defaultQuestions={defaultTestQuestions}
                        onComplete={handleTestComplete}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayoutV5>
    );
}
