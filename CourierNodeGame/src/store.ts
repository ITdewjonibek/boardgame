import { create } from 'zustand'
import type { Teacher, GameState, TestSection, Question } from './types'

interface AuthState {
  teacher: Teacher | null
  isLoggedIn: boolean
  login: (email: string, username: string) => void
  logout: () => void
}

interface SectionState {
  sections: TestSection[]
  addSection: (section: TestSection) => void
  removeSection: (sectionId: string) => void
  updateSection: (sectionId: string, section: TestSection) => void
  addQuestionToSection: (sectionId: string, question: Question) => void
  removeQuestionFromSection: (sectionId: string, questionId: string) => void
  loadSections: () => void
}

interface GamePlayState {
  gameState: GameState
  updateGameState: (state: Partial<GameState>) => void
  resetGame: () => void
}

// Auth Store
export const useAuthStore = create<AuthState>((set) => ({
  teacher: null,
  isLoggedIn: false,
  login: (email: string, username: string) => {
    const newTeacher: Teacher = {
      id: `teacher_${Date.now()}`,
      email,
      username,
      sections: [],
      createdAt: Date.now(),
    }
    localStorage.setItem('currentTeacher', JSON.stringify(newTeacher))
    set({ teacher: newTeacher, isLoggedIn: true })
  },
  logout: () => {
    localStorage.removeItem('currentTeacher')
    set({ teacher: null, isLoggedIn: false })
  },
}))

// Sections Store
export const useSectionStore = create<SectionState>((set) => ({
  sections: [],
  addSection: (section: TestSection) => {
    set((state) => {
      const newSections = [...state.sections, section]
      localStorage.setItem('testSections', JSON.stringify(newSections))
      return { sections: newSections }
    })
  },
  removeSection: (sectionId: string) => {
    set((state) => {
      const newSections = state.sections.filter((s) => s.id !== sectionId)
      localStorage.setItem('testSections', JSON.stringify(newSections))
      return { sections: newSections }
    })
  },
  updateSection: (sectionId: string, section: TestSection) => {
    set((state) => {
      const newSections = state.sections.map((s) => (s.id === sectionId ? section : s))
      localStorage.setItem('testSections', JSON.stringify(newSections))
      return { sections: newSections }
    })
  },
  addQuestionToSection: (sectionId: string, question: Question) => {
    set((state) => {
      const newSections = state.sections.map((s) =>
        s.id === sectionId ? { ...s, questions: [...s.questions, question] } : s
      )
      localStorage.setItem('testSections', JSON.stringify(newSections))
      return { sections: newSections }
    })
  },
  removeQuestionFromSection: (sectionId: string, questionId: string) => {
    set((state) => {
      const newSections = state.sections.map((s) =>
        s.id === sectionId ? { ...s, questions: s.questions.filter((q) => q.id !== questionId) } : s
      )
      localStorage.setItem('testSections', JSON.stringify(newSections))
      return { sections: newSections }
    })
  },
  loadSections: () => {
    const saved = localStorage.getItem('testSections')
    if (saved) {
      set({ sections: JSON.parse(saved) })
    }
  },
}))

// Game Play Store
export const useGamePlayStore = create<GamePlayState>((set) => ({
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
  updateGameState: (newState: Partial<GameState>) => {
    set((state) => ({
      gameState: { ...state.gameState, ...newState },
    }))
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
    })
  },
}))
