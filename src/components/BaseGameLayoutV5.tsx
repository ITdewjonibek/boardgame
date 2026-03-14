import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Network, Activity, Trophy, Shield, Users, Radio } from 'lucide-react';
import { useMultiplayerSync } from '@/lib/multiplayer-sync';
import { useScoreManager } from '@/lib/score-manager';
import { Link } from 'react-router-dom';

interface BaseGameLayoutV5Props {
    title: string;
    stage: number;
    maxStages: number;
    children: ReactNode;
    mechanics: string[];
}

export default function BaseGameLayoutV5({ title, stage, maxStages, children, mechanics }: BaseGameLayoutV5Props) {
    const { status: mpStatus, room, role } = useMultiplayerSync();
    const { globalScore, sessionCombo, rank } = useScoreManager();

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans overflow-hidden selection:bg-primary/30">
            {/* V5 Animated Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[150px] mix-blend-screen animate-blob" />
                <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            {/* Top Navigation HUD */}
            <header className="relative z-10 p-6 border-b border-white/5 bg-black/20 backdrop-blur-xl">
                <div className="max-w-[1920px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <Activity className="w-5 h-5 text-primary" />
                        </Link>

                        <div className="flex flex-col">
                            <h1 className="text-2xl font-display font-black tracking-widest uppercase italic">{title}</h1>
                            <div className="flex gap-4 items-center">
                                <span className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Phase_{stage}/{maxStages}</span>
                                <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stage / maxStages) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        {/* Multiplayer Status */}
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                            {mpStatus === 'connected' ? (
                                <>
                                    <div className="relative">
                                        <Radio className="w-5 h-5 text-emerald-500 animate-pulse" />
                                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[8px] font-black tracking-widest text-emerald-500/50 uppercase">Network Sync</span>
                                        <span className="text-sm font-display font-black tracking-widest text-white">{room.roomId || 'SOLO_NET'}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Radio className="w-5 h-5 text-white/20" />
                                    <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Offline</span>
                                </>
                            )}
                        </div>

                        {/* Score & Rank */}
                        <div className="flex items-center gap-4 text-right">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black tracking-[0.3em] text-secondary uppercase border-b border-secondary/20 pb-1 mb-1">{rank}</span>
                                <span className="text-3xl font-display font-black italic tracking-tighter">
                                    {globalScore.toLocaleString()}
                                </span>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-secondary/10 border-2 border-secondary/30 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-secondary" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mechanics Sidebar & Main Content */}
            <main className="flex-1 relative z-10 flex p-6 gap-6 max-w-[1920px] mx-auto w-full">

                {/* Left Sidebar: Mechanics & Team Info */}
                <aside className="w-80 flex flex-col gap-6 hidden xl:flex">
                    <div className="glass-card p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <Shield className="w-5 h-5 text-primary" />
                            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/60">Stage Mechanics</h3>
                        </div>
                        <ul className="space-y-4">
                            {mechanics.map((mech, i) => (
                                <li key={i} className="flex gap-3 text-sm text-white/70 font-sans">
                                    <span className="text-primary font-black mt-0.5">›</span>
                                    {mech}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass-card p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex-1">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <Users className="w-5 h-5 text-secondary" />
                            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/60">Active Session</h3>
                        </div>
                        {/* Session Data / Combo Meter */}
                        <div className="space-y-6">
                            <div>
                                <div className="text-[9px] font-black tracking-widest text-white/40 uppercase mb-2">Combo Chain</div>
                                <div className="text-5xl font-display font-black text-amber-500 italic tracking-tighter shadow-amber-500/20 drop-shadow-lg">
                                    X{sessionCombo}
                                </div>
                            </div>

                            {mpStatus === 'connected' && room.roomId && (
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="text-[9px] font-black tracking-widest text-white/40 uppercase mb-3">Linked Operatives</div>
                                    <div className="flex flex-col gap-2">
                                        {Object.values(room.players).map(p => (
                                            <div key={p.id} className="flex justify-between items-center text-xs font-black">
                                                <span className={`${p.id === role ? 'text-primary' : 'text-white'}`}>{p.username.substring(0, 8)}</span>
                                                <span className="text-white/30">{p.team}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Game Area */}
                <section className="flex-1 rounded-[3rem] border border-white/5 bg-black/40 backdrop-blur-2xl relative overflow-hidden shadow-2xl flex flex-col">
                    {children}
                </section>

            </main>
        </div>
    );
}
