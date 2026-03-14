import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Brain, Cpu, Zap, Activity, Network, Binary, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NeuralNetworkBuildChallenge() {
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

    const [weights, setWeights] = useState<number[]>([0.5, 0.5, 0.5]);
    const [targetAccuracy, setTargetAccuracy] = useState(0.85);
    const [currentAccuracy, setCurrentAccuracy] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What is an 'Activation Function' in a neural network?",
            options: ["A way to turn on the computer", "Formula that determines the output of a node", "A database query", "A type of graphics rendering"],
            correct: 1,
            explanation: "In artificial neural networks, the activation function of a node defines the output of that node given an input or set of inputs."
        },
        {
            id: 2,
            text: "What does 'Backpropagation' primarily help with?",
            options: ["Saving data", "Calculating gradients and updating weights", "Printing results", "Speeding up the internet"],
            correct: 1,
            explanation: "Backpropagation is an algorithm used in machine learning to calculate the gradient of the loss function with respect to the weights in a neural network."
        },
        {
            id: 3,
            text: "What is the purpose of a 'Hidden Layer'?",
            options: ["To hide data from users", "To extract complex features from input", "To store passwords", "To reduce power consumption"],
            correct: 1,
            explanation: "Hidden layers in a neural network are located between the input and output layers, where artificial neurons take in a set of weighted inputs and produce an output through an activation function."
        }
    ];

    const initializeNetwork = useCallback(() => {
        setWeights([Math.random(), Math.random(), Math.random()]);
        setTargetAccuracy(0.85 + (level * 0.01));
        setCurrentAccuracy(0);
    }, [level]);

    const adjustWeight = (idx: number, delta: number) => {
        if (status !== 'playing' || testActive) return;
        const nextWeights = [...weights];
        nextWeights[idx] = Math.max(0, Math.min(1, nextWeights[idx] + delta));
        setWeights(nextWeights);

        // Simulated Accuracy Calculation
        const acc = nextWeights.reduce((a, b) => a + b, 0) / 3;
        setCurrentAccuracy(acc);

        if (acc >= targetAccuracy) {
            addScore(3500 * (combo + 1));
            setCombo(combo + 1);
            toast.success("NETWORK_SYNCHRONIZED: Optimal Accuracy Reached");
            if (level % 2 === 0) triggerTest(true);
            else { nextLevel(); initializeNetwork(); }
        }
    };

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            initializeNetwork();
        }
    }, [status, gameStarted, initializeNetwork]);

    return (
        <BaseGameLayout
            title="Neural Network Build Challenge"
            rules={[
                "Architect a functional neural network by adjusting synaptic weights.",
                "Precision Tuning: Target accuracy must exceed the specified threshold.",
                "Learning Rate: Higher levels require tighter architecture synchronization.",
                "Expert AI-Analysis (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Network Diagnostics */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-6">
                                <Activity className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-black tracking-widest text-white uppercase italic">Synapse_Monitor_v4</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black tracking-widest text-primary uppercase">Training_Accuracy</span>
                                        <span className="text-xl font-display font-black text-white">{(currentAccuracy * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-primary"
                                            animate={{ width: `${currentAccuracy * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                                    <div className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-1">Target_Threshold</div>
                                    <div className="text-4xl font-display font-black text-white italic tracking-tighter">{(targetAccuracy * 100).toFixed(0)}%</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center gap-4">
                            <ShieldCheck className="w-8 h-8 text-secondary" />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-secondary uppercase">Integrity Score</div>
                                <div className="text-xl font-display font-black text-white italic lowercase underline underline-offset-8 decoration-white/30 underline-offset-8">VAL_{score}</div>
                            </div>
                        </div>
                    </div>

                    {/* Network Interface */}
                    <div className="lg:col-span-8">
                        <div className="glass-card p-12 bg-[#020617] border-white/5 relative overflow-hidden group shadow-2xl rounded-[3rem]">
                            <div className="absolute inset-0 opacity-5 pointer-events-none">
                                <Network className="w-full h-full text-primary" />
                            </div>

                            <div className="space-y-16 relative z-10">
                                <div className="text-center">
                                    <span className="inline-block px-8 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary tracking-[0.5em] uppercase mb-4">
                                        Synaptic_Weight_Adjustment
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-12 items-center">
                                    {/* Layer Nodes */}
                                    {weights.map((w, i) => (
                                        <div key={i} className="flex flex-col items-center gap-6">
                                            <div className="relative">
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                                    transition={{ duration: 4, repeat: Infinity }}
                                                    className="w-24 h-24 rounded-3xl bg-white/5 border-2 border-primary/40 flex items-center justify-center relative z-10"
                                                >
                                                    <Binary className="w-10 h-10 text-primary" />
                                                </motion.div>
                                                <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full opacity-50" />
                                            </div>

                                            <div className="flex flex-col gap-3 w-full">
                                                <Button onClick={() => adjustWeight(i, 0.05)} variant="outline" className="h-8 border-white/10 p-0 text-primary hover:bg-primary/10">↑</Button>
                                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                                                    <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Weight</div>
                                                    <div className="text-sm font-display font-black text-white">{w.toFixed(2)}</div>
                                                </div>
                                                <Button onClick={() => adjustWeight(i, -0.05)} variant="outline" className="h-8 border-white/10 p-0 text-primary hover:bg-primary/10">↓</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-12 border-t border-white/5 flex justify-center gap-8">
                                    <div className="flex items-center gap-3">
                                        <Cpu className="w-5 h-5 text-secondary" />
                                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Architecture_Sync: Tier_{level}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-primary" />
                                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Epoch_Speed: Normal</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex items-center gap-12">
                    <Brain className="w-10 h-10 text-primary animate-pulse" />
                    <div className="h-10 w-px bg-white/10" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">Neural Intelligence System</span>
                        <span className="text-2xl font-display font-black tracking-widest text-white italic underline underline-offset-8 decoration-primary/40">MASTER_CONTROL_SYNC</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="neural-network"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            initializeNetwork();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
