import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Activity, Medal, Star, Cpu, Network, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock Data for now - eventually fetched from API
const MOCK_LEADERBOARD = [
    { id: '1', name: 'NEO_SYNC', rank: 'Apex', score: 2540000, combo: 120 },
    { id: '2', name: 'CYBER_GHOST', rank: 'GrandMaster', score: 980500, combo: 85 },
    { id: '3', name: 'VOID_WALKER', rank: 'Master', score: 450200, combo: 64 },
    { id: '4', name: 'PROTOCOL_X', rank: 'Master', score: 320100, combo: 55 },
    { id: '5', name: 'DATA_MINER', rank: 'Expert', score: 120000, combo: 40 },
    { id: '6', name: 'ROOKIE_99', rank: 'Challenger', score: 45000, combo: 22 },
];

export default function Leaderboard() {
    const [filter, setFilter] = useState<'global' | 'friends'>('global');

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 overflow-hidden relative">
            {/* Background */}
            <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-secondary/10 rounded-full blur-[150px] opacity-30 mix-blend-screen pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-12">
                {/* Header */}
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-display font-black tracking-tighter uppercase italic mb-2">Global Hierarchy</h1>
                        <span className="text-[12px] font-black tracking-[0.5em] text-white/40 uppercase">Top Tier Operatives</span>
                    </div>
                    <Link to="/" className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Activity className="w-6 h-6 text-white" />
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Podium (Top 3) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/10 w-fit">
                            <button
                                onClick={() => setFilter('global')}
                                className={`px-6 py-2 rounded-xl text-sm font-black tracking-widest uppercase transition-all ${filter === 'global' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
                            >
                                Global
                            </button>
                            <button
                                onClick={() => setFilter('friends')}
                                className={`px-6 py-2 rounded-xl text-sm font-black tracking-widest uppercase transition-all ${filter === 'friends' ? 'bg-secondary text-black' : 'text-white/40 hover:text-white'}`}
                            >
                                Friends
                            </button>
                        </div>

                        <div className="glass-card bg-primary/5 border border-primary/20 rounded-[3rem] p-8 flex flex-col gap-8 relative overflow-hidden">
                            <Cpu className="w-64 h-64 text-primary absolute -right-10 -bottom-10 opacity-5" />

                            <div className="flex items-center gap-4">
                                <Trophy className="w-8 h-8 text-primary" />
                                <h2 className="text-2xl font-display font-black italic tracking-widest uppercase text-white">The Apex</h2>
                            </div>

                            <div className="flex flex-col gap-6">
                                {MOCK_LEADERBOARD.slice(0, 3).map((player, index) => (
                                    <div key={player.id} className="p-6 rounded-3xl bg-black/40 border border-white/10 flex flex-col gap-3 relative overflow-hidden group">
                                        {index === 0 && <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50" />}
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="flex items-center gap-4">
                                                <span className={`text-4xl font-display font-black italic tracking-tighter ${index === 0 ? 'text-primary' : index === 1 ? 'text-white/80' : 'text-orange-400'}`}>
                                                    0{index + 1}
                                                </span>
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black tracking-widest text-white uppercase">{player.name}</span>
                                                    <span className="text-[10px] font-black tracking-widest uppercase text-white/40">{player.rank}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-3 border-t border-white/10 flex justify-between relative z-10">
                                            <span className="text-xs font-mono text-white/50 tracking-widest">SCORE</span>
                                            <span className="text-sm font-display font-black text-white italic">{player.score.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Full List */}
                    <div className="lg:col-span-8 glass-card bg-[#020617]/50 border border-white/10 rounded-[3rem] p-8 lg:p-12 relative overflow-hidden">
                        <Network className="w-[500px] h-[500px] text-white absolute -top-40 -right-40 opacity-[0.02]" />

                        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                            <Shield className="w-6 h-6 text-white/40" />
                            <h3 className="text-sm font-black tracking-[0.4em] uppercase text-white/40">Full Server Roster</h3>
                        </div>

                        <div className="flex flex-col gap-4 relative z-10">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-6 text-[10px] font-black tracking-widest text-white/30 uppercase mb-2">
                                <div className="col-span-1">#</div>
                                <div className="col-span-4">Operative</div>
                                <div className="col-span-3">Tier</div>
                                <div className="col-span-2 text-right">Max Combo</div>
                                <div className="col-span-2 text-right">Net Score</div>
                            </div>

                            {/* Table Rows */}
                            {MOCK_LEADERBOARD.map((player, index) => (
                                <div key={player.id} className="grid grid-cols-12 gap-4 items-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="col-span-1 text-white/50 font-display font-black italic">{index + 1}</div>
                                    <div className="col-span-4 font-black tracking-widest text-white">{player.name}</div>
                                    <div className="col-span-3 text-xs font-black tracking-widest uppercase text-secondary">{player.rank}</div>
                                    <div className="col-span-2 text-right text-orange-400 font-display italic">x{player.combo}</div>
                                    <div className="col-span-2 text-right font-display font-black italic text-white">{player.score.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
