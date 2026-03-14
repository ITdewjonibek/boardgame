import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Atom, Zap, Eye, Binary, Cpu, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GRID_SIZE = 16;
const COLORS = ["cyan", "magenta", "yellow"];

export default function QuantumLogicDuel() {
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

    const [qubits, setQubits] = useState<string[]>([]);
    const [targetColor, setTargetColor] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const cycleInterval = useRef<NodeJS.Timeout | null>(null);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What is 'Superposition' in quantum computing?",
            options: ["A state of being in two places at once", "A particle existing in multiple states simultaneously", "High speed processing", "A type of encryption"],
            correct: 1,
            explanation: "Superposition is a fundamental principle of quantum mechanics that allows particles, such as electrons or photons, to exist in multiple states at the same time until they are observed."
        },
        {
            id: 2,
            text: "What happens when a quantum state is 'Observed'?",
            options: ["The computer speeds up", "The wavefunction collapses into a single state", "The data is deleted", "Nothing changes"],
            correct: 1,
            explanation: "In quantum mechanics, observation (measurement) causes the wavefunction to collapse, forcing the particle to take on a single, definite state."
        },
        {
            id: 3,
            text: "What is 'Quantum Entanglement'?",
            options: ["A bug in the system", "Particles interconnected regardless of distance", "A type of wiring", "Data compression"],
            correct: 1,
            explanation: "Entanglement is a phenomenon where pair or groups of particles are generated or interact in such a way that the quantum state of each particle cannot be described independently of the state of the others."
        }
    ];

    const initializeLevel = useCallback(() => {
        setQubits(Array(GRID_SIZE).fill(COLORS[0]));
        setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);

        if (cycleInterval.current) clearInterval(cycleInterval.current);

        cycleInterval.current = setInterval(() => {
            setQubits(prev => prev.map(() => COLORS[Math.floor(Math.random() * COLORS.length)]));
        }, Math.max(200, 1000 - level * 50)); // Speed increases
    }, [level]);

    const handleObserve = (idx: number) => {
        if (status !== 'playing' || testActive) return;

        if (qubits[idx] === targetColor) {
            addScore(500 * (combo + 1));
            setCombo(combo + 1);
            toast.success("QUANTUM_STATE_SYNCED");

            const remaining = qubits.filter(q => q === targetColor).length;
            if (remaining <= 1) {
                if (level % 3 === 0) triggerTest(true);
                else { nextLevel(); initializeLevel(); }
            }
        } else {
            damage(15);
            setCombo(0);
            toast.error("WAVEFUNCTION_COLLAPSE_ERROR");
        }
    };

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            initializeLevel();
        }
        return () => { if (cycleInterval.current) clearInterval(cycleInterval.current); };
    }, [status, gameStarted, initializeLevel]);

    return (
        <BaseGameLayout
            title="Quantum Logic Duel"
            rules={[
                "Observe (Click) Qubits only when they match the TARGET_COLOR.",
                "Qubits exist in superposition, cycling through states rapidly.",
                "Observation causes immediate wavefunction collapse.",
                "Expert Quantum Analysis (Test Phase) triggers every 3 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-16">

                    {/* Target Indicator */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">Target_Observation_State</div>
                        <motion.div
                            animate={{
                                boxShadow: [`0 0 20px ${targetColor}`, `0 0 60px ${targetColor}`, `0 0 20px ${targetColor}`],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-32 h-32 rounded-3xl border-4 flex items-center justify-center"
                            style={{ borderColor: targetColor, backgroundColor: `${targetColor}10` }}
                        >
                            <Atom className="w-16 h-16" style={{ color: targetColor }} />
                        </motion.div>
                        <span className="text-2xl font-display font-black tracking-widest uppercase italic" style={{ color: targetColor }}>
                            {targetColor}
                        </span>
                    </div>

                    {/* Qubit Grid */}
                    <div className="grid grid-cols-4 gap-4 p-8 bg-white/[0.02] rounded-[3rem] border border-white/5 backdrop-blur-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        {qubits.map((color, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleObserve(i)}
                                className="aspect-square w-20 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden"
                                style={{ borderColor: `${color}40`, backgroundColor: `${color}10` }}
                            >
                                <motion.div
                                    animate={{ opacity: [0.2, 0.8, 0.2] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                    className="absolute inset-0"
                                    style={{ backgroundColor: color }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Binary className="w-6 h-6 text-white/20" />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="mt-16 flex items-center gap-10">
                    <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                        <Layers className="w-8 h-8 text-secondary" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Coherence Level</span>
                            <span className="text-xl font-display font-black text-white italic lowercase underline decoration-white/30 underline-offset-8">稳定的_{100 - level}%</span>
                        </div>
                    </div>

                    <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                        <Zap className="w-8 h-8 text-primary" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Observation Accuracy</span>
                            <span className="text-xl font-display font-black text-white italic lowercase underline decoration-primary/30 underline-offset-8">PHASE_{level}_SYNC</span>
                        </div>
                    </div>

                    <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                        <Eye className="w-8 h-8 text-white/20" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Observer Effect</span>
                            <span className="text-xl font-display font-black text-white italic lowercase underline decoration-white/30 underline-offset-8">DETECTED</span>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="quantum-logic"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            initializeLevel();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
