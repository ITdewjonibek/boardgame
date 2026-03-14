import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Atom, Zap, CircleDot, Activity, ShieldCheck, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GRID_SIZE = 16;
const MAX_ELECTRONS = 8;

export default function MolecularLabChallenge() {
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

    const [atoms, setAtoms] = useState<number[]>([]);
    const [targetSum, setTargetSum] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What are 'Valence Electrons' in an atom?",
            options: ["Electrons in the nucleus", "Electrons in the outermost shell", "Protons and Neutrons", "A type of chemical bond"],
            correct: 1,
            explanation: "Valence electrons are the electrons in the outermost shell of an atom, and they are responsible for the chemical properties of the element and its ability to form bonds."
        },
        {
            id: 2,
            text: "What distinguishes a 'Covalent' bond from an 'Ionic' bond?",
            options: ["Sharing of electrons vs Transfer of electrons", "Speed of reaction", "Color of the molecule", "Number of atoms involved"],
            correct: 0,
            explanation: "Covalent bonds involve the sharing of electron pairs between atoms, while ionic bonds involve the electrostatic attraction between oppositely charged ions formed by electron transfer."
        },
        {
            id: 3,
            text: "Which rule states that atoms tend to combine so they each have eight electrons in their valence shell?",
            options: ["Newton's First Law", "The Octet Rule", "Heisenberg Uncertainty Principle", "Einstein's Relativity"],
            correct: 1,
            explanation: "The octet rule is a chemical rule of thumb that reflects observation that atoms of main-group elements tend to combine in such a way that each atom has eight electrons in its valence shell."
        }
    ];

    const initializeAtoms = useCallback(() => {
        const newAtoms = Array(GRID_SIZE).fill(0).map(() => Math.floor(Math.random() * 4));
        setTargetSum(30 + level * 5); // Increased difficulty
        setAtoms(newAtoms);
    }, [level]);

    const handleAtomClick = (idx: number) => {
        if (status !== 'playing' || testActive) return;

        const newAtoms = [...atoms];
        newAtoms[idx] = (newAtoms[idx] + 1) % (MAX_ELECTRONS + 1);
        setAtoms(newAtoms);

        const currentSum = newAtoms.reduce((acc, v) => acc + v, 0);
        if (currentSum === targetSum) {
            addScore(1800 * (combo + 1));
            setCombo(combo + 1);
            toast.success("VALENCE_STABILITY_ACHIEVED: Molecular Sync OK");
            if (level % 2 === 0) triggerTest(true);
            else { nextLevel(); initializeAtoms(); }
        } else if (currentSum > targetSum) {
            damage(20);
            setCombo(0);
            toast.error("ELECTRON_OVERLOAD: Atomic Rupture Detected");
            initializeAtoms();
        }
    };

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            initializeAtoms();
        }
    }, [status, gameStarted, initializeAtoms]);

    return (
        <BaseGameLayout
            title="Molecular Lab Challenge"
            rules={[
                "Manipulate atomic electron counts to match the TARGET_VALENCE_SUM.",
                "Precision counts: Exceeding the target causes an immediate electron overload.",
                "Atoms cycle from 0 to 8 electrons. Plan your increments carefully.",
                "Expert Chem-Analysis (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Lab Diagnostics */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-6">
                                <Microscope className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-black tracking-widest text-white uppercase italic">Atomic_Scanner_v4</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 text-center">
                                    <div className="text-[10px] font-black tracking-widest text-primary uppercase mb-1">Target_Valence_Sum</div>
                                    <div className="text-5xl font-display font-black text-white italic tracking-tighter">{targetSum}e⁻</div>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                                    <div className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-1">Current_Electron_Flux</div>
                                    <div className={`text-4xl font-display font-black italic tracking-tighter ${atoms.reduce((a, b) => a + b, 0) > targetSum ? 'text-red-500' : 'text-white/60'}`}>
                                        {atoms.reduce((a, b) => a + b, 0)}e⁻
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center gap-4">
                            <ShieldCheck className="w-8 h-8 text-secondary" />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-secondary uppercase">Integrity Score</div>
                                <div className="text-xl font-display font-black text-white italic lowercase underline decoration-white/30 underline-offset-8">VAL_{score}</div>
                            </div>
                        </div>
                    </div>

                    {/* Atomic Grid */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-4 gap-4 p-8 bg-white/[0.02] rounded-[3rem] border border-white/5 backdrop-blur-2xl relative shadow-2xl">
                            {atoms.map((electrons, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleAtomClick(i)}
                                    className="aspect-square rounded-2xl border-2 transition-all duration-300 relative group flex items-center justify-center overflow-hidden"
                                    style={{
                                        borderColor: electrons > 0 ? `rgba(var(--primary), ${0.2 + (electrons / 8)})` : 'rgba(255,255,255,0.05)',
                                        backgroundColor: electrons > 0 ? `rgba(var(--primary), 0.05)` : 'transparent'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Electron Visuals */}
                                    <div className="relative">
                                        <Atom className={`w-10 h-10 ${electrons > 0 ? 'text-primary' : 'text-white/10'} transition-colors`} />
                                        <AnimatePresence>
                                            {[...Array(electrons)].map((_, e) => (
                                                <motion.div
                                                    key={e}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="absolute w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#fbbf24] z-10"
                                                    style={{
                                                        top: `${50 + 40 * Math.sin((e * 2 * Math.PI) / electrons)}%`,
                                                        left: `${50 + 40 * Math.cos((e * 2 * Math.PI) / electrons)}%`
                                                    }}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    <span className="absolute bottom-2 right-3 text-[8px] font-mono font-black text-white/20">{electrons}e⁻</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex items-center gap-10">
                    <div className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <Activity className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">Molecular_Sync_Tier_{level}</span>
                    </div>
                    <div className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <Zap className="w-4 h-4 text-secondary" />
                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">COMBO_X{combo}</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="molecular-lab"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            initializeAtoms();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
