import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Zap, Cpu, Brain, ShieldAlert, Award, Activity, Flame, Terminal, Database, Lock, Unlock, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Stage = 'MATH' | 'LOGIC' | 'PATTERN' | 'REACTIVE' | 'FINAL';

export default function UltimateMegaChallenge() {
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

    const [stage, setStage] = useState<Stage>('MATH');
    const [stageProgress, setStageProgress] = useState(0);
    const [challenge, setChallenge] = useState<any>(null);
    const [userInput, setUserInput] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [timer, setTimer] = useState(30);

    // Grand Master Questions
    const questions = [
        {
            id: 1,
            text: "Which concept defines the peak of the Mega Game System architecture?",
            options: ["Simple gameplay", "Extreme logical complexity and multi-disciplinary integration", "Basic HTML layout", "Random number guessing"],
            correct: 1,
            explanation: "The Mega Game System V4 is designed to challenge cognitive limits through the integration of mathematics, cryptography, physics, and strategic logic."
        },
        {
            id: 2,
            text: "What is the primary objective of the 'Final Gauntlet' stage?",
            options: ["To rest", "To demonstrate mastery over multiple cognitive domains simultaneously", "To watch an animation", "To exit the game"],
            correct: 1,
            explanation: "The Ultimate Mega Challenge acts as a holistic evaluation of the player's performance across all previous mini-game styles."
        },
        {
            id: 3,
            text: "What does reaching Level 25 in this system signify?",
            options: ["A bug in the code", "Grand Master status and complete logical synchronization", "The end of the demo", "Nothing important"],
            correct: 1,
            explanation: "Reaching the final stage denotes the highest tier of achievement, requiring consistent excellence in speed, accuracy, and theoretical knowledge."
        }
    ];

    const generateChallenge = useCallback(() => {
        setTimer(Math.max(5, 30 - level));
        if (stage === 'MATH') {
            const a = Math.floor(Math.random() * 50) + 20;
            const b = Math.floor(Math.random() * 30) + 10;
            setChallenge({ q: `${a} * ${b} - ${Math.floor(a / 2)}`, a: a * b - Math.floor(a / 2) });
        } else if (stage === 'LOGIC') {
            const ops = ["AND", "OR", "XOR"];
            const op = ops[Math.floor(Math.random() * ops.length)];
            const v1 = Math.random() > 0.5;
            const v2 = Math.random() > 0.5;
            let res = false;
            if (op === 'AND') res = v1 && v2;
            if (op === 'OR') res = v1 || v2;
            if (op === 'XOR') res = v1 !== v2;
            setChallenge({ q: `${v1.toString().toUpperCase()} ${op} ${v2.toString().toUpperCase()}`, a: res.toString().toUpperCase() });
        } else if (stage === 'PATTERN') {
            const seq = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9));
            const diff = Math.floor(Math.random() * 5) + 1;
            setChallenge({ q: `${seq.join(', ')} ...`, a: (seq[3] + diff).toString() });
        } else if (stage === 'REACTIVE') {
            setChallenge({ q: "CLICK_RAPIDLY_SYNC", a: "CLICK" });
        }
        setUserInput("");
    }, [stage, level]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (status !== 'playing' || testActive) return;

        if (userInput.toUpperCase() === challenge.a.toString().toUpperCase()) {
            addScore(5000);
            setCombo(combo + 1);
            setStageProgress(prev => {
                const next = prev + 25;
                if (next >= 100) {
                    if (stage === 'MATH') setStage('LOGIC');
                    else if (stage === 'LOGIC') setStage('PATTERN');
                    else if (stage === 'PATTERN') setStage('REACTIVE');
                    else if (stage === 'REACTIVE') setStage('FINAL');
                    return 0;
                }
                return next;
            });
            toast.success("STAGE_SEGMENT_CLEARED");
            generateChallenge();
        } else {
            damage(15);
            setCombo(0);
            toast.error("SYSTEM_FAILURE: Gauntlet Resetting");
            generateChallenge();
        }
    };

    useEffect(() => {
        if (status === 'playing' && timer > 0 && !testActive) {
            const t = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(t);
        } else if (timer === 0 && status === 'playing') {
            damage(10);
            generateChallenge();
        }
    }, [timer, status, testActive, damage, generateChallenge]);

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            generateChallenge();
        }
    }, [status, gameStarted, generateChallenge]);

    useEffect(() => {
        if (stage === 'FINAL') {
            toast.success("GAUNTLET_CONQUERED: Grand Master Test Initiated");
            triggerTest(true);
        }
    }, [stage, triggerTest]);

    return (
        <BaseGameLayout
            title="Ultimate Mega Challenge"
            rules={[
                "The Gauntlet: Survive four distinct logical stages (Math, Logic, Pattern, Reactive).",
                "Stage Mastery: Complete 4 segments per stage to progress to the next phase.",
                "System Pressure: Failure triggers health damage and challenge scrambling.",
                "Final Evaluation: Complete the Grand Master Certification test to finish the system."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Gauntlet HUD */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-6">
                                <Activity className="w-5 h-5 text-red-500 animate-pulse" />
                                <h3 className="text-sm font-black tracking-widest text-white uppercase italic">Gauntlet_Sync_v5.0</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Stage_Intensity</span>
                                        <span className="text-xl font-display font-black text-red-500">{timer}s</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-red-500"
                                            animate={{ width: `${(timer / (30 - level)) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
                                        <div className="text-[8px] font-black text-primary uppercase">VAL_{score}</div>
                                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Master Credits</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-center">
                                        <div className="text-[8px] font-black text-orange-400 uppercase">LVL_{level}</div>
                                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Synch Tier</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 border-red-500/20 bg-red-500/5 flex items-center gap-6 relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-2 opacity-5 pointer-events-none">
                                <Flame className="w-20 h-20 text-red-500" />
                            </div>
                            <Award className="w-10 h-10 text-red-500 animate-bounce" />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-red-500 uppercase">Target Rank</div>
                                <div className="text-xl font-display font-black text-white italic tracking-tighter uppercase underline decoration-white/20 underline-offset-8">GRAND_MASTER</div>
                            </div>
                        </div>
                    </div>

                    {/* Gauntlet Chamber */}
                    <div className="lg:col-span-8">
                        <div className="glass-card p-12 bg-[#020617] border-white/5 relative overflow-hidden group shadow-2xl rounded-[3rem]">
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-red-500/5 to-transparent pointer-events-none" />

                            <div className="space-y-12 relative z-10 text-center">
                                <div className="flex justify-center gap-4">
                                    {(['MATH', 'LOGIC', 'PATTERN', 'REACTIVE'] as Stage[]).map((s) => (
                                        <div key={s} className="flex flex-col items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${stage === s ? 'bg-primary shadow-[0_0_15px_#22c55e]' : stageProgress > 0 && s === stage ? 'bg-primary/40' : 'bg-white/5 border border-white/10'}`} />
                                            <span className={`text-[8px] font-black tracking-widest ${stage === s ? 'text-white' : 'text-white/20'} uppercase`}>{s}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-8">
                                    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative">
                                        <div className="text-[10px] font-black text-white/20 uppercase mb-4 tracking-[0.4em]">Active_Gauntlet_Problem</div>
                                        <div className="text-5xl font-display font-black text-white italic tracking-tighter lowercase min-h-[60px]">
                                            {challenge?.q || "INITIALIZING..."}
                                        </div>
                                    </div>

                                    {stage === 'REACTIVE' ? (
                                        <Button
                                            onClick={() => handleSubmit()}
                                            variant="premium"
                                            className="w-full h-24 rounded-[2rem] border-b-8 border-primary/50 text-3xl font-black italic tracking-widest flex items-center justify-center gap-4"
                                        >
                                            <Zap className="w-8 h-8 fill-primary" />
                                            CLICK_SYNC
                                        </Button>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-mono text-xl select-none italic tracking-tighter">CMD_</div>
                                            <input
                                                autoFocus
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                placeholder="INPUT_SOLUTION..."
                                                className="w-full h-20 pl-20 bg-white/5 border-2 border-white/10 text-3xl font-display font-black text-white italic tracking-widest uppercase rounded-3xl transition-all focus:border-primary/50 outline-none"
                                            />
                                        </form>
                                    )}
                                </div>

                                <div className="pt-8 border-t border-white/5">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">Gauntlet_Phase_Sync</span>
                                        <span className="text-xs font-display font-black text-primary">{stageProgress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                                        <motion.div
                                            className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                                            animate={{ width: `${stageProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex items-center gap-12">
                    <div className="flex items-center gap-4 px-8 py-3 rounded-2xl bg-white/5 border border-white/10 group hover:border-primary/40 transition-all">
                        <Terminal className="w-8 h-8 text-primary group-hover:animate-pulse" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">Console_Sync</span>
                            <span className="text-xl font-display font-black text-white italic tracking-tighter">PHASE_{level}_ROOT</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 px-8 py-3 rounded-2xl bg-white/5 border border-white/10 group hover:border-secondary/40 transition-all">
                        <Network className="w-8 h-8 text-secondary group-hover:animate-pulse" />
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">Logic_Node</span>
                            <span className="text-xl font-display font-black text-white italic tracking-tighter">SYNC_X_{combo}</span>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="ultimate-mega"
                        questions={questions}
                        onComplete={(bonus) => {
                            // Final Completion logic
                            toast.success("MEGA_SYSTEM_COMPLETE: Grand Master Status Verified");
                            setTimeout(() => window.location.href = '/dashboard', 3000);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
