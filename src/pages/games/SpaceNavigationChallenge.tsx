import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Rocket, Box, Zap, ShieldAlert, Navigation, CircleDot, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GRID_SIZE = 8;

export default function SpaceNavigationChallenge() {
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

    const [grid, setGrid] = useState<('empty' | 'asteroid' | 'blackhole' | 'start' | 'target')[][]>([]);
    const [playerPos, setPlayerPos] = useState({ x: 0, y: 7 });
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What is an 'Event Horizon' in astrophysics?",
            options: ["A planet's surface", "The boundary around a black hole", "The speed of light", "A type of star"],
            correct: 1,
            explanation: "The event horizon is a boundary in spacetime around a black hole beyond which events cannot affect an outside observer."
        },
        {
            id: 2,
            text: "Which force is primarily responsible for planetary orbits?",
            options: ["Magnetism", "Gravity", "Elasticity", "Thermal energy"],
            correct: 1,
            explanation: "Gravity is the force that attracts two bodies toward each other, keeping planets in orbit around stars and moons around planets."
        },
        {
            id: 3,
            text: "What is 'Escape Velocity'?",
            options: ["Speed of a rocket at launch", "Minimum speed to break free from gravity", "Speed of light in a vacuum", "Speed of sound in space"],
            correct: 1,
            explanation: "Escape velocity is the minimum speed needed for a free, non-propelled object to escape from the gravitational influence of a massive body."
        }
    ];

    const initializeGrid = useCallback(() => {
        const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));

        // Start and Target
        newGrid[7][0] = 'start';
        newGrid[0][7] = 'target';

        // Obstacles based on level
        const obstacleCount = 5 + level * 2;
        for (let i = 0; i < obstacleCount; i++) {
            const rx = Math.floor(Math.random() * GRID_SIZE);
            const ry = Math.floor(Math.random() * GRID_SIZE);
            if (newGrid[ry][rx] === 'empty') {
                newGrid[ry][rx] = Math.random() > 0.8 ? 'blackhole' : 'asteroid';
            }
        }

        setGrid(newGrid);
        setPlayerPos({ x: 0, y: 7 });
    }, [level]);

    const handleMove = (dx: number, dy: number) => {
        if (status !== 'playing' || testActive) return;

        const nx = playerPos.x + dx;
        const ny = playerPos.y + dy;

        if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) {
            toast.error("TRAJECTORY_ERROR: Boundary Violation");
            return;
        }

        const cell = grid[ny][nx];
        if (cell === 'blackhole') {
            damage(100);
            toast.error("VOID_CRITICAL: Spacetime Compression Detected");
            initializeGrid();
            return;
        }

        if (cell === 'asteroid') {
            damage(30);
            toast.warning("HULL_IMPACT: Meteor Collision");
        }

        setPlayerPos({ x: nx, y: ny });

        if (cell === 'target') {
            addScore(2000);
            setCombo(combo + 1);
            toast.success("DESTINATION_REACHED: Orbital Sync Stabilized");
            if (level % 2 === 0) triggerTest(true);
            else { nextLevel(); initializeGrid(); }
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
            title="Space Navigation Challenge"
            rules={[
                "Navigate the spacecraft from the START_NODE to the TARGET_BEACON.",
                "Avoid Gravitational Singularities (Black Holes) at all costs.",
                "Asteroid fields cause significant hull damage. Plan your course.",
                "Expert Astro-Analysis (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="grid grid-cols-8 gap-2 max-w-2xl w-full p-6 bg-white/[0.02] rounded-[3rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden shadow-2xl">

                    {/* Stars Decor */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                                style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                            />
                        ))}
                    </div>

                    {grid.map((row, y) => row.map((cell, x) => (
                        <div
                            key={`${x}-${y}`}
                            className={`aspect-square rounded-xl border flex items-center justify-center relative transition-all duration-500 overflow-hidden ${cell === 'target' ? 'bg-secondary/20 border-secondary shadow-[0_0_20px_rgba(var(--secondary),0.3)] animate-pulse' :
                                    cell === 'blackhole' ? 'bg-black border-red-500/40 shadow-[inner_0_0_20px_#ef4444]' :
                                        cell === 'asteroid' ? 'bg-white/5 border-white/10' :
                                            'bg-white/[0.02] border-white/5'
                                }`}
                        >
                            {cell === 'target' && <CircleDot className="w-6 h-6 text-secondary" />}
                            {cell === 'blackhole' && <Box className="w-8 h-8 text-red-900 animate-spin" />}
                            {cell === 'asteroid' && <AlertTriangle className="w-5 h-5 text-white/10" />}

                            {playerPos.x === x && playerPos.y === y && (
                                <motion.div
                                    layoutId="ship"
                                    className="absolute inset-0 flex items-center justify-center bg-primary shadow-[0_0_25px_rgba(var(--primary),0.5)] z-20 rounded-xl"
                                >
                                    <Rocket className="w-8 h-8 text-black" />
                                </motion.div>
                            )}
                        </div>
                    )))}
                </div>

                <div className="mt-12 flex flex-col items-center gap-10">
                    <div className="grid grid-cols-3 gap-4">
                        <div />
                        <Button onClick={() => handleMove(0, -1)} variant="premium" className="w-20 h-20 rounded-2xl border-b-4 border-primary/50 text-2xl">↑</Button>
                        <div />
                        <Button onClick={() => handleMove(-1, 0)} variant="premium" className="w-20 h-20 rounded-2xl border-b-4 border-primary/50 text-2xl">←</Button>
                        <Button onClick={() => handleMove(0, 1)} variant="premium" className="w-20 h-20 rounded-2xl border-b-4 border-primary/50 text-2xl">↓</Button>
                        <Button onClick={() => handleMove(1, 0)} variant="premium" className="w-20 h-20 rounded-2xl border-b-4 border-primary/50 text-2xl">→</Button>
                    </div>

                    <div className="flex gap-8">
                        <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                            <Navigation className="w-6 h-6 text-primary" />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Pos_Vectors</div>
                                <div className="text-xl font-display font-black text-white italic tracking-tighter">[{playerPos.x}, {playerPos.y}]</div>
                            </div>
                        </div>

                        <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                            <Zap className="w-6 h-6 text-secondary" />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Sector Tier</div>
                                <div className="text-xl font-display font-black text-white italic tracking-tighter">LVL_{level}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="space-nav"
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
