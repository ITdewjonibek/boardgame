export type DifficultyLevel = 'oson' | 'orta' | 'qiyin'

export interface Question {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  difficulty: DifficultyLevel
  sectionId: string
}

export interface TestSection {
  id: string
  name: string
  description?: string
  questions: Question[]
  difficulty: DifficultyLevel
  createdAt: number
  teacherId: string
}

export interface Teacher {
  id: string
  email: string
  username: string
  sections: string[]
  createdAt: number
}

export interface GameState {
  phase: 'setup' | 'running' | 'delivery' | 'finished'
  currentNodeIndex: number
  score: number
  timeLeft: number
  selectedDifficulty: DifficultyLevel | null
  questions: Question[]
  currentQuestion: Question | null
  isAnswering: boolean
  answerResult: boolean | null
  finalScore: number
  bonus: number
  timeTaken: number
}

export interface GameSessionData {
  teacherId: string
  sectionId: string
  difficulty: DifficultyLevel
  totalQuestions: number
  timeLimit: number
  startTime: number
}
