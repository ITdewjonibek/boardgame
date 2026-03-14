import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchGameTests, type Test } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scroll, Compass, Map, Swords, ArrowLeft, Trophy, Book } from "lucide-react";

export default function VerbalQuest() {
    const [tests, setTests] = useState<Test[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start");

    useEffect(() => {
        fetchGameTests("verbal_quest").then(setTests).catch(() => { });
    }, []);

    const handleAnswer = (idx: number) => {
        const isCorrect = idx === tests[currentIdx].correct_index;
        if (isCorrect) {
            setScore(s => s + 200);
            if (currentIdx + 1 < tests.length) {
                setCurrentIdx(i => i + 1);
            } else {
                setGameState("gameover");
            }
        } else {
            setScore(s => Math.max(0, s - 50));
        }
    };

    const Parchment = ({ children }: { children: React.ReactNode }) => (
        <div className="relative p-12 bg-[#f4e4bc] text-[#5d4037] rounded-sm shadow-2xl border-[12px] border-[#8d6e63]">
            <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-[#8d6e63] -translate-x-1/2 -translate-y-1/2 shadow-inner" />
            <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-[#8d6e63] translate-x-1/2 -translate-y-1/2 shadow-inner" />
            <div className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-[#8d6e63] -translate-x-1/2 translate-y-1/2 shadow-inner" />
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#8d6e63] translate-x-1/2 translate-y-1/2 shadow-inner" />
            <div className="font-serif">
                {children}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#2d1b0d] text-[#f4e4bc] relative overflow-hidden p-4 md:p-8 mesh-bg">
            <div className="max-w-4xl mx-auto relative z-10">
                <header className="flex justify-between items-center mb-12 border-b-2 border-[#8d6e63]/30 pb-4">
                    <Link to="/">
                        <Button variant="ghost" className="text-[#f4e4bc]/60 hover:text-white hover:bg-white/5">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Qal'aga qaytish
                        </Button>
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Scroll className="w-5 h-5" />
                            <span className="font-serif font-bold text-2xl">{score} ALTIN</span>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {gameState === "start" ? (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1, filter: "sepia(1)" }}
                            className="text-center py-12"
                        >
                            <div className="mb-8">
                                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 5, repeat: Infinity }}>
                                    <Map className="w-40 h-40 mx-auto text-[#8d6e63]" />
                                </motion.div>
                            </div>
                            <h1 className="text-7xl font-serif font-black mb-4 tracking-tight drop-shadow-lg">VERBAL QUEST</h1>
                            <p className="text-[#f4e4bc]/60 text-2xl font-serif italic mb-12">So'zlar olamidagi sarguzashtingizni boshlang!</p>
                            <Button
                                onClick={() => setGameState("playing")}
                                className="bg-[#8d6e63] hover:bg-[#a1887f] text-[#f4e4bc] h-20 px-16 text-2xl font-serif font-bold rounded-none border-4 border-[#5d4037] shadow-[0_10px_0_#5d4037]"
                            >
                                SARGUZASHTNI BOSHLASH
                            </Button>
                        </motion.div>
                    ) : gameState === "playing" ? (
                        <div className="space-y-8">
                            <Parchment>
                                <div className="flex justify-between items-center mb-8 border-b border-[#5d4037]/20 pb-4">
                                    <div className="flex items-center gap-2">
                                        <Book className="w-6 h-6" />
                                        <span className="uppercase tracking-widest font-black text-sm">Topshiriq {currentIdx + 1}</span>
                                    </div>
                                    <Compass className="w-6 h-6 animate-spin-slow" />
                                </div>

                                <h2 className="text-4xl font-serif font-bold mb-12 text-center text-[#3e2723]">
                                    {tests[currentIdx]?.question || "Sehrli skritpsni o'qish..."}
                                </h2>

                                <div className="grid grid-cols-1 gap-4">
                                    {tests[currentIdx]?.options.map((option, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAnswer(i)}
                                            className="p-6 bg-white/40 border-2 border-[#8d6e63]/30 rounded-none text-left font-serif font-bold text-xl text-[#3e2723] hover:bg-white/60 hover:border-[#5d4037] transition-all"
                                        >
                                            <span className="mr-4 text-[#8d6e63] font-black">{i + 1}.</span>
                                            {option}
                                        </motion.button>
                                    ))}
                                </div>
                            </Parchment>

                            <div className="flex justify-center gap-8 mt-12 opacity-40 grayscale">
                                <Swords className="w-12 h-12" />
                                <Scroll className="w-12 h-12" />
                                <Compass className="w-12 h-12" />
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <Trophy className="w-32 h-32 mx-auto mb-8 text-[#fbc02d]" />
                            <h1 className="text-7xl font-serif font-black mb-4">SARGUZASHT YAKUNLANDI</h1>
                            <p className="text-2xl font-serif italic mb-12">Sizning natijangiz: <span className="font-bold text-4xl">{score} oltin</span></p>
                            <div className="flex gap-4 justify-center">
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="bg-[#8d6e63] text-[#f4e4bc] h-16 px-12 text-xl font-serif rounded-none border-4 border-[#5d4037]"
                                >
                                    YANA BİR BOR
                                </Button>
                                <Link to="/">
                                    <Button variant="ghost" className="h-16 px-12 text-xl font-serif text-[#f4e4bc]/60">KETISH</Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Visual embellishments */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#4e342e]/30 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#3e2723]/30 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
}
