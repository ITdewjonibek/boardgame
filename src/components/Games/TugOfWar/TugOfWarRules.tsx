import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, CheckCircle2, Zap, Activity, Sword } from 'lucide-react';

interface TugOfWarRulesProps {
    onClose: () => void;
}

export function TugOfWarRules({ onClose }: TugOfWarRulesProps) {
    const rules = [
        {
            icon: <Zap className="text-amber-500" />,
            title: "Torque Generation",
            desc: "Solve math equations rapidly. Every correct answer generates pulling force."
        },
        {
            icon: <Activity className="text-blue-500" />,
            title: "Stamina Management",
            desc: "Pulling drains stamina. Use correct Stage Test answers to regenerate it."
        },
        {
            icon: <Sword className="text-red-500" />,
            title: "Stage Battles",
            desc: "Reach Stage 3 and 5 to face AI Captains with massive pulling torque."
        },
        {
            icon: <CheckCircle2 className="text-emerald-500" />,
            title: "Tactical Tests",
            desc: "Internal challenges appear during matches. Success upgrades your stats."
        }
    ];

    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card bg-black/60 border-primary/30 p-8 md:p-12 rounded-[3.5rem] w-full max-w-2xl relative overflow-hidden"
            >
                <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
                    <X className="w-8 h-8" />
                </button>

                <div className="space-y-12">
                    <div className="text-center">
                        <h2 className="text-4xl font-display font-black italic tracking-tighter text-white uppercase">Combat Protocol</h2>
                        <p className="text-primary font-mono text-[10px] tracking-[0.5em] mt-2">TECHNICAL_SPECIFICATIONS_V5.0</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {rules.map((rule, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-4"
                            >
                                <div className="p-3 h-fit rounded-xl bg-white/5 border border-white/10">
                                    {rule.icon}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-wider">{rule.title}</h3>
                                    <p className="text-white/40 text-xs leading-relaxed">{rule.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <Button
                        onClick={onClose}
                        variant="premium"
                        className="w-full h-16 rounded-2xl text-lg font-black italic tracking-widest shadow-[0_0_30px_rgba(var(--primary),0.2)]"
                    >
                        ACKNOWLEDGE_MISSION
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
