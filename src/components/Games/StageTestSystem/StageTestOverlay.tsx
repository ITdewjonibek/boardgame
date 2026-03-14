import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StageTestQuestion } from "@/hooks/useStageTest";
import { Zap, CheckCircle2, Timer, HelpCircle } from "lucide-react";

interface StageTestOverlayProps {
    isActive: boolean;
    question: StageTestQuestion | null;
    onAnswer: (index: number) => void;
    title?: string;
}

export function StageTestOverlay({ isActive, question, onAnswer, title = "Stage Challenge" }: StageTestOverlayProps) {
    if (!isActive || !question) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl glass-card bg-black/80 border-primary/30 p-8 rounded-[3rem] shadow-[0_0_50px_rgba(var(--primary),0.2)] flex flex-col items-center gap-8 overflow-hidden"
            >
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-primary blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500 blur-3xl translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative z-10 w-full flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="p-4 rounded-full bg-primary/10 border border-primary/30"
                        >
                            <Zap className="w-8 h-8 text-primary shadow-glow" />
                        </motion.div>
                        <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase bg-primary/20 px-4 py-1 rounded-full border border-primary/40">
                            {title}
                        </span>
                    </div>

                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-display font-black italic tracking-tighter text-white drop-shadow-lg">
                            {question.text}
                        </h2>
                        {question.reward_type && (
                            <div className="flex items-center justify-center gap-2 text-primary/70 font-mono text-xs uppercase tracking-widest">
                                <CheckCircle2 className="w-3 h-3" />
                                Reward: {question.reward_type.replace('_', ' ')}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
                        {question.options.map((opt, i) => (
                            <Button
                                key={i}
                                onClick={() => onAnswer(i)}
                                className="h-16 md:h-20 text-lg md:text-xl font-display font-black italic bg-white/[0.03] border-white/10 hover:bg-primary/20 hover:border-primary/50 text-white rounded-2xl active:scale-95 transition-all group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <span className="relative z-10">{opt}</span>
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 mt-4 w-full justify-center">
                        <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] uppercase">
                            <Timer className="w-3 h-3" />
                            <span>Response Required</span>
                        </div>
                        <div className="w-16 h-px bg-white/10" />
                        <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] uppercase">
                            <HelpCircle className="w-3 h-3" />
                            <span>Logic Verification</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Decorative Aura */}
            <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
            </div>
        </div>
    );
}
