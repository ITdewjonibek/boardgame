import { useMemo, useState } from 'react'
import { Play, RotateCcw, Settings2, Sparkles, Users } from 'lucide-react'
import QuizModal from '../../components/QuizModal'
import Toast from '../../components/Toast'
import QuestionStudio from '../../components/QuestionStudio'
import { useToast } from '../../components/useToast'
import type { Difficulty } from '../../data/games'
import { formatDifficulty, getQuestions, getSections, type MCQ } from '../../data/questions'
import styles from './SubjectQuiz.module.css'

type Phase = 'setup' | 'play' | 'end'

function keyToTopic(key: string) {
  if (key.includes('math')) return 'math'
  if (key.includes('physics')) return 'physics'
  if (key.includes('english')) return 'english'
  if (key.includes('bio')) return 'biology'
  if (key.includes('history')) return 'history'
  if (key.includes('chem')) return 'chemistry'
  if (key.includes('geography')) return 'geography'
  if (key.includes('it-')) return 'it'
  if (key.includes('literature')) return 'literature'
  if (key.includes('logic')) return 'logic'
  return 'math'
}

function topicLabel(topic: string) {
  return {
    math: 'Matematika', physics: 'Fizika', english: 'Ingliz tili', biology: 'Biologiya', history: 'Tarix',
    chemistry: 'Kimyo', geography: 'Geografiya', it: 'Informatika', literature: 'Adabiyot', logic: 'Mantiq',
  }[topic] || 'Quiz'
}

export default function SubjectQuiz({ gameKey }: { gameKey: string }) {
  const topic = useMemo(() => keyToTopic(gameKey), [gameKey])
  const label = useMemo(() => topicLabel(topic), [topic])
  const sections = useMemo(() => getSections(topic), [topic])

  const [phase, setPhase] = useState<Phase>('setup')
  const [mode, setMode] = useState<'SOLO' | 'TEAM'>('SOLO')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [count, setCount] = useState(10)
  const [section, setSection] = useState<string>(sections[0] || 'Asosiy')
  const [studioOpen, setStudioOpen] = useState(false)

  const [teamA, setTeamA] = useState('1-Jamoa')
  const [teamB, setTeamB] = useState('2-Jamoa')
  const [turn, setTurn] = useState<'A' | 'B'>('A')

  const [idx, setIdx] = useState(0)
  const [scoreA, setScoreA] = useState(0)
  const [scoreB, setScoreB] = useState(0)

  const { msg, toast } = useToast(2200)
  const pool = useMemo(() => getQuestions(topic, difficulty, 120, section), [topic, difficulty, section, studioOpen])
  const current = pool[idx % Math.max(pool.length, 1)] || null

  const start = () => {
    if (!pool.length) {
      toast('Bu bo‘limda savollar yo‘q. Test Studio orqali qo‘shing.')
      return
    }
    setPhase('play')
    setIdx(0)
    setScoreA(0)
    setScoreB(0)
    setTurn('A')
    toast('Quiz boshlandi ✅')
  }

  const reset = () => {
    setPhase('setup')
    setIdx(0)
    setScoreA(0)
    setScoreB(0)
    setTurn('A')
  }

  const onAnswer = ({ correct }: { correct: boolean }) => {
    if (correct) {
      if (mode === 'SOLO') setScoreA((s) => s + 1)
      else if (turn === 'A') setScoreA((s) => s + 1)
      else setScoreB((s) => s + 1)
      toast('To‘g‘ri ✅')
    } else toast('Xato ❌')

    const next = idx + 1
    if (mode === 'TEAM') setTurn((t) => (t === 'A' ? 'B' : 'A'))
    if (next >= count) return setPhase('end')
    setIdx(next)
  }

  return (
    <div className={styles.wrap}>
      <Toast msg={msg} />
      <QuestionStudio open={studioOpen} onClose={() => setStudioOpen(false)} topic={topic} topicLabel={label} />

      <div className={styles.card}>
        <div className={styles.head}>
          <div>
            <div className="pill"><Sparkles size={14} /> Premium Subject Arena</div>
            <div className={styles.title}>{label} Quiz Arena</div>
            <div className={styles.sub}>O‘qituvchi Test Studio orqali yangi bo‘lim va savollar qo‘sha oladi. Shu topic ga qo‘shilgan savollar darhol shu o‘yinda ishlaydi.</div>
          </div>
          <div className={styles.btnRow}>
            <button className={`btn secondary ${mode === 'SOLO' ? styles.active : ''}`} onClick={() => setMode('SOLO')}>SOLO</button>
            <button className={`btn secondary ${mode === 'TEAM' ? styles.active : ''}`} onClick={() => setMode('TEAM')}><Users size={16} /> TEAM</button>
            <button className="btn secondary" onClick={() => setStudioOpen(true)}><Settings2 size={16} /> Test Studio</button>
          </div>
        </div>

        <div className={styles.names}>
          <input className={styles.input} value={teamA} onChange={(e) => setTeamA(e.target.value)} placeholder="1-jamoa" />
          {mode === 'TEAM' && <input className={styles.input} value={teamB} onChange={(e) => setTeamB(e.target.value)} placeholder="2-jamoa" />}
        </div>

        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.blockTitle}>Bo‘limlar</div>
            <div className={styles.btnRow}>
              {sections.map((item) => (
                <button key={item} className={`btn secondary ${section === item ? styles.active : ''}`} onClick={() => setSection(item)}>{item}</button>
              ))}
            </div>
          </div>

          <div className={styles.block}>
            <div className={styles.blockTitle}>Daraja va soni</div>
            <div className={styles.btnRow}>
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((item) => (
                <button key={item} className={`btn secondary ${difficulty === item ? styles.active : ''}`} onClick={() => setDifficulty(item)}>{formatDifficulty(item)}</button>
              ))}
            </div>
            <div className={styles.btnRow} style={{ marginTop: 10 }}>
              {[10, 15, 20].map((n) => <button key={n} className={`btn secondary ${count === n ? styles.active : ''}`} onClick={() => setCount(n)}>{n} ta savol</button>)}
            </div>
          </div>
        </div>

        {phase !== 'play' ? (
          <div className={styles.btnRow} style={{ marginTop: 14 }}>
            <button className="btn" onClick={start}><Play size={16} /> Boshlash</button>
          </div>
        ) : (
          <div className={styles.top}>
            <span className="pill">Bo‘lim: {section}</span>
            <span className="pill">Navbat: {mode === 'TEAM' ? (turn === 'A' ? teamA : teamB) : 'SOLO'}</span>
            <span className="pill">Savol: {idx + 1}/{count}</span>
            <span className="pill">Score: {scoreA}{mode === 'TEAM' ? ` | ${scoreB}` : ''}</span>
          </div>
        )}

        {phase === 'play' && current && (
          <QuizModal open title={`${label} — ${section}`} question={current as MCQ} onAnswer={onAnswer} inline />
        )}

        {phase === 'end' && (
          <div className={styles.end}>
            <div className={styles.endCard}>
              <div className={styles.endTitle}>Yakuniy natija</div>
              <div className={styles.endText}>{mode === 'TEAM' ? `${teamA}: ${scoreA} | ${teamB}: ${scoreB}` : `${scoreA}/${count}`}</div>
              <div className={styles.btnRow} style={{ marginTop: 12 }}>
                <button className="btn" onClick={start}><Play size={16} /> Qayta boshlash</button>
                <button className="btn secondary" onClick={reset}><RotateCcw size={16} /> Setup</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
