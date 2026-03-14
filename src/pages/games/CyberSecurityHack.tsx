import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Terminal, Shield, Eye, ShieldAlert, Cpu, Network, Unlock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CyberSecurityHack() {
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

    const [commands, setCommands] = useState<string[]>([]);
    const [targetCmd, setTargetCmd] = useState("");
    const [userInput, setUserInput] = useState("");
    const [consoleLog, setConsoleLog] = useState<string[]>([]);
    const [gameStarted, setGameStarted] = useState(false);
    const logEndRef = useRef<HTMLDivElement>(null);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "'Zero-Day Zaif Nuqta' nima?",
            options: ["Juda eski xato", "Dasturiy mahsulot bozori bilan noma'lum bo'lgan zaif taraf", "Har kuni takrorlanadigan xato", "Firewall turi"],
            correct: 1,
            explanation: "Zero-Day zaif taraf - bu dasturiy mahsulot bozori ma'lum lekin tuzatish yo'q bo'lgan xavfsizlik xatosi."
        },
        {
            id: 2,
            text: "Xavfsiz shell kirishi uchun asosan qaysi protokol ishlatiladi?",
            options: ["HTTP", "FTP", "SSH", "SMTP"],
            correct: 2,
            explanation: "SSH (Xavfsiz Shell) - bu xavfsizlanmagan tarmoq orqali tarmoq xizmatlarini xavfsiz harakatlantirish uchun kriptografik protokol."
        },
        {
            id: 3,
            text: "'Ikki faktorli Autentifikatsiya' (2FA) xavfsizlikni qanday yaxshilaydi?",
            options: ["Uses two different passwords", "Requires something you know and something you have", "Speeds up login", "Reduces need for encryption"],
            correct: 1,
            explanation: "2FA adds an extra layer of security by requiring not just a password and username but also something that only the user has on them."
        }
    ];

    const initializeHack = useCallback(() => {
        const cmdList = ["BYPASS_ROOT", "KILL_DAEMON", "OVERRIDE_AUTH", "INJECT_SQL", "FORCE_SSH", "SPOOF_MAC"];
        const target = cmdList[Math.floor(Math.random() * cmdList.length)];
        setCommands(cmdList);
        setTargetCmd(target);
        setUserInput("");
        setConsoleLog([`Initializing System Breach v${level}.0...`, `Target found: ${target}_SERVICE`, "Awaiting exploit command..."]);
    }, [level]);

    const handleCommandSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (status !== 'playing' || testActive) return;

        if (userInput.toUpperCase() === targetCmd) {
            addScore(1200 * (combo + 1));
            setCombo(combo + 1);
            setConsoleLog(prev => [...prev, `> ${userInput}`, "EXPLOIT_EXECUTED: Success", "Security layer bypassed."]);
            toast.success("FIREWALL_BYPASSED");

            if (level % 2 === 0) triggerTest(true);
            else { nextLevel(); initializeHack(); }
        } else {
            damage(20);
            setCombo(0);
            setConsoleLog(prev => [...prev, `> ${userInput}`, "ACCESS_DENIED: Counter-intrusion detected!", "Integrity compromised."]);
            toast.error("SECURITY_BREACH_FAILED");
            initializeHack(); // Scramble on fail
        }
    };

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            initializeHack();
        }
    }, [status, gameStarted, initializeHack]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [consoleLog]);

    return (
        <BaseGameLayout
            title="Cyber Security Hack"
            rules={[
                "Analyze the system log to identify the specific target service.",
                "Input the corresponding EXPLOIT_COMMAND to bypass the layer.",
                "Mistakes trigger counter-intrusion protocols. Speed is critical.",
                "Expert Security Phase (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">

                    {/* Terminal Interface */}
                    <div className="glass-card p-0 border-green-500/20 bg-black shadow-[0_0_50px_rgba(34,197,94,0.1)] flex flex-col min-h-[500px]">
                        <div className="h-10 bg-green-500/10 border-b border-green-500/20 flex items-center justify-between px-6">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-green-500" />
                                <span className="text-[10px] font-mono font-black text-green-500 tracking-widest uppercase">Root_Terminal_v4.2</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                            </div>
                        </div>

                        <div className="flex-1 p-8 font-mono text-sm space-y-2 overflow-y-auto max-h-[400px] scrollbar-hide">
                            <AnimatePresence>
                                {consoleLog.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={log.startsWith('>') ? 'text-white' : log.includes('ACCESS_DENIED') ? 'text-red-500' : 'text-green-500/60'}
                                    >
                                        {log}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={logEndRef} />
                        </div>

                        <div className="p-8 border-t border-green-500/10">
                            <form onSubmit={handleCommandSubmit} className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 font-mono text-sm select-none">$</div>
                                <Input
                                    autoFocus
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="EXECUTE_EXPLOIT..."
                                    className="h-14 pl-10 bg-green-500/5 border-green-500/20 text-green-400 font-mono tracking-widest uppercase rounded-xl transition-all group-focus-within:border-green-500/50"
                                />
                            </form>
                        </div>
                    </div>

                    {/* Dashboard Area */}
                    <div className="space-y-8 flex flex-col justify-center">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/40 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                                <Cpu className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-display font-black italic tracking-tighter uppercase">Sec_Ops_Center</h3>
                                <p className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase">Intrusion Analysis Level {level}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {commands.map((cmd) => (
                                <div
                                    key={cmd}
                                    className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col gap-2 relative overflow-hidden group ${cmd === targetCmd ? 'bg-primary/10 border-primary shadow-[0_0_30px_rgba(var(--primary),0.1)] hover:bg-primary/20' : 'bg-white/5 border-white/5 opacity-40 hover:opacity-60'}`}
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        {cmd === targetCmd ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                                    </div>
                                    <span className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">Threat_Module</span>
                                    <span className="text-sm font-display font-black text-white italic tracking-widest">{cmd}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 relative">
                            <div className="flex items-center gap-3 mb-4">
                                <ShieldAlert className="w-5 h-5 text-red-500" />
                                <span className="text-xs font-black tracking-widest text-red-500 uppercase">Warning: System Integrity</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black tracking-widest text-white/20 uppercase">Network Sync</div>
                                    <div className="text-xl font-display font-black text-white italic lowercase underline decoration-white/30 underline-offset-8">127.0.0.1_STABLE</div>
                                </div>
                                <div className="w-px h-10 bg-white/5" />
                                <div className="space-y-1 text-right">
                                    <div className="text-[10px] font-black tracking-widest text-white/20 uppercase">Data Credits</div>
                                    <div className="text-xl font-display font-black text-white italic lowercase underline decoration-primary/30 underline-offset-8">CR_{score}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="cyber-hack"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            initializeHack();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
