import { useState, useCallback } from 'react';

export function useScoreEngine() {
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [multiplier, setMultiplier] = useState(1);

    const addPoints = useCallback((basePoints: number, isCombo: boolean = true) => {
        const pointsToAdd = Math.floor(basePoints * multiplier);
        setScore(prev => prev + pointsToAdd);

        if (isCombo) {
            setCombo(prev => {
                const next = prev + 1;
                if (next > maxCombo) setMaxCombo(next);
                // Multiplier logic: +0.1 for every 5 combo
                setMultiplier(1 + Math.floor(next / 5) * 0.1);
                return next;
            });
        }
    }, [multiplier, maxCombo]);

    const breakCombo = useCallback(() => {
        setCombo(0);
        setMultiplier(1);
    }, []);

    const resetScore = useCallback(() => {
        setScore(0);
        setCombo(0);
        setMultiplier(1);
    }, []);

    return {
        score,
        combo,
        maxCombo,
        multiplier,
        addPoints,
        breakCombo,
        resetScore
    };
}
