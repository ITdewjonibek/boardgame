import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseGameLayout from "@/components/BaseGameLayout";
import TestSystem from "@/components/TestSystem";
import { useMegaStore } from "@/lib/mega-store";
import { Target, Zap, Wind, ArrowRight, RefreshCcw, ShieldAlert, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PhysicsEngineChallenge() {
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

    const [angle, setAngle] = useState(45);
    const [power, setPower] = useState(50);
    const [wind, setWind] = useState(0);
    const [targetPos, setTargetPos] = useState({ x: 80, y: 0 });
    const [isFiring, setIsFiring] = useState(false);
    const [projectilePos, setProjectilePos] = useState({ x: 0, y: 0 });
    const [gameStarted, setGameStarted] = useState(false);
    const animationRef = useRef<number>();

    // Expert Questions for Test System
    const questions = [
        {
            id: 1,
            text: "What is 'Parabolic Motion' in physics?",
            options: ["Movement in a straight line", "The path of a projectile under gravity", "Circular movement", "Random oscillation"],
            correct: 1,
            explanation: "A parabolic trajectory is the path followed by a projectile under the influence of gravity, assuming no air resistance."
        },
        {
            id: 2,
            text: "How does 'Air Resistance' affect a projectile's range?",
            options: ["Increases range", "Decreases range", "No effect", "Makes the path perfectly straight"],
            correct: 1,
            explanation: "Air resistance (drag) acts opposite to the direction of motion, reducing the horizontal and vertical velocity components and shortening the flight distance."
        },
        {
            id: 3,
            text: "At what angle (degrees) is the maximum range achieved for a projectile in a vacuum?",
            options: ["30°", "45°", "60°", "90°"],
            correct: 1,
            explanation: "In the absence of air resistance, a launch angle of 45 degrees provides the maximum horizontal range for a projectile launched from ground level."
        }
    ];

    const initializeLevel = useCallback(() => {
        setWind(Math.floor(Math.random() * 21) - 10); // -10 to 10
        setTargetPos({ x: 60 + Math.random() * 30, y: Math.random() * 40 });
        setAngle(45);
        setPower(50);
        setIsFiring(false);
        setProjectilePos({ x: 0, y: 0 });
    }, []);

    const fire = () => {
        if (status !== 'playing' || testActive || isFiring) return;
        setIsFiring(true);

        let t = 0;
        const g = 9.8;
        const rad = (angle * Math.PI) / 180;
        const v0 = power * 0.5;

        const animate = () => {
            t += 0.1;
            // Basic physics equations: x = v0*cos(theta)*t + 0.5*wind*t^2, y = v0*sin(theta)*t - 0.5*g*t^2
            const x = v0 * Math.cos(rad) * t + (0.05 * wind * t * t);
            const y = v0 * Math.sin(rad) * t - (0.5 * g * t * t);

            setProjectilePos({ x, y });

            // Check Hit/Miss
            const dist = Math.sqrt(Math.pow(x - targetPos.x, 2) + Math.pow(y - targetPos.y, 2));
            if (dist < 5) {
                addScore(2500);
                setCombo(combo + 1);
                toast.success("CALIBRATION_SUCCESS: Target Neutralized");
                cancelAnimationFrame(animationRef.current!);
                if (level % 2 === 0) triggerTest(true);
                else { nextLevel(); initializeLevel(); }
                return;
            }

            if (y < -10 || x > 110) {
                damage(20);
                setCombo(0);
                toast.error("CALIBRATION_FAILURE: Kinetic Mismatch");
                setIsFiring(false);
                setProjectilePos({ x: 0, y: 0 });
                cancelAnimationFrame(animationRef.current!);
                initializeLevel(); // Scramble wind
                return;
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (status === 'playing' && !gameStarted) {
            setGameStarted(true);
            initializeLevel();
        }
        return () => cancelAnimationFrame(animationRef.current!);
    }, [status, gameStarted, initializeLevel]);

    return (
        <BaseGameLayout
            title="Physics Engine Challenge"
            rules={[
                "Adjust ANGLE and POWER to calibrate the projectile trajectory.",
                "Factor in REAL-TIME WIND vectors to ensure target impact.",
                "Gravity is constant (9.8 m/s²). Kinetic energy is proportional to Power.",
                "Expert Physics Phase (Test Phase) triggers every 2 cycles."
            ]}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-6xl h-[500px] bg-white/[0.02] rounded-[3rem] border border-white/10 backdrop-blur-3xl relative overflow-hidden shadow-2xl mb-12">

                    {/* Trajectory visualization area */}
                    <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden pointer-events-none">
                        {/* Projectile */}
                        {isFiring && (
                            <motion.div
                                className="absolute w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.8)]"
                                style={{ left: `${projectilePos.x}%`, bottom: `${projectilePos.y}%` }}
                            >
                                <div className="absolute inset-0 animate-ping bg-primary rounded-full opacity-50" />
                            </motion.div>
                        )}

                        {/* Target */}
                        <motion.div
                            className="absolute w-12 h-12 rounded-full border-4 flex items-center justify-center animate-pulse"
                            style={{ left: `${targetPos.x}%`, bottom: `${targetPos.y}%`, borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                        >
                            <Target className="w-6 h-6 text-red-500" />
                        </motion.div>

                        {/* Launcher */}
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 border-t-4 border-r-4 border-white/20 rounded-tr-3xl flex items-center justify-center">
                            <motion.div
                                style={{ rotate: -angle }}
                                className="w-12 h-2 bg-primary origin-left rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                            />
                        </div>
                    </div>

                    {/* Wind Indicator */}
                    <div className="absolute top-8 left-8 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                        <Wind className={`w-6 h-6 ${wind !== 0 ? 'text-secondary animate-pulse' : 'text-white/20'}`} />
                        <div>
                            <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Wind_Vector</div>
                            <div className="text-xl font-display font-black text-white italic tracking-tighter">{wind > 0 ? `EAST +${wind}` : wind < 0 ? `WEST ${wind}` : 'STILL'} m/s</div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-black tracking-widest text-white/30 uppercase">Launch_Angle</span>
                                <span className="text-xl font-display font-black text-primary">{angle}°</span>
                            </div>
                            <input
                                type="range" min="0" max="90" value={angle}
                                onChange={(e) => setAngle(parseInt(e.target.value))}
                                disabled={isFiring}
                                className="w-full accent-primary bg-white/5 h-2 rounded-full cursor-pointer"
                            />
                        </div>

                        <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-black tracking-widest text-white/30 uppercase">Kinetic_Power</span>
                                <span className="text-xl font-display font-black text-secondary">{power}u</span>
                            </div>
                            <input
                                type="range" min="10" max="150" value={power}
                                onChange={(e) => setPower(parseInt(e.target.value))}
                                disabled={isFiring}
                                className="w-full accent-secondary bg-white/5 h-2 rounded-full cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col items-center gap-6">
                        <Button
                            onClick={fire}
                            disabled={isFiring}
                            variant="premium"
                            className="w-full h-24 rounded-[2rem] border-b-8 border-primary/50 text-3xl font-black italic tracking-widest flex items-center justify-center gap-4 bg-gradient-to-br from-primary/10 to-primary/5"
                        >
                            <Zap className="w-8 h-8 fill-primary" />
                            INITIATE_DROP
                        </Button>
                        <div className="flex gap-4 w-full">
                            <Button onClick={initializeLevel} variant="outline" className="flex-1 h-12 rounded-xl border-white/10 hover:bg-white/5 transition-all text-[10px] font-black tracking-widest uppercase italic">
                                <RefreshCcw className="w-4 h-4 mr-2" /> Scramble_Data
                            </Button>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-4">
                        <div className="glass-card p-6 border-primary/20 bg-primary/5 flex items-center gap-4">
                            <Cpu className="w-8 h-8 text-primary" />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-primary uppercase">Trajectory_Tier</div>
                                <div className="text-xl font-display font-black text-white italic tracking-tighter underline underline-offset-8 decoration-white/20">PHASE_{level}_SYNC</div>
                            </div>
                        </div>
                        <div className="glass-card p-6 border-red-500/20 bg-red-500/5 flex items-center gap-4">
                            <ShieldAlert className="w-8 h-8 text-red-500" />
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-red-500 uppercase">Kinetic Credits</div>
                                <div className="text-xl font-display font-black text-white italic tracking-tighter underline underline-offset-8 decoration-white/20">VAL_{score}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {testActive && (
                    <TestSystem
                        gameId="physics-challenge"
                        questions={questions}
                        onComplete={(bonus) => {
                            nextLevel();
                            initializeLevel();
                            triggerTest(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </BaseGameLayout>
    );
}
