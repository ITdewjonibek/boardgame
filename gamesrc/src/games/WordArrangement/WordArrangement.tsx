import React, { useState, useMemo, useCallback } from 'react'
import { getQuestions } from '@/data/questions'
import { useToast } from '@/hooks/useToast'
import styles from './WordArrangement.module.css'

interface MCQ {
  question: string
  options: string[]
  correct: number
  explanation?: string
}

interface WordQuestion {
  words: string[]
  correct: string[]
  hint?: string
}

export default function WordArrangement() {
  const { showToast } = useToast()
  const [phase, setPhase] = useState<'setup' | 'playing' | 'finished'>('setup')
  const [team1, setTeam1] = useState('Team 1')
  const [team2, setTeam2] = useState('Team 2')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [score1, setScore1] = useState(0)
  const [score2, setScore2] = useState(0)
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A')
  const [currentQIdx, setCurrentQIdx] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [answered, setAnswered] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizQ, setQuizQ] = useState<MCQ | null>(null)

  const wordPool = useMemo(() => {
    const qList = getQuestions('word', difficulty, 20)
    return qList as WordQuestion[]
  }, [difficulty])

  const currentQ = wordPool[currentQIdx]
  const shuffled = useMemo(() => {
    if (!currentQ) return []
    return [...currentQ.correct].sort(() => Math.random() - 0.5)
  }, [currentQ])

  const qPool = useMemo(() => {
    return getQuestions('arrangement', difficulty, 20)
  }, [difficulty])

  const handleStart = () => {
    setPhase('playing')
    setCurrentQIdx(0)
    setScore1(0)
    setScore2(0)
    setCurrentTeam('A')
    setAnswered(0)
  }

  const toggleWord = (idx: number) => {
    setSelected(s => {
      const n = [...s]
      const pos = n.indexOf(idx)
      if (pos >= 0) n.splice(pos, 1)
      else n.push(idx)
      return n
    })
  }

  const handleSubmit = () => {
    if (selected.length === 0) {
      showToast('Select words first', 'error')
      return
    }

    const arrangement = selected.map(i => shuffled[i]).join(' ')
    const isCorrect = arrangement === currentQ.correct.join(' ')

    if (isCorrect) {
      setScore1(s => currentTeam === 'A' ? s + 10 : s)
      setScore2(s => currentTeam === 'B' ? s + 10 : s)
      showToast('✓ Correct! +10 points', 'success')
    } else {
      showToast('✗ Wrong arrangement. Try again!', 'error')
    }

    setSelected([])
    if (currentQIdx < wordPool.length - 1) {
      setCurrentQIdx(c => c + 1)
      setCurrentTeam(t => t === 'A' ? 'B' : 'A')
    } else {
      setPhase('finished')
    }
  }

  if (phase === 'setup') {
    return (
      <div className={styles.wrap}>
        <div className={styles.setupBox}>
          <h2 className={styles.setupTitle}>Word Arrangement Game</h2>
          <p className={styles.setupDesc}>
            Players arrange scrambled words in correct order. Each correct arrangement earns 10 points!
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
            START GAME
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
            <div className={styles.finishTitle}>🏆 GAME OVER</div>
            <div className={styles.finishWinner}>{winner} wins!</div>
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
        <div className={styles.track}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,.6)' }}>
              Word {currentQIdx + 1}/{wordPool.length}
            </span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(100,200,255,.8)' }}>
              {currentTeam === 'A' ? team1 : team2}'s turn
            </span>
          </div>

          {currentQ && (
            <div className={styles.wordContainer}>
              <p className={styles.instructions}>Arrange the words in correct order:</p>
              <div className={styles.wordGrid}>
                {shuffled.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleWord(idx)}
                    className={`${styles.wordButton} ${selected.includes(idx) ? styles.selected : ''}`}
                  >
                    {word}
                  </button>
                ))}
              </div>

              {selected.length > 0 && (
                <div className={styles.selectedDisplay}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,.6)', marginBottom: '8px' }}>Your arrangement:</p>
                  <div className={styles.selectedWords}>
                    {selected.map((idx, i) => (
                      <span key={i} className={styles.selectedWord}>
                        {shuffled[idx]}
                        {i < selected.length - 1 ? <span style={{ marginLeft: '6px' }}>→</span> : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={selected.length === 0}
                style={{
                  marginTop: '16px',
                  padding: '10px 20px',
                  background: selected.length === 0 ? 'rgba(255,255,255,.1)' : 'linear-gradient(135deg, #64b5f6 0%, #4ade80 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: selected.length === 0 ? 'rgba(255,255,255,.4)' : '#000',
                  fontWeight: '900',
                  cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                Submit
              </button>
            </div>
          )}
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
    </div>
  )
}
