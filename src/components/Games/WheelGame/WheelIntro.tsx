import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Radius, Disc, Shield, Zap, Info } from 'lucide-react';

interface WheelIntroProps {
    onStart: () => void;
    onShowRules: () => void;
}

export function WheelIntro({ onStart, onShowRules }: WheelIntroProps) {
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
                            className="flex items-center gap-3 text-emerald-500"
                        >
                            <Radius className="w-6 h-6" />
                            <span className="text-[10px] font-black tracking-[0.6em] uppercase">Quantum Sync Ready</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-display font-black italic tracking-tighter text-white leading-[0.9]">
                            PROBABILITY <br /> <span className="text-emerald-500">MATRIX</span> <br /> V5_CHORE
                        </h1>
                    </div>

                    <p className="text-white/40 font-mono text-sm max-w-sm leading-relaxed">
                        Navigate the unstable quantum field. Extract high-yield Compute Points (CP) while dodging reality-void anomalies. Precision timing is mandatory.
                    </p>

                    <div className="flex gap-4">
                        <Button
                            onClick={onStart}
                            variant="premium"
                            className="h-16 px-12 rounded-2xl text-xl font-black italic tracking-widest flex-1 shadow-[0_0_40px_rgba(16,185,129,0.2)] bg-emerald-600 hover:bg-emerald-500"
                        >
                            INITIATE_SPIN
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
                    <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[10%] border border-emerald-500/10 rounded-full"
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10 glass-card bg-black/40 border-emerald-500/20 p-12 rounded-[4rem] shadow-2xl flex flex-col items-center gap-6"
                    >
                        <Disc className="w-40 h-40 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]" />
                        <div className="text-center space-y-1">
                            <div className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">Quantum State</div>
                            <div className="text-xs font-mono text-emerald-500 font-bold">SUPERPOSITION_STABLE</div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
