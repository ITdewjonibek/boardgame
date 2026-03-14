import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type OperativeState = 'idle' | 'scanning' | 'attacking' | 'damaged' | 'victory';

interface OperativeAvatarProps {
    state: OperativeState;
    color?: string; // e.g. '#3b82f6'
    className?: string;
    facingLeft?: boolean;
}

export function OperativeAvatar({ state, color = '#3b82f6', className = '', facingLeft = false }: OperativeAvatarProps) {
    let yOffset = [0, -10, 0];
    let rotate = 0;
    let scanLine = false;
    let eyeColor = color;

    switch (state) {
        case 'idle':
            yOffset = [0, -15, 0];
            break;
        case 'scanning':
            yOffset = [0, -5, 0];
            scanLine = true;
            eyeColor = '#f59e0b'; // Amber
            break;
        case 'attacking':
            yOffset = [0, -2, 0];
            rotate = facingLeft ? -15 : 15;
            eyeColor = '#10b981'; // Emerald
            break;
        case 'damaged':
            yOffset = [0, 20, 0]; // Drops down
            rotate = facingLeft ? -30 : 30;
            eyeColor = '#ef4444'; // Red
            break;
        case 'victory':
            yOffset = [0, -40, 0]; // High float
            rotate = 360; // Spin
            eyeColor = '#10b981';
            break;
    }

    return (
        <motion.div
            className={`relative ${className}`}
            animate={{
                y: yOffset,
                rotate: rotate,
                rotateY: facingLeft ? 180 : 0
            }}
            transition={{
                y: { repeat: state === 'idle' || state === 'scanning' ? Infinity : 0, duration: 3, ease: 'easeInOut' },
                rotate: { type: 'spring', stiffness: 200, damping: 15 },
                rotateY: { duration: 0 }
            }}
            style={{ originY: 1 }} // Rotate from bottom
        >
            <svg width="100" height="120" viewBox="0 0 100 120" className="drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]">
                <defs>
                    <filter id={`glow-${Math.random().toString(36).substring(7)}`}>
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                </defs>

                {/* Main Body (Floating Drone shape) */}
                <path d="M 20 40 Q 50 10 80 40 L 70 80 Q 50 100 30 80 Z" fill="url(#bodyGrad)" stroke={color} strokeWidth="3" />

                {/* Side Wings / Thrusters */}
                <path d="M 20 50 L 5 40 L 15 70 Z" fill="#1e293b" stroke={color} strokeWidth="2" />
                <path d="M 80 50 L 95 40 L 85 70 Z" fill="#1e293b" stroke={color} strokeWidth="2" />

                {/* Thruster Flames */}
                {state !== 'damaged' && (
                    <motion.path
                        d="M 40 90 L 50 115 L 60 90 Z"
                        fill={color}
                        initial={{ opacity: 0.5, scaleY: 0.8 }}
                        animate={{ opacity: 1, scaleY: 1.2 }}
                        transition={{ repeat: Infinity, duration: 0.1, repeatType: 'reverse' }}
                    />
                )}

                {/* Eye / Visor */}
                <rect x="35" y="45" width="30" height="10" rx="4" fill="#000" />
                <rect x="40" y="47" width="20" height="6" rx="2" fill={eyeColor} filter="url(#glow-random)" />

                {/* Scanning Laser FX */}
                {scanLine && (
                    <motion.rect
                        x="10" y="40" width="80" height="2" fill="#f59e0b" opacity="0.5"
                        initial={{ y: 0 }}
                        animate={{ y: 50 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    />
                )}
            </svg>
        </motion.div>
    );
}
