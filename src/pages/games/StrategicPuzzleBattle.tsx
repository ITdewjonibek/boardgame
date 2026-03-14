import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Shield, Swords, Battery, Zap, Globe, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GRID_SIZE = 6;
const INITIAL_ENERGY = 10;

export default function StrategicPuzzleBattle() {
    const {
        status,
        level,
        score,
        addScore,
        setCombo,
        combo,
        damage,
        nextLevel,
        triggerTest,
        testActive
    } = useMegaStore();

    const [grid, setGrid] = useState<('player' | 'ai' | 'neutral')[][]>([]);
    const [energy, setEnergy] = useState(INITIAL_ENERGY);
    const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What is a 'Zero-Sum Game' in strategic theory?",
            options: ["Everyone wins", "One person's gain is another's loss", "No one can win", "Random outcome"],
            correct: 1,
            explanation: "A zero-sum game is a mathematical representation in game theory where each participant's gain or loss is exactly balanced by the losses or gains of the other participants."
        },
        {
            id: 2,
            text: "Which strategy focuses on minimizing the maximum possible loss?",
            options: ["Maximax", "Minimax", "Nash Equilibrium", "Pareto Efficiency"],
            correct: 1,
            explanation: "Minimax is a decision rule used in artificial intelligence, decision theory, and game theory for minimizing the possible loss for a worst-case scenario."
        },
        {
            id: 3,
            text: "In the context of 'Resource Management', what is 'Opportunity Cost'?",
            options: ["The price of a resource", "The value of the next best alternative", "The total cost of production", "A discount on energy"],
            correct: 1,
            explanation: "Opportunity cost is the loss of potential gain from other alternatives when one alternative is chosen. Every strategic move consumes energy that could have been used elsewhere."
        }
    ];

    const initializeGrid = useCallback(() => {
        const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('neutral'));
        newGrid[0][0] = 'player';
        newGrid[GRID_SIZE - 1][GRID_SIZE - 1] = 'ai';
        setGrid(newGrid);
        setEnergy(INITIAL_ENERGY + level);
        setPlayerPos({ x: 0, y: 0 });
    }, [level]);

    const handleCapture = (x: number, y: number) => {
        if (status !== 'playing' || testActive || energy <= 0) return;

        // Check adjacency
        const dist = Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y);
        if (dist !== 1) {
            toast.error("INVALID_RANGE: Adjacency Required");
            return;
        }

        const newGrid = [...grid.map(row => [...row])];
        const target = newGrid[y][x];

        if (target === 'player') return;

        newGrid[y][x] = 'player';
        setGrid(newGrid);
        setPlayerPos({ x, y });
        setEnergy(prev => prev - 1);
        addScore(200);

        // AI Turn (Simulated)
        setTimeout(() => {
            simulateAITurn(newGrid);
        }, 500);

        // Check Win Condition
        const neutralCount = newGrid.flat().filter(c => c === 'neutral').length;
        if (neutralCount === 0 || energy <= 1) {
            const playerCount = newGrid.flat().filter(c => c === 'player').length;
            const aiCount = newGrid.flat().filter(c => c === 'ai').length;

            if (playerCount > aiCount) {
                setCombo(combo + 1);
                toast.success("TERRITORY_SECURED: Victory");
                if (level % 2 === 0) triggerTest(true);
                else { nextLevel(); initializeGrid(); }
            } else {
                damage(50);
                toast.error("STRATEGIC_DEFEAT: Retrying Phase");
                initializeGrid();
            }
        }
    };

    const simulateAITurn = (currentGrid: ('player' | 'ai' | 'neutral')[][]) => {
        const aiPositions: { x: number, y: number }[] = [];
        currentGrid.forEach((row, y) => row.forEach((cell, x) => {
            if (cell === 'ai') aiPositions.push({ x, y });
        }));

        if (aiPositions.length === 0) return;

        // Pick random AI cell and find neutral neighbor
        const randomAI = aiPositions[Math.floor(Math.random() * aiPositions.length)];
        const neighbors = [
            { x: randomAI.x + 1, y: randomAI.y }, { x: randomAI.x - 1, y: randomAI.y },
            { x: randomAI.x, y: randomAI.y + 1 }, { x: randomAI.x, y: randomAI.y - 1 }
        ].filter(n => n.x >= 0 && n.x < GRID_SIZE && n.y >= 0 && n.y < GRID_SIZE && currentGrid[n.y][n.x] !== 'ai');

        if (neighbors.length > 0) {
            const target = neighbors[Math.floor(Math.random() * neighbors.length)];
            const updatedGrid = [...currentGrid.map(row => [...row])];
            updatedGrid[target.y][target.x] = 'ai';
            setGrid(updatedGrid);
        }
    };

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            initializeGrid();
        }
    }, [status, gameStarted, initializeGrid]);

    return (
        <BaseGameLayout
            title="Strategic Puzzle Battle"
            rules={[
                "Capture neutral nodes to expand your territory.",
                "Energy is finite. Each move consumes 1 Energy Unit.",
                "AI expands automatically. Block and counter-capture.",
                "Secure the majority of the grid before energy depletion."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="grid grid-cols-6 gap-3 max-w-xl w-full relative z-10 p-6 bg-white/[0.01] rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-2xl">
                    {grid.map((row, y) => row.map((cell, x) => (
                        <motion.button
                            key={`${x}-${y}`}
                            whileHover={{ scale: cell === 'neutral' ? 1.1 : 1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleCapture(x, y)}
                            className={`aspect-square rounded-2xl border transition-all duration-500 overflow-hidden relative group ${cell === 'player' ? 'bg-primary border-primary shadow-[0_0_30px_rgba(var(--primary),0.5)] z-20' :
                                    cell === 'ai' ? 'bg-red-500/40 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.3)]' :
                                        'bg-white/5 border-white/10 hover:border-white/20'
                                }`}
                        >
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                {cell === 'player' ? <Globe className="w-8 h-8" /> :
                                    cell === 'ai' ? <Cpu className="w-8 h-8" /> :
                                        <Shield className="w-6 h-6" />}
                            </div>
                            {playerPos.x === x && playerPos.y === y && (
                                <motion.div layoutId="player" className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <Swords className="w-8 h-8 text-black" />
                                </motion.div>
                            )}
                        </motion.button>
                    )))}
                </div>

                <div className="mt-12 flex items-center gap-8">
                    <motion.div
                        animate={{ scale: energy < 3 ? [1, 1.1, 1] : 1 }}
                        transition={{ repeat: Infinity }}
                        className={`px-8 py-4 rounded-2xl border flex items-center gap-4 ${energy < 3 ? 'bg-red-500/10 border-red-500/50' : 'bg-white/5 border-white/10'}`}
                    >
                        <Battery className={`w-6 h-6 ${energy < 3 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-white/30">CORE_ENERGY</span>
                            <span className="text-xl font-display font-black tracking-tighter">{energy} E_UNITS</span>
                        </div>
                    </motion.div>
                    <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                        <Zap className="w-6 h-6 text-secondary" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-white/30">CURRENT_TIER</span>
                            <span className="text-xl font-display font-black tracking-tighter">LVL {level} STRATEGY</span>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="strategic-battle"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            initializeGrid();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
