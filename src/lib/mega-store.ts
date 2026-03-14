import { create } from 'zustand';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'testing' | 'victory' | 'failure';
export type GameMode = 'single' | 'team';
export type Difficulty = 'normal' | 'hard' | 'extreme' | 'expert';

interface TeamState {
    score: number;
    rank: number;
    members: string[];
}

interface MegaGameState {
    // Core Status
    status: GameStatus;
    mode: GameMode;
    difficulty: Difficulty;
    level: number;

    // Scoring & Stats
    score: number;
    highScore: number;
    combo: number;
    maxCombo: number;
    health: number;
    maxHealth: number;

    // Team Mode
    teams: {
        A: TeamState;
        B: TeamState;
    };

    // Test System
    testActive: boolean;
    testScore: number;

    // Actions
    setStatus: (status: GameStatus) => void;
    setMode: (mode: GameMode) => void;
    setDifficulty: (diff: Difficulty) => void;
    addScore: (points: number) => void;
    setCombo: (combo: number) => void;
    damage: (amount: number) => void;
    heal: (amount: number) => void;
    resetGame: () => void;
    nextLevel: () => void;
    triggerTest: (active: boolean) => void;
}

export const useMegaStore = create<MegaGameState>((set) => ({
    status: 'idle',
    mode: 'single',
    difficulty: 'hard',
    level: 1,
    score: 0,
    highScore: 0,
    combo: 0,
    maxCombo: 0,
    health: 100,
    maxHealth: 100,
    teams: {
        A: { score: 0, rank: 0, members: [] },
        B: { score: 0, rank: 0, members: [] },
    },
    testActive: false,
    testScore: 0,

    setStatus: (status) => set({ status }),
    setMode: (mode) => set({ mode }),
    setDifficulty: (difficulty) => set({ difficulty }),

    addScore: (points) => set((state) => ({
        score: state.score + points,
        highScore: Math.max(state.highScore, state.score + points)
    })),

    setCombo: (combo) => set((state) => ({
        combo,
        maxCombo: Math.max(state.maxCombo, combo)
    })),

    damage: (amount) => set((state) => {
        const newHealth = Math.max(0, state.health - amount);
        return {
            health: newHealth,
            status: newHealth === 0 ? 'failure' : state.status
        };
    }),

    heal: (amount) => set((state) => ({
        health: Math.min(state.maxHealth, state.health + amount)
    })),

    nextLevel: () => set((state) => ({ level: state.level + 1 })),

    triggerTest: (active) => set({ testActive: active, status: active ? 'testing' : 'playing' }),

    resetGame: () => set({
        status: 'idle',
        level: 1,
        score: 0,
        combo: 0,
        health: 100,
        testActive: false,
        testScore: 0
    }),
}));
