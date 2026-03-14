import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Shield, Zap, Info } from 'lucide-react';

interface TugOfWarIntroProps {
    onStart: () => void;
    onShowRules: () => void;
}

export function TugOfWarIntro({ onStart, onShowRules }: TugOfWarIntroProps) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                <div className="flex flex-col justify-center gap-6">
                    <div className="space-y-2">
                        <motion.div
                            initial={{ x: -20 }}
                            animate={{ x: 0 }}
                            className="flex items-center gap-2 text-primary"
                        >
                            <Trophy className="w-5 h-5" />
                            <span className="text-xs font-black tracking-[0.4em] uppercase">Elite Arena V5</span>
                        </motion.div>
                        <h1 className="text-6xl md:text-8xl font-display font-black italic tracking-tighter text-white leading-tight">
                            TACTICAL <br /> <span className="text-primary">TUG OF WAR</span>
                        </h1>
                    </div>

                    <p className="text-white/50 font-mono text-sm max-w-md">
                        Mechanical tension systems initialized. Solve equations to generate pulling torque and conquer the AI team.
                        Build performance combos to trigger stage-based reinforcements.
                    </p>

                    <div className="flex gap-4">
                        <Button
                            onClick={onStart}
                            variant="premium"
                            className="h-16 px-10 rounded-2xl text-xl font-black italic tracking-widest flex-1 shadow-[0_0_30px_rgba(var(--primary),0.3)]"
                        >
                            INITIALIZE_MATCH
                        </Button>
                        <Button
                            onClick={onShowRules}
                            variant="outline"
                            className="h-16 w-16 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
                        >
                            <Info className="w-6 h-6 text-white" />
                        </Button>
                    </div>
                </div>

                <div className="relative hidden md:flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="relative z-10 glass-card bg-black/40 border-primary/30 p-8 rounded-[3rem] shadow-2xl"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard icon={<Users />} label="Solo / Team" color="primary" />
                            <StatCard icon={<Shield />} label="5 Stages" color="blue" />
                            <StatCard icon={<Zap />} label="Combo Mechanics" color="amber" />
                            <StatCard icon={<Trophy />} label="AAA Visuals" color="red" />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

function StatCard({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) {
    return (
        <div className={`p-4 rounded-2xl bg-${color}-500/10 border border-${color}-500/30 flex flex-col items-center gap-3 text-center`}>
            <div className={`text-${color}-500 w-6 h-6`}>{icon}</div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
        </div>
    );
}
