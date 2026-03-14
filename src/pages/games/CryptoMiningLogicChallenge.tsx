import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Link, Cpu, Zap, Activity, ShieldCheck, Database, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Simplistic hash function for gameplay (not cryptographic)
const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
};

export default function CryptoMiningLogicChallenge() {
    const {
        status,
        level,
        score,
        addScore,
        setCombo,
        combo,
        damage,
        nextLevel,
        triggerTest,
        testActive
    } = useMegaStore();

    const [nonce, setNonce] = useState(0);
    const [blockData, setBlockData] = useState("");
    const [targetDifficulty, setTargetDifficulty] = useState(1); // Number of leading zeros
    const [currentHash, setCurrentHash] = useState("");
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "'Ish dalili' (PoW) minerlarga nima qilishni talap qiladi?",
            options: ["Raqamli shartnoma imzolash", "Murakkab matematik masalalarni echish", "Tarmoq o'zgarishlari uchun ovoz berish", "Xavfsizlik depozitini joylashtirish"],
            correct: 1,
            explanation: "Ish dalili - minerlarga computational kuchni ishlatarak muammoni echish uchun 'ish' qilish zarurligini talab qiladi."
        },
        {
            id: 2,
            text: "Blockchain minerlashda 'Nons' nima?",
            options: ["Jami tangalarning soni", "Hesh kodi topish uchun o'zgartiradigan tasodifiy raqam", "Birinchi minerni nomi", "Kriptovalyuta hamyoni turi"],
            correct: 1,
            explanation: "Nons ('bir marta ishlatilgan raqam') - bu kriptografik aloqada bir marta ishlatiladi. Minerlashda hesh kodini topish uchun o'zgartiriladi."
        },
        {
            id: 3,
            text: "Blokda 'Hesh' ning rolI nima?",
            options: ["Minerni nomini saqlash", "Ma'lumotlarning noyob raqamli otishini yaratish", "Tranzaksiya summasini yashirish", "Tarmoq tezligini oshirish"],
            correct: 1,
            explanation: "Kriptografik hesh funksiyasi kiritilganlar o'sini belgilangan o'lchamdagi belgi qatoriga o'tkazadi va bloktagi ma'lumotlarning noyob otishi."
        }
    ];

    const initializeBlock = useCallback(() => {
        setBlockData(`BLOCK_${Math.random().toString(36).substring(7).toUpperCase()}`);
        setNonce(0);
        setTargetDifficulty(Math.min(3, 1 + Math.floor(level / 5)));
        setCurrentHash(simpleHash(`BLOCK_INIT_0`));
    }, [level]);

    const handleMine = (delta: number) => {
        if (status !== 'playing' || testActive) return;
        const nextNonce = Math.max(0, nonce + delta);
        setNonce(nextNonce);

        const hash = simpleHash(`${blockData}_${nextNonce}`);
        setCurrentHash(hash);

        // Check Difficulty (leading '0's)
        const prefix = '0'.repeat(targetDifficulty);
        if (hash.startsWith(prefix)) {
            addScore(4000 * (combo + 1));
            setCombo(combo + 1);
            toast.success("BLOCK_VALIDATED: Hash Protocol Met");
            if (level % 2 === 0) triggerTest(true);
            else { nextLevel(); initializeBlock(); }
        }
    };

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            initializeBlock();
        }
    }, [status, gameStarted, initializeBlock]);

    return (
        <BaseGameLayout
            title="Crypto Mining Logic"
            rules={[
                "Find the NONCE that generates a valid block HASH signature.",
                "Difficulty Protocol: The hash must start with the required number of ZEROS.",
                "Precision Validation: Incorrect signatures result in network pool rejection.",
                "Expert Blockchain Phase (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Blockchain HUD */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-6">
                                <Database className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-black tracking-widest text-white uppercase italic">Ledger_Sync_v4</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-2">Required_Difficulty</div>
                                    <div className="flex gap-2">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className={`w-3 h-3 rounded-full ${i < targetDifficulty ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]' : 'bg-white/5 border border-white/10'}`} />
                                        ))}
                                    </div>
                                    <div className="mt-2 text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Start_With_{targetDifficulty}_Zeros</div>
                                </div>

                                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
                                    <div className="text-[10px] font-black text-primary uppercase mb-1">Block_Height</div>
                                    <div className="text-3xl font-display font-black text-white italic tracking-tighter">Chain_{level}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center gap-4">
                            <ShieldCheck className="w-8 h-8 text-secondary" />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-secondary uppercase">Sync Credits</div>
                                <div className="text-xl font-display font-black text-white italic lowercase underline underline-offset-8 decoration-white/30 underline-offset-8">VAL_{score}</div>
                            </div>
                        </div>
                    </div>

                    {/* Mining Console */}
                    <div className="lg:col-span-8">
                        <div className="glass-card p-12 bg-[#020617] border-white/5 relative overflow-hidden group shadow-2xl rounded-[3rem]">
                            <div className="absolute inset-0 opacity-5 pointer-events-none">
                                <Link className="w-full h-full text-secondary" />
                            </div>

                            <div className="space-y-12 relative z-10 text-center">
                                <div className="inline-block px-8 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-[10px] font-black text-secondary tracking-[0.5em] uppercase mb-4">
                                    Proof_of_Work_Mining
                                </div>

                                <div className="space-y-8">
                                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 relative group">
                                        <div className="absolute top-4 right-6 flex items-center gap-2">
                                            <Lock className="w-3 h-3 text-white/20" />
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">SHA-256_SIM</span>
                                        </div>
                                        <div className="text-[10px] font-black text-white/20 uppercase mb-4 tracking-widest">Target_Hash_String</div>
                                        <div className="text-4xl font-mono font-black text-white tracking-widest break-all">
                                            {currentHash.split('').map((char, i) => (
                                                <span key={i} className={i < targetDifficulty && char === '0' ? 'text-primary' : 'text-white'}>{char}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-center items-center gap-6">
                                        <Button onClick={() => handleMine(-10)} variant="outline" className="w-16 h-16 rounded-2xl border-white/10 hover:bg-white/5">-10</Button>
                                        <Button onClick={() => handleMine(-1)} variant="outline" className="w-16 h-16 rounded-2xl border-white/10 hover:bg-white/5">-1</Button>
                                        <div className="px-12 py-6 bg-primary/10 border-2 border-primary/40 rounded-3xl relative">
                                            <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Nonce_Variable</div>
                                            <div className="text-5xl font-display font-black text-white italic tracking-tighter">{nonce}</div>
                                        </div>
                                        <Button onClick={() => handleMine(1)} variant="outline" className="w-16 h-16 rounded-2xl border-white/10 hover:bg-white/5">+1</Button>
                                        <Button onClick={() => handleMine(10)} variant="outline" className="w-16 h-16 rounded-2xl border-white/10 hover:bg-white/5">+10</Button>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5 flex justify-center gap-8">
                                    <div className="flex items-center gap-2 px-6 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                        <Cpu className="w-4 h-4 text-orange-500" />
                                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Hash_Rate: 48.2 TH/s</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <Activity className="w-4 h-4 text-blue-500" />
                                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Pool_Status: Synchronized</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex items-center gap-12">
                    <Zap className="w-10 h-10 text-primary animate-pulse" />
                    <div className="h-10 w-px bg-white/10" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">Decentralized Logic Module</span>
                        <span className="text-2xl font-display font-black tracking-widest text-white italic underline underline-offset-8 decoration-secondary/40">GENESIS_PROTOCOL_v{level}.0</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="crypto-logic"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            initializeBlock();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
