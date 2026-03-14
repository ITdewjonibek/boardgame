import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface StageTestQuestion {
    id: string | number;
    text: string;
    options: string[];
    correct: number;
    explanation?: string;
    reward_type?: string;
    reward_value?: number;
    penalty_type?: string;
    penalty_value?: number;
}

interface UseStageTestProps {
    gameId: string;
    onReward: (type: string, value: number) => void;
    onPenalty: (type: string, value: number) => void;
    onComplete: () => void;
}

export function useStageTest({ gameId, onReward, onPenalty, onComplete }: UseStageTestProps) {
    const [isActive, setIsActive] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<StageTestQuestion | null>(null);
    const [questions, setQuestions] = useState<StageTestQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const triggerTest = useCallback((testQuestions: StageTestQuestion[]) => {
        setQuestions(testQuestions);
        setCurrentIndex(0);
        setCurrentQuestion(testQuestions[0]);
        setIsActive(true);
    }, []);

    const handleAnswer = (index: number) => {
        if (!currentQuestion) return;

        if (index === currentQuestion.correct) {
            toast.success("Correct!", { description: currentQuestion.reward_type ? `Reward: ${currentQuestion.reward_type}` : undefined });
            if (currentQuestion.reward_type && currentQuestion.reward_value) {
                onReward(currentQuestion.reward_type, currentQuestion.reward_value);
            }
        } else {
            toast.error("Incorrect", { description: currentQuestion.explanation });
            if (currentQuestion.penalty_type && currentQuestion.penalty_value) {
                onPenalty(currentQuestion.penalty_type, currentQuestion.penalty_value);
            }
        }

        // Move to next question or complete
        if (currentIndex + 1 < questions.length) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCurrentQuestion(questions[nextIndex]);
        } else {
            setTimeout(() => {
                setIsActive(false);
                onComplete();
            }, 1000);
        }
    };

    return {
        isActive,
        currentQuestion,
        triggerTest,
        handleAnswer,
        setIsActive
    };
}
