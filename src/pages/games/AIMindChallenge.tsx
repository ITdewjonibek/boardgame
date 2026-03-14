import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Brain, Cpu, Zap, Activity, ShieldAlert, Binary } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AIMindChallenge() {
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

    const [aiSequence, setAiSequence] = useState<string[]>([]);
    const [userSequence, setUserSequence] = useState<string[]>([]);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "AI da 'Neyronniy Naqsh Tan Olish' nima?",
            options: ["Kimnindir aqlini o'qish", "Ma'lumotlar ichidagi qonuniyatlarni aniqlash", "Murakkab matematikani soddalash", "Video oqimi turi"],
            correct: 1,
            explanation: "Naqsh tan'olish - bu mashinali o'rganish sohasi bo'lib, ma'lumotlar ichidagi naqsh va qonuniyatlarni aniqlashga e'tibor beradi."
        },
        {
            id: 2,
            text: "Turing Testi kontekstida nima baholanadi?",
            options: ["Kompyuter tezligi", "Mashinaning intellektual xatti-harakati", "Bazaning o'lchami", "Grafik renderlash"],
            correct: 1,
            explanation: "Turing Testi - Alan Turing 1950-yilda yaratgan mashinaning insan kabi intellektual xatti-harakati ko'rsata oladimi test qiladi."
        },
        {
            id: 3,
            text: "'Chuqur O'rganish' asosan inson miyasini taqlid qilish uchun nima ishlati?",
            options: ["Ikkilik daraxtlari", "Ketma-ketlik massivlari", "Sun'iy Neyronniy Tarmog'lar", "Chiziqli regressiya"],
            correct: 2,
            explanation: "Chuqur o'rganish - sun'iy neyronniy tarmog'larni asosidagi mashinali o'rganish usuli bo'lib, niqob o'rganishga asoslanadi."
        }
    ];

    const symbols = ["ALPHA", "BETA", "GAMMA", "DELTA"];

    const startAiTurn = useCallback(() => {
        setIsAiThinking(true);
        const length = 3 + Math.floor(level / 2);
        const newSeq = Array.from({ length }, () => symbols[Math.floor(Math.random() * symbols.length)]);

        setTimeout(() => {
            setAiSequence(newSeq);
            setUserSequence([]);
            setIsAiThinking(false);
            toast.info("AI_NEURAL_SEQUENCE_GENERATED");
        }, 1500 - (level * 100)); // AI gets faster
    }, [level]);

    const handleUserInput = (symbol: string) => {
        if (status !== 'playing' || testActive || isAiThinking) return;

        const nextUserSeq = [...userSequence, symbol];
        setUserSequence(nextUserSeq);

        // Immediate check
        const idx = nextUserSeq.length - 1;
        if (symbol !== aiSequence[idx]) {
            damage(25);
            setCombo(0);
            toast.error("NEURAL_MISMATCH: Pattern Corrupted");
            startAiTurn();
            return;
        }

        if (nextUserSeq.length === aiSequence.length) {
            addScore(1500 * (combo + 1));
            setCombo(combo + 1);
            toast.success("NEURAL_SYNC_SUCCESSFUL");

            if (level % 2 === 0) triggerTest(true);
            else { nextLevel(); startAiTurn(); }
        }
    };

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            startAiTurn();
        }
    }, [status, gameStarted, startAiTurn]);

    return (
        <BaseGameLayout
            title="AI Mind Challenge"
            rules={[
                "Predict and match the AI's neural sequence in real-time.",
                "Response speed and accuracy impact neural sync integrity.",
                "The AI adapts its sequence complexity every cycle.",
                "Expert AI Research (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* AI Zone */}
                    <div className="glass-card p-10 border-red-500/20 bg-red-500/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Cpu className="w-32 h-32 text-red-500" />
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-red-500 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-display font-black italic tracking-widest text-red-500 uppercase">AI_CORE_NEURAL_STREAM</h3>
                            </div>

                            <div className="h-48 flex items-center justify-center gap-4 bg-black/40 rounded-3xl border border-white/5 p-6 min-h-[12rem]">
                                {isAiThinking ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-2"
                                    >
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                                                className="w-3 h-3 rounded-full bg-red-500"
                                            />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {aiSequence.map((s, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, rotate: -20 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                className="px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-[10px] font-black tracking-widest text-red-500"
                                            >
                                                {s}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Input Zone */}
                    <div className="glass-card p-10 border-primary/20 bg-primary/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Brain className="w-32 h-32 text-primary" />
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                                    <Binary className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-xl font-display font-black italic tracking-widest text-primary uppercase">HUMAN_NEURAL_INPUT</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {symbols.map((s) => (
                                    <Button
                                        key={s}
                                        onClick={() => handleUserInput(s)}
                                        disabled={isAiThinking}
                                        variant="premium"
                                        className="h-20 text-lg font-black italic rounded-2xl border-b-4 border-primary/50 group"
                                    >
                                        {s}
                                    </Button>
                                ))}
                            </div>

                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mt-6">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(userSequence.length / aiSequence.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex items-center gap-12">
                    <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                        <ShieldAlert className="w-8 h-8 text-secondary" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Firewall Integrity</span>
                            <span className="text-xl font-display font-black text-white italic lowercase underline decoration-white/30 underline-offset-8">STABLE_98.2%</span>
                        </div>
                    </div>

                    <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                        <Zap className="w-8 h-8 text-primary" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Cognitive Sync</span>
                            <span className="text-xl font-display font-black text-white italic lowercase underline decoration-primary/30 underline-offset-8">TIER_{level}</span>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="ai-mind"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            startAiTurn();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
