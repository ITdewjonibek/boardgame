import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Plus, ShieldAlert, Cpu, CheckCircle2, XCircle, Search, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const GAMES = [
    // BARABAN Game
    { id: 'baraban', name: '🎡 BARABAN (Wheel Spinner)' },
    
    // V5 Next-Gen Games (AssessmentCore mapping)
    { id: 'tugofwar-v5-physics', name: 'Arqon tortish (Physics v5)' },
    { id: 'speedquiz-v5', name: 'Viktorina (SpeedQuiz v5)' },
    { id: 'aimind-v5', name: 'Millioner (AI Mind v5)' },
    { id: 'memory-v5', name: 'Xotira (Interference v5)' },
    { id: 'math-v5', name: 'Tezkor hisob (Math v5)' },
    { id: 'cipher-v5', name: 'So\'z topish (Cipher v5)' },
    { id: 'quantum-logic', name: '1v1 Jang (Duel v5)' },
    { id: 'chain-v5', name: 'Savol zanjiri (Chain v5)' },
    { id: 'logic-master', name: 'Logic Master' },
    { id: 'battle-wits', name: 'Battle of Wits' },
    { id: 'molecular-lab', name: 'Molecular Lab' },

    // Legacy Games (fetchGameTests mapping string)
    { id: 'word_search', name: 'So\'z qidiruv' },
    { id: 'country', name: 'Davlatni top' },
    { id: 'champion', name: 'Chempion o\'quvchi' },
    { id: 'speed_round', name: 'Vaqt boshi' },
    { id: 'crossword', name: 'Krossvord' },
    { id: 'biggest', name: 'Kattasini top' },
    { id: 'cosmic-quiz', name: 'Cosmic Quiz' },
    { id: 'verbal-quest', name: 'Verbal Quest' },
];

export default function TestManager() {
    const [selectedGame, setSelectedGame] = useState(GAMES[0].id);
    const [customTests, setCustomTests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        prompt: "",
        options: ["", "", "", ""],
        correct_index: 0,
        explanation: "To'g'ri javob",
        difficulty: "medium"
    });

    // Fetch tests for selected game
    useEffect(() => {
        const fetchTests = async () => {
            setIsLoading(true);
            try {
                const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
                const token = localStorage.getItem("token");
                const headers: HeadersInit = { "Content-Type": "application/json" };
                if (token) headers["Authorization"] = `Bearer ${token}`;

                const res = await fetch(`${apiUrl}/api/game-tests/merged/${selectedGame}`, { headers });
                if (res.ok) {
                    const data = await res.json();
                    setCustomTests(data);
                } else if (res.status === 404) {
                    // Game tests not available for this game
                    setCustomTests([]);
                    console.warn(`No tests found for game: ${selectedGame}`);
                }
            } catch (error) {
                console.error("Failed to fetch custom tests", error);
                setCustomTests([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTests();
    }, [selectedGame]);

    const handleOptionChange = (idx: number, val: string) => {
        setNewQuestion(prev => {
            const nextOpts = [...prev.options];
            nextOpts[idx] = val;
            return { ...prev, options: nextOpts };
        });
    };

    const handleAddTest = async () => {
        if (!newQuestion.prompt) {
            toast.error("Savol matnini kiriting!");
            return;
        }
        if (newQuestion.options.some(o => !o)) {
            toast.error("Barcha variantlarni to'ldiring!");
            return;
        }

        setIsSaving(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
            const token = localStorage.getItem("token");
            const headers: HeadersInit = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            // Wrap single question in the expected Set format
            const payload = {
                game_key: selectedGame,
                title: `Custom Addition ${new Date().toLocaleDateString()}`,
                questions: [{
                    ...newQuestion,
                    options: newQuestion.options.map(opt => ({ text: opt }))
                }]
            };

            const res = await fetch(`${apiUrl}/api/game-tests/sets`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const result = await res.json();
                console.log("Success:", result);
                toast.success("O'zgartirishlar muvaffaqiyatli saqlandi!");
                setIsAdding(false);
                setNewQuestion({
                    prompt: "",
                    options: ["", "", "", ""],
                    correct_index: 0,
                    explanation: "To'g'ri javob",
                    difficulty: "medium"
                });
                // Refetch
                const refetch = await fetch(`${apiUrl}/api/game-tests/merged/${selectedGame}`, { headers });
                const data = await refetch.json();
                setCustomTests(data);
            } else {
                const errorData = await res.json().catch(() => ({ detail: "Unknown error" }));
                console.error("Server Error:", res.status, errorData);
                
                if (res.status === 404) {
                    toast.error(`Bu o'yin uchun test qo'shish funktsiyasi hali tayyomash`);
                } else {
                    toast.error(`Xatolik yuz berdi: ${errorData.detail || res.statusText}`);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Server bilan aloqa yo'q");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 flex gap-8">

            {/* Sidebar List */}
            <div className="w-80 flex-shrink-0 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-4">
                    <Database className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold tracking-widest uppercase">Database Systems</h2>
                </div>

                <div className="flex flex-col gap-2 overflow-y-auto max-h-[80vh] pr-4">
                    {GAMES.map(game => (
                        <button
                            key={game.id}
                            onClick={() => setSelectedGame(game.id)}
                            className={`p-4 text-left rounded-2xl border transition-all duration-300 ${selectedGame === game.id
                                ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <span className="text-sm font-semibold">{game.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col gap-8">

                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-2">
                            Assessment Manager
                        </h1>
                        <p className="text-white/50 text-sm">
                            Configure appended database tests for {GAMES.find(g => g.id === selectedGame)?.name}
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-primary hover:bg-primary/80 text-black font-bold flex items-center gap-2"
                    >
                        {isAdding ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {isAdding ? "Cancel" : "Append New Test"}
                    </Button>
                </div>

                <AnimatePresence mode="wait">
                    {isAdding ? (
                        <motion.div
                            key="add-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-8 rounded-3xl glass-card bg-black/60 border border-primary/30 shadow-[0_0_30px_rgba(var(--primary),0.1)] flex flex-col gap-6"
                        >
                            <h3 className="text-xl font-bold text-primary flex items-center gap-3">
                                <Cpu className="w-5 h-5" />
                                Inject Custom Data Node
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs uppercase font-bold text-white/50 tracking-widest pl-2 mb-2 block">Savol Matni</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors min-h-[100px] relative z-10"
                                        placeholder="Savol matnini kiriting..."
                                        value={newQuestion.prompt}
                                        onChange={e => setNewQuestion({ ...newQuestion, prompt: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {newQuestion.options.map((opt, idx) => (
                                        <div key={idx} className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-mono">[{String.fromCharCode(65 + idx)}]</div>
                                            <input
                                                className={`w-full bg-white/5 border rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none transition-colors relative z-10 ${newQuestion.correct_index === idx ? 'border-emerald-500 shadow-[0_0_20px_#10b98140]' : 'border-white/10 focus:border-white/30'}`}
                                                placeholder={`Variant ${idx + 1}`}
                                                value={opt}
                                                onChange={e => handleOptionChange(idx, e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setNewQuestion({ ...newQuestion, correct_index: idx });
                                                }}
                                                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all z-20 cursor-pointer ${newQuestion.correct_index === idx ? 'bg-emerald-500 text-black scale-110' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
                                                title="To'g'ri javob sifatida belgilash"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-xs uppercase font-bold text-white/50 tracking-widest pl-2 mb-2 block">To'g'ri javob izohi</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors"
                                            placeholder="Nega bu javob to'g'ri?"
                                            value={newQuestion.explanation}
                                            onChange={e => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase font-bold text-white/50 tracking-widest pl-2 mb-2 block">Dars Qiyinchiligi</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                                            value={newQuestion.difficulty}
                                            onChange={e => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                                        >
                                            <option value="easy">Oson (1x ball)</option>
                                            <option value="medium">O'rtacha (2x ball)</option>
                                            <option value="hard">Qiyin (3x ball)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleAddTest}
                                disabled={isSaving}
                                className="w-full py-6 mt-4 font-bold text-lg tracking-widest relative"
                            >
                                {isSaving ? (
                                    <span className="flex items-center gap-2">
                                        <Cpu className="w-5 h-5 animate-spin" />
                                        SAQLANMOQDA...
                                    </span>
                                ) : (
                                    "TESTNI SUBMIT QILISH VA SAQLASH"
                                )}
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col gap-6"
                        >
                            {/* System Defaults Notice */}
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">System Default Tests</h4>
                                    <p className="text-white/50 text-sm mt-1">This game contains hardcoded default tests that ensure core educational value is always present during network interruptions. The tests listed below are <strong className="text-primary text-xs uppercase tracking-widest">APPENDED</strong> after the defaults during gameplay.</p>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Database className="w-8 h-8 text-primary animate-pulse" />
                                </div>
                            ) : customTests.length === 0 ? (
                                <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 text-white/30">
                                    No custom database tests appended yet. Click "Append New Test" above.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h3 className="font-bold uppercase tracking-widest text-primary text-xs mb-4">Appended Database Tests ({customTests.length})</h3>
                                    {customTests.map((test, index) => (
                                        <div key={test.id} className="p-6 rounded-2xl glass-card bg-black/40 border-l-4 border-l-secondary border-y-white/5 border-r-white/5 hover:bg-white/5 transition-colors group">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-4">
                                                    <span className="text-secondary/50 font-bold font-mono">{(index + 1).toString().padStart(2, '0')}</span>
                                                    <div>
                                                        <p className="font-bold text-lg">{test.prompt}</p>
                                                        <div className="flex gap-4 mt-2">
                                                            {test.options.map((opt: any, i: number) => (
                                                                <span key={i} className={`text-xs px-2 py-1 rounded-md ${i === test.correct_index ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'}`}>
                                                                    {opt.text}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <p className="text-xs text-secondary/60 mt-4 italic">Analysis: {test.explanation}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white/50"><Edit2 className="w-4 h-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="hover:bg-red-500/20 text-red-500/50 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}
