import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Activity, Shield, Zap, Info } from 'lucide-react';

interface MemoryIntroProps {
    onStart: () => void;
    onShowRules: () => void;
}

export function MemoryIntro({ onStart, onShowRules }: MemoryIntroProps) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12"
            >
                <div className="flex flex-col justify-center gap-8">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ x: -20 }}
                            animate={{ x: 0 }}
                            className="flex items-center gap-3 text-secondary"
                        >
                            <Brain className="w-6 h-6" />
                            <span className="text-[10px] font-black tracking-[0.6em] uppercase">Neural Sync Protocol</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-display font-black italic tracking-tighter text-white leading-[0.9]">
                            NEURAL <br /> <span className="text-secondary">LINK</span> <br /> SYNC_V5
                        </h1>
                    </div>

                    <p className="text-white/40 font-mono text-sm max-w-sm leading-relaxed">
                        Replicate the transmission sequence to stabilize the neural link. Advanced stages feature spatial rotation and signal mirroring. Don't let your synapse collapse.
                    </p>

                    <div className="flex gap-4">
                        <Button
                            onClick={onStart}
                            variant="premium"
                            className="h-16 px-12 rounded-2xl text-xl font-black italic tracking-widest flex-1 shadow-[0_0_40px_rgba(var(--secondary),0.2)] bg-secondary hover:bg-secondary/80"
                        >
                            ENGAGE_BUFFER
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
                    <div className="absolute inset-0 bg-secondary/10 blur-[120px] rounded-full animate-pulse" />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 glass-card bg-black/40 border-secondary/20 p-12 rounded-[4rem] shadow-2xl flex flex-col items-center gap-8"
                    >
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 0, 1, 0, 1, 0, 1, 0, 1].map((v, i) => (
                                <div key={i} className={`w-8 h-8 rounded-lg ${v ? 'bg-secondary animate-pulse' : 'bg-white/5'}`} />
                            ))}
                        </div>
                        <div className="text-center space-y-1">
                            <div className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">Synaptic Health</div>
                            <div className="text-xs font-mono text-secondary font-bold">STABLE_CONNECT</div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
