import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Zap, Cpu, Battery, ShieldAlert, RotateCw, Activity, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ComponentType = 'straight' | 'corner' | 'cross' | 'input' | 'output';

interface Component {
    type: ComponentType;
    rotation: number; // 0, 90, 180, 270
}

const GRID_SIZE = 5;

export default function CircuitDesignPuzzle() {
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

    const [grid, setGrid] = useState<Component[][]>([]);
    const [voltage, setVoltage] = useState(100);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "'Om qonuni' asosan nimani belgilab beradi?",
            options: ["Yorug'lik tezligi", "Kuchlanish, tok va qarshilik orasidagi munosabat", "Batareyaning kuchi", "LED ning rangi"],
            correct: 1,
            explanation: "Om qonuni (V=IR) - elektr tokining ikki nuqta orasidagi qiymatiga to'g'ri mutanosib ekanini aytadi."
        },
        {
            id: 2,
            text: "'Qisqa kontakt' da nima sodir bo'ladi?",
            options: ["Qarshilik cheksizga aylanadi", "Tok niyat bo'lmagan past qarshilik orqali oqadi", "Zanjir xavfsizroq bo'ladi", "Kuchlanish darhol nolga tushadi"],
            correct: 1,
            explanation: "Qisqa kontakt - bu elektr zanjirning ikkita nodasi orasidagi anormal ulanish bo'lib, ortiqcha tok oqishiga olib keladi."
        },
        {
            id: 3,
            text: "Elektr tokining oqishini cheklovchi komponent qaysi?",
            options: ["Kondensator", "Induktor", "Rezistor", "Tranzistor"],
            correct: 2,
            explanation: "Rezistor - elektr qarshiligini o'z ichiga olgan passiv elektr elementi bo'lib, tok oqishini kamaytiriladi."
        }
    ];

    const initializeGrid = useCallback(() => {
        const types: ComponentType[] = ['straight', 'corner', 'cross'];
        const newGrid = Array(GRID_SIZE).fill(null).map((_, y) =>
            Array(GRID_SIZE).fill(null).map((_, x) => {
                if (x === 0 && y === 0) return { type: 'input', rotation: 0 };
                if (x === GRID_SIZE - 1 && y === GRID_SIZE - 1) return { type: 'output', rotation: 0 };
                return {
                    type: types[Math.floor(Math.random() * types.length)],
                    rotation: Math.floor(Math.random() * 4) * 90
                };
            })
        );
        setGrid(newGrid);
        setVoltage(100);
    }, []);

    const rotateComponent = (x: number, y: number) => {
        if (status !== 'playing' || testActive) return;
        if (grid[y][x].type === 'input' || grid[y][x].type === 'output') return;

        const newGrid = [...grid.map(row => [...row])];
        newGrid[y][x].rotation = (newGrid[y][x].rotation + 90) % 360;
        setGrid(newGrid);
        checkConnection(newGrid);
    };

    const checkConnection = (currentGrid: Component[][]) => {
        // Simplified connection logic for gameplay feel
        // In a real implementation, this would be a pathfinding algorithm
        const isComplete = Math.random() > 0.95; // Simulating outcome for now
        if (isComplete) {
            addScore(3000);
            setCombo(combo + 1);
            toast.success("CIRCUIT_PATHLOAD_COMPLETED: Power Delivery Stable");
            if (level % 2 === 0) triggerTest(true);
            else { nextLevel(); initializeGrid(); }
        }
    };

    useEffect(() => {
        if (status === 'playing' && voltage > 0 && !testActive) {
            const timer = setInterval(() => setVoltage(prev => Math.max(0, prev - 1)), 1000);
            return () => clearInterval(timer);
        } else if (voltage === 0 && status === 'playing') {
            damage(25);
            toast.error("VOLTAGE_DROP: Circuit Collapse");
            initializeGrid();
        }
    }, [voltage, status, testActive, damage, initializeGrid]);

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            initializeGrid();
        }
    }, [status, gameStarted, initializeGrid]);

    return (
        <BaseGameLayout
            title="Circuit Design Puzzle"
            rules={[
                "Rotate components to complete the electrical pathway from INF_IN to OUT_FLOW.",
                "Voltage stability decreases over time. Complete the sync before brownout.",
                "Precision Flow: Ensure all segments align for maximum power efficiency.",
                "Expert Electrical Phase (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Power Metrics */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-6">
                                <Battery className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-black tracking-widest text-white uppercase italic">Grid_Voltage_v4.1</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Stability_Index</span>
                                        <span className={`text-xl font-display font-black ${voltage < 20 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>{voltage}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${voltage < 20 ? 'bg-red-500' : 'bg-primary'}`}
                                            animate={{ width: `${voltage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center gap-4">
                                    <Activity className="w-8 h-8 text-secondary" />
                                    <div>
                                        <div className="text-[10px] font-black tracking-widest text-secondary uppercase">Flux_Capacity</div>
                                        <div className="text-xl font-display font-black text-white italic lowercase underline underline-offset-8 decoration-white/20">Val_{score}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-4">
                            <ShieldAlert className="w-8 h-8 text-red-500" />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-red-500 uppercase">Short_Alert</div>
                                <div className="text-xl font-display font-black text-white italic lowercase underline underline-offset-8 decoration-white/20">Monitor_Active</div>
                            </div>
                        </div>
                    </div>

                    {/* Circuit Grid */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-5 gap-3 p-8 bg-[#020617] rounded-[3rem] border border-white/5 backdrop-blur-2xl relative shadow-2xl">
                            {grid.map((row, y) => row.map((comp, x) => (
                                <motion.button
                                    key={`${x}-${y}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => rotateComponent(x, y)}
                                    className={`aspect-square rounded-xl border-2 transition-all duration-300 relative group flex items-center justify-center overflow-hidden ${comp.type === 'input' ? 'bg-primary/20 border-primary' :
                                            comp.type === 'output' ? 'bg-secondary/20 border-secondary' :
                                                'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <motion.div
                                        animate={{ rotate: comp.rotation }}
                                        className="relative flex items-center justify-center"
                                    >
                                        {comp.type === 'straight' && <div className="w-12 h-2 bg-white/20 rounded-full" />}
                                        {comp.type === 'corner' && (
                                            <div className="w-8 h-8 border-b-8 border-r-8 border-white/20 rounded-br-2xl translate-x-1 translate-y-1" />
                                        )}
                                        {comp.type === 'cross' && (
                                            <div className="relative">
                                                <div className="w-12 h-2 bg-white/20 rounded-full" />
                                                <div className="w-2 h-12 bg-white/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            </div>
                                        )}
                                        {comp.type === 'input' && <Zap className="w-8 h-8 text-primary fill-primary/20" />}
                                        {comp.type === 'output' && <Battery className="w-8 h-8 text-secondary fill-secondary/20" />}
                                    </motion.div>

                                    <RotateCw className="absolute top-1.5 right-1.5 w-3 h-3 text-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.button>
                            )))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex items-center gap-10">
                    <div className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">Grid_Tier_{level}</span>
                    </div>
                    <div className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <Cpu className="w-4 h-4 text-secondary" />
                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">Multi_X{combo}</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="circuit-design"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            initializeGrid();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
