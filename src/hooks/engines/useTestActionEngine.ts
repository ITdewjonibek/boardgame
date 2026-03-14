import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export type ActionPhase = 'idle' | 'showing_test' | 'evaluating_test' | 'executing_action' | 'cooldown';

export interface GameTest {
    id: string | number;
    question: string;
    options: string[];
    correct: number;
    reward_type?: string;
    reward_value?: any;
    penalty_type?: string;
    penalty_value?: any;
}

interface UseTestActionEngineProps {
    onAction: (result: 'success' | 'failure', test: GameTest) => void;
    onPhaseChange?: (phase: ActionPhase) => void;
    cooldownMs?: number;
}

/**
 * useTestActionEngine
 * Standardized hook to manage the TEST -> ACTION lifecycle.
 * Prevents "update during render" by handling all transitions in event handlers or useEffect.
 */
export function useTestActionEngine({ onAction, onPhaseChange, cooldownMs = 1000 }: UseTestActionEngineProps) {
    const [phase, setPhase] = useState<ActionPhase>('idle');
    const [currentTest, setCurrentTest] = useState<GameTest | null>(null);
    const [lastResult, setLastResult] = useState<'success' | 'failure' | null>(null);

    const phaseRef = useRef<ActionPhase>('idle');

    const updatePhase = useCallback((newPhase: ActionPhase) => {
        phaseRef.current = newPhase;
        setPhase(newPhase);
        onPhaseChange?.(newPhase);
    }, [onPhaseChange]);

    const startTest = useCallback((test: GameTest) => {
        if (phaseRef.current !== 'idle' && phaseRef.current !== 'cooldown') return;

        setCurrentTest(test);
        updatePhase('showing_test');
    }, [updatePhase]);

    const submitAnswer = useCallback((index: number) => {
        if (phaseRef.current !== 'showing_test' || !currentTest) return;

        updatePhase('evaluating_test');

        const isCorrect = index === currentTest.correct;
        const result = isCorrect ? 'success' : 'failure';

        setLastResult(result);

        // Transition to Action Phase after a small delay for feedback
        setTimeout(() => {
            updatePhase('executing_action');
            onAction(result, currentTest);

            // After action duration (e.g., 2s), move to cooldown
            setTimeout(() => {
                updatePhase('cooldown');
                setTimeout(() => {
                    updatePhase('idle');
                    setLastResult(null);
                    setCurrentTest(null);
                }, cooldownMs);
            }, 2000); // 2s fixed action duration for now
        }, 800);
    }, [currentTest, updatePhase, onAction, cooldownMs]);

    return {
        phase,
        currentTest,
        lastResult,
        startTest,
        submitAnswer,
        isBusy: phase !== 'idle'
    };
}
