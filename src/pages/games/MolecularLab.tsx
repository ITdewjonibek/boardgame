import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchGameTests, type Test } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FlaskConical, Atom, Beaker, ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";

export default function MolecularLab() {
    const [tests, setTests] = useState<Test[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start");
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        fetchGameTests("molecular_lab")
            .then(t => setTests(t))
            .catch(() => { });
    }, []);

    const handleAnswer = (idx: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(idx);
        const correct = idx === tests[currentIdx].correct_index;
        setIsCorrect(correct);

        if (correct) {
            setScore(s => s + 150);
            toast.success("Element muvaffaqiyatli sintez qilindi!", { icon: <Atom className="text-green-500" /> });
        } else {
            toast.error("Reaksiya muvaffaqiyatsiz bo'ldi!");
        }

        setTimeout(() => {
            if (currentIdx + 1 < tests.length) {
                setCurrentIdx(i => i + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                setGameState("gameover");
            }
        }, 1500);
    };

    const ScientificGrid = () => (
        <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0f] relative text-white overflow-hidden p-4 md:p-8 mesh-bg">
            <ScientificGrid />

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="flex justify-between items-center mb-12">
                    <Link to="/">
                        <Button variant="ghost" className="text-white/60 hover:text-white">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Laboratoriyadan chiqish
                        </Button>
                    </Link>

                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-2 backdrop-blur-md flex items-center gap-3">
                            <Beaker className="w-5 h-5 text-emerald-500" />
                            <span className="font-display font-bold text-xl">{score} UNIT</span>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {gameState === "start" ? (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            className="text-center py-12"
                        >
                            <div className="relative inline-block mb-12">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-2 border-primary/20 rounded-full scale-150"
                                />
                                <FlaskConical className="w-40 h-40 text-primary drop-shadow-[0_0_30px_rgba(var(--primary),0.5)]" />
                            </div>
                            <h1 className="text-7xl font-display font-black mb-4 tracking-tight uppercase">MOLECULAR LAB</h1>
                            <p className="text-white/40 mb-12 text-xl max-w-xl mx-auto tracking-wide">
                                Virtual laboratoriyada elementlarni sintez qiling va kimyoviy jarayonlarni boshqaring.
                            </p>
                            <Button
                                variant="premium"
                                size="lg"
                                className="h-16 px-16 text-xl rounded-2xl border-b-4 border-primary/50"
                                onClick={() => setGameState("playing")}
                            >
                                LABORATORIYANI ISHGA TUSHRISH
                            </Button>
                        </motion.div>
                    ) : gameState === "playing" ? (
                        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="glass-card p-8 border-primary/20">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Search className="w-5 h-5 text-primary" />
                                        <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Analizator: Savol {currentIdx + 1}</span>
                                    </div>
                                    <h2 className="text-4xl font-display font-bold mb-12 leading-tight">
                                        {tests[currentIdx]?.question || "Test yuklanmoqda..."}
                                    </h2>

                                    <div className="grid grid-cols-1 gap-4">
                                        {tests[currentIdx]?.options.map((option, i) => (
                                            <motion.button
                                                key={i}
                                                whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.05)" }}
                                                onClick={() => handleAnswer(i)}
                                                className={`
                          group relative p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden
                          ${selectedAnswer === i
                                                        ? (isCorrect ? "border-green-500 bg-green-500/10 text-green-400" : "border-red-500 bg-red-500/10 text-red-400")
                                                        : "border-white/5 bg-white/5 text-white/70 hover:border-primary/50"
                                                    }
                          ${selectedAnswer !== null && i === tests[currentIdx].correct_index ? "border-green-500 bg-green-500/10" : ""}
                        `}
                                            >
                                                <div className="flex items-center gap-6">
                                                    <span className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 font-display font-bold text-xl group-hover:bg-primary group-hover:text-black transition-colors ${selectedAnswer === i ? "bg-primary text-black" : ""}`}>
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-xl font-medium">{option}</span>
                                                </div>
                                                {selectedAnswer === i && (
                                                    <motion.div layoutId="highlight" className="absolute left-0 top-0 bottom-0 w-1 bg-current" />
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                                    <h3 className="text-sm font-bold tracking-widest text-white/30 uppercase mb-8">Struktura Vizualizatsiyasi</h3>
                                    <div className="aspect-square relative flex items-center justify-center">
                                        <motion.div
                                            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                                            transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }}
                                            className="w-48 h-48 rounded-full border border-dashed border-primary/30 flex items-center justify-center"
                                        >
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-black"
                                            >
                                                <Atom className="w-8 h-8" />
                                            </motion.div>
                                            {[...Array(4)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ rotate: -360 }}
                                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                    className="absolute w-6 h-6 rounded-full bg-secondary shadow-[0_0_15px_rgba(var(--secondary),0.5)]"
                                                    style={{
                                                        transform: `rotate(${i * 90}deg) translateY(96px)`
                                                    }}
                                                />
                                            ))}
                                        </motion.div>
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-white/5">
                                        <div className="flex justify-between text-xs font-bold tracking-widest text-white/40 mb-2 uppercase">
                                            <span>Barqarorlik</span>
                                            <span className="text-primary">{score / 15}%</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, score / 15)}%` }}
                                                className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <motion.div
                            key="gameover"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card max-w-2xl mx-auto p-12 text-center"
                        >
                            <FlaskConical className="w-20 h-20 text-emerald-500 mx-auto mb-8" />
                            <h2 className="text-5xl font-display font-black mb-4">SINTEZ YAKUNLANDI</h2>
                            <p className="text-white/40 text-xl mb-12">Yig'ilgan tajriba: <span className="text-emerald-400 font-bold">{score} XP</span></p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="premium" className="h-14 px-10" onClick={() => window.location.reload()}>LABORATORIYANI QAYTA TIKLASH</Button>
                                <Link to="/"><Button variant="outline" className="h-14 px-10">TERMINALGA QAYTISH</Button></Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
