import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { FlaskConical, Beaker, Dna, Atom, ShieldAlert, Activity, GitCommitHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const COLORS = ["#34d399", "#60a5fa", "#f87171", "#fbbf24"]; // Emerald, Blue, Red, Amber

export default function BioLabSimulation() {
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

    const [targetChain, setTargetChain] = useState<string[]>([]);
    const [userChain, setUserChain] = useState<string[]>([]);
    const [radiationLevel, setRadiationLevel] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What is the primary function of DNA in biological systems?",
            options: ["Energy production", "Storage of genetic information", "Waste removal", "Structural support"],
            correct: 1,
            explanation: "DNA (Deoxyribonucleic Acid) is the molecule that carries the genetic instructions for the development, functioning, growth, and reproduction of all known organisms."
        },
        {
            id: 2,
            text: "Which process describes a cell's ability to maintain a stable internal environment?",
            options: ["Photosynthesis", "Homeostasis", "Mitosis", "Metabolism"],
            correct: 1,
            explanation: "Homeostasis is the state of steady internal, physical, and chemical conditions maintained by living systems, crucial for optimal functioning."
        },
        {
            id: 3,
            text: "In chemistry, what is an 'Isotope'?",
            options: ["A variant of an element with different neutrons", "An element with no electrons", "A toxic chemical", "A type of bonding"],
            correct: 0,
            explanation: "Isotopes are variants of a particular chemical element which differ in neutron number, and consequently in nucleon number."
        }
    ];

    const generateChain = useCallback(() => {
        const length = 4 + Math.floor(level / 2);
        const newChain = Array.from({ length }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
        setTargetChain(newChain);
        setUserChain([]);
        setRadiationLevel(0);
    }, [level]);

    const handleBond = (color: string) => {
        if (status !== 'playing' || testActive) return;

        const nextIdx = userChain.length;
        if (color === targetChain[nextIdx]) {
            const nextChain = [...userChain, color];
            setUserChain(nextChain);
            addScore(200);

            if (nextChain.length === targetChain.length) {
                setCombo(combo + 1);
                toast.success("MOLECULAR_STRUCTURE_STABILIZED");
                if (level % 2 === 0) triggerTest(true);
                else { nextLevel(); generateChain(); }
            }
        } else {
            damage(15);
            setCombo(0);
            setRadiationLevel(prev => Math.min(100, prev + 25));
            toast.error("BONDING_ERROR: Radiation Leak Detected");
            setUserChain([]);
        }
    };

    useEffect(() => {
        if (status === 'playing' && radiationLevel > 50) {
            const timer = setInterval(() => {
                damage(5);
                toast.warning("CONTAMINATION_ALERT: HP drain active", { duration: 1000 });
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [status, radiationLevel, damage]);

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            generateChain();
        }
    }, [status, gameStarted, generateChain]);

    return (
        <BaseGameLayout
            title="Bio Lab Simulation"
            rules={[
                "Synthesize the target molecular isotope by matching the color bond chain.",
                "Precision Bonding Required: Incorrect sequences trigger radiation leaks.",
                "Environmental Hazards: High radiation levels cause continuous HP depletion.",
                "Expert Bio-Analysis (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Lab HUD */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-6">
                                <FlaskConical className="w-5 h-5 text-emerald-400" />
                                <h3 className="text-sm font-black tracking-widest text-white uppercase italic">Lab_Environment_v4</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black tracking-widest text-emerald-400/60 uppercase">
                                        <span>Isotope_Stability</span>
                                        <span>{100 - radiationLevel}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                                        <motion.div
                                            className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                                            animate={{ width: `${100 - radiationLevel}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black tracking-widest text-red-500 uppercase">
                                        <span>Radiation_Exposure</span>
                                        <span>{radiationLevel}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                                        <motion.div
                                            className="h-full bg-red-500 shadow-[0_0_10px_#ef4444]"
                                            animate={{ width: `${radiationLevel}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 border-primary/20 bg-primary/5 flex items-center gap-6">
                            <Dna className="w-10 h-10 text-primary animate-pulse" />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-primary uppercase">Genome_Sync</div>
                                <div className="text-xl font-display font-black text-white italic lowercase underline decoration-white/30 underline-offset-8">Level_{level}_Secure</div>
                            </div>
                        </div>
                    </div>

                    {/* Reaction Chamber */}
                    <div className="lg:col-span-8">
                        <div className="glass-card p-12 bg-[#020617] border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-5 pointer-events-none">
                                <Activity className="w-full h-full text-emerald-500" />
                            </div>

                            <div className="space-y-12 relative z-10 text-center">
                                <div className="inline-block px-6 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 tracking-[0.3em] uppercase mb-4">
                                    Target_Molecular_Sequence
                                </div>

                                <div className="flex justify-center gap-4 flex-wrap">
                                    {targetChain.map((color, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${i < userChain.length ? 'opacity-20 scale-90 translate-y-4' : 'opacity-100'}`}
                                            style={{ borderColor: `${color}40`, backgroundColor: `${color}10` }}
                                        >
                                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}` }} />
                                            {i < targetChain.length - 1 && (
                                                <GitCommitHorizontal className="absolute -right-4 w-4 h-4 text-white/10" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="pt-12 border-t border-white/5">
                                    <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                                        {COLORS.map((color) => (
                                            <motion.button
                                                key={color}
                                                whileHover={{ scale: 1.1, y: -5 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleBond(color)}
                                                className="aspect-square rounded-2xl border-2 flex items-center justify-center transition-all group relative overflow-hidden"
                                                style={{ borderColor: `${color}40`, backgroundColor: `${color}10` }}
                                            >
                                                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 30px ${color}` }} />
                                                <Beaker className="absolute bottom-2 right-2 w-4 h-4 text-white/5 group-hover:text-white/20 transition-colors" />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex items-center gap-10">
                    <div className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <ShieldAlert className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">Bio_Safety_Level_{level < 5 ? 'A' : level < 10 ? 'X' : 'OMEGA'}</span>
                    </div>
                    <div className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <Atom className="w-4 h-4 text-secondary" />
                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">Credits_{score}</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="bio-lab"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            generateChain();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
