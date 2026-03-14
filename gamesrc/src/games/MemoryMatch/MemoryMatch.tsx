import React, { useState, useMemo, useEffect } from 'react'
import { getQuestions } from '@/data/questions'
import { useToast } from '@/hooks/useToast'
import styles from './MemoryMatch.module.css'

interface MCQ {
  question: string
  options: string[]
  correct: number
}

export default function MemoryMatch() {
  const { showToast } = useToast()
  const [phase, setPhase] = useState<'setup' | 'matching' | 'finished'>('setup')
  const [team1, setTeam1] = useState('Team 1')
  const [team2, setTeam2] = useState('Team 2')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [pairCount, setPairCount] = useState(6)
  const [score1, setScore1] = useState(0)
  const [score2, setScore2] = useState(0)
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A')
  const [flipped, setFlipped] = useState<Set<number>>(new Set())
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [firstCard, setFirstCard] = useState<number | null>(null)
  const [disabled, setDisabled] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQ, setCurrentQ] = useState<MCQ | null>(null)
  const [selectedPairIdx, setSelectedPairIdx] = useState<number | null>(null)

  const qPool = useMemo(() => {
    return getQuestions('memory', difficulty, pairCount)
  }, [difficulty, pairCount])

  const totalCards = pairCount * 2

  const cardPairs = useMemo(() => {
    const pairs: { question: string; answer: string }[] = []
    for (let i = 0; i < pairCount; i++) {
      if (qPool[i]) {
        const q = qPool[i] as MCQ
        pairs.push({
          question: q.question.substring(0, 20) + '...',
          answer: q.options[q.correct],
        })
      }
    }
    const shuffled = [...pairs, ...pairs]
    return shuffled.sort(() => Math.random() - 0.5)
  }, [qPool, pairCount])

  const handleStart = () => {
    setPhase('matching')
    setScore1(0)
    setScore2(0)
    setCurrentTeam('A')
    setFlipped(new Set())
    setMatched(new Set())
    setFirstCard(null)
  }

  const getPairIndex = (cardIdx: number) => {
    // Group pairs: 0-1 are pair 0, 2-3 are pair 1, etc.
    return Math.floor(cardIdx / 2)
  }

  const handleCardFlip = (idx: number) => {
    if (matched.has(idx) || flipped.has(idx) || disabled) return

    const newFlipped = new Set(flipped)
    newFlipped.add(idx)
    setFlipped(newFlipped)

    if (firstCard === null) {
      setFirstCard(idx)
    } else {
      setDisabled(true)

      const firstPair = getPairIndex(firstCard)
      const secondPair = getPairIndex(idx)

      if (firstPair === secondPair) {
        // Match found!
        setMatched(m => new Set([...m, firstCard, idx]))
        if (currentTeam === 'A') {
          setScore1(s => s + 1)
        } else {
          setScore2(s => s + 1)
        }
        showToast('✓ Match found! +1', 'success')

        if (matched.size + 2 >= totalCards) {
          setTimeout(() => setPhase('finished'), 1500)
        }

        setFlipped(new Set())
        setFirstCard(null)
        setDisabled(false)
      } else {
        // No match - show quiz
        setSelectedPairIdx(firstPair)
        if (qPool[firstPair]) {
          setCurrentQ(qPool[firstPair] as MCQ)
          setShowQuiz(true)
        }
      }
    }
  }

  const handleAnswer = ({ correct }: { correct: boolean }) => {
    setShowQuiz(false)

    if (correct) {
      if (selectedPairIdx !== null) {
        setMatched(m => new Set([...m, firstCard, ...Array.from(flipped).filter(f => f !== firstCard)]))
      }
      if (currentTeam === 'A') {
        setScore1(s => s + 1)
      } else {
        setScore2(s => s + 1)
      }
      showToast('✓ Correct! Keep your turn', 'success')
    } else {
      showToast('✗ Wrong answer. Next team', 'error')
      setCurrentTeam(t => t === 'A' ? 'B' : 'A')
    }

    setFlipped(new Set())
    setFirstCard(null)
    setDisabled(false)
    setSelectedPairIdx(null)
  }

  if (phase === 'setup') {
    return (
      <div className={styles.wrap}>
        <div className={styles.setupBox}>
          <h2 className={styles.setupTitle}>Memory Match</h2>
          <p className={styles.setupDesc}>
            Find matching pairs! Answer questions when you don't match to keep your turn.
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
              Pairs: <strong>{pairCount}</strong>
            </label>
            <input
              type="range"
              min="4"
              max="10"
              value={pairCount}
              onChange={e => setPairCount(+e.target.value)}
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
            START MATCHING
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
            <div className={styles.finishTitle}>🏆 MEMORY CHAMPION</div>
            <div className={styles.finishWinner}>{winner} found more pairs!</div>
            <div className={styles.stats}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>{team1}</div>
                <div className={styles.statValue}>{score1}</div>
                <div className={styles.statSub}>Pairs</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>{team2}</div>
                <div className={styles.statValue}>{score2}</div>
                <div className={styles.statSub}>Pairs</div>
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
            Pairs found: {matched.size / 2}/{pairCount}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(100,200,255,.8)' }}>
            {currentTeam === 'A' ? team1 : team2}'s turn
          </span>
        </div>

        <div className={styles.cardGrid}>
          {cardPairs.map((card, idx) => (
            <button
              key={idx}
              onClick={() => handleCardFlip(idx)}
              disabled={matched.has(idx)}
              className={`${styles.card} ${flipped.has(idx) ? styles.flipped : ''} ${matched.has(idx) ? styles.matchedCard : ''}`}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>?</div>
                <div className={styles.cardBack}>
                  <span className={styles.cardText}>{card.answer.substring(0, 8)}</span>
                </div>
              </div>
            </button>
          ))}
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
            <h3 className={styles.quizTitle}>Answer to keep your turn!</h3>
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
