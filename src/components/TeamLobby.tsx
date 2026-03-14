import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Wifi, UserPlus, Play, X, Shield, Sword } from 'lucide-react';
import { useMultiplayerSync } from '@/lib/multiplayer-sync';
import { Button } from '@/components/ui/button';

export default function TeamLobby({ onStart }: { onStart: () => void }) {
    const { status, room, role, connect, createRoom, joinRoom, leaveRoom, localPlayerId } = useMultiplayerSync();
    const [joinCode, setJoinCode] = useState('');
    const [username, setUsername] = useState(`Player_${Math.floor(Math.random() * 1000)}`);

    const handleConnectAndCreate = () => {
        connect('wss://mock-server', username);
        setTimeout(() => createRoom(), 1200);
    };

    const handleConnectAndJoin = () => {
        if (!joinCode) return;
        connect('wss://mock-server', username);
        setTimeout(() => joinRoom(joinCode.toUpperCase()), 1200);
    };

    if (status !== 'connected' || !room.roomId) {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
                <div className="w-full max-w-2xl glass-card bg-[#020617] border-white/10 rounded-[3rem] p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Wifi className="w-48 h-48 text-secondary" />
                    </div>

                    <div className="relative z-10 flex flex-col gap-10">
                        <div className="text-center">
                            <h2 className="text-4xl font-display font-black text-white italic tracking-tighter uppercase mb-2">Network Sync</h2>
                            <p className="text-white/40 font-mono text-sm tracking-widest uppercase">Establish connection to the Multiplayer Node</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black tracking-widest text-primary uppercase">Operative Callsign</label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-16 bg-white/5 border-2 border-white/10 rounded-2xl px-6 text-2xl font-display font-black text-white italic tracking-wide outline-none focus:border-primary/50 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/20 flex flex-col gap-6">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-6 h-6 text-secondary" />
                                    <span className="text-sm font-black tracking-widest text-white uppercase">Host Session</span>
                                </div>
                                <Button
                                    onClick={handleConnectAndCreate}
                                    variant="premium"
                                    className="w-full h-16 rounded-2xl border-b-4 border-secondary/50 text-lg font-black italic tracking-widest flex items-center justify-center gap-3 bg-gradient-to-br from-secondary/20 to-transparent"
                                >
                                    <Play className="w-5 h-5 fill-secondary" />
                                    INITIALIZE
                                </Button>
                            </div>

                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-6">
                                <div className="flex items-center gap-3">
                                    <UserPlus className="w-6 h-6 text-white/60" />
                                    <span className="text-sm font-black tracking-widest text-white uppercase">Join Session</span>
                                </div>
                                <input
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    placeholder="Enter Code"
                                    className="w-full h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-center text-xl font-mono text-white tracking-[0.3em] outline-none focus:border-white/30"
                                />
                                <Button
                                    onClick={handleConnectAndJoin}
                                    disabled={!joinCode}
                                    variant="secondary"
                                    className="w-full"
                                >
                                    CONNECT
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Lobby View
    const playersA = Object.values(room.players).filter(p => p.team === 'A');
    const playersB = Object.values(room.players).filter(p => p.team === 'B');
    const unassigned = Object.values(room.players).filter(p => p.team === 'None');

    return (
        <div className="absolute inset-0 z-50 flex flex-col bg-[#020617] p-8">
            <header className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-6">
                    <button onClick={leaveRoom} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-display font-black text-white italic tracking-tighter uppercase">Combat Lobby</h1>
                        <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">Awaiting Operative Sync</span>
                    </div>
                </div>

                <div className="px-8 py-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center gap-6">
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] font-black tracking-widest text-primary uppercase">Session ID</span>
                        <span className="text-2xl font-mono text-white tracking-[0.3em]">{room.roomId}</span>
                    </div>
                    <Wifi className="w-8 h-8 text-primary animate-pulse" />
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Team Alpha */}
                <div className="glass-card p-8 bg-blue-500/5 border border-blue-500/20 rounded-[3rem] flex flex-col gap-6">
                    <div className="flex items-center gap-4 border-b border-blue-500/20 pb-4">
                        <Shield className="w-8 h-8 text-blue-500" />
                        <h2 className="text-2xl font-display font-black text-white italic tracking-widest uppercase">Team Alpha</h2>
                    </div>
                    <div className="flex-1 space-y-4">
                        {playersA.map(p => (
                            <div key={p.id} className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex justify-between items-center">
                                <span className="font-black text-white">{p.username}</span>
                                {p.id === room.hostId && <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">HOST</span>}
                            </div>
                        ))}
                        {playersA.length === 0 && <div className="text-center text-blue-500/30 text-xs font-black tracking-widest uppercase py-8">No Operatives</div>}
                    </div>
                </div>

                {/* Unassigned / Center Panel */}
                <div className="flex flex-col gap-8">
                    <div className="flex-1 glass-card p-8 bg-white/5 border border-white/10 rounded-[3rem] flex flex-col gap-6">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <Users className="w-8 h-8 text-white/40" />
                            <h2 className="text-2xl font-display font-black text-white italic tracking-widest uppercase">Unassigned</h2>
                        </div>
                        <div className="flex-1 space-y-4">
                            {unassigned.map(p => (
                                <div key={p.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                                    <span className="font-black text-white">{p.username}</span>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="border-blue-500/30 hover:bg-blue-500/10 text-blue-400">Join Alpha</Button>
                            <Button variant="outline" className="border-red-500/30 hover:bg-red-500/10 text-red-500">Join Omega</Button>
                        </div>
                    </div>

                    {role === 'host' && (
                        <Button
                            onClick={onStart}
                            variant="premium"
                            className="w-full h-24 rounded-[2rem] border-b-8 border-primary/50 text-2xl font-black italic tracking-widest flex items-center justify-center gap-4 bg-gradient-to-br from-primary/20 to-transparent"
                        >
                            <Sword className="w-8 h-8 fill-primary" />
                            ENGAGE MATCH
                        </Button>
                    )}
                </div>

                {/* Team Omega */}
                <div className="glass-card p-8 bg-red-500/5 border border-red-500/20 rounded-[3rem] flex flex-col gap-6">
                    <div className="flex items-center gap-4 border-b border-red-500/20 pb-4">
                        <Shield className="w-8 h-8 text-red-500" />
                        <h2 className="text-2xl font-display font-black text-white italic tracking-widest uppercase">Team Omega</h2>
                    </div>
                    <div className="flex-1 space-y-4">
                        {playersB.map(p => (
                            <div key={p.id} className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex justify-between items-center">
                                <span className="font-black text-white">{p.username}</span>
                                {p.id === room.hostId && <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">HOST</span>}
                            </div>
                        ))}
                        {playersB.length === 0 && <div className="text-center text-red-500/30 text-xs font-black tracking-widest uppercase py-8">No Operatives</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
