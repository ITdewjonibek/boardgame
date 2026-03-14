import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useGamePlayStore, useSectionStore } from '../store';
import LeftPanel from './LeftPanel';
import RoadAndCar from './RoadAndCar';
import TrafficLightTestModal from './TrafficLightTestModal';
const TOTAL_LIGHTS = 20;
const DEADLINE_SEC = 120;
const WAIT_CORRECT = 5;
const WAIT_WRONG = 10;
const BASE_BONUS = 10000;
export default function GameScreen({ onAddTests }) {
    const { gameState, updateGameState, resetGame } = useGamePlayStore();
    const { sections } = useSectionStore();
    const [waitLeft, setWaitLeft] = useState(null);
    const [waitType, setWaitType] = useState(null);
    // Timer countdown
    useEffect(() => {
        if (gameState.phase !== 'running')
            return;
        const timer = setInterval(() => {
            updateGameState({ timeLeft: Math.max(0, gameState.timeLeft - 1) });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameState.phase, gameState.timeLeft, updateGameState]);
    // Wait timer countdown
    useEffect(() => {
        if (waitLeft === null || waitLeft <= 0)
            return;
        const timer = setInterval(() => {
            setWaitLeft((prev) => (prev ? prev - 1 : null));
        }, 1000);
        return () => clearInterval(timer);
    }, [waitLeft]);
    // Check game finish
    useEffect(() => {
        if (gameState.phase === 'running' && gameState.timeLeft === 0) {
            endGame();
        }
    }, [gameState.timeLeft, gameState.phase]);
    // Auto-advance when wait completes
    useEffect(() => {
        if (waitLeft === 0) {
            setWaitLeft(null);
            setWaitType(null);
            if (gameState.currentNodeIndex + 1 >= TOTAL_LIGHTS) {
                finishGame();
            }
            else {
                // Move to next question
                const nextIdx = gameState.currentNodeIndex + 1;
                if (gameState.questions[nextIdx]) {
                    updateGameState({
                        currentNodeIndex: nextIdx,
                        currentQuestion: gameState.questions[nextIdx],
                    });
                }
            }
        }
    }, [waitLeft]);
    const startGame = (difficulty) => {
        // Get questions from sections based on difficulty
        const allQuestions = sections
            .filter((s) => s.difficulty === difficulty)
            .flatMap((s) => s.questions)
            .slice(0, TOTAL_LIGHTS);
        // If not enough questions, duplicate them
        const questions = [];
        for (let i = 0; i < TOTAL_LIGHTS; i++) {
            questions.push(allQuestions[i % allQuestions.length]);
        }
        updateGameState({
            phase: 'running',
            selectedDifficulty: difficulty,
            questions,
            currentQuestion: questions[0],
            currentNodeIndex: 0,
            score: 0,
            timeLeft: DEADLINE_SEC,
        });
    };
    const handleAnswer = (correct) => {
        if (correct) {
            updateGameState({ score: gameState.score + 1 });
            setWaitLeft(WAIT_CORRECT);
            setWaitType('correct');
        }
        else {
            updateGameState({ score: Math.max(0, gameState.score - 10) });
            setWaitLeft(WAIT_WRONG);
            setWaitType('wrong');
        }
        updateGameState({ currentQuestion: null });
    };
    const finishGame = () => {
        const bonus = gameState.timeLeft > 0 ? BASE_BONUS : 0;
        updateGameState({
            phase: 'delivery',
            bonus,
            finalScore: gameState.score,
            timeTaken: DEADLINE_SEC - gameState.timeLeft,
        });
    };
    const endGame = () => {
        updateGameState({
            phase: 'finished',
            bonus: 0,
            finalScore: gameState.score,
            timeTaken: DEADLINE_SEC,
        });
    };
    const handlePlayAgain = () => {
        resetGame();
    };
    return (_jsxs("div", { className: "flex h-screen gap-4 p-4 bg-gradient-dark", children: [_jsx("div", { className: "w-[30%] flex flex-col gap-4", children: _jsx(LeftPanel, { gameState: gameState, onStartGame: startGame, onPlayAgain: handlePlayAgain, onAddTests: onAddTests }) }), _jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [gameState.phase === 'setup' && (_jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-4xl font-bold neon-text mb-4", children: "Kuryer Node O'yiniga Xush Kelibsiz" }), _jsx("p", { className: "text-lg text-gray-400 mb-8", children: "Darajani tanlang va o'yin boshlang" })] }) })), gameState.phase === 'running' && (_jsxs(_Fragment, { children: [_jsx(RoadAndCar, { currentNode: gameState.currentNodeIndex, totalNodes: TOTAL_LIGHTS }), gameState.currentQuestion && !waitLeft && (_jsx(TrafficLightTestModal, { question: gameState.currentQuestion, onAnswer: handleAnswer }))] })), gameState.phase === 'delivery' && (_jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsxs("div", { className: "bg-gradient-card border border-brand-primary/50 rounded-3xl p-12 text-center max-w-md", children: [_jsx("h2", { className: "text-4xl font-bold text-success mb-4", children: "\u2705 Yetkazib berish muvaffaq!" }), _jsxs("p", { className: "text-2xl font-bold text-brand-primary mb-6", children: ["+", gameState.bonus.toLocaleString('uz-UZ'), " so'm bonus"] }), _jsxs("p", { className: "text-lg text-gray-300 mb-8", children: ["Siz ", gameState.timeTaken, " soniyada ", TOTAL_LIGHTS, " testdan o'tdingiz"] }), _jsx("button", { onClick: handlePlayAgain, className: "bg-gradient-primary hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg transition", children: "Yana o'yna" })] }) })), gameState.phase === 'finished' && (_jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsxs("div", { className: "bg-gradient-card border border-error/50 rounded-3xl p-12 text-center max-w-md", children: [_jsx("h2", { className: "text-4xl font-bold text-error mb-4", children: "\u274C Vaqt tugadi!" }), _jsxs("p", { className: "text-xl font-bold text-warning mb-4", children: ["Siz faqat ", gameState.currentNodeIndex, " ta svetafordan o'tdingiz"] }), _jsxs("p", { className: "text-lg text-gray-300 mb-8", children: [gameState.score, " ball to'pladingiz"] }), _jsx("button", { onClick: handlePlayAgain, className: "bg-gradient-primary hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg transition", children: "Qayta o'yna" })] }) }))] }), waitLeft !== null && (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none", children: _jsxs("div", { className: `bg-gradient-card border-2 rounded-3xl p-8 text-center ${waitType === 'correct'
                        ? 'border-success'
                        : 'border-error'}`, children: [_jsx("h3", { className: "text-2xl font-bold mb-4", children: waitType === 'correct' ? '✅ To\'g\'ri!' : '❌ Xato!' }), _jsx("p", { className: "text-5xl font-bold text-brand-primary mb-2", children: waitLeft }), _jsx("p", { className: "text-sm text-gray-400", children: "soniyani kuting..." })] }) }))] }));
}
