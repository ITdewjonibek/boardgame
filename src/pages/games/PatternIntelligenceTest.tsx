import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Grid3X3, Layers, Zap, Info, Shapes, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PatternIntelligenceTest() {
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

    const [matrix, setMatrix] = useState<string[]>([]);
    const [options, setOptions] = useState<string[]>([]);
    const [correctOption, setCorrectOption] = useState(-1);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What does 'Abstract Reasoning' typically involve?",
            options: ["Mathematical calculation", "Finding underlying rules/patterns", "Memorizing facts", "Reading long texts"],
            correct: 1,
            explanation: "Abstract reasoning involves the ability to analyze information, detect patterns and relationships, and solve problems on a complex, intangible level."
        },
        {
            id: 2,
            text: "Which of these is a common 'Spatial Intelligence' task?",
            options: ["Defining words", "Mental rotation of objects", "Playing a guitar", "Cooking a meal"],
            correct: 1,
            explanation: "Spatial intelligence is an area in the theory of multiple intelligences that deals with spatial judgment and the ability to visualize with the mind's eye."
        },
        {
            id: 3,
            text: "How do matrix logic tests correlate with general intelligence (g)?",
            options: ["Low correlation", "No correlation", "Very high correlation", "Negative correlation"],
            correct: 2,
            explanation: "Raven's Progressive Matrices and similar tests are widely considered some of the most accurate measures of fluid intelligence and G-factor."
        }
    ];

    const generatePattern = useCallback(() => {
        // Simulating pattern generation (Shapes representation as strings/icons)
        const shapePool = ["circle", "square", "triangle", "pentagon", "hexagon", "star"];
        const baseShape = shapePool[Math.floor(Math.random() * shapePool.length)];

        // Pattern logic: Row 1 defines rule, Row 2 follows, Row 3 has missing
        const newMatrix = Array(8).fill(baseShape);
        const correct = baseShape;

        // Distractors
        const newOptions = [baseShape];
        while (newOptions.length < 4) {
            const s = shapePool[Math.floor(Math.random() * shapePool.length)];
            if (!newOptions.includes(s)) newOptions.push(s);
        }

        // Shuffle options
        const shuffledOptions = [...newOptions].sort(() => Math.random() - 0.5);
        setCorrectOption(shuffledOptions.indexOf(correct));
        setOptions(shuffledOptions);
        setMatrix(newMatrix);
    }, [level]);

    const handleSelect = (idx: number) => {
        if (status !== 'playing' || testActive) return;

        if (idx === correctOption) {
            addScore(800 * (combo + 1));
            setCombo(combo + 1);
            toast.success("PATTERN_LOGIC_VALIDATED");

            if (level % 3 === 0) triggerTest(true);
            else { nextLevel(); generatePattern(); }
        } else {
            damage(30);
            setCombo(0);
            toast.error("COGNITIVE_ERROR: Pattern Disruption");
            generatePattern();
        }
    };

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            generatePattern();
        }
    }, [status, gameStarted, generatePattern]);

    return (
        <BaseGameLayout
            title="Pattern Intelligence Test"
            rules={[
                "Analyze the 3x3 matrix and identify the underlying logical rule.",
                "Precision Abstract Reasoning: Identify the missing element.",
                "Logic rules involve rotation, addition, and structural evolution.",
                "Expert Cognitive Phase (Test Phase) triggers every 3 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl w-full">
                    {/* Matrix Area */}
                    <div className="glass-card p-10 bg-white/[0.02] border-white/5 relative">
                        <div className="absolute -top-4 left-10 bg-secondary text-white px-6 py-1 font-display font-black italic text-xs skew-x-[-12deg] shadow-lg">
                            MATRIX_ANALYSIS_MOD_4
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            {matrix.map((shape, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Shapes className={`w-12 h-12 text-white/40 group-hover:text-primary transition-colors`} />
                                    <span className="absolute bottom-2 right-2 text-[8px] font-mono text-white/10">{i < 2 ? 'R1' : i < 5 ? 'R2' : 'R3'}_{i + 1}</span>
                                </motion.div>
                            ))}
                            <div className="aspect-square rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 flex items-center justify-center animate-pulse">
                                <Puzzle className="w-10 h-10 text-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Options Area */}
                    <div className="space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40">
                                <Grid3X3 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-display font-bold uppercase tracking-widest text-white">Select_Missing_Node</h3>
                                <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase italic">Verification Phase Level {level}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {options.map((option, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSelect(i)}
                                    className="aspect-video rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                >
                                    <Shapes className="w-16 h-16 text-white/60 group-hover:text-primary transition-colors" />
                                </motion.button>
                            ))}
                        </div>

                        <div className="p-8 rounded-3xl bg-secondary/10 border border-secondary/30 relative">
                            <div className="flex items-center gap-3 mb-3">
                                <Info className="w-4 h-4 text-secondary" />
                                <span className="text-[10px] font-black tracking-widest text-secondary uppercase">Expert Intelligence Insight</span>
                            </div>
                            <p className="text-sm font-medium text-white/40 italic leading-relaxed">
                                Rules in Tier 4+ involve complex shape combinations where Row 1 + Row 2 = Result. Watch for overlapping structures.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex items-center gap-8">
                    <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                        <Layers className="w-6 h-6 text-primary" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Cognitive Load</span>
                            <span className="text-xl font-display font-black tracking-tighter">PHASE_{level}_SYNC</span>
                        </div>
                    </div>
                    <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                        <Zap className="w-6 h-6 text-secondary" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Synapse Relay</span>
                            <span className="text-xl font-display font-black tracking-tighter">COMBO_X{combo}</span>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="pattern-intelligence"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            generatePattern();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
