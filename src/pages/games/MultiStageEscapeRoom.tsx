import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Lock, Unlock, Key, ShieldCheck, DoorOpen, Timer, AlertCircle, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Stage = 'lock' | 'pairs' | 'direction';

export default function MultiStageEscapeRoom() {
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

    const [currentStage, setCurrentStage] = useState<Stage>('lock');
    const [stageProgress, setStageProgress] = useState(0); // 0 to 2
    const [lockCode, setLockCode] = useState("");
    const [userLockInput, setUserLockInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "In sequential logic, what is 'State Dependency'?",
            options: ["Random transitions", "Next state depends on current state/input", "A permanent error", "A type of database"],
            correct: 1,
            explanation: "Sequential logic is a type of logic circuit whose output depends not only on the present value of its input signals but on the past history of its inputs."
        },
        {
            id: 2,
            text: "Which problem-solving strategy involves breaking a complex goal into smaller stages?",
            options: ["Brute Force", "Decomposition", "Random Search", "Recursion Limit"],
            correct: 1,
            explanation: "Decomposition is the process of breaking a complex problem down into manageable parts that are easier to understand and solve."
        },
        {
            id: 3,
            text: "What is the primary risk of 'Linear Thinking' in escape room logic?",
            options: ["Excessive speed", "Missing non-obvious connections", "Over-simplification", "Both B and C"],
            correct: 3,
            explanation: "Linear thinking can lead to missing complex, multi-variable relationships and over-simplifying problems that require lateral or out-of-the-box reasoning."
        }
    ];

    const initializeStage = useCallback(() => {
        if (currentStage === 'lock') {
            const code = Math.floor(1000 + Math.random() * 9000).toString();
            setLockCode(code);
            setUserLockInput("");
        }
        setTimeLeft(Math.max(20, 60 - level * 5));
    }, [currentStage, level]);

    const handleStageComplete = () => {
        if (stageProgress < 2) {
            setStageProgress(prev => prev + 1);
            const stages: Stage[] = ['lock', 'pairs', 'direction'];
            setCurrentStage(stages[stageProgress + 1]);
            toast.success(`SECURITY_LEVEL_${stageProgress + 1}_BYPASSED`);
            addScore(1000);
        } else {
            setCombo(combo + 1);
            toast.success("ESCAPE_PROTOCOL_SUCCESSFUL");
            if (level % 2 === 0) triggerTest(true);
            else {
                nextLevel();
                setStageProgress(0);
                setCurrentStage('lock');
                initializeStage();
            }
        }
    };

    const handleLockSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userLockInput === lockCode) {
            handleStageComplete();
        } else {
            damage(10);
            toast.error("INVALID_PIN: Security Alert Triggered");
            setUserLockInput("");
        }
    };

    useEffect(() => {
        if (status === 'playing' && timeLeft > 0 && !testActive) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft <= 0 && status === 'playing') {
            damage(30);
            toast.error("SYSTEM_LOCKDOWN: Time Expired");
            initializeStage();
        }
    }, [timeLeft, status, testActive, damage, initializeStage]);

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            initializeStage();
        }
    }, [status, gameStarted, initializeStage]);

    return (
        <BaseGameLayout
            title="Multi Stage Escape Room"
            rules={[
                "Bypass three distinct security stages to execute the exit protocol.",
                "Stage 1: Numeric Decryption PIN. Stage 2: Pattern Sync. Stage 3: Vectors.",
                "Time is finite. System lockdown occurs upon timer depletion.",
                "Expert Logic Phase (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Sidebar: Progress */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                            <div className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-4">Security Hierarchy</div>
                            <div className="space-y-4">
                                {['PIN_DECRYPTION', 'SYNAPSE_PAIRS', 'VECTOR_STRIKE'].map((s, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${i === stageProgress ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]' : i < stageProgress ? 'bg-green-500/10 border-green-500/30 opacity-50' : 'bg-white/5 border-white/5 opacity-20'}`}>
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${i <= stageProgress ? 'bg-primary text-black' : 'bg-white/10 text-white/40'}`}>{i + 1}</div>
                                        <span className="text-[10px] font-black tracking-tighter uppercase">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-6 border-red-500/20 bg-red-500/[0.02] flex items-center gap-4">
                            <Timer className={`w-8 h-8 ${timeLeft < 10 ? 'text-red-500 animate-spin' : 'text-white/20'}`} />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-red-500/50 uppercase">Lockdown_In</div>
                                <div className={`text-2xl font-display font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{timeLeft}s</div>
                            </div>
                        </div>
                    </div>

                    {/* Main Stage Area */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {currentStage === 'lock' && (
                                <motion.div
                                    key="lock"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass-card p-12 bg-[#0a0c1a] border-primary/20 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <Lock className="w-48 h-48" />
                                    </div>

                                    <div className="space-y-12 relative z-10 text-center">
                                        <div className="space-y-4">
                                            <div className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Encryption_PIN_Found</div>
                                            <div className="text-7xl font-display font-black tracking-[0.3em] text-white italic drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                                {lockCode.split('').map((c, i) => <span key={i} className="mx-2">{c}</span>)}
                                            </div>
                                        </div>

                                        <form onSubmit={handleLockSubmit} className="max-w-md mx-auto space-y-8">
                                            <Input
                                                autoFocus
                                                value={userLockInput}
                                                onChange={(e) => setUserLockInput(e.target.value)}
                                                placeholder="INPUT_Bypass_PIN"
                                                className="h-20 bg-white/5 border-white/10 text-4xl font-display font-black text-center tracking-[0.5em] rounded-2xl"
                                                maxLength={4}
                                            />
                                            <Button variant="premium" className="w-full h-16 text-xl font-black italic rounded-2xl border-b-4 border-primary/50">
                                                BYPASS_LAYER_01
                                            </Button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}

                            {currentStage !== 'lock' && (
                                <motion.div
                                    key="rest"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card p-20 text-center border-secondary/20 bg-secondary/[0.02]"
                                >
                                    <Cpu className="w-16 h-16 text-secondary mx-auto mb-6 animate-pulse" />
                                    <h2 className="text-4xl font-display font-black italic mb-4">ACCESSING_NEXT_PROTOCOL</h2>
                                    <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-10">Integration in progress... Please stand by</p>
                                    <Button onClick={handleStageComplete} variant="premium" className="h-14 px-12 rounded-xl">EXECUTE_FORCE_BYPASS</Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-16 flex items-center gap-10">
                    <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        <span className="text-[10px] font-black tracking-widest uppercase italic">Secure_Sync_Active</span>
                    </div>
                    <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <Key className="w-5 h-5 text-secondary" />
                        <span className="text-[10px] font-black tracking-widest uppercase italic">X_{score}_CREDITS</span>
                    </div>
                    <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-primary">
                        <DoorOpen className="w-5 h-5" />
                        <span className="text-[10px] font-black tracking-widest uppercase italic">STAGE {stageProgress + 1}/3</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="escape-room"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            setStageProgress(0);
                            setCurrentStage('lock');
                            initializeStage();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
