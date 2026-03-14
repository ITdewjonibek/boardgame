import { useEffect, useMemo, useState } from 'react'
import { Clock3, Flag, Play, RotateCcw, Settings2, Sparkles } from 'lucide-react'
import Toast from '../../components/Toast'
import QuestionStudio from '../../components/QuestionStudio'
import { useToast } from '../../components/useToast'
import type { Difficulty } from '../../data/games'
import { formatDifficulty, getQuestions, getSections, type MCQ } from '../../data/questions'
import styles from './CourierNode.module.css'

type Phase = 'setup' | 'play' | 'end'
const TOTAL_LIGHTS = 20

type SportsCarProps = { progress: number }
function SportsCar({ progress }: SportsCarProps) {
  return (
    <div className={styles.car} style={{ left: `calc(${Math.max(4, Math.min(progress, 92))}% - 54px)` }}>
      <svg viewBox="0 0 240 110" className={styles.carSvg}>
        <defs>
          <linearGradient id="carBody" x1="0" x2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="glass" x1="0" x2="1">
            <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <ellipse cx="120" cy="98" rx="90" ry="10" fill="rgba(0,0,0,.35)" />
        <path d="M25 70 C40 48, 64 35, 102 32 L166 30 C188 30, 206 42, 218 58 L228 70 L215 76 L26 76 Z" fill="url(#carBody)" stroke="rgba(255,255,255,.22)" strokeWidth="3" />
        <path d="M88 34 L158 34 C174 34 188 42 198 56 L120 56 C110 43 101 38 88 34Z" fill="url(#glass)" />
        <rect x="52" y="74" width="32" height="8" rx="4" fill="#60a5fa" opacity=".8" />
        <circle cx="72" cy="79" r="20" fill="#0f172a" stroke="#475569" strokeWidth="6" />
        <circle cx="175" cy="79" r="20" fill="#0f172a" stroke="#475569" strokeWidth="6" />
        <circle cx="72" cy="79" r="8" fill="#dbeafe" opacity=".9" />
        <circle cx="175" cy="79" r="8" fill="#dbeafe" opacity=".9" />
        <circle cx="208" cy="62" r="7" fill="#fb7185" opacity=".9" />
      </svg>
    </div>
  )
}

export default function CourierNode() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [section, setSection] = useState('Asosiy hisob')
  const [studioOpen, setStudioOpen] = useState(false)

  const [node, setNode] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(150)
  const [selected, setSelected] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const { msg, toast } = useToast(2200)
  const sections = useMemo(() => getSections('courier'), [studioOpen])
  const pool = useMemo(() => getQuestions('courier', difficulty, 80, section), [difficulty, section, studioOpen])
  const current = pool[node % Math.max(pool.length, 1)] || null

  useEffect(() => {
    if (sections.length && !sections.includes(section)) setSection(sections[0])
  }, [sections, section])

  useEffect(() => {
    if (phase !== 'play') return
    const t = window.setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (phase === 'play' && timeLeft <= 0) setPhase('end')
  }, [phase, timeLeft])

  const start = () => {
    if (!pool.length) return toast('Bu bo‘limda savollar yo‘q. Test Studio orqali qo‘shing.')
    setNode(0)
    setScore(0)
    setTimeLeft(150)
    setSelected(null)
    setShowFeedback(false)
    setPhase('play')
  }

  const submit = () => {
    if (!current || selected === null || phase !== 'play') return
    const correct = selected === current.correctIndex
    setShowFeedback(true)
    window.setTimeout(() => {
      if (correct) {
        setScore((s) => s + 10)
        setNode((n) => Math.min(n + 1, TOTAL_LIGHTS))
        toast('To‘g‘ri! Mashina oldinga yurdi 🚀')
      } else {
        setTimeLeft((t) => Math.max(0, t - 8))
        toast('Xato! 8 soniya ketdi ⏱️')
      }
      setSelected(null)
      setShowFeedback(false)
      setNode((n) => {
        if (n + (correct ? 1 : 0) >= TOTAL_LIGHTS) setPhase('end')
        return n
      })
    }, 520)
  }

  const reset = () => {
    setPhase('setup')
    setNode(0)
    setScore(0)
    setTimeLeft(150)
    setSelected(null)
    setShowFeedback(false)
  }

  const progress = (node / TOTAL_LIGHTS) * 88

  return (
    <div className={styles.page}>
      <Toast msg={msg} />
      <QuestionStudio open={studioOpen} onClose={() => setStudioOpen(false)} topic="courier" topicLabel="Yo‘l Quiz Poygasi" />

      <div className={styles.shell}>
        <section className={styles.sceneCard}>
          <div className={styles.heroTop}>
            <div>
              <div className="pill"><Sparkles size={14} /> Neon Road Quiz Race</div>
              <h2 className={styles.title}>Mashina yo‘lda, test yon panelda</h2>
              <p className={styles.sub}>Modal olib tashlandi. Endi ekran ikkiga bo‘lingan: chapda premium yo‘l va poyga, o‘ngda esa test boshqaruvi.</p>
            </div>
            <div className={styles.topBtns}>
              <button className="btn secondary" onClick={() => setStudioOpen(true)}><Settings2 size={16} /> Test Studio</button>
              <button className="btn secondary" onClick={reset}><RotateCcw size={16} /> Reset</button>
            </div>
          </div>

          <div className={styles.stats}>
            <span className="pill"><Clock3 size={14} /> {timeLeft}s</span>
            <span className="pill">Svetafor: {Math.min(node + 1, TOTAL_LIGHTS)}/{TOTAL_LIGHTS}</span>
            <span className="pill">Ball: {score}</span>
            <span className="pill"><Flag size={14} /> Finish: 20</span>
          </div>

          <div className={styles.scene}>
            <div className={styles.city} />
            <div className={styles.finish} />
            <div className={styles.road}>
              <div className={styles.roadGlow} />
              <div className={styles.centerLine} />
              <SportsCar progress={progress} />
            </div>
            <div className={styles.lightRow}>
              {Array.from({ length: TOTAL_LIGHTS }).map((_, i) => (
                <div key={i} className={`${styles.lightNode} ${i < node ? styles.done : ''} ${i === node ? styles.current : ''}`}>{i + 1}</div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.quizCard}>
          <div className={styles.quizHead}>
            <div>
              <div className={styles.quizTitle}>Test panel</div>
              <div className={styles.quizSub}>Poyga bilan bog‘langan savollar. To‘g‘ri javob = mashina yuradi.</div>
            </div>
            <button className="btn" onClick={phase === 'play' ? submit : start}><Play size={16} /> {phase === 'play' ? 'Tasdiqlash' : 'Boshlash'}</button>
          </div>

          <div className={styles.controls}>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((item) => (
              <button key={item} className={`btn secondary ${difficulty === item ? styles.active : ''}`} onClick={() => setDifficulty(item)} disabled={phase === 'play'}>{formatDifficulty(item)}</button>
            ))}
          </div>

          <div className={styles.sectionRow}>
            {sections.map((item) => (
              <button key={item} className={`btn secondary ${section === item ? styles.active : ''}`} onClick={() => setSection(item)} disabled={phase === 'play'}>{item}</button>
            ))}
          </div>

          {phase !== 'end' && current ? (
            <div className={styles.questionBox}>
              <div className={styles.qMeta}>Savol #{node + 1}</div>
              <div className={styles.prompt}>{current.prompt}</div>
              <div className={styles.options}>
                {current.options.map((option, idx) => {
                  const active = selected === idx
                  const correct = showFeedback && idx === current.correctIndex
                  const wrong = showFeedback && active && idx !== current.correctIndex
                  return (
                    <button key={idx} className={`${styles.option} ${active ? styles.optionActive : ''} ${correct ? styles.optionGood : ''} ${wrong ? styles.optionBad : ''}`} onClick={() => setSelected(idx)} disabled={showFeedback || phase !== 'play'}>
                      <span>{String.fromCharCode(65 + idx)}</span>
                      <b>{option}</b>
                    </button>
                  )
                })}
              </div>
              <div className={styles.hint}>{current.explanation || 'Variantni tanlang va tasdiqlang.'}</div>
            </div>
          ) : (
            <div className={styles.endBox}>
              <div className={styles.endTitle}>{timeLeft > 0 && node >= TOTAL_LIGHTS ? 'Yetkazib berildi!' : 'Run tugadi'}</div>
              <div className={styles.endText}>Yakuniy ball: {score}. {timeLeft > 0 && node >= TOTAL_LIGHTS ? 'Mashina finishga yetdi.' : 'Keyingi urinishda tezroq va aniqroq javob bering.'}</div>
              <button className="btn" onClick={start}><Play size={16} /> Yana boshlash</button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
