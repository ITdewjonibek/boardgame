import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Brain, Zap, Activity, ShieldAlert, Cpu, Share2, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AIEvolutionSimulator() {
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

    const [traits, setTraits] = useState({ intelligence: 30, efficiency: 30, resilience: 30 });
    const [pressure, setPressure] = useState({ type: 'Compute Scarcity', intensity: 50 });
    const [survivalChance, setSurvivalChance] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "AI da 'Genetik Algoritm' nima?",
            options: ["Biologik DNKni tuzatish usuli", "Tabiy evolyutsiyadan ilhomlanib yaratilgan qidiruv usuli", "SQL so'rovining bir turi", "Apparatning turi"],
            correct: 1,
            explanation: "Genetik algoritmlar tabiy tanlov jarayonidan ilhomlanib yaratilgan qidiruv va optimizatsiya usullari bo'lib, kesishish, mutatsiya va tanlov mehanizmlarini o'z ichiga oladi."
        },
        {
            id: 2,
            text: "'Fitness Funksiyasi' nimani o'lchasadi?",
            options: ["Kompyuterning tezligi", "Yechim muammoni qanchalik yaxshi hal etishini", "Ishlatilgan xotira hajmi", "Dasturchi jismoniy sog'lig'ini"],
            correct: 1,
            explanation: "Genetik algoritmlarda fitness funksiyasi qancha yaxshi yechim maqsadlarga erishligi hisoblanadi."
        },
        {
            id: 3,
            text: "Evolyutsiya simulyatsiyasida 'Mutatsiya'ning roli nima?",
            options: ["Yomon ma'lumotlarni o'chirish", "Genetik xilmaxilligi saqlash va maksimum darajasida qolish", "Tarmoqning tezligini oshirish", "Natijalarni shifrlash"],
            correct: 1,
            explanation: "Mutatsiya individning genetik tuzilmasiga tasodifiy o'zgartirishlar kiritadi, algoritm qidiruv fazosini yangi sohalarini o'rganish uchun."
        }
    ];

    const initializeEnvironment = useCallback(() => {
        const pressures = ['Compute Scarcity', 'Data Noise', 'Algorithmic Complexity', 'Adversarial Attack'];
        setPressure({
            type: pressures[Math.floor(Math.random() * pressures.length)],
            intensity: 40 + level * 5
        });
        setTraits({ intelligence: 33, efficiency: 33, resilience: 34 });
    }, [level]);

    const updateTrait = (trait: keyof typeof traits, delta: number) => {
        if (status !== 'playing' || testActive) return;

        setTraits(prev => {
            const newVal = Math.max(0, Math.min(100, prev[trait] + delta));
            const total = Object.values({ ...prev, [trait]: newVal }).reduce((a, b) => a + b, 0);

            // Normalize if total exceeds 100
            if (total > 100) {
                toast.warning("EVOLUTION_LIMIT: Energy budget exceeded");
                return prev;
            }
            return { ...prev, [trait]: newVal };
        });
    };

    const runSimulation = () => {
        if (status !== 'playing' || testActive) return;

        // Survival logic based on pressure type
        let score = 0;
        if (pressure.type === 'Compute Scarcity') score = (traits.efficiency * 1.5 + traits.intelligence * 0.5);
        if (pressure.type === 'Data Noise') score = (traits.intelligence * 1.5 + traits.resilience * 0.5);
        if (pressure.type === 'Algorithmic Complexity') score = (traits.intelligence * 1.2 + traits.efficiency * 0.8);
        if (pressure.type === 'Adversarial Attack') score = (traits.resilience * 1.5 + traits.intelligence * 0.5);

        setSurvivalChance(score);

        if (score >= pressure.intensity) {
            addScore(5000 * (combo + 1));
            setCombo(combo + 1);
            toast.success("ADAPTATION_SUCCESSCORE: AI Entity Survived");
            if (level % 2 === 0) triggerTest(true);
            else { nextLevel(); initializeEnvironment(); }
        } else {
            damage(25);
            setCombo(0);
            toast.error("EXTINCTION_EVENT: Fitness Threshold Not Met");
        }
    };

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            initializeEnvironment();
        }
    }, [status, gameStarted, initializeEnvironment]);

    return (
        <BaseGameLayout
            title="AI Evolution Simulator"
            rules={[
                "Synthesize evolution traits to survive specific ENVIRONMENTAL PRESSURES.",
                "Resource Constraint: Your total adaptation energy is limited to 100 units.",
                "Fitness Threshold: Survival depends on the synergistic alignment of traits.",
                "Expert Machine-Learning Phase (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Biological/AI HUD */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-6">
                                <Activity className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-black tracking-widest text-white uppercase italic">Fitness_Monitor_v5</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 relative group overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <Wind className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-2">Current_Pressure</div>
                                    <div className="text-xl font-display font-black text-white italic tracking-tighter uppercase">{pressure.type}</div>
                                    <div className="mt-4 flex justify-between text-[10px] font-black text-red-500 uppercase italic">
                                        <span>Threshold_Req</span>
                                        <span>{pressure.intensity}u</span>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-secondary/10 border border-secondary/30 text-center">
                                    <div className="text-[10px] font-black text-secondary uppercase mb-1">Energy_Allocation</div>
                                    <div className="text-4xl font-display font-black text-white italic tracking-tighter">
                                        {Object.values(traits).reduce((a, b) => a + b, 0)}/100
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-primary/10 border border-primary/30 flex items-center gap-4">
                            <ShieldAlert className="w-8 h-8 text-primary" />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-primary uppercase">Elite Score</div>
                                <div className="text-xl font-display font-black text-white italic lowercase underline underline-offset-8 decoration-white/30 underline-offset-8">VAL_{score}</div>
                            </div>
                        </div>
                    </div>

                    {/* Evolution Lab Interface */}
                    <div className="lg:col-span-8">
                        <div className="glass-card p-12 bg-[#020617] border-white/5 relative overflow-hidden group shadow-2xl rounded-[3rem]">
                            <div className="absolute inset-0 opacity-5 pointer-events-none">
                                <Share2 className="w-full h-full text-secondary" />
                            </div>

                            <div className="space-y-12 relative z-10">
                                <div className="text-center">
                                    <span className="inline-block px-8 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-[10px] font-black text-secondary tracking-[0.5em] uppercase mb-4">
                                        Trait_Splicing_Matrix
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {(['intelligence', 'efficiency', 'resilience'] as const).map((trait) => (
                                        <div key={trait} className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 rounded-2xl bg-white/5 border-2 border-white/10 flex items-center justify-center relative group-hover:border-primary/40 transition-colors">
                                                {trait === 'intelligence' && <Brain className="w-10 h-10 text-white group-hover:text-primary" />}
                                                {trait === 'efficiency' && <Cpu className="w-10 h-10 text-white group-hover:text-secondary" />}
                                                {trait === 'resilience' && <Zap className="w-10 h-10 text-white group-hover:text-orange-500" />}
                                            </div>

                                            <span className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">{trait}</span>

                                            <div className="bg-white/5 rounded-xl flex items-center border border-white/10 overflow-hidden">
                                                <button onClick={() => updateTrait(trait, -5)} className="px-3 py-1 hover:bg-white/10 text-xl font-black transition-colors">-</button>
                                                <span className="px-4 py-1 text-sm font-display font-black border-x border-white/10 min-w-16 text-center">{traits[trait]}</span>
                                                <button onClick={() => updateTrait(trait, 5)} className="px-3 py-1 hover:bg-white/10 text-xl font-black transition-colors">+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-12 border-t border-white/5">
                                    <Button
                                        onClick={runSimulation}
                                        variant="premium"
                                        className="w-full h-24 rounded-[3rem] border-b-8 border-secondary/50 text-3xl font-black italic tracking-widest flex items-center justify-center gap-4 bg-gradient-to-br from-secondary/10 to-transparent"
                                    >
                                        <Database className="w-8 h-8 fill-secondary" />
                                        RUN_SURVIVAL_SIM
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex items-center gap-12">
                    <Share2 className="w-10 h-10 text-primary animate-spin-slow" />
                    <div className="h-10 w-px bg-white/10" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">Neural Adaptation Tier</span>
                        <span className="text-2xl font-display font-black tracking-widest text-white italic underline underline-offset-8 decoration-secondary/40">EVOLUTION_X_{level}</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="ai-evolution"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            initializeEnvironment();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
