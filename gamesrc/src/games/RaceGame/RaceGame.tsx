import { useEffect, useMemo, useState } from 'react';
import { Flag, Play, RotateCcw } from 'lucide-react'
import Toast from '../../components/Toast'
import { useToast } from '../../components/useToast'
import type { Difficulty } from '../../data/games'
import { formatDifficulty, getQuestions, type MCQ } from '../../data/questions'
import styles from './RaceGame.module.css'

type Phase = 'setup' | 'racing' | 'finished'

const TRACK_LENGTH = 100

export default function RaceGame() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [team1, setTeam1] = useState('1-Jamoa')
  const [team2, setTeam2] = useState('2-Jamoa')

  const [pos1, setPos1] = useState(0)
  const [pos2, setPos2] = useState(0)
  const [score1, setScore1] = useState(0)
  const [score2, setScore2] = useState(0)
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A')

  const [currentQ, setCurrentQ] = useState<MCQ | null>(null)
  const [quizOpen, setQuizOpen] = useState(false)

  const { msg, toast } = useToast()
  const pool = useMemo(() => getQuestions('race', difficulty, 60), [difficulty])

  const start = () => {
    setPhase('racing')
    setPos1(0)
    setPos2(0)
    setScore1(0)
    setScore2(0)
    setCurrentTeam('A')
    const q = pool[0] || null
    setCurrentQ(q)
    setQuizOpen(true)
    toast('🏎️ Poyga boshlandi! Test javob ber, mashina yugurib ketadi!')
  }

  const answer = ({ correct }: { correct: boolean }) => {
    setQuizOpen(false)

    if (correct) {
      if (currentTeam === 'A') {
        setPos1((p) => Math.min(TRACK_LENGTH, p + 15))
        setScore1((s) => s + 1)
      } else {
        setPos2((p) => Math.min(TRACK_LENGTH, p + 15))
        setScore2((s) => s + 1)
      }
      toast(`${currentTeam === 'A' ? team1 : team2}: To'g'ri! +15m 🚗`)
    } else {
      toast(`${currentTeam === 'A' ? team1 : team2}: Xato… 0m ❌`)
    }

    const nextTeam: 'A' | 'B' = currentTeam === 'A' ? 'B' : 'A'
    setCurrentTeam(nextTeam)
    const nextPos = nextTeam === 'A' ? pos1 : pos2

    if (nextPos >= TRACK_LENGTH) {
      setTimeout(() => setPhase('finished'), 500)
    } else {
      const newQ = pool[(Math.random() * pool.length) | 0] || null
      setCurrentQ(newQ)
      setQuizOpen(true)
    }
  }

  const reset = () => {
    setPhase('setup')
    setPos1(0)
    setPos2(0)
    setScore1(0)
    setScore2(0)
    setCurrentTeam('A')
  }

  return (
    <div className={styles.wrap}>
      <Toast msg={msg} />

      <div className={styles.container}>
        {phase === 'setup' && (
          <div className={styles.setupBox}>
            <div className={styles.setupTitle}>🏎️ Poyga O'yini</div>
            <div className={styles.setupDesc}>
              Jamoa ravshan to'g'ri savollarga javob berib, mashinasini 100m yugurib chiqishi kerak!
            </div>
            <div className={styles.teamInputs}>
              <input
                className={styles.teamInput}
                placeholder="1-Jamoa"
                value={team1}
                onChange={(e) => setTeam1(e.target.value)}
              />
              <input
                className={styles.teamInput}
                placeholder="2-Jamoa"
                value={team2}
                onChange={(e) => setTeam2(e.target.value)}
              />
            </div>
            <div className={styles.diffRow}>
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  className={`btn secondary ${difficulty === d ? styles.active : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  {formatDifficulty(d)}
                </button>
              ))}
            </div>
            <button className="btn" style={{ width: '100%', marginTop: 16 }} onClick={start}>
              <Play size={18} /> START POYGA
            </button>
          </div>
        )}

        {(phase === 'racing' || phase === 'finished') && (
          <div className={styles.gameArea}>
            <div className={styles.track}>
              {/* Lane 1 */}
              <div className={styles.lane}>
                <div className={styles.finish} />
                <svg className={styles.car} style={{ left: `${(pos1 / TRACK_LENGTH) * 95}%` }}>
                  <rect x="0" y="0" width="40" height="20" fill="#3b82f6" rx="4" />
                  <circle cx="8" cy="22" r="4" fill="#333" />
                  <circle cx="30" cy="22" r="4" fill="#333" />
                  <rect x="4" y="2" width="10" height="6" fill="#87ceeb" />
                </svg>
                <div className={styles.laneLabel}>{team1}</div>
              </div>

              {/* Lane 2 */}
              <div className={styles.lane}>
                <div className={styles.finish} />
                <svg className={styles.car} style={{ left: `${(pos2 / TRACK_LENGTH) * 95}%` }}>
                  <rect x="0" y="0" width="40" height="20" fill="#a855f7" rx="4" />
                  <circle cx="8" cy="22" r="4" fill="#333" />
                  <circle cx="30" cy="22" r="4" fill="#333" />
                  <rect x="4" y="2" width="10" height="6" fill="#87ceeb" />
                </svg>
                <div className={styles.laneLabel}>{team2}</div>
              </div>
            </div>

            <div className={styles.stats}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>{team1}</div>
                <div className={styles.statValue}>{pos1}m</div>
                <div className={styles.statSub}>{score1} to'g'ri</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>{team2}</div>
                <div className={styles.statValue}>{pos2}m</div>
                <div className={styles.statSub}>{score2} to'g'ri</div>
              </div>
            </div>

            {phase === 'finished' && (
              <div className={styles.finishBox}>
                <div className={styles.finishTitle}>
                  <Flag size={24} /> YAKUNIY NATIJA
                </div>
                <div className={styles.finishWinner}>
                  {pos1 > pos2 ? team1 : pos2 > pos1 ? team2 : 'DURRANG!'} YUTDI! 🎉
                </div>
                <button className="btn" style={{ marginTop: 12 }} onClick={reset}>
                  Yana o'ynash
                </button>
              </div>
            )}
          </div>
        )}

        {quizOpen && currentQ && (
          <div className={styles.quizOverlay}>
            <div className={styles.quizCard}>
              <div className={styles.quizTitle}>
                {currentTeam === 'A' ? team1 : team2} — Test
              </div>
              <div className={styles.quizQuestion}>{currentQ.prompt}</div>
              <div className={styles.quizOptions}>
                {currentQ.options.map((opt, i) => {
                  const correct = i === currentQ.correctIndex
                  return (
                    <button
                      key={i}
                      className={styles.quizOptionBtn}
                      onClick={() => answer({ correct })}
                    >
                      <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
