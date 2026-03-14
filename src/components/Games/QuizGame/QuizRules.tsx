import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Cpu, Zap, Activity, BrainCircuit } from 'lucide-react';

interface QuizRulesProps {
    onClose: () => void;
}

export function QuizRules({ onClose }: QuizRulesProps) {
    const protocols = [
        {
            icon: <Zap className="text-amber-500" />,
            title: "Adrenaline Feed",
            desc: "The adrenaline timer drains constantly. Fast correct answers partially replenish the core."
        },
        {
            icon: <Cpu className="text-blue-500" />,
            title: "Cognitive Load",
            desc: "Navigate through logic, math, and memory streams. Difficulty doubles every 2 sectors."
        },
        {
            icon: <BrainCircuit className="text-primary" />,
            title: "Logic Inversion",
            desc: "Elite Sentinels (Bosses) will invert your inputs. Pick the wrong answer when [INVERTED] is active."
        },
        {
            icon: <Activity className="text-emerald-500" />,
            title: "Neural Synergy",
            desc: "Maintain streaks to build your combo multiplier. High combos double your torque efficiency."
        }
    ];

    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card bg-black/40 border-primary/30 p-10 md:p-14 rounded-[3.5rem] w-full max-w-3xl relative overflow-hidden shadow-2xl"
            >
                <button onClick={onClose} className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors">
                    <X className="w-8 h-8" />
                </button>

                <div className="space-y-12">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-display font-black italic tracking-tighter text-white uppercase">Neural Protocol</h2>
                        <div className="h-px w-32 bg-primary/50" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {protocols.map((protocol, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-5"
                            >
                                <div className="p-4 h-fit rounded-2xl bg-white/5 border border-white/10 shadow-xl">
                                    {protocol.icon}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-white font-black text-sm uppercase tracking-widest">{protocol.title}</h3>
                                    <p className="text-white/40 text-[11px] leading-relaxed font-mono">{protocol.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <Button
                        onClick={onClose}
                        variant="premium"
                        className="w-full h-18 rounded-2xl text-xl font-black italic tracking-widest shadow-[0_0_40px_rgba(var(--primary),0.2)]"
                    >
                        ACKNOWLEDGE_SYNC
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
