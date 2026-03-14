import React, { useState, useMemo } from 'react'
import { getQuestions } from '@/data/questions'
import { useToast } from '@/hooks/useToast'
import styles from './TreasureHunt.module.css'

interface MCQ {
  question: string
  options: string[]
  correct: number
}

type CellState = 'hidden' | 'treasure' | 'rock'

export default function TreasureHunt() {
  const { showToast } = useToast()
  const [phase, setPhase] = useState<'setup' | 'hunting' | 'finished'>('setup')
  const [team1, setTeam1] = useState('Team 1')
  const [team2, setTeam2] = useState('Team 2')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [gridSize, setGridSize] = useState(5)
  const [score1, setScore1] = useState(0)
  const [score2, setScore2] = useState(0)
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A')
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQ, setCurrentQ] = useState<MCQ | null>(null)
  const [selectedTreasureIdx, setSelectedTreasureIdx] = useState<number | null>(null)

  const qPool = useMemo(() => {
    return getQuestions('treasure', difficulty, gridSize * gridSize)
  }, [difficulty, gridSize])

  const totalCells = gridSize * gridSize
  const treasureCount = Math.floor(totalCells / 3)
  const treasureIndices = useMemo(() => {
    const indices = new Set<number>()
    while (indices.size < treasureCount) {
      indices.add(Math.floor(Math.random() * totalCells))
    }
    return indices
  }, [totalCells, treasureCount])

  const handleStart = () => {
    setPhase('hunting')
    setScore1(0)
    setScore2(0)
    setCurrentTeam('A')
    setRevealed(new Set())
  }

  const handleCellClick = (idx: number) => {
    if (revealed.has(idx)) return

    const isTreasure = treasureIndices.has(idx)

    if (isTreasure) {
      // Show question for this treasure
      setSelectedTreasureIdx(idx)
      if (qPool[idx]) {
        setCurrentQ(qPool[idx] as MCQ)
        setShowQuiz(true)
      }
    } else {
      // Rock penalty
      setRevealed(r => new Set(r).add(idx))
      showToast('✗ Rock! Next team', 'error')
      setCurrentTeam(t => t === 'A' ? 'B' : 'A')
    }
  }

  const handleAnswer = ({ correct }: { correct: boolean }) => {
    setShowQuiz(false)

    if (correct && selectedTreasureIdx !== null) {
      setRevealed(r => new Set(r).add(selectedTreasureIdx))
      if (currentTeam === 'A') {
        setScore1(s => s + 1)
      } else {
        setScore2(s => s + 1)
      }
      showToast('✓ Treasure found! +1', 'success')

      if (revealed.size + 1 >= treasureCount) {
        setTimeout(() => setPhase('finished'), 1500)
      }
    } else {
      if (selectedTreasureIdx !== null) {
        setRevealed(r => new Set(r).add(selectedTreasureIdx))
      }
      showToast('✗ Wrong answer', 'error')
      setCurrentTeam(t => t === 'A' ? 'B' : 'A')
    }

    setSelectedTreasureIdx(null)
  }

  if (phase === 'setup') {
    return (
      <div className={styles.wrap}>
        <div className={styles.setupBox}>
          <h2 className={styles.setupTitle}>Treasure Hunt</h2>
          <p className={styles.setupDesc}>
            Find hidden treasures in the grid! Answer questions to claim each treasure.
          </p>
          <div className={styles.teamInputs}>
            <input
              type="text"
              placeholder="Team 1 name"
              value={team1}
              onChange={e => setTeam1(e.target.value)}
              className={styles.teamInput}
            />
            <input
              type="text"
              placeholder="Team 2 name"
              value={team2}
              onChange={e => setTeam2(e.target.value)}
              className={styles.teamInput}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'rgba(255,255,255,.7)' }}>Difficulty:</p>
            <div className={styles.diffRow}>
              {(['easy', 'medium', 'hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  style={{
                    padding: '8px 16px',
                    background: difficulty === d ? 'rgba(100,200,255,.3)' : 'rgba(255,255,255,.08)',
                    border: `1px solid ${difficulty === d ? 'rgba(100,200,255,.5)' : 'rgba(255,255,255,.15)'}`,
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'rgba(255,255,255,.7)' }}>
              Grid Size: <strong>{gridSize}x{gridSize}</strong>
            </label>
            <input
              type="range"
              min="3"
              max="7"
              value={gridSize}
              onChange={e => setGridSize(+e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <button
            onClick={handleStart}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #64b5f6 0%, #4ade80 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#000',
              fontWeight: '900',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            START HUNT
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'finished') {
    const winner = score1 > score2 ? team1 : score2 > score1 ? team2 : 'Draw'
    return (
      <div className={styles.wrap}>
        <div className={styles.gameArea}>
          <div className={styles.finishBox}>
            <div className={styles.finishTitle}>🏆 HUNT COMPLETE</div>
            <div className={styles.finishWinner}>{winner} found more treasures!</div>
            <div className={styles.stats}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>{team1}</div>
                <div className={styles.statValue}>{score1}</div>
                <div className={styles.statSub}>Treasures</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>{team2}</div>
                <div className={styles.statValue}>{score2}</div>
                <div className={styles.statSub}>Treasures</div>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '10px 24px',
                background: 'rgba(100,200,255,.3)',
                border: '1px solid rgba(100,200,255,.5)',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.gameArea}>
        <div className={styles.header}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,.6)' }}>
            Treasures: {revealed.size}/{treasureCount}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(100,200,255,.8)' }}>
            {currentTeam === 'A' ? team1 : team2}'s turn
          </span>
        </div>

        <div className={styles.gridContainer}>
          <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
            {Array.from({ length: totalCells }).map((_, idx) => {
              const isRevealed = revealed.has(idx)
              const isTreasure = treasureIndices.has(idx)
              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  disabled={isRevealed}
                  className={`${styles.cell} ${isRevealed ? (isTreasure ? styles.treasure : styles.rock) : ''}`}
                >
                  {!isRevealed && '?'}
                  {isRevealed && isTreasure && '💎'}
                  {isRevealed && !isTreasure && '🪨'}
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>{team1}</div>
            <div className={styles.statValue}>{score1}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>{team2}</div>
            <div className={styles.statValue}>{score2}</div>
          </div>
        </div>
      </div>

      {showQuiz && currentQ && (
        <div className={styles.quizOverlay}>
          <div className={styles.quizCard}>
            <h3 className={styles.quizTitle}>Answer to claim treasure!</h3>
            <p className={styles.quizQuestion}>{currentQ.question}</p>
            <div className={styles.quizOptions}>
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer({ correct: idx === currentQ.correct })}
                  className={styles.quizOptionBtn}
                >
                  <span className={styles.optionLetter}>{String.fromCharCode(65 + idx)}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
