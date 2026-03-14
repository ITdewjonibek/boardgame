import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMegaStore } from "@/lib/mega-store";
import {
    Trophy,
    Heart,
    Zap,
    Shield,
    Target,
    Clock,
    Settings,
    Pause,
    Play,
    ArrowLeft,
    Users,
    User,
    Info
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface BaseGameLayoutProps {
    children: React.ReactNode;
    title: string;
    rules: string[];
}

export default function BaseGameLayout({ children, title, rules }: BaseGameLayoutProps) {
    const {
        status,
        score,
        level,
        health,
        combo,
        mode,
        difficulty,
        setStatus,
        setMode,
        setDifficulty,
        resetGame
    } = useMegaStore();

    const handleStart = () => {
        resetGame();
        setStatus('playing');
    };

    return (
        <div className="min-h-screen bg-[#02040a] text-white selection:bg-primary/30 font-sans overflow-hidden mesh-bg relative">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Top HUD */}
            <header className="fixed top-0 left-0 w-full z-50 px-8 py-4 backdrop-blur-md bg-black/40 border-b border-white/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-white/40 hover:text-white transition-colors group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div className="h-6 w-px bg-white/10" />
                        <h1 className="text-2xl font-display font-black tracking-tighter italic uppercase">
                            {title} <span className="text-[10px] not-italic opacity-30 tracking-widest ml-2">LVL {level}</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-12">
                        {/* Score */}
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">SCORE</span>
                            <span className="text-2xl font-display font-black text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]">
                                {score.toLocaleString()}
                            </span>
                        </div>

                        {/* Combo */}
                        {combo > 1 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex flex-col items-end"
                            >
                                <span className="text-[10px] font-black tracking-[0.2em] text-secondary uppercase animate-pulse">COMBO</span>
                                <span className="text-2xl font-display font-black text-secondary drop-shadow-[0_0_10px_rgba(var(--secondary),0.5)]">
                                    x{combo}
                                </span>
                            </motion.div>
                        )}

                        {/* Health Bar */}
                        <div className="w-48 space-y-2">
                            <div className="flex justify-between text-[10px] font-black tracking-widest text-white/30">
                                <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500" /> HP</span>
                                <span>{health}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-red-600 to-red-400"
                                    initial={{ width: '100%' }}
                                    animate={{ width: `${health}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Game Area */}
            <main className="pt-32 pb-12 px-8 min-h-screen flex items-center justify-center relative z-10">
                <AnimatePresence mode="wait">
                    {status === 'idle' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="glass-card max-w-2xl w-full p-12 border-white/5 bg-white/[0.02]"
                        >
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black px-8 py-1.5 font-display font-black italic text-sm skew-x-[-12deg] shadow-xl">
                                SYSTEM INITIALIZATION
                            </div>

                            <div className="space-y-10">
                                <div className="text-center space-y-4">
                                    <h2 className="text-5xl font-display font-black leading-none">{title}</h2>
                                    <p className="text-white/40 font-mono text-xs tracking-widest uppercase">Select Mode & Prepare for Challenge</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <button
                                        onClick={() => setMode('single')}
                                        className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 group ${mode === 'single' ? 'bg-primary/10 border-primary shadow-[0_0_30px_rgba(var(--primary),0.2)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                    >
                                        <User className={`w-8 h-8 ${mode === 'single' ? 'text-primary' : 'text-white/20'}`} />
                                        <span className="text-sm font-black tracking-widest uppercase">Single Player</span>
                                    </button>
                                    <button
                                        onClick={() => setMode('team')}
                                        className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 group ${mode === 'team' ? 'bg-secondary/10 border-secondary shadow-[0_0_30px_rgba(var(--secondary),0.2)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                    >
                                        <Users className={`w-8 h-8 ${mode === 'team' ? 'text-secondary' : 'text-white/20'}`} />
                                        <span className="text-sm font-black tracking-widest uppercase">Team Mode</span>
                                    </button>
                                </div>

                                <div className="space-y-4 px-6 py-8 rounded-2xl bg-white/5 border border-white/5">
                                    <h3 className="text-xs font-black tracking-[0.3em] text-white/30 uppercase flex items-center gap-2">
                                        <Info className="w-4 h-4" /> Challenge Logic
                                    </h3>
                                    <ul className="grid grid-cols-1 gap-3">
                                        {rules.map((rule, i) => (
                                            <li key={i} className="text-sm font-medium text-white/60 flex items-start gap-3">
                                                <span className="text-primary font-mono select-none">0{i + 1}:</span>
                                                {rule}
                                            </li>
                                        ))}
                                        <li className="text-sm font-black text-red-400 flex items-start gap-3 uppercase">
                                            <Zap className="w-4 h-4 fill-current" /> Extreme Hard Difficulty Active
                                        </li>
                                    </ul>
                                </div>

                                <Button
                                    onClick={handleStart}
                                    variant="premium"
                                    className="w-full h-16 text-xl font-black italic rounded-2xl border-b-4 border-primary/50"
                                >
                                    LOAD_GAME_CORE
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {status === 'playing' && (
                        <motion.div
                            key="playing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-7xl mx-auto h-[70vh] flex flex-col"
                        >
                            {children}
                        </motion.div>
                    )}

                    {status === 'failure' && (
                        <motion.div
                            key="gameover"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card max-w-md w-full p-12 text-center border-red-500/20 bg-red-500/[0.02]"
                        >
                            <h2 className="text-6xl font-display font-black text-red-500 mb-6 italic tracking-tighter">CRITICAL_FAIL</h2>
                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between p-4 bg-white/5 rounded-xl border border-white/5 font-mono">
                                    <span className="text-white/40">FINAL_SCORE</span>
                                    <span className="text-xl font-bold">{score}</span>
                                </div>
                            </div>
                            <Button
                                onClick={handleStart}
                                className="w-full h-14 rounded-xl bg-red-500 text-black font-black uppercase tracking-widest"
                            >
                                SYSTEM_REBOOT
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Floating Indicators */}
            <div className="fixed bottom-8 left-8 flex items-center gap-4 z-50">
                <div className="px-4 py-2 rounded-lg bg-black/60 border border-white/5 backdrop-blur-md flex items-center gap-3">
                    <Settings className="w-4 h-4 text-white/30" />
                    <span className="text-[10px] font-black text-white/40 tracking-widest uppercase italic">
                        {difficulty} MODE // SECURE_SYNC_V4
                    </span>
                </div>
            </div>
        </div>
    );
}
