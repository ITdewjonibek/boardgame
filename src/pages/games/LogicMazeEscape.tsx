import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Move, Skull, Goal, EyeOff, ShieldAlert, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GRID_SIZE = 5;

export default function LogicMazeEscape() {
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

    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
    const [exitPosition, setExitPosition] = useState({ x: 4, y: 4 });
    const [traps, setTraps] = useState<{ x: number, y: number }[]>([]);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "Which algorithm is most efficient for finding the shortest path in a dynamic maze?",
            options: ["Dijkstra's Algorithm", "Breadth-First Search", "A* Search", "Depth-First Search"],
            correct: 2,
            explanation: "A* (A-star) is widely used in pathfinding and graph traversal due to its efficiency and performance, using heuristics to guide its search."
        },
        {
            id: 2,
            text: "In logic puzzles, what is a 'Heuristic'?",
            options: ["A guaranteed solution", "A mental shortcut/rule of thumb", "An infinite loop", "A type of encryption"],
            correct: 1,
            explanation: "A heuristic is a strategy derived from experience that helps solve a problem by focusing on the most likely solutions, though it doesn't guarantee a result."
        },
        {
            id: 3,
            text: "What happens to path complexity as maze dimension increases linearly?",
            options: ["Increases Linearly", "Remains Constant", "Increases Exponentially", "Decreases"],
            correct: 2,
            explanation: "As dimensions increase, the state space (number of possible paths) grows exponentially, significantly increasing the computational difficulty of finding an optimal exit."
        }
    ];

    const initializeMaze = useCallback(() => {
        setPlayerPosition({ x: 0, y: 0 });
        setExitPosition({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 });

        // Generate dynamic traps based on level
        const trapCount = Math.min(3 + level, 12);
        const newTraps: { x: number, y: number }[] = [];
        while (newTraps.length < trapCount) {
            const x = Math.floor(Math.random() * GRID_SIZE);
            const y = Math.floor(Math.random() * GRID_SIZE);
            if ((x === 0 && y === 0) || (x === GRID_SIZE - 1 && y === GRID_SIZE - 1)) continue;
            if (newTraps.some(t => t.x === x && t.y === y)) continue;
            newTraps.push({ x, y });
        }
        setTraps(newTraps);
    }, [level]);

    const handleMove = (dx: number, dy: number) => {
        if (status !== 'playing' || testActive) return;

        const newX = Math.min(Math.max(0, playerPosition.x + dx), GRID_SIZE - 1);
        const newY = Math.min(Math.max(0, playerPosition.y + dy), GRID_SIZE - 1);

        if (newX === playerPosition.x && newY === playerPosition.y) return;

        // Check Trap
        if (traps.some(t => t.x === newX && t.y === newY)) {
            damage(30);
            setCombo(0);
            toast.error("TRAP_ACTIVATED: Structural Damage Sustained");
            setPlayerPosition({ x: 0, y: 0 });
            return;
        }

        setPlayerPosition({ x: newX, y: newY });
        addScore(50);

        // Check Exit
        if (newX === exitPosition.x && newY === exitPosition.y) {
            setCombo(combo + 1);
            toast.success("CORE_EXIT_SECURED");
            if (level % 2 === 0) {
                triggerTest(true);
            } else {
                nextLevel();
                initializeMaze();
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") handleMove(0, -1);
            if (e.key === "ArrowDown") handleMove(0, 1);
            if (e.key === "ArrowLeft") handleMove(-1, 0);
            if (e.key === "ArrowRight") handleMove(1, 0);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [playerPosition, status, testActive]);

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            initializeMaze();
        }
    }, [status, gameStarted, initializeMaze]);

    return (
        <BaseGameLayout
            title="Logic Maze Escape"
            rules={[
                "Navigate the digital maze core using ARROW_KEYS.",
                "Avoid hidden static and dynamic traps. Detection is offline.",
                "Fog of War activates at Advanced Levels (Level 5+).",
                "Expert Logic Analysis (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="grid grid-cols-5 gap-4 max-w-lg w-full relative z-10 p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
                    {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
                        const x = i % GRID_SIZE;
                        const y = Math.floor(i / GRID_SIZE);
                        const isPlayer = playerPosition.x === x && playerPosition.y === y;
                        const isExit = exitPosition.x === x && exitPosition.y === y;
                        const isTrap = traps.some(t => t.x === x && t.y === y);

                        // Fog of War mechanic
                        const dist = Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y);
                        const isVisible = level < 5 || dist <= 1 || isExit;

                        return (
                            <motion.div
                                key={i}
                                className={`aspect-square rounded-xl border flex items-center justify-center transition-all duration-500 overflow-hidden ${!isVisible ? 'bg-black border-transparent grayscale' :
                                        isPlayer ? 'bg-primary border-primary shadow-[0_0_20px_rgba(var(--primary),0.4)] scale-110 z-20' :
                                            isExit ? 'bg-green-500/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' :
                                                'bg-white/[0.02] border-white/5'
                                    }`}
                            >
                                {isVisible && (
                                    <>
                                        {isPlayer && <Move className="w-8 h-8 text-black animate-pulse" />}
                                        {isExit && <Goal className="w-8 h-8 text-green-500 animate-bounce" />}
                                        {isTrap && level < 3 && <Skull className="w-6 h-6 text-red-500/30" />}
                                    </>
                                )}
                                {!isVisible && <EyeOff className="w-4 h-4 text-white/5" />}
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-12 flex items-center gap-8">
                    <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5 text-secondary" />
                        <span className="text-xs font-black tracking-widest uppercase italic">
                            {level >= 5 ? 'FOG_OF_WAR: ACTIVE' : 'LIDAR_SCANNING: PASSIVE'}
                        </span>
                    </div>
                    <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-primary" />
                        <span className="text-xs font-black tracking-widest uppercase italic">X:{playerPosition.x} Y:{playerPosition.y}</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="logic-maze"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            initializeMaze();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
