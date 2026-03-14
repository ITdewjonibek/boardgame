import { create } from 'zustand';

// Advanced Rank Tiers
export type PlayerRank = 'Novice' | 'Challenger' | 'Expert' | 'Master' | 'GrandMaster' | 'Apex';

export interface ScoreModifier {
    source: string;
    multiplier: number;
    durationSeconds?: number;
}

interface ScoreManagerState {
    // Current Session Stats
    globalScore: number;
    sessionCombo: number;
    highestSessionCombo: number;

    // Modifiers & Risks
    activeModifiers: Record<string, ScoreModifier>;
    baseMultiplier: number;
    riskFactor: number; // Increases score yield but increases damage taken

    // Progression
    rank: PlayerRank;
    experienceXP: number;
    nextRankXP: number;

    // Core Actions
    addPoints: (basePoints: number, type: 'standard' | 'combo' | 'bonus' | 'boss') => number; // Returns actual awarded points
    incrementCombo: () => void;
    breakCombo: () => void;

    // Modifier Actions
    addModifier: (id: string, modifier: ScoreModifier) => void;
    removeModifier: (id: string) => void;

    // Progression Actions
    awardXP: (amount: number) => void;
}

const RANK_THRESHOLDS = {
    Novice: 0,
    Challenger: 5000,
    Expert: 25000,
    Master: 100000,
    GrandMaster: 500000,
    Apex: 2000000
};

export const useScoreManager = create<ScoreManagerState>((set, get) => ({
    globalScore: 0,
    sessionCombo: 0,
    highestSessionCombo: 0,

    activeModifiers: {},
    baseMultiplier: 1.0,
    riskFactor: 1.0,

    rank: 'Novice',
    experienceXP: 0,
    nextRankXP: RANK_THRESHOLDS.Challenger,

    addPoints: (basePoints, type) => {
        const state = get();
        let finalMultiplier = state.baseMultiplier * state.riskFactor;

        // Calculate dynamic active modifiers
        Object.values(state.activeModifiers).forEach(mod => {
            finalMultiplier *= mod.multiplier;
        });

        // Combo scaling logic
        if (state.sessionCombo > 5) finalMultiplier *= 1.2;
        if (state.sessionCombo > 15) finalMultiplier *= 1.5;
        if (state.sessionCombo > 50) finalMultiplier *= 2.5;

        // Type specific yields
        let yieldModifier = 1.0;
        if (type === 'bonus') yieldModifier = 2.0;
        if (type === 'boss') yieldModifier = 5.0;

        const actualPoints = Math.floor(basePoints * finalMultiplier * yieldModifier);

        set(s => ({
            globalScore: s.globalScore + actualPoints
        }));

        // Award XP proportional to points
        get().awardXP(Math.floor(actualPoints / 10));

        return actualPoints;
    },

    incrementCombo: () => set(state => {
        const newCombo = state.sessionCombo + 1;
        return {
            sessionCombo: newCombo,
            highestSessionCombo: Math.max(state.highestSessionCombo, newCombo)
        };
    }),

    breakCombo: () => set({ sessionCombo: 0 }),

    addModifier: (id, modifier) => set(state => {
        const newMods = { ...state.activeModifiers, [id]: modifier };

        // Handle temporary modifiers
        if (modifier.durationSeconds) {
            setTimeout(() => {
                get().removeModifier(id);
            }, modifier.durationSeconds * 1000);
        }

        return { activeModifiers: newMods };
    }),

    removeModifier: (id) => set(state => {
        const newMods = { ...state.activeModifiers };
        delete newMods[id];
        return { activeModifiers: newMods };
    }),

    awardXP: (amount) => set(state => {
        const newXP = state.experienceXP + amount;
        let newRank = state.rank;
        let nextRankXP = state.nextRankXP;

        // Check rank progression
        if (newXP >= RANK_THRESHOLDS.Apex) { newRank = 'Apex'; nextRankXP = Infinity; }
        else if (newXP >= RANK_THRESHOLDS.GrandMaster) { newRank = 'GrandMaster'; nextRankXP = RANK_THRESHOLDS.Apex; }
        else if (newXP >= RANK_THRESHOLDS.Master) { newRank = 'Master'; nextRankXP = RANK_THRESHOLDS.GrandMaster; }
        else if (newXP >= RANK_THRESHOLDS.Expert) { newRank = 'Expert'; nextRankXP = RANK_THRESHOLDS.Master; }
        else if (newXP >= RANK_THRESHOLDS.Challenger) { newRank = 'Challenger'; nextRankXP = RANK_THRESHOLDS.Expert; }

        return {
            experienceXP: newXP,
            rank: newRank,
            nextRankXP
        };
    })
}));
