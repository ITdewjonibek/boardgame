import { Plus } from 'lucide-react'
import type { GameState, DifficultyLevel } from '../types'

interface LeftPanelProps {
  gameState: GameState
  onStartGame: (difficulty: DifficultyLevel) => void
  onPlayAgain: () => void
  onAddTests: () => void
}

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  oson: 'Oson',
  orta: "O'rta",
  qiyin: 'Qiyin',
}

export default function LeftPanel({
  gameState,
  onStartGame,
  onPlayAgain,
  onAddTests,
}: LeftPanelProps) {
  return (
    <div className="h-full flex flex-col gap-4">
      {/* Add Tests Button */}
      <button
        onClick={onAddTests}
        className="w-full flex items-center justify-center gap-2 bg-gradient-primary hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition"
      >
        <Plus size={20} />
        <span>Testlar Qo'shish</span>
      </button>

      {/* Game Info */}
      <div className="card-dark flex-1 overflow-y-auto">
        <h2 className="text-xl font-bold neon-text mb-4">O'yin Axbori</h2>

        {gameState.phase === 'setup' && (
          <div className="space-y-3">
            <p className="text-gray-400 text-sm mb-4">Darajani tanlang:</p>
            {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => onStartGame(key as DifficultyLevel)}
                className="w-full py-2 px-3 bg-dark-border hover:bg-brand-primary/30 border border-brand-primary/50 rounded-lg text-white font-bold transition"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {gameState.phase === 'running' && (
          <div className="space-y-4">
            {/* Time */}
            <div className="bg-dark-bg p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Qolgan Vaqt</p>
              <p className="text-3xl font-bold neon-text">
                {gameState.timeLeft}
              </p>
              <p className="text-xs text-gray-500 mt-1">soniya</p>
            </div>

            {/* Score */}
            <div className="bg-dark-bg p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Ballar</p>
              <p className="text-3xl font-bold text-success">
                {gameState.score}
              </p>
              <p className="text-xs text-gray-500 mt-1">ta to'g'ri javob</p>
            </div>

            {/* Progress */}
            <div className="bg-dark-bg p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-2">Taraqqiyot</p>
              <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-300"
                  style={{
                    width: `${(gameState.currentNodeIndex / 20) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {gameState.currentNodeIndex} / 20 svetafor
              </p>
            </div>

            {/* Current Difficulty */}
            <div className="bg-dark-bg p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Darajasi</p>
              <p className="text-lg font-bold text-warning">
                {gameState.selectedDifficulty
                  ? DIFFICULTY_LABELS[gameState.selectedDifficulty]
                  : '-'}
              </p>
            </div>
          </div>
        )}

        {(gameState.phase === 'delivery' || gameState.phase === 'finished') && (
          <div className="space-y-4">
            <div className="bg-dark-bg p-4 rounded-lg text-center">
              <p className="text-gray-400 text-xs mb-2">Yakuniy Natija</p>
              <p
                className={`text-4xl font-bold ${
                  gameState.phase === 'delivery'
                    ? 'text-success'
                    : 'text-error'
                }`}
              >
                {gameState.score}
              </p>
            </div>

            {gameState.bonus > 0 && (
              <div className="bg-green-900/30 border border-success p-4 rounded-lg text-center">
                <p className="text-gray-300 text-xs mb-2">Bonus</p>
                <p className="text-2xl font-bold text-success">
                  +{gameState.bonus.toLocaleString('uz-UZ')}
                </p>
              </div>
            )}

            <button
              onClick={onPlayAgain}
              className="w-full py-2 px-3 bg-brand-primary hover:opacity-90 text-white font-bold rounded-lg transition"
            >
              Yana o'yna
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
