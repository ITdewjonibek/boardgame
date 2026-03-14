import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Dna, Zap, Activity, ShieldAlert, GitBranch, Binary } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BASES = ["A", "T", "G", "C"];
const BASE_COLORS: Record<string, string> = {
    A: "#ef4444", // Red
    T: "#3b82f6", // Blue
    G: "#22c55e", // Green
    C: "#eab308"  // Yellow
};

export default function GeneticSplicingDuel() {
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

    const [targetSequence, setTargetSequence] = useState<string[]>([]);
    const [userSequence, setUserSequence] = useState<string[]>([]);
    const [mutationTimer, setMutationTimer] = useState(10);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What does the 'A' base stand for in DNA?",
            options: ["Adenine", "Alanine", "Ammonia", "Aspartic Acid"],
            correct: 0,
            explanation: "Adenine is one of the four nucleobases in the nucleic acid of DNA that are represented by the letters G–C–A–T."
        },
        {
            id: 2,
            text: "In DNA base-pairing, which base always pairs with Cytosine (C)?",
            options: ["Adenine (A)", "Thymine (T)", "Guanine (G)", "Uracil (U)"],
            correct: 2,
            explanation: "According to Chargaff's rules, in DNA, Guanine always pairs with Cytosine (G-C) and Adenine always pairs with Thymine (A-T)."
        },
        {
            id: 3,
            text: "What is a 'Point Mutation'?",
            options: ["Deletion of an entire chromosome", "A change in a single nucleotide base pair", "Adding a new gene", "Doubling the DNA"],
            correct: 1,
            explanation: "A point mutation is a genetic mutation where a single nucleotide base is changed, inserted, or deleted from a DNA or RNA sequence."
        }
    ];

    const generateSequence = useCallback(() => {
        const length = 5 + Math.floor(level / 2);
        const newSeq = Array.from({ length }, () => BASES[Math.floor(Math.random() * BASES.length)]);
        setTargetSequence(newSeq);
        setUserSequence([]);
        setMutationTimer(Math.max(5, 15 - level));
    }, [level]);

    const handleSplice = (base: string) => {
        if (status !== 'playing' || testActive) return;

        const nextIdx = userSequence.length;
        if (base === targetSequence[nextIdx]) {
            const nextSeq = [...userSequence, base];
            setUserSequence(nextSeq);
            addScore(300);

            if (nextSeq.length === targetSequence.length) {
                setCombo(combo + 1);
                toast.success("GENOME_STABILIZED: Sequential Alignment Complete");
                if (level % 2 === 0) triggerTest(true);
                else { nextLevel(); generateSequence(); }
            }
        } else {
            damage(20);
            setCombo(0);
            toast.error("SPLICING_ERROR: Genetic Mismatch Detected");
            setUserSequence([]);
        }
    };

    useEffect(() => {
        if (status === 'playing' && mutationTimer > 0 && !testActive) {
            const timer = setInterval(() => setMutationTimer(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (mutationTimer === 0 && status === 'playing') {
            damage(10);
            toast.error("MUTATION_ALERT: Rerouted Sequence");
            generateSequence();
        }
    }, [mutationTimer, status, testActive, damage, generateSequence]);

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            generateSequence();
        }
    }, [status, gameStarted, generateSequence]);

    return (
        <BaseGameLayout
            title="Genetic Splicing Duel"
            rules={[
                "Align the base pairs (A, T, G, C) to stabilize the target GENOME.",
                "Precision Sequence Matching: Avoid mismatch-induced mutations.",
                "Timer Alert: Mutation triggers sequence scrambles at T-minus 0.",
                "Expert Genetic Phase (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Sequence HUD */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-6">
                                <GitBranch className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-black tracking-widest text-white uppercase italic">Bio_Stream_v4.7</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Mutation_T-Minus</span>
                                        <span className={`text-xl font-display font-black ${mutationTimer < 3 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>{mutationTimer}s</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${mutationTimer < 3 ? 'bg-red-500' : 'bg-primary'}`}
                                            animate={{ width: `${(mutationTimer / (15 - level)) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center gap-4">
                                    <Binary className="w-8 h-8 text-primary" />
                                    <div>
                                        <div className="text-[10px] font-black tracking-widest text-primary uppercase">Sync_Integrity</div>
                                        <div className="text-xl font-display font-black text-white italic lowercase underline underline-offset-8 decoration-white/20">Level_{level}_Stable</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-4">
                            <ShieldAlert className="w-8 h-8 text-red-500" />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-red-500 uppercase">Val_Points</div>
                                <div className="text-xl font-display font-black text-white italic lowercase underline underline-offset-8 decoration-white/20">CR_{score}</div>
                            </div>
                        </div>
                    </div>

                    {/* Splicing Chamber */}
                    <div className="lg:col-span-8">
                        <div className="glass-card p-12 bg-[#020617] border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                            <div className="space-y-16 relative z-10 text-center">
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Target_Genome_Signature</span>
                                    <div className="flex justify-center gap-4 flex-wrap">
                                        {targetSequence.map((base, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className={`w-14 h-20 rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all ${i < userSequence.length ? 'opacity-20 translate-y-4' : 'opacity-100'}`}
                                                style={{ borderColor: `${BASE_COLORS[base]}40`, backgroundColor: `${BASE_COLORS[base]}10` }}
                                            >
                                                <span className="text-2xl font-display font-black" style={{ color: BASE_COLORS[base] }}>{base}</span>
                                                <div className="mt-2 w-full h-1 rounded-full" style={{ backgroundColor: `${BASE_COLORS[base]}80` }} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-12 border-t border-white/5 grid grid-cols-4 gap-6 max-w-md mx-auto">
                                    {BASES.map((base) => (
                                        <motion.button
                                            key={base}
                                            whileHover={{ scale: 1.1, y: -5 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleSplice(base)}
                                            className="aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all bg-[#0a0f1e] group relative"
                                            style={{ borderColor: `${BASE_COLORS[base]}40` }}
                                        >
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="text-3xl font-display font-black group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all" style={{ color: BASE_COLORS[base] }}>{base}</span>
                                            <span className="text-[8px] font-black text-white/20 mt-1 uppercase tracking-tighter">Match_{base}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex items-center gap-12">
                    <div className="flex flex-col items-center gap-2">
                        <Dna className="w-8 h-8 text-primary animate-spin-slow" />
                        <span className="text-[10px] font-black tracking-widest text-white/30 uppercase italic">Helix_Sync_v4</span>
                    </div>

                    <div className="h-10 w-px bg-white/10" />

                    <div className="flex flex-col items-center gap-2">
                        <Zap className="w-8 h-8 text-secondary" />
                        <span className="text-[10px] font-black tracking-widest text-white/30 uppercase italic">Combo_Multiplier_x{combo}</span>
                    </div>

                    <div className="h-10 w-px bg-white/10" />

                    <div className="flex items-center gap-4">
                        <Activity className="w-8 h-8 text-emerald-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Stability</span>
                            <span className="text-xl font-display font-black text-white">99.8%</span>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="genetic-splice"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            generateSequence();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
