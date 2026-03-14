import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Telescope, Zap, Navigation, Star, Globe, ShieldCheck, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TelescopeAlignmentChallenge() {
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

    const [ra, setRa] = useState(0); // Right Ascension (0-360)
    const [dec, setDec] = useState(0); // Declination (-90 to 90)
    const [targetRa, setTargetRa] = useState(0);
    const [targetDec, setTargetDec] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What does 'RA' stand for in celestial coordinates?",
            options: ["Radial Alignment", "Right Ascension", "Rotation Angle", "Relative Altitude"],
            correct: 1,
            explanation: "Right Ascension (RA) is the astronomical equivalent of longitude, measured eastwards along the celestial equator from the vernal equinox."
        },
        {
            id: 2,
            text: "Which coordinate is the celestial equivalent of Latitude?",
            options: ["Right Ascension", "Declination (Dec)", "Azimuth", "Zenith"],
            correct: 1,
            explanation: "Declination (Dec) is the celestial sphere coordinate equivalent to terrestrial latitude, measured in degrees north or south of the celestial equator."
        },
        {
            id: 3,
            text: "What is the 'Light-Year' a measure of?",
            options: ["Time", "Distance", "Brightness", "Speed"],
            correct: 1,
            explanation: "A light-year is the distance that light travels in a vacuum in one Julian year (365.25 days), approximately 9.46 trillion kilometers."
        }
    ];

    const initializeTarget = useCallback(() => {
        setTargetRa(Math.floor(Math.random() * 361));
        setTargetDec(Math.floor(Math.random() * 181) - 90);
        setRa(180);
        setDec(0);
    }, []);

    const handleAlign = () => {
        if (status !== 'playing' || testActive) return;

        const diffRa = Math.abs(ra - targetRa);
        const diffDec = Math.abs(dec - targetDec);

        if (diffRa < 5 && diffDec < 5) {
            addScore(2200 * (combo + 1));
            setCombo(combo + 1);
            toast.success("CELESTIAL_SYNC_COMPLETE: Object Identified");
            if (level % 2 === 0) triggerTest(true);
            else { nextLevel(); initializeTarget(); }
        } else {
            damage(15);
            setCombo(0);
            toast.error("ALIGNMENT_DRIFT: Coordinate Mismatch");
        }
    };

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            initializeTarget();
        }
    }, [status, gameStarted, initializeTarget]);

    return (
        <BaseGameLayout
            title="Telescope Alignment Challenge"
            rules={[
                "Adjust RA (Right Ascension) and DEC (Declination) to center the celestial body.",
                "Precision Optical Tracking: The target must be within 5° of center.",
                "Observation Drift: Higher levels require faster and more accurate alignment.",
                "Expert Astro-Analysis (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Navigation Controls */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-6">
                                <Navigation className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-black tracking-widest text-white uppercase italic">Celestial_Nav_v4</h3>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black tracking-widest text-primary/60 uppercase">
                                        <span>Right_Ascension</span>
                                        <span>{ra}°</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="360" value={ra}
                                        onChange={(e) => setRa(parseInt(e.target.value))}
                                        className="w-full accent-primary bg-white/5 h-2 rounded-full cursor-pointer"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black tracking-widest text-secondary/60 uppercase">
                                        <span>Declination</span>
                                        <span>{dec}°</span>
                                    </div>
                                    <input
                                        type="range" min="-90" max="90" value={dec}
                                        onChange={(e) => setDec(parseInt(e.target.value))}
                                        className="w-full accent-secondary bg-white/5 h-2 rounded-full cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleAlign}
                            variant="premium"
                            className="w-full h-20 rounded-3xl border-b-8 border-primary/50 text-2xl font-black italic tracking-widest flex items-center justify-center gap-4"
                        >
                            <Zap className="w-6 h-6 fill-primary" />
                            INITIATE_CAPTURE
                        </Button>
                    </div>

                    {/* Star Field View */}
                    <div className="lg:col-span-8">
                        <div className="aspect-video rounded-[3rem] bg-black border-4 border-white/5 relative overflow-hidden group shadow-2xl">
                            {/* Star Field */}
                            <div className="absolute inset-0 opacity-40">
                                {[...Array(50)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="absolute text-white/20"
                                        style={{
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                            width: `${Math.random() * 4 + 2}px`
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Target Object */}
                            <motion.div
                                animate={{
                                    x: (targetRa - ra) * 5,
                                    y: (targetDec - dec) * 5,
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.8, 0.3]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20"
                            >
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
                                <Star className="w-full h-full text-primary" />
                            </motion.div>

                            {/* Crosshair */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-32 h-32 border-2 border-white/10 rounded-full flex items-center justify-center relative">
                                    <div className="w-full h-px bg-white/20 absolute" />
                                    <div className="w-px h-full bg-white/20 absolute" />
                                    <div className="w-4 h-4 border-2 border-primary rounded-full animate-ping" />
                                </div>
                            </div>

                            {/* Coordinates HUD Overlay */}
                            <div className="absolute bottom-6 left-10 flex gap-8">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-white/20 tracking-widest uppercase">Target_RA</span>
                                    <span className="text-sm font-display font-black text-white italic">{targetRa}°</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[8px] font-black text-white/20 tracking-widest uppercase">Target_DEC</span>
                                    <span className="text-sm font-display font-black text-white italic">{targetDec}°</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex items-center gap-10">
                    <div className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <Telescope className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">Astro_Lens_Tier_{level}</span>
                    </div>
                    <div className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <Globe className="w-4 h-4 text-secondary" />
                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">Planet_Sync_{combo}%</span>
                    </div>
                    <div className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">VAL_{score}</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="telescope-align"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            initializeTarget();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
