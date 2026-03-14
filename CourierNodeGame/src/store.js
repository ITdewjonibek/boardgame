import { create } from 'zustand';
// Auth Store
export const useAuthStore = create((set) => ({
    teacher: null,
    isLoggedIn: false,
    login: (email, username) => {
        const newTeacher = {
            id: `teacher_${Date.now()}`,
            email,
            username,
            sections: [],
            createdAt: Date.now(),
        };
        localStorage.setItem('currentTeacher', JSON.stringify(newTeacher));
        set({ teacher: newTeacher, isLoggedIn: true });
    },
    logout: () => {
        localStorage.removeItem('currentTeacher');
        set({ teacher: null, isLoggedIn: false });
    },
}));
// Sections Store
export const useSectionStore = create((set) => ({
    sections: [],
    addSection: (section) => {
        set((state) => {
            const newSections = [...state.sections, section];
            localStorage.setItem('testSections', JSON.stringify(newSections));
            return { sections: newSections };
        });
    },
    removeSection: (sectionId) => {
        set((state) => {
            const newSections = state.sections.filter((s) => s.id !== sectionId);
            localStorage.setItem('testSections', JSON.stringify(newSections));
            return { sections: newSections };
        });
    },
    updateSection: (sectionId, section) => {
        set((state) => {
            const newSections = state.sections.map((s) => (s.id === sectionId ? section : s));
            localStorage.setItem('testSections', JSON.stringify(newSections));
            return { sections: newSections };
        });
    },
    addQuestionToSection: (sectionId, question) => {
        set((state) => {
            const newSections = state.sections.map((s) => s.id === sectionId ? { ...s, questions: [...s.questions, question] } : s);
            localStorage.setItem('testSections', JSON.stringify(newSections));
            return { sections: newSections };
        });
    },
    removeQuestionFromSection: (sectionId, questionId) => {
        set((state) => {
            const newSections = state.sections.map((s) => s.id === sectionId ? { ...s, questions: s.questions.filter((q) => q.id !== questionId) } : s);
            localStorage.setItem('testSections', JSON.stringify(newSections));
            return { sections: newSections };
        });
    },
    loadSections: () => {
        const saved = localStorage.getItem('testSections');
        if (saved) {
            set({ sections: JSON.parse(saved) });
        }
    },
}));
// Game Play Store
export const useGamePlayStore = create((set) => ({
    gameState: {
        phase: 'setup',
        currentNodeIndex: 0,
        score: 0,
        timeLeft: 120,
        selectedDifficulty: null,
        questions: [],
        currentQuestion: null,
        isAnswering: false,
        answerResult: null,
        finalScore: 0,
        bonus: 0,
        timeTaken: 0,
    },
    updateGameState: (newState) => {
        set((state) => ({
            gameState: { ...state.gameState, ...newState },
        }));
    },
    resetGame: () => {
        set({
            gameState: {
                phase: 'setup',
                currentNodeIndex: 0,
                score: 0,
                timeLeft: 120,
                selectedDifficulty: null,
                questions: [],
                currentQuestion: null,
                isAnswering: false,
                answerResult: null,
                finalScore: 0,
                bonus: 0,
                timeTaken: 0,
            },
        });
    },
}));
