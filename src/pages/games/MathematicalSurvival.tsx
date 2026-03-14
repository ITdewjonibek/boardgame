import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Calculator, Zap, Timer, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const INITIAL_TIME = 15;

export default function MathematicalSurvival() {
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

    const [equation, setEquation] = useState<{ question: string, answer: number }>({ question: "", answer: 0 });
    const [userAnswer, setUserAnswer] = useState("");
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What is the 'Fibonacci Sequence' primarily based on?",
            options: ["Random numbers", "Sum of two preceding ones", "Multiplication of primes", "Logarithmic growth"],
            correct: 1,
            explanation: "The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1."
        },
        {
            id: 2,
            text: "In mathematics, what does 'Prime Factorization' involve?",
            options: ["Adding prime numbers", "Finding the largest prime", "Breaking a number into prime factors", "Dividing by zero"],
            correct: 2,
            explanation: "Prime factorization is the process of breaking down a composite number into a set of prime numbers which, when multiplied together, equal the original number."
        },
        {
            id: 3,
            text: "What is 'Computational Complexity' used to measure?",
            options: ["The size of a number", "Resources needed for an algorithm", "The brightness of a screen", "The speed of light"],
            correct: 1,
            explanation: "Computational complexity is a branch of the theory of computation that focuses on classifying computational problems according to their inherent difficulty and the resources (time/space) required to solve them."
        }
    ];

    const generateEquation = useCallback(() => {
        let q = "";
        let a = 0;

        // Difficulty scaling
        const range = 10 + (level * 5);
        const opType = level < 5 ? 2 : level < 10 ? 3 : 4;

        const n1 = Math.floor(Math.random() * range) + 1;
        const n2 = Math.floor(Math.random() * range) + 1;
        const ops = ["+", "-", "*", "/"];
        const op = ops[Math.floor(Math.random() * opType)];

        switch (op) {
            case "+": q = `${n1} + ${n2}`; a = n1 + n2; break;
            case "-": q = `${n1} - ${n2}`; a = n1 - n2; break;
            case "*": q = `${n1} × ${n2}`; a = n1 * n2; break;
            case "/":
                const product = n1 * n2;
                q = `${product} ÷ ${n1}`; a = n2; break;
        }

        setEquation({ question: q, answer: a });
        setUserAnswer("");
        setTimeLeft(Math.max(5, INITIAL_TIME - Math.floor(level / 2)));
    }, [level]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (status !== 'playing' || testActive) return;

        if (parseInt(userAnswer) === equation.answer) {
            addScore(500 * (combo + 1));
            setCombo(combo + 1);
            toast.success("CALCULATION_VERIFIED");

            if (level % 3 === 0) triggerTest(true);
            else { nextLevel(); generateEquation(); }
        } else {
            damage(20);
            setCombo(0);
            toast.error("MATH_ERROR: Logic Inconsistency");
            generateEquation();
        }
    };

    useEffect(() => {
        if (status === 'playing' && timeLeft > 0 && !testActive) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && status === 'playing') {
            damage(25);
            toast.error("TIME_EXPIRY: Processor Overload");
            generateEquation();
        }
    }, [timeLeft, status, testActive, damage, generateEquation]);

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            generateEquation();
        }
    }, [status, gameStarted, generateEquation]);

    return (
        <BaseGameLayout
            title="Mathematical Survival"
            rules={[
                "Solve complex equations within the strict time limit.",
                "Incorrect results trigger health depletion protocols.",
                "Solve speed directly influences score exponentiality.",
                "Expert Math Analysis (Test Phase) triggers every 3 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <motion.div
                    key={equation.question}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="glass-card p-16 text-center max-w-2xl w-full border-primary/20 bg-white/[0.02] relative"
                >
                    <div className="absolute top-4 left-6 flex items-center gap-2 text-primary/40 font-mono text-[10px] tracking-widest uppercase italic">
                        <Calculator className="w-3 h-3" /> Arithmetic_Core_v4
                    </div>

                    <h2 className="text-8xl font-display font-black tracking-tighter mb-12 italic text-gradient underline decoration-primary/20 underline-offset-[20px]">
                        {equation.question}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="relative group">
                            <Input
                                autoFocus
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="ENTER_RESULT"
                                className="h-24 bg-white/5 border-white/10 text-5xl font-display font-black text-center tracking-widest rounded-3xl focus:border-primary/50 transition-all placeholder:text-white/5"
                                type="number"
                            />
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-primary/20 rounded-full blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        </div>

                        <Button
                            type="submit"
                            variant="premium"
                            className="w-full h-16 text-xl font-black italic rounded-2xl border-b-4 border-primary/50"
                        >
                            EXECUTE_CALCULATION
                        </Button>
                    </form>
                </motion.div>

                <div className="mt-16 flex items-center gap-12">
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">Processor Time</span>
                        <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center relative transition-colors ${timeLeft < 5 ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-primary/30'}`}>
                            <span className={`text-4xl font-display font-black ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>{timeLeft}s</span>
                            <Timer className="absolute -top-1 -right-1 w-6 h-6 text-white/20 p-1 bg-[#02040a] rounded-full border border-white/5" />
                        </div>
                    </div>

                    <div className="h-20 w-px bg-white/5" />

                    <div className="flex flex-col items-center gap-4">
                        <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">Phase Metrics</span>
                        <div className="flex gap-4">
                            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-secondary" />
                                <span className="text-xl font-display font-black tracking-tighter">LVL {level}</span>
                            </div>
                            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="text-xl font-display font-black tracking-tighter">+{score}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="math-survival"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            generateEquation();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
