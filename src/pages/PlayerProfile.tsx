import React from 'react';
import { motion } from 'framer-motion';
import { useScoreManager } from '@/lib/score-manager';
import { Trophy, Activity, Target, Shield, Zap, Medal, Flame, Star, Hexagon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlayerProfile() {
    const { globalScore, highestSessionCombo, rank, experienceXP, nextRankXP } = useScoreManager();
    const progressToNextRank = (experienceXP / nextRankXP) * 100;

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 overflow-hidden relative">
            {/* Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-primary/10 rounded-full blur-[150px] opacity-50 mix-blend-screen pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-12">
                {/* Header */}
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-display font-black tracking-tighter uppercase italic mb-2">Operative Profile</h1>
                        <span className="text-[12px] font-black tracking-[0.5em] text-white/40 uppercase">Classified Personnel Data</span>
                    </div>
                    <Link to="/" className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Activity className="w-6 h-6 text-primary" />
                    </Link>
                </header>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Rank Card */}
                    <div className="lg:col-span-8 glass-card bg-black/40 border border-white/10 backdrop-blur-2xl rounded-[3rem] p-12 flex items-center justify-between relative overflow-hidden shadow-2xl">
                        <div className="absolute right-0 top-0 p-12 opacity-5 pointer-events-none">
                            <Shield className="w-96 h-96 text-primary" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <h2 className="text-[14px] font-black tracking-widest text-primary uppercase mb-2">Current Tier</h2>
                                <div className="text-7xl font-display font-black text-white italic tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(var(--primary),0.3)]">
                                    {rank}
                                </div>
                            </div>

                            <div className="space-y-3 w-96">
                                <div className="flex justify-between text-sm font-black tracking-widest uppercase">
                                    <span className="text-white/60">XP Sync</span>
                                    <span className="text-primary">{experienceXP.toLocaleString()} / {nextRankXP === Infinity ? 'MAX' : nextRankXP.toLocaleString()}</span>
                                </div>
                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                                    <motion.div
                                        className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.6)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, progressToNextRank)}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-48 h-48 rounded-[3rem] bg-gradient-to-br from-primary/20 to-transparent border-4 border-primary/30 flex items-center justify-center relative z-10 rotate-12 group hover:rotate-0 transition-all duration-500">
                            <Hexagon className="w-24 h-24 text-primary absolute mix-blend-overlay" />
                            <Trophy className="w-20 h-20 text-white fill-white/10" />
                        </div>
                    </div>

                    {/* Secondary Stats */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <div className="glass-card flex-1 bg-white/5 border border-white/10 rounded-[3rem] p-8 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute right-[-10%] top-[-10%] opacity-10">
                                <Target className="w-48 h-48 text-secondary" />
                            </div>
                            <span className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-2">Global Score</span>
                            <span className="text-6xl font-display font-black text-white italic tracking-tighter">{globalScore.toLocaleString()}</span>
                        </div>
                        <div className="glass-card flex-1 bg-orange-500/5 border border-orange-500/20 rounded-[3rem] p-8 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute right-[-10%] bottom-[-10%] opacity-10">
                                <Flame className="w-48 h-48 text-orange-500" />
                            </div>
                            <span className="text-[10px] font-black tracking-widest text-orange-400/60 uppercase mb-2">Max Session Combo</span>
                            <span className="text-6xl font-display font-black text-orange-400 italic tracking-tighter">X{highestSessionCombo}</span>
                        </div>
                    </div>
                </div>

                {/* Achievements Section */}
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <Medal className="w-6 h-6 text-white" />
                        <h3 className="text-3xl font-display font-black text-white italic tracking-widest uppercase">Combat Honors</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "First Blood", desc: "Complete 1st game", icon: <Target />, earned: true },
                            { name: "Combo Master", desc: "Reach 50x Combo", icon: <Flame />, earned: highestSessionCombo >= 50 },
                            { name: "Architect", desc: "Build Custom Test", icon: <Zap />, earned: false },
                            { name: "Grand Master", desc: "Clear Boss Phase", icon: <Star />, earned: rank === 'GrandMaster' || rank === 'Apex' }
                        ].map((ach, i) => (
                            <div key={i} className={`p-8 rounded-[2.5rem] border ${ach.earned ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/10'} flex flex-col items-center text-center gap-4 transition-all hover:scale-105`}>
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${ach.earned ? 'bg-primary/20 text-primary' : 'bg-black/50 text-white/20'}`}>
                                    {ach.icon}
                                </div>
                                <div>
                                    <h4 className={`text-sm font-black tracking-widest uppercase ${ach.earned ? 'text-white' : 'text-white/40'}`}>{ach.name}</h4>
                                    <p className="text-[10px] font-black tracking-widest uppercase text-white/30 mt-2">{ach.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
