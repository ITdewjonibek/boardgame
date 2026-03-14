import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Zap, Timer, Brain, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const INITIAL_TIME = 2.5; // Seconds per question

export default function SpeedBrainQuiz() {
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

    const [question, setQuestion] = useState<{ text: string, color: string, answer: boolean }>({ text: "", color: "", answer: false });
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What is the 'Stroop Effect' in cognitive psychology?",
            options: ["Memory loss", "Delay in reaction time with conflicting stimuli", "Vision impairment", "Speed reading technique"],
            correct: 1,
            explanation: "The Stroop effect is a demonstration of cognitive interference where a delay in the reaction time of a task occurs due to a mismatch in stimuli (e.g., the word 'Red' printed in blue ink)."
        },
        {
            id: 2,
            text: "Which type of 'Attention' is required to focus on one source while ignoring others?",
            options: ["Divided Attention", "Selective Attention", "Sustained Attention", "Alternating Attention"],
            correct: 1,
            explanation: "Selective attention is the process of focusing on a particular object in the environment for a certain period of time, allowing us to tune out unimportant details."
        },
        {
            id: 3,
            text: "How does 'Reaction Time' typically change with task complexity?",
            options: ["Decreases", "Increases", "Stays the same", "Becomes zero"],
            correct: 1,
            explanation: "According to Hick's Law, the time it takes to make a decision increases logarithmically with the number and complexity of choices available."
        }
    ];

    const generateQuestion = useCallback(() => {
        const colors = ["RED", "BLUE", "GREEN", "YELLOW", "PURPLE"];
        const text = colors[Math.floor(Math.random() * colors.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const isMatch = text === color;

        setQuestion({ text, color, answer: isMatch });
        setTimeLeft(Math.max(0.8, INITIAL_TIME - (level * 0.1))); // Faster per level
    }, [level]);

    const handleAnswer = (userAns: boolean) => {
        if (status !== 'playing' || testActive) return;

        if (userAns === question.answer) {
            addScore(300 * (combo + 1));
            setCombo(combo + 1);
            toast.success("SYNAPSE_MATCH_CONFIRMED");

            if (level % 4 === 0) triggerTest(true);
            else { nextLevel(); generateQuestion(); }
        } else {
            damage(20);
            setCombo(0);
            toast.error("COGNITIVE_MISMATCH: System Desync");
            generateQuestion();
        }
    };

    useEffect(() => {
        if (status === 'playing' && timeLeft > 0 && !testActive) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 0.1), 100);
            return () => clearInterval(timer);
        } else if (timeLeft <= 0 && status === 'playing') {
            damage(15);
            toast.error("NEURAL_TIMEOUT: Processing Lag");
            generateQuestion();
        }
    }, [timeLeft, status, testActive, damage, generateQuestion]);

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            generateQuestion();
        }
    }, [status, gameStarted, generateQuestion]);

    return (
        <BaseGameLayout
            title="Speed Brain Quiz"
            rules={[
                "Respond instantly to the visual stimuli presented.",
                "Verify: Does the COLOR name match its visual color?",
                "Response window shrinks exponentially per level.",
                "Expert Cognitive Phase (Test Phase) triggers every 4 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <motion.div
                    key={question.text + question.color}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card p-20 text-center max-w-2xl w-full border-primary/20 bg-[#0a0c1a]/90 relative shadow-[0_0_100px_rgba(var(--primary),0.1)]"
                >
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
                        <Brain className="w-5 h-5 text-primary animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">Neural_Processor_Sync</span>
                    </div>

                    <div className="mb-16">
                        <h2
                            className="text-9xl font-display font-black tracking-tighter italic"
                            style={{ color: question.color.toLowerCase() }}
                        >
                            {question.text}
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <Button
                            onClick={() => handleAnswer(true)}
                            variant="premium"
                            className="h-24 text-3xl font-black italic rounded-3xl border-b-8 border-green-500/50 bg-green-500/10 hover:bg-green-500/20 group"
                        >
                            <CheckCircle2 className="w-8 h-8 mr-4 group-hover:scale-125 transition-transform" />
                            MATCH
                        </Button>
                        <Button
                            onClick={() => handleAnswer(false)}
                            variant="premium"
                            className="h-24 text-3xl font-black italic rounded-3xl border-b-8 border-red-500/50 bg-red-500/10 hover:bg-red-500/20 group"
                        >
                            <XCircle className="w-8 h-8 mr-4 group-hover:scale-125 transition-transform" />
                            NO_MATCH
                        </Button>
                    </div>

                    {/* Time Progress Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-white/5 overflow-hidden">
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: `${(timeLeft / INITIAL_TIME) * 100}%` }}
                            className={`h-full ${timeLeft < 1 ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-primary'}`}
                        />
                    </div>
                </motion.div>

                <div className="mt-16 flex items-center gap-12">
                    <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                        <Timer className={`w-8 h-8 ${timeLeft < 1 ? 'text-red-500 animate-spin' : 'text-primary'}`} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Burst Time</span>
                            <span className={`text-2xl font-display font-black ${timeLeft < 1 ? 'text-red-500' : 'text-white'}`}>{timeLeft.toFixed(1)}s</span>
                        </div>
                    </div>

                    <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                        <Zap className="w-8 h-8 text-secondary" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Synapse Tier</span>
                            <span className="text-2xl font-display font-black text-white italic lowercase underline decoration-white/30 underline-offset-8">LVL_{level}</span>
                        </div>
                    </div>

                    <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                        <AlertCircle className="w-8 h-8 text-white/20" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Stability</span>
                            <span className="text-2xl font-display font-black text-white italic lowercase underline decoration-primary/30 underline-offset-8">{combo * 5}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="speed-brain"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            generateQuestion();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
