import { useState, useEffect } from 'react'
import { useGamePlayStore, useSectionStore } from '../store'
import type { DifficultyLevel } from '../types'
import LeftPanel from './LeftPanel'
import RoadAndCar from './RoadAndCar'
import TrafficLightTestModal from './TrafficLightTestModal'

const TOTAL_LIGHTS = 20
const DEADLINE_SEC = 120
const WAIT_CORRECT = 5
const WAIT_WRONG = 10
const BASE_BONUS = 10000

interface GameScreenProps {
  onAddTests: () => void
}

export default function GameScreen({ onAddTests }: GameScreenProps) {
  const { gameState, updateGameState, resetGame } = useGamePlayStore()
  const { sections } = useSectionStore()
  const [waitLeft, setWaitLeft] = useState<number | null>(null)
  const [waitType, setWaitType] = useState<'correct' | 'wrong' | null>(null)

  // Timer countdown
  useEffect(() => {
    if (gameState.phase !== 'running') return
    const timer = setInterval(() => {
      updateGameState({ timeLeft: Math.max(0, gameState.timeLeft - 1) })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameState.phase, gameState.timeLeft, updateGameState])

  // Wait timer countdown
  useEffect(() => {
    if (waitLeft === null || waitLeft <= 0) return
    const timer = setInterval(() => {
      setWaitLeft((prev) => (prev ? prev - 1 : null))
    }, 1000)
    return () => clearInterval(timer)
  }, [waitLeft])

  // Check game finish
  useEffect(() => {
    if (gameState.phase === 'running' && gameState.timeLeft === 0) {
      endGame()
    }
  }, [gameState.timeLeft, gameState.phase])

  // Auto-advance when wait completes
  useEffect(() => {
    if (waitLeft === 0) {
      setWaitLeft(null)
      setWaitType(null)
      if (gameState.currentNodeIndex + 1 >= TOTAL_LIGHTS) {
        finishGame()
      } else {
        // Move to next question
        const nextIdx = gameState.currentNodeIndex + 1
        if (gameState.questions[nextIdx]) {
          updateGameState({
            currentNodeIndex: nextIdx,
            currentQuestion: gameState.questions[nextIdx],
          })
        }
      }
    }
  }, [waitLeft])

  const startGame = (difficulty: DifficultyLevel) => {
    // Get questions from sections based on difficulty
    const allQuestions = sections
      .filter((s) => s.difficulty === difficulty)
      .flatMap((s) => s.questions)
      .slice(0, TOTAL_LIGHTS)

    // If not enough questions, duplicate them
    const questions = []
    for (let i = 0; i < TOTAL_LIGHTS; i++) {
      questions.push(allQuestions[i % allQuestions.length])
    }

    updateGameState({
      phase: 'running',
      selectedDifficulty: difficulty,
      questions,
      currentQuestion: questions[0],
      currentNodeIndex: 0,
      score: 0,
      timeLeft: DEADLINE_SEC,
    })
  }

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      updateGameState({ score: gameState.score + 1 })
      setWaitLeft(WAIT_CORRECT)
      setWaitType('correct')
    } else {
      updateGameState({ score: Math.max(0, gameState.score - 10) })
      setWaitLeft(WAIT_WRONG)
      setWaitType('wrong')
    }
    updateGameState({ currentQuestion: null })
  }

  const finishGame = () => {
    const bonus = gameState.timeLeft > 0 ? BASE_BONUS : 0
    updateGameState({
      phase: 'delivery',
      bonus,
      finalScore: gameState.score,
      timeTaken: DEADLINE_SEC - gameState.timeLeft,
    })
  }

  const endGame = () => {
    updateGameState({
      phase: 'finished',
      bonus: 0,
      finalScore: gameState.score,
      timeTaken: DEADLINE_SEC,
    })
  }

  const handlePlayAgain = () => {
    resetGame()
  }

  return (
    <div className="flex h-screen gap-4 p-4 bg-gradient-dark">
      {/* Left Panel */}
      <div className="w-[30%] flex flex-col gap-4">
        <LeftPanel
          gameState={gameState}
          onStartGame={startGame}
          onPlayAgain={handlePlayAgain}
          onAddTests={onAddTests}
        />
      </div>

      {/* Right Side - Game Area */}
      <div className="flex-1 flex flex-col gap-4">
        {gameState.phase === 'setup' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold neon-text mb-4">
                Kuryer Node O'yiniga Xush Kelibsiz
              </h1>
              <p className="text-lg text-gray-400 mb-8">
                Darajani tanlang va o'yin boshlang
              </p>
            </div>
          </div>
        )}

        {gameState.phase === 'running' && (
          <>
            <RoadAndCar
              currentNode={gameState.currentNodeIndex}
              totalNodes={TOTAL_LIGHTS}
            />
            {gameState.currentQuestion && !waitLeft && (
              <TrafficLightTestModal
                question={gameState.currentQuestion}
                onAnswer={handleAnswer}
              />
            )}
          </>
        )}

        {gameState.phase === 'delivery' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-gradient-card border border-brand-primary/50 rounded-3xl p-12 text-center max-w-md">
              <h2 className="text-4xl font-bold text-success mb-4">
                ✅ Yetkazib berish muvaffaq!
              </h2>
              <p className="text-2xl font-bold text-brand-primary mb-6">
                +{gameState.bonus.toLocaleString('uz-UZ')} so'm bonus
              </p>
              <p className="text-lg text-gray-300 mb-8">
                Siz {gameState.timeTaken} soniyada {TOTAL_LIGHTS} testdan o'tdingiz
              </p>
              <button
                onClick={handlePlayAgain}
                className="bg-gradient-primary hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                Yana o'yna
              </button>
            </div>
          </div>
        )}

        {gameState.phase === 'finished' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-gradient-card border border-error/50 rounded-3xl p-12 text-center max-w-md">
              <h2 className="text-4xl font-bold text-error mb-4">
                ❌ Vaqt tugadi!
              </h2>
              <p className="text-xl font-bold text-warning mb-4">
                Siz faqat {gameState.currentNodeIndex} ta svetafordan o'tdingiz
              </p>
              <p className="text-lg text-gray-300 mb-8">
                {gameState.score} ball to'pladingiz
              </p>
              <button
                onClick={handlePlayAgain}
                className="bg-gradient-primary hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                Qayta o'yna
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wait Card */}
      {waitLeft !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
          <div
            className={`bg-gradient-card border-2 rounded-3xl p-8 text-center ${
              waitType === 'correct'
                ? 'border-success'
                : 'border-error'
            }`}
          >
            <h3 className="text-2xl font-bold mb-4">
              {waitType === 'correct' ? '✅ To\'g\'ri!' : '❌ Xato!'}
            </h3>
            <p className="text-5xl font-bold text-brand-primary mb-2">
              {waitLeft}
            </p>
            <p className="text-sm text-gray-400">soniyani kuting...</p>
          </div>
        </div>
      )}
    </div>
  )
}
