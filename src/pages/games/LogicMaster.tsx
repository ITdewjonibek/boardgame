import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayoutV5 from "@/components/BaseGameLayoutV5";
import AssessmentCore from "@/components/AssessmentCore";
import { useMegaStore } from "@/lib/mega-store";
import { useScoreManager } from "@/lib/score-manager";
import { Network, ShieldAlert, Fingerprint, Activity, Terminal, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OperativeAvatar, OperativeState } from "@/components/game-entities/OperativeAvatar";

// Game Config
const MAX_STAGES = 10;
const BOSS_STAGES = [5, 10];

interface GatePath {
    id: string;
    expression: string;
    evaluatesTo: boolean;
}

export default function LogicMazeEscapeV5() {
    const { status, level, damage, nextLevel, triggerTest, testActive, setStatus } = useMegaStore();
    const { addPoints, incrementCombo, breakCombo } = useScoreManager();

    const isBossStage = BOSS_STAGES.includes(level);
    const pathCount = isBossStage ? 4 : level >= 7 ? 3 : 2;

    const [paths, setPaths] = useState<GatePath[]>([]);
    const [timer, setTimer] = useState(100); // 100% capacity
    const [mazeDepth, setMazeDepth] = useState(0); // Progress within current level
    const requiredDepth = level * 3 + (isBossStage ? 5 : 0);

    const [gameStarted, setGameStarted] = useState(false);

    // Avatar State
    const [avatarState, setAvatarState] = useState<OperativeState>('idle');
    const [avatarPos, setAvatarPos] = useState({ x: 0, y: 0 });

    const generateLogicExpression = useCallback((forceTrue: boolean): GatePath => {
        // Basic vars: A, B, C
        const A = Math.random() > 0.5;
        const B = Math.random() > 0.5;
        const C = Math.random() > 0.5;

        const ops = ['AND', 'OR', 'XOR'];

        let expStr = '';
        let result = false;

        const op1 = ops[Math.floor(Math.random() * ops.length)];

        if (level < 4) {
            // Simple: A op B
            const evaluate = (a: boolean, b: boolean, op: string) => {
                if (op === 'AND') return a && b;
                if (op === 'OR') return a || b;
                if (op === 'XOR') return a !== b;
                return false;
            };
            result = evaluate(A, B, op1);
            expStr = `[${A}] ${op1} [${B}]`;
        } else {
            // Complex: (A op1 B) op2 C
            const op2 = ops[Math.floor(Math.random() * ops.length)];
            const evaluate = (a: boolean, b: boolean, c: boolean, o1: string, o2: string) => {
                let r1 = false;
                if (o1 === 'AND') r1 = a && b;
                if (o1 === 'OR') r1 = a || b;
                if (o1 === 'XOR') r1 = a !== b;

                if (o2 === 'AND') return r1 && c;
                if (o2 === 'OR') return r1 || c;
                if (o2 === 'XOR') return r1 !== c;
                return false;
            };
            result = evaluate(A, B, C, op1, op2);
            expStr = `([${A}] ${op1} [${B}]) ${op2} [${C}]`;

            if (isBossStage && Math.random() > 0.5) {
                expStr = `NOT ${expStr}`;
                result = !result;
            }
        }

        // If it doesn't match what we want, wrap it in NOT
        if (result !== forceTrue) {
            expStr = `NOT(${expStr})`;
            result = !result;
        }

        return {
            id: Math.random().toString(36).substring(7),
            expression: expStr,
            evaluatesTo: result
        };
    }, [level, isBossStage]);

    const generatePaths = useCallback(() => {
        const newPaths: GatePath[] = [];
        const trueIndex = Math.floor(Math.random() * pathCount);

        for (let i = 0; i < pathCount; i++) {
            newPaths.push(generateLogicExpression(i === trueIndex));
        }
        setPaths(newPaths);
        setTimer(100);
    }, [pathCount, generateLogicExpression]);

    // Timer Drain
    useEffect(() => {
        if (status !== 'playing' || testActive || !gameStarted || avatarState === 'attacking' || avatarState === 'damaged') return;

        const drainRate = isBossStage ? 2 : (0.5 + level * 0.1);

        const interval = setInterval(() => {
            setTimer(prev => {
                const next = prev - drainRate;
                if (next <= 0) {
                    damage(isBossStage ? 30 : 15);
                    breakCombo();
                    toast.error("SYSTEM_OVERLOAD: Time Expired");
                    setMazeDepth(Math.max(0, mazeDepth - 1)); // push back
                    generatePaths();
                    return 100;
                }
                return next;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [status, testActive, gameStarted, isBossStage, level, damage, breakCombo, mazeDepth, generatePaths, avatarState]);

    // Start Level
    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            setMazeDepth(0);
            setAvatarState('idle');
            setAvatarPos({ x: 0, y: 0 });
            generatePaths();
        }
    }, [status, gameStarted, generatePaths]);

    const handlePathSelect = (path: GatePath, index: number) => {
        if (avatarState === 'attacking' || avatarState === 'damaged') return;

        // Move avatar to the selected node
        const isMobile = window.innerWidth < 768;
        const gridCols = isMobile ? 1 : 2;
        const row = Math.floor(index / gridCols);
        const col = index % gridCols;

        // Approximate physics movement target
        const xTarget = isMobile ? 0 : (col === 0 ? -150 : 150);
        const yTarget = isMobile ? (row * -140) - 100 : (row * -160) - 100;

        setAvatarPos({ x: xTarget, y: yTarget });

        if (path.evaluatesTo) {
            // Correct
            setAvatarState('attacking');
            setTimeout(() => {
                addPoints(100, isBossStage ? 'boss' : 'standard');
                incrementCombo();

                const newDepth = mazeDepth + 1;
                if (newDepth >= requiredDepth) {
                    toast.success(`MAZE_SECTOR_${level}_CLEARED`);
                    addPoints(1000 * level, 'bonus');
                    setAvatarState('victory');

                    setTimeout(() => {
                        if (level % 5 === 0) {
                            triggerTest(true);
                        } else if (level < MAX_STAGES) {
                            nextLevel();
                            setGameStarted(false);
                        }
                    }, 2000);
                } else {
                    setMazeDepth(newDepth);
                    generatePaths();
                    // Reset avatar
                    setAvatarPos({ x: 0, y: 0 });
                    setAvatarState('idle');
                }
            }, 800); // Wait for attack animation

        } else {
            // Incorrect
            setAvatarState('damaged');
            setTimeout(() => {
                damage(isBossStage ? 20 : 10);
                breakCombo();
                toast.error("LOGIC_FATAL_ERROR: Path Blocked");
                setTimer(prev => Math.max(0, prev - 30)); // Heavy time penalty

                // Reset avatar
                setAvatarPos({ x: 0, y: 0 });
                setAvatarState('idle');
            }, 800);
        }
    };

    const handleTestComplete = (bonusScore: number, isCustom: boolean) => {
        if (bonusScore > 0) addPoints(bonusScore, 'bonus');
        triggerTest(false);
        if (level >= MAX_STAGES) {
            toast.success("MEGA_SYSTEM_CLEARED: Logic Mastery");
            setStatus('victory');
        } else {
            nextLevel();
            setGameStarted(false);
        }
    };

    const defaultTestQuestions = [
        {
            id: 1,
            text: "If A is TRUE and B is FALSE, what is the result of (A XOR B) AND A?",
            options: ["TRUE", "FALSE", "Syntax Error", "Null"],
            correct: 0,
            explanation: "A XOR B is True (since inputs differ). True AND A (True) is True.",
            difficulty: "medium" as const
        },
        {
            id: 2,
            text: "Which boolean operation only returns TRUE if BOTH inputs are TRUE?",
            options: ["XOR", "OR", "AND", "NAND"],
            correct: 2,
            explanation: "The AND operator requires all conditions to be met (True) for the output to be True.",
            difficulty: "easy" as const
        },
        {
            id: 3,
            text: "Evaluate: NOT ( (TRUE OR FALSE) AND (FALSE XOR TRUE) )",
            options: ["TRUE", "FALSE", "Undefined", "0"],
            correct: 1,
            explanation: "TRUE OR FALSE = TRUE. FALSE XOR TRUE = TRUE. TRUE AND TRUE = TRUE. NOT(TRUE) = FALSE.",
            difficulty: "hard" as const
        }
    ];

    return (
        <BaseGameLayoutV5
            title="Logic Maze Escape V5"
            stage={level}
            maxStages={MAX_STAGES}
            mechanics={[
                "Operative Drone: Fly your execution avatar to the correct logic gate.",
                "Evaluate the Boolean logic expressions on each Maze Node.",
                "Time pressure drops rapidly. Taking too long damages your hull.",
                "Incorrect selections cause electro-shock feedback damage and time penalties.",
                "Boss Phases (5 & 10): Deeply nested chained expressions and inverted logic."
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
                            className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-12 py-3 rounded-full bg-red-500/10 border-2 border-red-500/50 flex items-center gap-4"
                        >
                            <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                            <span className="text-sm font-black tracking-[0.5em] text-red-500 uppercase">Boss Phase: Nested Logic Depth</span>
                            <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* HUD Elements */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20 hidden md:flex">
                    <div className="glass-card bg-black/40 border-white/10 p-4 rounded-2xl flex flex-col gap-2 min-w-[200px]">
                        <div className="flex items-center gap-2 text-white/50">
                            <Terminal className="w-4 h-4" />
                            <span className="text-[10px] font-black tracking-widest uppercase">Depth Render</span>
                        </div>
                        <div className="text-2xl font-display font-black italic tracking-widest text-white">
                            NODE {mazeDepth} / {requiredDepth}
                        </div>
                    </div>

                    <div className="glass-card bg-black/40 border-white/10 p-4 rounded-2xl flex flex-col gap-2 min-w-[200px] items-end">
                        <div className="flex items-center gap-2 text-white/50">
                            <Activity className="w-4 h-4" />
                            <span className="text-[10px] font-black tracking-widest uppercase">System Integrity</span>
                        </div>
                        <div className="w-full flex justify-end">
                            <div className="w-full max-w-[150px] h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                <motion.div
                                    className={`h-full ${timer > 50 ? 'bg-emerald-500' : timer > 25 ? 'bg-amber-500' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]'}`}
                                    animate={{ width: `${timer}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 w-full max-w-4xl mt-12 md:mt-24 h-full flex flex-col justify-end pb-32">
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                        <Network className="w-[800px] h-[800px]" />
                    </div>

                    <div className="flex items-center justify-center mb-8 md:mb-12 absolute top-0 w-full">
                        <div className="px-6 py-2 rounded-full border border-primary/30 bg-primary/10 flex items-center gap-3">
                            <Fingerprint className="w-5 h-5 text-primary" />
                            <span className="text-[10px] md:text-sm font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-primary">Map the TRUE Stream</span>
                        </div>
                    </div>

                    {/* Path Nodes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10 w-full mb-8">
                        <AnimatePresence mode="popLayout">
                            {paths.map((path, i) => (
                                <motion.div
                                    key={path.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Button
                                        onClick={() => handlePathSelect(path, i)}
                                        disabled={avatarState !== 'idle' && avatarState !== 'scanning'}
                                        variant="outline"
                                        className={`w-full h-24 md:h-32 glass-card rounded-3xl border-2 flex flex-col items-center justify-center gap-2 md:gap-3 group transition-all duration-300 relative overflow-hidden
                                            ${isBossStage ? 'bg-red-950/20 border-red-500/20 hover:bg-red-900/40 hover:border-red-500/50' : 'bg-white/[0.03] border-white/10 hover:bg-white/10 hover:border-white/30'}
                                            ${avatarState !== 'idle' ? 'pointer-events-none' : ''}
                                        `}
                                    >
                                        <div className={`text-xl md:text-2xl lg:text-3xl font-mono font-black tracking-wider transition-colors group-hover:text-primary z-10 text-white`}>
                                            {path.expression}
                                        </div>
                                        <div className="flex items-center gap-2 text-white/40 text-[8px] md:text-[10px] font-black tracking-widest uppercase group-hover:text-primary/50 transition-colors z-10">
                                            <ArrowRight className="w-3 h-3 group-hover:animate-bounce-x" />
                                            Execute Gateway {i + 1}
                                        </div>
                                    </Button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Dynamic Avatar Container */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-[100px] h-[120px]">
                        <motion.div
                            animate={{ x: avatarPos.x, y: avatarPos.y }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        >
                            <OperativeAvatar
                                state={avatarState}
                                color={isBossStage ? "#ef4444" : "#3b82f6"}
                            />

                            {/* Attack Laser VFX */}
                            {avatarState === 'attacking' && (
                                <motion.div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-2 md:w-4 bg-emerald-400 rounded-full blur-[1px] md:blur-[2px] shadow-[0_0_20px_#10b981]"
                                    initial={{ height: 0, opacity: 1 }}
                                    animate={{ height: 200, opacity: 0, y: -100 }}
                                    transition={{ duration: 0.5 }}
                                />
                            )}

                            {/* Damage Lightning VFX */}
                            {avatarState === 'damaged' && (
                                <motion.div
                                    className="absolute inset-[-50px] flex items-center justify-center pointer-events-none"
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <Zap className="w-24 h-24 md:w-32 md:h-32 text-red-500 animate-pulse mix-blend-screen" />
                                    <Zap className="w-16 h-16 md:w-24 md:h-24 text-amber-500 animate-spin mix-blend-screen absolute" />
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>

            </div>

            <AnimatePresence>
                {testActive && (
                    <AssessmentCore
                        gameId="logic-maze-v5"
                        defaultQuestions={defaultTestQuestions}
                        onComplete={handleTestComplete}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayoutV5>
    );
}
