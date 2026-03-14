import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ShieldAlert, CheckCircle2, XCircle, Trophy, BarChart3, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScoreManager } from '@/lib/score-manager';
import { toast } from 'sonner';

export interface TestQuestion {
    id: string | number;
    text: string;
    options: string[];
    correct: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

interface AssessmentCoreProps {
    gameId: string;
    defaultQuestions: TestQuestion[];
    onComplete: (bonusScore: number, isCustom: boolean) => void;
}

export default function AssessmentCore({ gameId, defaultQuestions, onComplete }: AssessmentCoreProps) {
    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isCustomTest, setIsCustomTest] = useState(false);

    const { addPoints } = useScoreManager();

    // Fetch Custom Tests and Append
    useEffect(() => {
        const fetchCustomTests = async () => {
            setIsLoading(true);
            try {
                // Determine API URL (local vs prod)
                const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

                const token = localStorage.getItem("token");
                const headers: HeadersInit = {
                    "Content-Type": "application/json",
                };

                // If the user is logged in, send token (might be useful for tracking)
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }

                // Add a timeout to prevent game hangs
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2500);

                try {
                    const res = await fetch(`${apiUrl}/api/game-tests/merged/${gameId}`, {
                        headers,
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (!res.ok) {
                        throw new Error(`API error: ${res.status}`);
                    }

                    const customData = await res.json();

                    if (Array.isArray(customData) && customData.length > 0) {
                        // Map API response to TestQuestion format
                        const formattedCustomTests: TestQuestion[] = customData.map(q => ({
                            id: q.id,
                            text: `[DATABASE] ${q.prompt}`,
                            options: q.options.map((o: any) => o.text),
                            correct: q.correct_index,
                            explanation: q.explanation || "Instructor provided question.",
                            difficulty: (q.difficulty as 'easy' | 'medium' | 'hard') || 'medium'
                        }));

                        setIsCustomTest(true);
                        setQuestions([...defaultQuestions, ...formattedCustomTests]);
                    } else {
                        setIsCustomTest(false);
                        setQuestions([...defaultQuestions]);
                    }
                } catch (fetchError: any) {
                    if (fetchError.name === 'AbortError') {
                        console.warn("Assessment sync timed out. Falling back to internal defaults.");
                    } else {
                        console.error("Failed to load custom tests:", fetchError);
                    }
                    setIsCustomTest(false);
                    setQuestions([...defaultQuestions]);
                }
            } catch (error) {
                console.error("Failed to load custom tests, falling back strictly to defaults.", error);
                setIsCustomTest(false);
                setQuestions([...defaultQuestions]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomTests();
    }, [gameId, defaultQuestions]);

    const handleAnswer = (index: number) => {
        if (isAnswered) return;

        setSelectedAnswer(index);
        setIsAnswered(true);

        const currentQ = questions[currentIndex];
        const isCorrect = index === currentQ.correct;

        if (isCorrect) {
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
            addPoints(1000, 'bonus');
            toast.success("ASSESSMENT_VALID: Correct Answer", { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> });
        } else {
            toast.error("ASSESSMENT_INVALID: Incorrect Answer", { icon: <XCircle className="w-5 h-5 text-red-500" /> });
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setScore(prev => ({ ...prev, total: prev.total + 1 }));
        } else {
            setScore(prev => ({ ...prev, total: prev.total + 1 }));
            completeAssessment();
        }
    };

    const completeAssessment = () => {
        const bonus = score.correct * 5000;
        onComplete(bonus, isCustomTest);
    };

    if (isLoading) {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl">
                <div className="flex flex-col items-center gap-6">
                    <Database className="w-16 h-16 text-primary animate-pulse" />
                    <span className="text-xl font-black tracking-[0.5em] text-white/50 uppercase">Syncing Custom Assessments</span>
                </div>
            </div>
        );
    }

    if (questions.length === 0) return null;

    const currentQ = questions[currentIndex];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 sm:p-8"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-4xl glass-card bg-[#020617] border-white/10 rounded-[3rem] p-8 sm:p-12 relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Brain className="w-64 h-64 text-primary" />
                    </div>

                    <div className="relative z-10 flex flex-col gap-12">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    {currentIndex >= defaultQuestions.length ? <Database className="w-6 h-6 text-secondary animate-pulse" /> : <ShieldAlert className="w-6 h-6 text-primary" />}
                                    <span className={`text-[10px] font-black tracking-[0.5em] uppercase ${currentIndex >= defaultQuestions.length ? 'text-secondary/80' : 'text-white/40'}`}>
                                        {currentIndex >= defaultQuestions.length ? 'Custom Instructor Assessment' : 'System Default Assessment'}
                                    </span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-display font-black text-white italic tracking-tighter uppercase">
                                    Knowledge Phase {currentIndex + 1}
                                </h2>
                            </div>
                            <div className="flex flex-col items-end gap-2 text-right">
                                <span className="text-[10px] font-black tracking-widest text-primary uppercase">Completion Core</span>
                                <div className="flex gap-2">
                                    {questions.map((_, idx) => (
                                        <div key={idx} className={`w-3 h-3 rounded-full ${idx === currentIndex ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]' : idx < currentIndex ? 'bg-white/20' : 'bg-white/5 border border-white/10'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Question */}
                        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                            <span className="inline-block px-4 py-1 rounded-full bg-white/5 text-[10px] font-black tracking-widest text-white/40 uppercase mb-4">
                                Problem Details [Tier: {currentQ.difficulty}]
                            </span>
                            <p className="text-2xl sm:text-3xl font-display font-black text-white italic tracking-wide leading-tight">
                                {currentQ.text}
                            </p>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentQ.options.map((option, idx) => {
                                const isSelected = selectedAnswer === idx;
                                const isCorrectOpt = idx === currentQ.correct;

                                let btnClass = "border-white/10 hover:border-white/30 text-white/70 hover:bg-white/5";

                                if (isAnswered) {
                                    if (isCorrectOpt) {
                                        btnClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-400";
                                    } else if (isSelected && !isCorrectOpt) {
                                        btnClass = "border-red-500/50 bg-red-500/10 text-red-500";
                                    } else {
                                        btnClass = "border-white/5 opacity-30 text-white/30";
                                    }
                                } else if (isSelected) {
                                    btnClass = "border-primary/50 bg-primary/10 text-primary";
                                }

                                return (
                                    <button
                                        key={idx}
                                        disabled={isAnswered}
                                        onClick={() => handleAnswer(idx)}
                                        className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 font-display font-black text-xl italic tracking-wide ${btnClass}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-mono opacity-50 block uppercase">[{String.fromCharCode(65 + idx)}]</span>
                                            {option}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation & Next */}
                        <AnimatePresence>
                            {isAnswered && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="pt-8 border-t border-white/10 flex flex-col gap-8"
                                >
                                    <div className={`p-6 rounded-2xl border ${selectedAnswer === currentQ.correct ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <BarChart3 className={`w-5 h-5 ${selectedAnswer === currentQ.correct ? 'text-emerald-500' : 'text-red-500'}`} />
                                            <span className={`text-[10px] font-black tracking-widest uppercase ${selectedAnswer === currentQ.correct ? 'text-emerald-500' : 'text-red-500'}`}>
                                                Analytical Sync {selectedAnswer === currentQ.correct ? 'Verified' : 'Failed'}
                                            </span>
                                        </div>
                                        <p className="text-lg text-white/80 font-mono">
                                            {currentQ.explanation}
                                        </p>
                                    </div>

                                    <Button
                                        onClick={nextQuestion}
                                        variant="premium"
                                        className="w-full h-20 rounded-[2rem] border-b-8 border-primary/50 text-2xl font-black italic tracking-widest flex items-center justify-center gap-4"
                                    >
                                        {currentIndex < questions.length - 1 ? (
                                            <>ENGAGE_NEXT_PHASE</>
                                        ) : (
                                            <>
                                                <Trophy className="w-6 h-6 fill-primary" />
                                                SUBMIT_FINAL_ANALYSIS
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
