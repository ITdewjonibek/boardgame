import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Brain, Repeat, RotateCw, Zap } from 'lucide-react';

interface MemoryRulesProps {
    onClose: () => void;
}

export function MemoryRules({ onClose }: MemoryRulesProps) {
    const protocols = [
        {
            icon: <Brain className="text-secondary" />,
            title: "Observe Phase",
            desc: "Wait for the drone to scan the grid. Memorize the sequence of highlighted neural nodes."
        },
        {
            icon: <Repeat className="text-blue-500" />,
            title: "Mirroring Logic",
            desc: "In Boss stages, you must reverse the sequence. Input the nodes in the exact opposite order."
        },
        {
            icon: <RotateCw className="text-red-500" />,
            title: "Spatial Rotation",
            desc: "Advanced sectors feature rotation. The nodes will physically turn, requiring spatial remapping."
        },
        {
            icon: <Zap className="text-amber-500" />,
            title: "Signal Boost",
            desc: "Successfully completing in-game challenges grants 'Neural Clarity' and massive score bonuses."
        }
    ];

    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card bg-black/40 border-secondary/30 p-10 md:p-14 rounded-[3.5rem] w-full max-w-3xl relative overflow-hidden shadow-2xl"
            >
                <button onClick={onClose} className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors">
                    <X className="w-8 h-8" />
                </button>

                <div className="space-y-12">
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-4xl font-display font-black italic tracking-tighter text-white uppercase tracking-widest">Neural Link Guide</h2>
                        <p className="text-secondary font-mono text-[10px] tracking-[0.5em]">BUFFER_CLEARANCE_SECURED</p>
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
                        className="w-full h-18 rounded-2xl text-xl font-black italic tracking-widest shadow-[0_0_40px_rgba(var(--secondary),0.2)] bg-secondary hover:bg-secondary/80"
                    >
                        BUFFER_ACKNOWLEDGED
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
