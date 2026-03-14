import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Lock, Unlock, Key, ShieldCheck, Terminal, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CodeBreakingChallenge() {
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

    const [targetCode, setTargetCode] = useState("");
    const [encryptedCode, setEncryptedCode] = useState("");
    const [shift, setShift] = useState(0);
    const [userAttempt, setUserAttempt] = useState("");
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "\"Keyzer Shiferi\" asosan nimaga asoslangan?",
            options: ["Tasodifiy o'zgartirish", "Bitwise XOR", "Belgi Siljishishi", "Ochiq kalit shifrlash"],
            correct: 2,
            explanation: "Keyzer Shiferi - bu shifrlash turi bo'lib, matnning har bir harfi alfavitda ma'lum pozitsiyada o'ngga siljigan harf bilan almashtiriladi."
        },
        {
            id: 2,
            text: "'Simmetrik' va 'Asimmetrik' shifrlash orasidagi farq nima?",
            options: ["Hisoblash tezligi", "Ishlatiladigan kalitlar soni", "Kodning uzunligi", "Terminalning rangi"],
            correct: 1,
            explanation: "Simmetrik shifrlashda shifrlash va shifrlashni ochishda bir xil kalit ishlatiladi, asimmetrik shifrlashda esa ikkita kalit (ochiq va yopiq) ishlatiladi."
        },
        {
            id: 3,
            text: "'Kuch bilan hujum' qilinishiga qarshi qanday tur choralari bor?",
            options: ["Matn hajmini oshirish", "Kirish takrorlanish cheklovi", "Oddiy parollardan foydalanish", "Shifrlashni o'chirib tashlash"],
            correct: 1,
            explanation: "Takrorlanish cheklovi - bu tarmoq traffic'ini cheklash strategiyasi bo'lib, foydalanuvchi ma'lum vaqtda urinish sonini cheklab beriladi."
        }
    ];

    const generateCode = useCallback(() => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const length = 4 + Math.floor(level / 2);
        let code = "";
        for (let i = 0; i < length; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }

        const s = Math.floor(Math.random() * 5) + 1 + Math.floor(level / 3);
        setShift(s);
        setTargetCode(code);

        // Encrypt
        let encrypted = "";
        for (let i = 0; i < code.length; i++) {
            const charCode = code.charCodeAt(i);
            encrypted += String.fromCharCode(charCode + s);
        }
        setEncryptedCode(encrypted);
        setUserAttempt("");
    }, [level]);

    const handleDecrypt = (e: React.FormEvent) => {
        e.preventDefault();
        if (status !== 'playing' || testActive) return;

        if (userAttempt.toUpperCase() === targetCode) {
            addScore(1000 * (combo + 1));
            setCombo(combo + 1);
            toast.success("SHIFRLASH_QATLAMINI_CHETLADI");

            if (level % 2 === 0) triggerTest(true);
            else { nextLevel(); generateCode(); }
        } else {
            damage(25);
            setCombo(0);
            toast.error("SHIFRLASHNI_OCHISH_AMALGA_KELTIRILMADI: Ruxsatsiz Imzo");
            generateCode(); // Change code on failure
        }
    };

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            generateCode();
        }
    }, [status, gameStarted, generateCode]);

    return (
        <BaseGameLayout
            title="Kod Ochish Muammosi"
            rules={[
                "Shifrlangan satrni analiz qiling va teskari mantiq siljishini qo'llang.",
                "SILJISH_QIYMATI xavfsizlik qatlamlarini chetlab o'tganingiz sari murakkablashadi.",
                "Berilgan kriptografik shartdan foydalanib harflar va raqamlarni shifrlashni oching.",
                "Mutaxassis Xavfsizlik Bosqichi (Test Bosqichi) har 2 siklda ishga tushuriladi."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <motion.div
                    key={encryptedCode}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 max-w-2xl w-full border-blue-500/20 bg-[#0a0c1a]/80 relative overflow-hidden"
                >
                    {/* Matrix Decor */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none font-mono text-[8px] leading-tight select-none">
                        {Array(20).fill("011010101101010110").join("\n")}
                    </div>

                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-5 h-5 text-blue-400" />
                            <span className="text-xs font-black tracking-widest text-blue-400/60 uppercase">Xavfsizlik_Daemon_v4.2</span>
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center gap-2">
                            <Key className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] font-black text-blue-400 tracking-tighter">SILJISH_QIYMATI: -{shift}</span>
                        </div>
                    </div>

                    <div className="text-center space-y-12 relative z-10">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Shifrlangan_Yuklamasi</span>
                            <div className="text-7xl font-display font-black tracking-[0.2em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] italic uppercase">
                                {encryptedCode}
                            </div>
                        </div>

                        <form onSubmit={handleDecrypt} className="space-y-8">
                            <div className="relative">
                                <Input
                                    autoFocus
                                    value={userAttempt}
                                    onChange={(e) => setUserAttempt(e.target.value)}
                                    placeholder="SHIFRLANGAN_IMZO"
                                    className="h-20 bg-white/5 border-white/10 text-4xl font-display font-black text-center tracking-[0.3em] rounded-2xl focus:border-blue-500/50 transition-all font-mono"
                                />
                                <Unlock className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10" />
                            </div>

                            <Button
                                type="submit"
                                variant="premium"
                                className="w-full h-16 text-xl font-black italic rounded-2xl border-b-4 border-blue-500/50 bg-gradient-to-r from-blue-600 to-indigo-600"
                            >
                                SHIFRLASHNI_BAJARISH
                            </Button>
                        </form>
                    </div>
                </motion.div>

                <div className="mt-12 flex items-center gap-10">
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/40">
                            <Lock className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Qatlamni Xolati</div>
                            <div className="text-xl font-display font-black text-white italic lowercase underline decoration-primary/30 underline-offset-8">Daraja_{level}_Xavfsiz</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/40">
                            <ShieldCheck className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Butunlik Bali</div>
                            <div className="text-xl font-display font-black text-white italic lowercase underline decoration-white/30 underline-offset-8">QIYMAT_{score}</div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="code-breaking"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            generateCode();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
