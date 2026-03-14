import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Shield, Swords, Zap, Globe, Cpu, Target, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GRID_SIZE = 8;
const INITIAL_CELLS = 4;

export default function StrategyGridWar() {
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
    const [playerCells, setPlayerCells] = useState(INITIAL_CELLS);
    const [aiCells, setAiCells] = useState(INITIAL_CELLS);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What is 'Tactical Dominance' in grid-based strategy games?",
            options: ["Owning more cells", "Controlling key bottlenecks/chokepoints", "Fastest movement", "Highest score"],
            correct: 1,
            explanation: "Tactical dominance refers to the strategic control of key areas of the map that limit the opponent's movement or provide superior offensive/defensive positions."
        },
        {
            id: 2,
            text: "Which AI strategy focuses on surrounding the player's territory?",
            options: ["Encirclement", "Blitzkrieg", "Attrition", "Turtle Strategy"],
            correct: 0,
            explanation: "Encirclement is a military and strategic concept where a force is isolated and surrounded by enemy forces, cutting off supplies and movement."
        },
        {
            id: 3,
            text: "In complex systems, what is 'Emergent Complexity'?",
            options: ["The rules are complex", "Simple rules creating complex behavior", "A system error", "A type of graphics"],
            correct: 1,
            explanation: "Emergence occurs when a complex system exhibits properties that its individual parts do not have on their own, often arising from simple local interactions."
        }
    ];

    const initializeGrid = useCallback(() => {
        const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('neutral'));

        // Player start (top-left)
        newGrid[0][0] = 'player';
        newGrid[0][1] = 'player';
        newGrid[1][0] = 'player';
        newGrid[1][1] = 'player';

        // AI start (bottom-right)
        newGrid[GRID_SIZE - 1][GRID_SIZE - 1] = 'ai';
        newGrid[GRID_SIZE - 1][GRID_SIZE - 2] = 'ai';
        newGrid[GRID_SIZE - 2][GRID_SIZE - 1] = 'ai';
        newGrid[GRID_SIZE - 2][GRID_SIZE - 2] = 'ai';

        setGrid(newGrid);
        setPlayerCells(INITIAL_CELLS);
        setAiCells(INITIAL_CELLS);
    }, [level]);

    const handleCapture = (x: number, y: number) => {
        if (status !== 'playing' || testActive) return;

        // Must be adjacent to player cell
        const isAdjacent = [
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
        ].some(d => {
            const nx = x + d.dx;
            const ny = y + d.dy;
            return nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && grid[ny][nx] === 'player';
        });

        if (!isAdjacent) {
            toast.error("INVALID_STRIKE: Target Area Unreachable");
            return;
        }

        const newGrid = [...grid.map(row => [...row])];
        if (newGrid[y][x] === 'player') return;

        const wasAI = newGrid[y][x] === 'ai';
        newGrid[y][x] = 'player';
        setGrid(newGrid);
        addScore(wasAI ? 500 : 100);

        // AI Response (Dynamic)
        setTimeout(() => simulateAIExpansion(newGrid), 300);

        // Count and Verify
        const counts = newGrid.flat().reduce((acc, cell) => {
            acc[cell]++;
            return acc;
        }, { player: 0, ai: 0, neutral: 0 });

        setPlayerCells(counts.player);
        setAiCells(counts.ai);

        if (counts.neutral === 0) {
            if (counts.player > counts.ai) {
                setCombo(combo + 1);
                toast.success("GRID_DECRYPTED: Total Dominance Achieved");
                if (level % 2 === 0) triggerTest(true);
                else { nextLevel(); initializeGrid(); }
            } else {
                damage(40);
                toast.error("GRID_BREACH: AI Dominance Detected");
                initializeGrid();
            }
        }
    };

    const simulateAIExpansion = (currentGrid: ('player' | 'ai' | 'neutral')[][]) => {
        const aiCellsList: { x: number, y: number }[] = [];
        currentGrid.forEach((row, y) => row.forEach((cell, x) => {
            if (cell === 'ai') aiCellsList.push({ x, y });
        }));

        if (aiCellsList.length === 0) return;

        // AI looks for neutral or player neighbors to capture
        const possibleMoves: { x: number, y: number, priority: number }[] = [];
        aiCellsList.forEach(pos => {
            [
                { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
            ].forEach(d => {
                const nx = pos.x + d.dx;
                const ny = pos.y + d.dy;
                if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && currentGrid[ny][nx] !== 'ai') {
                    const priority = currentGrid[ny][nx] === 'player' ? 2 : 1;
                    possibleMoves.push({ x: nx, y: ny, priority });
                }
            });
        });

        if (possibleMoves.length > 0) {
            // Pick best moves (highest priority)
            const maxPriority = Math.max(...possibleMoves.map(m => m.priority));
            const bestMoves = possibleMoves.filter(m => m.priority === maxPriority);
            const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];

            const nextGrid = [...currentGrid.map(row => [...row])];
            nextGrid[move.y][move.x] = 'ai';
            setGrid(nextGrid);
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
            title="Strategy Grid War"
            rules={[
                "Expand your network by capturing adjacent regional nodes.",
                "Capturing AI nodes (Red) grants high-tier data credits.",
                "Precision Tactics: Block AI expansion paths to isolate their core.",
                "Expert Grid Analysis (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="grid grid-cols-8 gap-1.5 max-w-2xl w-full relative z-10 p-4 bg-white/[0.02] rounded-[2rem] border border-white/5 backdrop-blur-2xl">
                    {grid.map((row, y) => row.map((cell, x) => (
                        <motion.button
                            key={`${x}-${y}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleCapture(x, y)}
                            className={`aspect-square rounded-lg border transition-all duration-300 relative group ${cell === 'player' ? 'bg-primary border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] z-10' :
                                    cell === 'ai' ? 'bg-red-500/40 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
                                        'bg-white/5 border-white/5 hover:border-white/20'
                                }`}
                        >
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                {cell === 'player' ? <Globe className="w-5 h-5" /> :
                                    cell === 'ai' ? <Cpu className="w-5 h-5" /> :
                                        <Target className="w-4 h-4" />}
                            </div>
                        </motion.button>
                    )))}
                </div>

                <div className="mt-12 flex items-center gap-8 w-full max-w-2xl">
                    <div className="flex-1 p-6 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Swords className="w-6 h-6 text-primary" />
                            <span className="text-xs font-black tracking-widest text-primary uppercase">Player_Territory</span>
                        </div>
                        <span className="text-3xl font-display font-black text-white">{Math.round((playerCells / 64) * 100)}%</span>
                    </div>

                    <div className="flex-1 p-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Network className="w-6 h-6 text-red-500" />
                            <span className="text-xs font-black tracking-widest text-red-500 uppercase">AI_Territory</span>
                        </div>
                        <span className="text-3xl font-display font-black text-white">{Math.round((aiCells / 64) * 100)}%</span>
                    </div>
                </div>

                <div className="mt-8 px-6 py-2 rounded-full bg-white/5 border border-white/5 flex items-center gap-3">
                    <Zap className="w-4 h-4 text-secondary" />
                    <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Strategic Complexity Tier: {level}</span>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="grid-war"
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
