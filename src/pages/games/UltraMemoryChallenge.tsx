import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Brain, Star, Zap, Timer, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GRID_SIZE = 16;
const INITIAL_SEQUENCE_LENGTH = 4;

export default function UltraMemoryChallenge() {
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

    const [sequence, setSequence] = useState<number[]>([]);
    const [userSequence, setUserSequence] = useState<number[]>([]);
    const [isShowingSequence, setIsShowingSequence] = useState(false);
    const [activeSquare, setActiveSquare] = useState<number | null>(null);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "Which cognitive process is primarily tested in high-speed visual sequence recall?",
            options: ["Working Memory", "Procedural Memory", "Semantic Memory", "Implicit Memory"],
            correct: 0,
            explanation: "Working memory is the system responsible for the transient holding and processing of new and already-stored information, an essential process for reasoning, comprehension, and learning."
        },
        {
            id: 2,
            text: "How does the 'Chunking' technique help in Ultra Memory mode?",
            options: ["Increases grid size", "Groups data into units", "Slows down timer", "Auto-fills patterns"],
            correct: 1,
            explanation: "Chunking is a process by which individual pieces of an information set are bound together into a meaningful whole, effectively increasing the perceived capacity of your working memory."
        },
        {
            id: 3,
            text: "Which brain region is most active during pattern recognition tasks?",
            options: ["Prefrontal Cortex", "Cerebellum", "Occipital Lobe", "Temporal Lobe"],
            correct: 0,
            explanation: "The Prefrontal Cortex is the primary orchestration center for complex cognitive behavior, decision making, and moderating social behavior, directly controlling working memory."
        }
    ];

    const generateSequence = useCallback(() => {
        const newLength = INITIAL_SEQUENCE_LENGTH + level;
        const newSequence = Array.from({ length: newLength }, () => Math.floor(Math.random() * GRID_SIZE));
        setSequence(newSequence);
        setUserSequence([]);
        showSequence(newSequence);
    }, [level]);

    const showSequence = async (seq: number[]) => {
        setIsShowingSequence(true);
        for (let i = 0; i < seq.length; i++) {
            setActiveSquare(seq[i]);
            await new Promise(r => setTimeout(r, 600 - (level * 20))); // Speed increases with level
            setActiveSquare(null);
            await new Promise(r => setTimeout(r, 200));
        }
        setIsShowingSequence(false);
    };

    const handleSquareClick = (idx: number) => {
        if (isShowingSequence || status !== 'playing' || testActive) return;

        const nextUserSeq = [...userSequence, idx];
        setUserSequence(nextUserSeq);

        // Click feedback
        setActiveSquare(idx);
        setTimeout(() => setActiveSquare(null), 200);

        // Check correctness
        if (idx !== sequence[userSequence.length]) {
            damage(25);
            setCombo(0);
            toast.error("SEQUENCE_BREACH: Pattern Mismatch Detected");
            setUserSequence([]);
            showSequence(sequence); // Re-show the pattern on mistake
        } else {
            addScore(100 * (combo + 1));
            if (nextUserSeq.length === sequence.length) {
                setCombo(combo + 1);
                toast.success("PATTERN_SYNC_COMPLETE");
                if (level % 3 === 0) {
                    triggerTest(true);
                } else {
                    nextLevel();
                    setTimeout(generateSequence, 1000);
                }
            }
        }
    };

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            generateSequence();
        }
    }, [status, gameStarted, generateSequence]);

    return (
        <BaseGameLayout
            title="Ultra Memory Challenge"
            rules={[
                "Memorize the high-speed neon pattern sequence exactly.",
                "Precision is mandatory. One breach resets the current phase.",
                "Difficulty scales exponentially. Speed and length increase per level.",
                "Post-Game Analysis (Test Phase) triggers every 3 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                {/* Distraction Layer (Expert Mechanic) */}
                <AnimatePresence>
                    {level > 5 && isShowingSequence && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
                        >
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        x: [Math.random() * 1000, Math.random() * 1000],
                                        y: [Math.random() * 1000, Math.random() * 1000],
                                        rotate: [0, 360]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute w-64 h-64 border-2 border-primary/30 rounded-full"
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-4 gap-4 max-w-lg w-full relative z-10">
                    {[...Array(GRID_SIZE)].map((_, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSquareClick(i)}
                            className={`aspect-square rounded-2xl border-2 transition-all duration-300 relative group overflow-hidden ${activeSquare === i
                                    ? 'bg-primary border-primary shadow-[0_0_40px_rgba(var(--primary),0.8)] z-30 scale-110'
                                    : 'bg-white/5 border-white/5 hover:border-white/20'
                                }`}
                        >
                            <div className={`absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity`} />
                            <div className="absolute inset-0 flex items-center justify-center opacity-5">
                                <Brain className="w-8 h-8" />
                            </div>
                        </motion.button>
                    ))}
                </div>

                <div className="mt-12 flex items-center gap-8">
                    <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <Timer className={`w-5 h-5 ${isShowingSequence ? 'text-primary animate-spin' : 'text-white/20'}`} />
                        <span className="text-xs font-black tracking-widest uppercase italic">
                            {isShowingSequence ? 'SCANNING_SEQUENCE' : 'AWAITING_INPUT'}
                        </span>
                    </div>
                    <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-secondary" />
                        <span className="text-xs font-black tracking-widest uppercase italic">LEVEL {level} COMPLEXITY</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="ultra-memory"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            setTimeout(generateSequence, 1000);
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
