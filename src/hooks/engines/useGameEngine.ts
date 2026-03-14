import { useState, useCallback } from 'react';

export type GameStatus = 'idle' | 'intro' | 'rules' | 'prep' | 'playing' | 'paused' | 'boss' | 'victory' | 'gameover' | 'result';

interface GameState {
    status: GameStatus;
    level: number;
    maxLevels: number;
}

export function useGameEngine(maxLevels: number = 5) {
    const [state, setState] = useState<GameState>({
        status: 'idle',
        level: 1,
        maxLevels
    });

    const setStatus = useCallback((status: GameStatus) => {
        setState(prev => ({ ...prev, status }));
    }, []);

    const nextLevel = useCallback(() => {
        setState(prev => {
            if (prev.level < prev.maxLevels) {
                return { ...prev, level: prev.level + 1, status: 'prep' };
            }
            return { ...prev, status: 'victory' };
        });
    }, []);

    const resetGame = useCallback(() => {
        setState({
            status: 'intro',
            level: 1,
            maxLevels
        });
    }, [maxLevels]);

    return {
        ...state,
        setStatus,
        nextLevel,
        resetGame,
        isBossLevel: state.level === state.maxLevels || (state.level % 5 === 0)
    };
}
