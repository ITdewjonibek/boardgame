import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMegaStore } from "@/lib/mega-store";
import {
    HelpCircle,
    CheckCircle2,
    XCircle,
    BrainCircuit,
    AlertTriangle,
    ArrowRight,
    Trophy,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
    id: number;
    text: string;
    options: string[];
    correct: number;
    explanation: string;
}

interface TestSystemProps {
    gameId: string;
    questions: Question[];
    onComplete: (score: number) => void;
}

export default function TestSystem({ gameId, questions, onComplete }: TestSystemProps) {
    const { addScore, setStatus } = useMegaStore();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [stats, setStats] = useState({ correct: 0, wrong: 0, bonus: 0 });
    const [showSummary, setShowSummary] = useState(false);

    const currentQuestion = questions[currentIdx];

    const handleSelect = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        const correct = idx === currentQuestion.correct;
        setIsCorrect(correct);

        if (correct) {
            setStats(prev => ({ ...prev, correct: prev.correct + 1, bonus: prev.bonus + 500 }));
            addScore(500);
        } else {
            setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
        }
    };

    const handleNext = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelected(null);
            setIsCorrect(null);
        } else {
            setShowSummary(true);
        }
    };

    const handleFinish = () => {
        onComplete(stats.bonus);
        setStatus('idle');
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[200px]" />
            </div>

            <div className="max-w-4xl w-full relative">
                <AnimatePresence mode="wait">
                    {!showSummary ? (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            className="glass-card p-12 border-primary/20 bg-[#0a0c14]/80 shadow-[0_0_50px_rgba(var(--primary),0.1)] relative"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                                        <BrainCircuit className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-display font-black tracking-tight italic uppercase">Expert Analysis Phase</h2>
                                        <p className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">Phase Integration Sync v4.0</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black tracking-widest text-primary">QUESTION 0{currentIdx + 1}</span>
                                    <div className="flex gap-1 mt-1">
                                        {questions.map((_, i) => (
                                            <div key={i} className={`h-1 w-6 rounded-full transition-colors ${i <= currentIdx ? 'bg-primary' : 'bg-white/10'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Question Body */}
                            <div className="space-y-12">
                                <h3 className="text-3xl font-display font-bold leading-tight tracking-tight text-white/90 italic">
                                    "{currentQuestion.text}"
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentQuestion.options.map((option, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={selected === null ? { scale: 1.02, x: 5 } : {}}
                                            onClick={() => handleSelect(i)}
                                            className={`h-20 px-8 rounded-2xl border flex items-center justify-between transition-all font-display text-lg tracking-tight uppercase italic ${selected === i
                                                    ? i === currentQuestion.correct ? 'bg-green-500/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-red-500/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                                                    : selected !== null && i === currentQuestion.correct ? 'bg-green-500/10 border-green-500/40' : 'bg-white/5 border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <span className={selected === i ? 'text-white' : 'text-white/60'}>{option}</span>
                                            {selected === i && (i === currentQuestion.correct ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />)}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Feedback Overlay */}
                            <AnimatePresence>
                                {selected !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className={`w-5 h-5 ${isCorrect ? 'text-green-500' : 'text-red-500'}`} />
                                            <span className="text-xs font-black tracking-widest uppercase">Expert Explanation</span>
                                        </div>
                                        <p className="text-sm font-medium text-white/50 leading-relaxed italic">{currentQuestion.explanation}</p>
                                        <div className="flex justify-end pt-2">
                                            <Button
                                                onClick={handleNext}
                                                variant="premium"
                                                className="h-12 px-10 rounded-xl"
                                            >
                                                Continue Analysis <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="summary"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-16 text-center border-primary/30 bg-[#0a0c14]/90"
                        >
                            <Trophy className="w-24 h-24 text-primary mx-auto mb-10 drop-shadow-[0_0_40px_rgba(var(--primary),0.5)]" />
                            <h2 className="text-6xl font-display font-black italic tracking-tighter mb-4">PHASE_COMPLETE</h2>
                            <p className="text-white/40 font-mono tracking-widest uppercase mb-12 italic">Performance Metrics Analysis Finalized</p>

                            <div className="grid grid-cols-3 gap-8 mb-16 max-w-2xl mx-auto">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                    <div className="text-[10px] font-black tracking-widest text-white/20 mb-2 uppercase">Accuracy</div>
                                    <div className="text-4xl font-display font-black text-green-500 italic lowercase underline decoration-primary/30 underline-offset-8">
                                        {Math.round((stats.correct / questions.length) * 100)}%
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                    <div className="text-[10px] font-black tracking-widest text-white/20 mb-2 uppercase">Core Sync</div>
                                    <div className="text-4xl font-display font-black text-primary italic lowercase underline decoration-primary/30 underline-offset-8">
                                        {stats.correct}/{questions.length}
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/30">
                                    <div className="text-[10px] font-black tracking-widest text-secondary/40 mb-2 uppercase">Bonus Earned</div>
                                    <div className="text-4xl font-display font-black text-secondary italic lowercase underline decoration-white/30 underline-offset-8">
                                        +{stats.bonus}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <Button
                                    onClick={handleFinish}
                                    variant="premium"
                                    className="flex-1 h-20 text-2xl font-black italic rounded-3xl border-b-8 border-primary/50"
                                >
                                    SYSTEM_FINALIZE
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
