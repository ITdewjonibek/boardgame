import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Bot, Zap, Battery, ShieldAlert, Play, Square, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GRID_SIZE = 8;

export default function RoboticsPathfindingChallenge() {
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

    const [grid, setGrid] = useState<('empty' | 'obstacle' | 'goal' | 'start')[][]>([]);
    const [robotPos, setRobotPos] = useState({ x: 0, y: 7 });
    const [commandStack, setCommandStack] = useState<('up' | 'down' | 'left' | 'right')[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What is the 'A*' algorithm used for in robotics?",
            options: ["Battery charging", "Pathfinding and graph traversal", "Image recognition", "Voice synthesis"],
            correct: 1,
            explanation: "A* (A-star) is a popular pathfinding and graph traversal algorithm used in many fields of computer science due to its completeness, optimality, and optimal efficiency."
        },
        {
            id: 2,
            text: "What does 'LIDAR' stand for?",
            options: ["Light Detection and Ranging", "Laser Internal Data Analysis", "Linear Integrated Driver", "Local Intelligent Data Resource"],
            correct: 0,
            explanation: "LIDAR is a remote sensing method that uses light in the form of a pulsed laser to measure ranges (variable distances) to the Earth."
        },
        {
            id: 3,
            text: "In robotics, what is 'Kinematics'?",
            options: ["Study of robot emotions", "Study of motion without considering forces", "Battery chemistry", "Programming language for AI"],
            correct: 1,
            explanation: "Kinematics is a subfield of physics and engineering that describes the motion of points, bodies (objects), and systems of bodies without considering the forces that cause them to move."
        }
    ];

    const initializeCourse = useCallback(() => {
        const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
        newGrid[7][0] = 'start';
        newGrid[0][7] = 'goal';

        const obstacleCount = 8 + level * 2;
        for (let i = 0; i < obstacleCount; i++) {
            const rx = Math.floor(Math.random() * GRID_SIZE);
            const ry = Math.floor(Math.random() * GRID_SIZE);
            if (newGrid[ry][rx] === 'empty') newGrid[ry][rx] = 'obstacle';
        }

        setGrid(newGrid);
        setRobotPos({ x: 0, y: 7 });
        setCommandStack([]);
        setIsExecuting(false);
    }, [level]);

    const addCommand = (cmd: 'up' | 'down' | 'left' | 'right') => {
        if (isExecuting || commandStack.length >= 10) return;
        setCommandStack(prev => [...prev, cmd]);
    };

    const executeStack = async () => {
        if (isExecuting || commandStack.length === 0) return;
        setIsExecuting(true);

        let currentPos = { ...robotPos };
        for (const cmd of commandStack) {
            await new Promise(r => setTimeout(r, 400));

            let nextPos = { ...currentPos };
            if (cmd === 'up') nextPos.y--;
            else if (cmd === 'down') nextPos.y++;
            else if (cmd === 'left') nextPos.x--;
            else if (cmd === 'right') nextPos.x++;

            if (nextPos.x < 0 || nextPos.x >= GRID_SIZE || nextPos.y < 0 || nextPos.y >= GRID_SIZE || grid[nextPos.y][nextPos.x] === 'obstacle') {
                damage(20);
                setCombo(0);
                toast.error("ROBOT_COLLISION: Course Deviation Detected");
                setIsExecuting(false);
                setRobotPos({ x: 0, y: 7 });
                setCommandStack([]);
                return;
            }

            currentPos = nextPos;
            setRobotPos(currentPos);

            if (grid[currentPos.y][currentPos.x] === 'goal') {
                addScore(4500);
                setCombo(combo + 1);
                toast.success("GOAL_REACHED: Navigation Successful");
                setIsExecuting(false);
                if (level % 2 === 0) triggerTest(true);
                else { nextLevel(); initializeCourse(); }
                return;
            }
        }

        setIsExecuting(false);
        toast.warning("COMMAND_STACK_EXHAUSTED: Goal not reached");
    };

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            initializeCourse();
        }
    }, [status, gameStarted, initializeCourse]);

    return (
        <BaseGameLayout
            title="Robotics Pathfinding Challenge"
            rules={[
                "Program the command sequence to guide the robot unit to the GOAL_NODE.",
                "Precision Navigation: Avoid all grid obstacles to prevent hull damage.",
                "Limited Battery: You can only sequence a maximum of 10 commands per run.",
                "Expert Robotics Phase (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Programming Console */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-6">
                                <Cog className="w-5 h-5 text-primary animate-spin-slow" />
                                <h3 className="text-sm font-black tracking-widest text-white uppercase italic">Command_Buffer_v4.2</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-black/40 border border-white/10 rounded-2xl relative">
                                    <AnimatePresence>
                                        {commandStack.map((cmd, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center"
                                            >
                                                {cmd === 'up' && <ArrowUp className="w-4 h-4 text-primary" />}
                                                {cmd === 'down' && <ArrowDown className="w-4 h-4 text-primary" />}
                                                {cmd === 'left' && <ArrowLeft className="w-4 h-4 text-primary" />}
                                                {cmd === 'right' && <ArrowRight className="w-4 h-4 text-primary" />}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {commandStack.length === 0 && (
                                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black tracking-widest text-white/10 uppercase">Buffer_Empty</span>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div />
                                    <Button onClick={() => addCommand('up')} variant="outline" className="h-12 border-white/10 hover:bg-primary/10 transition-colors"><ArrowUp /></Button>
                                    <div />
                                    <Button onClick={() => addCommand('left')} variant="outline" className="h-12 border-white/10 hover:bg-primary/10 transition-colors"><ArrowLeft /></Button>
                                    <Button onClick={() => addCommand('down')} variant="outline" className="h-12 border-white/10 hover:bg-primary/10 transition-colors"><ArrowDown /></Button>
                                    <Button onClick={() => addCommand('right')} variant="outline" className="h-12 border-white/10 hover:bg-primary/10 transition-colors"><ArrowRight /></Button>
                                </div>

                                <Button
                                    onClick={executeStack}
                                    disabled={isExecuting || commandStack.length === 0}
                                    variant="premium"
                                    className="w-full h-16 rounded-2xl border-b-4 border-primary/50 text-xl font-black italic tracking-widest flex items-center justify-center gap-3 bg-gradient-to-br from-primary/10 to-transparent"
                                >
                                    <Play className="w-5 h-5 fill-primary" />
                                    EXECUTE_STACK
                                </Button>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center gap-4">
                            <ShieldAlert className="w-8 h-8 text-secondary" />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-secondary uppercase">Val_Points</div>
                                <div className="text-xl font-display font-black text-white italic lowercase underline underline-offset-8 decoration-white/30 underline-offset-8">VAL_{score}</div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Grid */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-8 gap-1 p-6 bg-white/[0.02] rounded-[2.5rem] border border-white/5 backdrop-blur-2xl relative shadow-2xl">
                            {grid.map((row, y) => row.map((cell, x) => (
                                <div
                                    key={`${x}-${y}`}
                                    className={`aspect-square rounded-lg border transition-all duration-500 relative flex items-center justify-center ${cell === 'goal' ? 'bg-secondary/20 border-secondary shadow-[0_0_15px_rgba(var(--secondary),0.3)] animate-pulse' :
                                            cell === 'obstacle' ? 'bg-red-500/20 border-red-500/10' :
                                                'bg-white/[0.02] border-white/5'
                                        }`}
                                >
                                    {cell === 'goal' && <Square className="w-4 h-4 text-secondary fill-secondary/20" />}
                                    {cell === 'obstacle' && <ShieldAlert className="w-4 h-4 text-red-500/20" />}

                                    {robotPos.x === x && robotPos.y === y && (
                                        <motion.div
                                            layoutId="robot"
                                            className="absolute inset-1 bg-primary rounded-md shadow-[0_0_20px_rgba(var(--primary),0.6)] z-10 flex items-center justify-center"
                                        >
                                            <Bot className="w-5 h-5 text-black" />
                                        </motion.div>
                                    )}
                                </div>
                            )))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex items-center gap-12">
                    <Battery className={`w-8 h-8 ${commandStack.length > 8 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
                    <div className="h-10 w-px bg-white/10" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">Kinematic Hub Tier</span>
                        <span className="text-2xl font-display font-black tracking-widest text-white italic underline underline-offset-8 decoration-primary/40">ROBOTICS_PATH_{level}_SYNC</span>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div className="flex items-center gap-3 px-6 py-2 rounded-xl bg-white/5 border border-white/10">
                        <Zap className="w-5 h-5 text-secondary" />
                        <span className="text-sm font-display font-black text-white italic">COMBO_X{combo}</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="robot-path"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            initializeCourse();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
