import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchGameTests, type Test } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, Shield, ArrowLeft, Trophy } from "lucide-react";

export default function CosmicQuiz() {
    const [tests, setTests] = useState<Test[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start");
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        fetchGameTests("cosmic_quiz")
            .then(t => setTests(t))
            .catch(() => { });
    }, []);

    const handleAnswer = (idx: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(idx);
        const correct = idx === tests[currentIdx].correct_index;
        setIsCorrect(correct);

        if (correct) {
            setScore(s => s + 100);
        } else {
            setLives(l => l - 1);
        }

        setTimeout(() => {
            if (!correct && lives <= 1) {
                setGameState("gameover");
            } else if (currentIdx + 1 < tests.length) {
                setCurrentIdx(i => i + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                setGameState("gameover");
            }
        }, 1500);
    };

    const StarField = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: Math.random(), scale: Math.random() }}
                    animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2 + Math.random() * 4, repeat: Infinity }}
                    className="absolute bg-white rounded-full"
                    style={{
                        width: Math.random() * 3 + "px",
                        height: Math.random() * 3 + "px",
                        left: Math.random() * 100 + "%",
                        top: Math.random() * 100 + "%",
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050510] relative text-white overflow-hidden p-4 md:p-8 mesh-bg">
            <StarField />

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="flex justify-between items-center mb-8">
                    <Link to="/">
                        <Button variant="ghost" className="text-white/60 hover:text-white">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Orqaga
                        </Button>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-500" />
                            <span className="font-display font-bold text-xl">{lives}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            <span className="font-display font-bold text-xl">{score}</span>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {gameState === "start" ? (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center py-20"
                        >
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="inline-block mb-8"
                            >
                                <Rocket className="w-32 h-32 text-primary drop-shadow-[0_0_30px_rgba(var(--primary),0.5)]" />
                            </motion.div>
                            <h1 className="text-6xl font-display font-black mb-4 tracking-tighter">COSMIC QUIZ</h1>
                            <p className="text-white/40 mb-12 text-xl max-w-lg mx-auto">Koinot bo'ylab sayohat qiling va bilimlaringizni sinab ko'ring!</p>
                            <Button
                                variant="premium"
                                size="lg"
                                className="h-16 px-16 text-xl"
                                onClick={() => setGameState("playing")}
                            >
                                MISSİYANI BOSHLASH
                            </Button>
                        </motion.div>
                    ) : gameState === "playing" ? (
                        <motion.div
                            key="playing"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-12">
                                <span className="text-primary font-display font-bold tracking-widest uppercase">Sayyora {currentIdx + 1} / {tests.length || "?"}</span>
                                <h2 className="text-3xl font-display font-bold mt-2">
                                    {tests[currentIdx]?.question || "Yuklanmoqda..."}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tests[currentIdx]?.options.map((option, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(i)}
                                        className={`
                      p-6 rounded-2xl border-2 text-left font-display font-bold text-lg transition-all duration-300 backdrop-blur-md
                      ${selectedAnswer === i
                                                ? (isCorrect ? "border-green-500 bg-green-500/20 text-green-400" : "border-red-500 bg-red-500/20 text-red-400")
                                                : "border-white/10 bg-white/5 text-white/70 hover:border-primary/50"
                                            }
                      ${selectedAnswer !== null && i === tests[currentIdx].correct_index ? "border-green-500 bg-green-500/20 text-green-400" : ""}
                    `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-sm">
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            {option}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="gameover"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20"
                        >
                            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
                            <h2 className="text-5xl font-display font-black mb-2 tracking-tighter">MISSİYA TUGADI</h2>
                            <p className="text-white/40 text-2xl mb-12">Sizning natijangiz: <span className="text-primary font-bold">{score}</span> ball</p>
                            <div className="flex gap-4 justify-center">
                                <Button variant="premium" onClick={() => window.location.reload()}>QAYTA BOSHLASH</Button>
                                <Link to="/"><Button variant="outline">ASOSIY MENU</Button></Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none"
            />
        </div>
    );
}
