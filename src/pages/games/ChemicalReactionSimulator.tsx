import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { FlaskConical, Beaker, Zap, ShieldAlert, Thermometer, Flame, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ChemicalReactionSimulator() {
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

    const [coefficients, setCoefficients] = useState<number[]>([1, 1]);
    const [targetCoefficients, setTargetCoefficients] = useState<number[]>([2, 1]);
    const [reactionStability, setReactionStability] = useState(100);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What does 'Stoichiometry' study in chemistry?",
            options: ["Color of chemicals", "Quantitative relationships in reactions", "The shape of flasks", "Speed of light"],
            correct: 1,
            explanation: "Stoichiometry is the calculation of reactants and products in chemical reactions in chemistry."
        },
        {
            id: 2,
            text: "What is an 'Exothermic' reaction?",
            options: ["Absorbs heat", "Releases heat", "Creates gold", "Does not change temperature"],
            correct: 1,
            explanation: "An exothermic process is a dynamic process or reaction that releases energy from the system to its surroundings, usually in the form of heat."
        },
        {
            id: 3,
            text: "In the context of 'Reaction Balancing', why must atoms be equal on both sides?",
            options: ["For visual symmetry", "Law of Conservation of Mass", "To save chemicals", "It's just a tradition"],
            correct: 1,
            explanation: "The law of conservation of mass states that mass in an isolated system is neither created nor destroyed by chemical reactions or physical transformations."
        }
    ];

    const initializeReaction = useCallback(() => {
        const c1 = Math.floor(Math.random() * 4) + 1;
        const c2 = Math.floor(Math.random() * 4) + 1;
        setTargetCoefficients([c1, c2]);
        setCoefficients([1, 1]);
        setReactionStability(100);
    }, []);

    const adjustCoefficient = (idx: number, delta: number) => {
        if (status !== 'playing' || testActive) return;
        const nextVal = Math.max(1, coefficients[idx] + delta);
        const nextCoefficients = [...coefficients];
        nextCoefficients[idx] = nextVal;
        setCoefficients(nextCoefficients);

        if (nextCoefficients[0] === targetCoefficients[0] && nextCoefficients[1] === targetCoefficients[1]) {
            addScore(2500 * (combo + 1));
            setCombo(combo + 1);
            toast.success("REACTION_STABILIZED: Stoichiometric Balance OK");
            if (level % 2 === 0) triggerTest(true);
            else { nextLevel(); initializeReaction(); }
        }
    };

    useEffect(() => {
        if (status === 'playing' && reactionStability > 0 && !testActive) {
            const timer = setInterval(() => {
                const isUnbalanced = coefficients[0] !== targetCoefficients[0] || coefficients[1] !== targetCoefficients[1];
                if (isUnbalanced) {
                    setReactionStability(prev => Math.max(0, prev - 2));
                } else {
                    setReactionStability(prev => Math.min(100, prev + 5));
                }
            }, 500);
            return () => clearInterval(timer);
        } else if (reactionStability === 0 && status === 'playing') {
            damage(30);
            toast.error("THERMAL_RUNAWAY: Reaction Vessel Ruptured");
            initializeReaction();
        }
    }, [reactionStability, coefficients, targetCoefficients, status, testActive, damage, initializeReaction]);

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            initializeReaction();
        }
    }, [status, gameStarted, initializeReaction]);

    return (
        <BaseGameLayout
            title="Chemical Reaction Simulator"
            rules={[
                "Adjust reagent coefficients to balance the chemical equation.",
                "Precision Stoichiometry: Unbalanced reactions cause thermal instability.",
                "Thermal Runaway: Zero stability triggers a system-wide catastrophic failure.",
                "Expert Chem-Analysis (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Reaction Metrics */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-6">
                                <Thermometer className={`w-5 h-5 ${reactionStability < 30 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
                                <h3 className="text-sm font-black tracking-widest text-white uppercase italic">Reactor_Core_v5</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Stability_Index</span>
                                        <span className={`text-xl font-display font-black ${reactionStability < 30 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>{reactionStability}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${reactionStability < 30 ? 'bg-red-500' : 'bg-primary'}`}
                                            animate={{ width: `${reactionStability}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-primary/20 border border-primary/30 text-center">
                                        <div className="text-[8px] font-black text-primary uppercase">VAL_{score}</div>
                                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Credits</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-orange-500/20 border border-orange-500/30 text-center">
                                        <div className="text-[8px] font-black text-orange-400 uppercase">TIER_{level}</div>
                                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Phases</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center gap-6">
                            <ShieldAlert className="w-10 h-10 text-red-500" />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-red-500 uppercase">Reactor Status</div>
                                <div className="text-xl font-display font-black text-white italic lowercase underline underline-offset-8 decoration-white/20">Monitor_Online</div>
                            </div>
                        </div>
                    </div>

                    {/* Reaction Balancing Chamber */}
                    <div className="lg:col-span-8">
                        <div className="glass-card p-12 bg-[#020617] border-white/5 relative overflow-hidden group shadow-2xl rounded-[3rem]">
                            <div className="absolute inset-0 opacity-5 pointer-events-none">
                                <Droplets className="w-full h-full text-primary" />
                            </div>

                            <div className="space-y-16 relative z-10 text-center">
                                <div className="inline-block px-8 py-2 rounded-full bg-primary/10 border border-primary/20 text-[12px] font-black text-primary tracking-[0.5em] uppercase mb-4">
                                    Balance_Complex_Equation
                                </div>

                                <div className="flex items-center justify-center gap-12 flex-wrap">
                                    {/* Reagent A */}
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-2">
                                                <Button onClick={() => adjustCoefficient(0, 1)} variant="outline" className="w-10 h-10 rounded-lg border-white/10 p-0 text-primary hover:bg-primary/10">↑</Button>
                                                <div className="w-12 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-4xl font-display font-black text-white">{coefficients[0]}</div>
                                                <Button onClick={() => adjustCoefficient(0, -1)} variant="outline" className="w-10 h-10 rounded-lg border-white/10 p-0 text-primary hover:bg-primary/10">↓</Button>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <FlaskConical className="w-16 h-16 text-primary" />
                                                <span className="text-xs font-black tracking-widest text-white italic underline underline-offset-4 decoration-primary/40">HYDROGEN</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-4xl font-display font-black text-white/20">+</div>

                                    {/* Reagent B */}
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-2">
                                                <Button onClick={() => adjustCoefficient(1, 1)} variant="outline" className="w-10 h-10 rounded-lg border-white/10 p-0 text-secondary hover:bg-secondary/10">↑</Button>
                                                <div className="w-12 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-4xl font-display font-black text-white">{coefficients[1]}</div>
                                                <Button onClick={() => adjustCoefficient(1, -1)} variant="outline" className="w-10 h-10 rounded-lg border-white/10 p-0 text-secondary hover:bg-secondary/10">↓</Button>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <Beaker className="w-16 h-16 text-secondary" />
                                                <span className="text-xs font-black tracking-widest text-white italic underline underline-offset-4 decoration-secondary/40">OXYGEN</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-4xl font-display font-black text-primary animate-pulse">→</div>

                                    {/* Product */}
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                            <span className="text-4xl font-display font-black text-white italic">2H₂O</span>
                                        </div>
                                        <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">AQUATIC_SYNTH</span>
                                    </div>
                                </div>

                                <div className="pt-12 border-t border-white/5 flex justify-center gap-6">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                        <Flame className="w-4 h-4 text-orange-500" />
                                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Thermal_Flux_Stable</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <Activity className="w-4 h-4 text-blue-500" />
                                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Isotope_Signature_Matched</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex items-center gap-12">
                    <Zap className="w-10 h-10 text-secondary" />
                    <div className="h-10 w-px bg-white/10" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">Molecular Synergy</span>
                        <span className="text-2xl font-display font-black tracking-widest text-white italic">Tier_System_v{level}.0</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="chemical-reaction"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            initializeReaction();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
