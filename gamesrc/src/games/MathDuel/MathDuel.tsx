import React, { useState, useMemo, useEffect } from 'react'
import { getQuestions } from '@/data/questions'
import { useToast } from '@/hooks/useToast'
import styles from './MathDuel.module.css'

interface MCQ {
  question: string
  options: string[]
  correct: number
}

export default function MathDuel() {
  const { showToast } = useToast()
  const [phase, setPhase] = useState<'setup' | 'duel' | 'finished'>('setup')
  const [team1, setTeam1] = useState('Team 1')
  const [team2, setTeam2] = useState('Team 2')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [score1, setScore1] = useState(0)
  const [score2, setScore2] = useState(0)
  const [roundsCompleted, setRoundsCompleted] = useState(0)
  const [maxRounds, setMaxRounds] = useState(5)
  const [timeLeft, setTimeLeft] = useState(30)
  const [currentQ, setCurrentQ] = useState<MCQ | null>(null)
  const [selectedA, setSelectedA] = useState<number | null>(null)
  const [selectedB, setSelectedB] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const qPool = useMemo(() => {
    return getQuestions('duel', difficulty, maxRounds)
  }, [difficulty, maxRounds])

  useEffect(() => {
    if (phase === 'duel' && roundsCompleted < maxRounds && qPool.length > roundsCompleted) {
      setCurrentQ(qPool[roundsCompleted] as MCQ)
      setTimeLeft(30)
      setSelectedA(null)
      setSelectedB(null)
      setAnswered(false)
    }
  }, [phase, roundsCompleted, maxRounds, qPool])

  useEffect(() => {
    if (phase !== 'duel' || answered) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleRoundEnd()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [phase, answered])

  const handleStart = () => {
    setPhase('duel')
    setScore1(0)
    setScore2(0)
    setRoundsCompleted(0)
  }

  const selectOption = (team: 'A' | 'B', optIdx: number) => {
    if (team === 'A' && selectedA === null) setSelectedA(optIdx)
    if (team === 'B' && selectedB === null) setSelectedB(optIdx)
  }

  const handleRoundEnd = () => {
    if (!currentQ) return
    setAnswered(true)

    const teamACorrect = selectedA === currentQ.correct
    const teamBCorrect = selectedB === currentQ.correct

    if (teamACorrect && !teamBCorrect) {
      setScore1(s => s + 1)
      showToast(`✓ ${team1} wins this round!`, 'success')
    } else if (teamBCorrect && !teamACorrect) {
      setScore2(s => s + 1)
      showToast(`✓ ${team2} wins this round!`, 'success')
    } else if (teamACorrect && teamBCorrect) {
      showToast('⚡ Both teams correct! Tie round', 'info')
    } else {
      showToast('✗ Both teams wrong', 'error')
    }

    setTimeout(() => {
      if (roundsCompleted + 1 >= maxRounds) {
        setPhase('finished')
      } else {
        setRoundsCompleted(r => r + 1)
      }
    }, 2000)
  }

  if (phase === 'setup') {
    return (
      <div className={styles.wrap}>
        <div className={styles.setupBox}>
          <h2 className={styles.setupTitle}>Math Duel</h2>
          <p className={styles.setupDesc}>
            Head-to-head math speed competition! Answer faster and more accurately than your opponent.
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
              Rounds: <strong>{maxRounds}</strong>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={maxRounds}
              onChange={e => setMaxRounds(+e.target.value)}
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
            START DUEL
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
            <div className={styles.finishTitle}>🏆 DUEL OVER</div>
            <div className={styles.finishWinner}>{winner} is the champion!</div>
            <div className={styles.stats}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>{team1}</div>
                <div className={styles.statValue}>{score1}</div>
                <div className={styles.statSub}>Rounds won</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>{team2}</div>
                <div className={styles.statValue}>{score2}</div>
                <div className={styles.statSub}>Rounds won</div>
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
        <div className={styles.roundInfo}>
          <span>Round {roundsCompleted + 1}/{maxRounds}</span>
          <span className={`${styles.timer} ${timeLeft < 10 ? styles.lowTime : ''}`}>
            ⏱ {timeLeft}s
          </span>
        </div>

        {currentQ && (
          <div className={styles.duelContainer}>
            <div className={styles.questionBox}>
              <p className={styles.question}>{currentQ.question}</p>
            </div>

            <div className={styles.teamsBox}>
              <div className={styles.teamSide}>
                <h3>{team1}</h3>
                <div className={styles.optionsGrid}>
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectOption('A', idx)}
                      disabled={answered || selectedA !== null}
                      className={`${styles.optionBtn} ${selectedA === idx ? styles.selected : ''} ${answered && idx === currentQ.correct ? styles.correct : ''} ${answered && selectedA === idx && idx !== currentQ.correct ? styles.wrong : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.vs}>VS</div>

              <div className={styles.teamSide}>
                <h3>{team2}</h3>
                <div className={styles.optionsGrid}>
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectOption('B', idx)}
                      disabled={answered || selectedB !== null}
                      className={`${styles.optionBtn} ${selectedB === idx ? styles.selected : ''} ${answered && idx === currentQ.correct ? styles.correct : ''} ${answered && selectedB === idx && idx !== currentQ.correct ? styles.wrong : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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
