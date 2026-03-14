import { useEffect, useMemo, useState } from 'react'
import { Play, Settings2, Sparkles, Timer } from 'lucide-react'
import Toast from '../../components/Toast'
import QuestionStudio from '../../components/QuestionStudio'
import { useToast } from '../../components/useToast'
import type { Difficulty } from '../../data/games'
import { formatDifficulty, getQuestions, getSections, type MCQ } from '../../data/questions'
import styles from './RopeBattle.module.css'

type Phase = 'setup' | 'play' | 'end'

function formatTime(sec: number) { const m = Math.floor(sec / 60); const s = sec % 60; return `${m}:${String(s).padStart(2, '0')}` }
function randomQ(pool: MCQ[]) { return pool[Math.floor(Math.random() * Math.max(pool.length, 1))] || null }

function Keypad({ value, onChange, onSubmit, color }: { value: string; onChange: (v: string) => void; onSubmit: () => void; color: 'blue' | 'red' }) {
  const add = (x: string) => onChange(value + x)
  const clear = () => onChange('')
  return (
    <div className={styles.keypad} data-color={color}>
      <input className={styles.input} value={value} onChange={(e) => onChange(e.target.value.replace(/[^0-9-]/g, ''))} placeholder="Javob..." />
      <div className={styles.keys}>{['1','2','3','4','5','6','7','8','9'].map((n)=><button key={n} className={styles.k} onClick={()=>add(n)}>{n}</button>)}<button className={`${styles.k} ${styles.danger}`} onClick={clear}>C</button><button className={styles.k} onClick={()=>add('0')}>0</button><button className={`${styles.k} ${styles.go}`} onClick={onSubmit}>Go</button></div>
    </div>
  )
}

export default function RopeBattle() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [section, setSection] = useState('Qo‘shish')
  const [studioOpen, setStudioOpen] = useState(false)
  const [teamA, setTeamA] = useState('1-Jamoa')
  const [teamB, setTeamB] = useState('2-Jamoa')
  const [time, setTime] = useState(5 * 60)
  const [scoreA, setScoreA] = useState(0)
  const [scoreB, setScoreB] = useState(0)
  const [rope, setRope] = useState(0)
  const [qA, setQA] = useState<MCQ | null>(null)
  const [qB, setQB] = useState<MCQ | null>(null)
  const [ansA, setAnsA] = useState('')
  const [ansB, setAnsB] = useState('')
  const { msg, toast } = useToast(2200)
  const sections = useMemo(() => getSections('rope'), [studioOpen])
  const pool = useMemo(() => getQuestions('rope', difficulty, 120, section), [difficulty, section, studioOpen])

  useEffect(() => { if(sections.length && !sections.includes(section)) setSection(sections[0]) }, [sections, section])
  useEffect(() => { if (phase !== 'play') return; const t = window.setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000); return () => window.clearInterval(t) }, [phase])
  useEffect(() => { if (phase === 'play' && (time <= 0 || Math.abs(rope) >= 5)) setPhase('end') }, [phase, time, rope])

  const start = () => { if(!pool.length) return toast('Bu bo‘limda savol yo‘q. Test Studio orqali qo‘shing.'); setPhase('play'); setTime(5*60); setScoreA(0); setScoreB(0); setRope(0); setQA(randomQ(pool)); setQB(randomQ(pool)); setAnsA(''); setAnsB('') }
  const reset = () => { setPhase('setup'); setTime(5*60); setScoreA(0); setScoreB(0); setRope(0); setAnsA(''); setAnsB('') }

  const checkAnswer = (side: 'A' | 'B') => {
    const q = side === 'A' ? qA : qB
    const ans = side === 'A' ? ansA : ansB
    if (!q) return
    const correctText = q.options[q.correctIndex]?.replace(/[^0-9-]/g, '')
    const ok = ans.trim() === correctText
    if (ok) {
      if (side === 'A') { setScoreA((s) => s + 1); setRope((r) => Math.max(r - 1, -5)); setQA(randomQ(pool)); setAnsA('') }
      else { setScoreB((s) => s + 1); setRope((r) => Math.min(r + 1, 5)); setQB(randomQ(pool)); setAnsB('') }
      toast(`${side === 'A' ? teamA : teamB}: to‘g‘ri! Arqon siljidi 🔥`)
    } else toast(`${side === 'A' ? teamA : teamB}: xato javob`)
  }

  return (
    <div className={styles.wrap}>
      <Toast msg={msg} />
      <QuestionStudio open={studioOpen} onClose={() => setStudioOpen(false)} topic="rope" topicLabel="Arqon Tortish" />
      <div className={styles.header}><div><div className="pill"><Sparkles size={14} /> Tug of War Premium</div><div className={styles.title}>Rasmli arqon tortish battle</div><div className={styles.sub}>Aylana olib tashlandi. Endi markazda bolalar rasmi bor. Qaysi jamoa to‘g‘ri javob bersa, arqon o‘sha tomonga siljiydi.</div></div><div className={styles.headerBtns}><button className="btn secondary" onClick={() => setStudioOpen(true)}><Settings2 size={16} /> Test Studio</button><button className="btn" onClick={phase === 'play' ? reset : start}><Play size={16} /> {phase === 'play' ? 'Reset' : 'Boshlash'}</button></div></div>
      <div className={styles.controlRow}>{(['easy','medium','hard'] as Difficulty[]).map((d)=><button key={d} className={`btn secondary ${difficulty===d?styles.active:''}`} onClick={()=>setDifficulty(d)}>{formatDifficulty(d)}</button>)}{sections.map((item)=><button key={item} className={`btn secondary ${section===item?styles.active:''}`} onClick={()=>setSection(item)}>{item}</button>)}<span className="pill"><Timer size={14} /> {formatTime(time)}</span></div>

      {phase === 'setup' ? (
        <div className={styles.setup}><input className={styles.nameInput} value={teamA} onChange={(e)=>setTeamA(e.target.value)} /><input className={styles.nameInput} value={teamB} onChange={(e)=>setTeamB(e.target.value)} /><div className={styles.setupText}>Boshlash tugmasini bosing — chap va o‘ng jamoa uchun alohida savollar chiqadi.</div></div>
      ) : (
        <div className={styles.playGrid}>
          <section className={styles.teamCard} data-color="blue"><div className={styles.qHeader}>{qA?.prompt || 'Savol...'}</div><Keypad value={ansA} onChange={setAnsA} onSubmit={() => checkAnswer('A')} color="blue" /><div className={styles.teamMeta}>{teamA}: {scoreA} ball</div></section>
          <section className={styles.arena}><div className={styles.timerPill}><Timer size={16} /> {formatTime(time)}</div><div className={styles.centerTitle}>Jamoaviy musobaqa</div><div className={styles.scoreRow}><span className={styles.bluePill}>{teamA}: {scoreA} ball</span><span className={styles.redPill}>{teamB}: {scoreB} ball</span></div><div className={styles.scene}><img src="/assets/rope-left.png" className={styles.leftKid} alt="left team" /><img src="/assets/rope-right.png" className={styles.rightKid} alt="right team" /><div className={styles.centerGuide} /><div className={styles.rope} /><div className={styles.knot} style={{ left: `calc(50% + ${rope * 8}%)` }} /></div><div className={styles.tip}>Arqonni tortish uchun savollarga to‘g‘ri javob bering!</div></section>
          <section className={styles.teamCard} data-color="red"><div className={`${styles.qHeader} ${styles.redHead}`}>{qB?.prompt || 'Savol...'}</div><Keypad value={ansB} onChange={setAnsB} onSubmit={() => checkAnswer('B')} color="red" /><div className={styles.teamMeta}>{teamB}: {scoreB} ball</div></section>
        </div>
      )}

      {phase === 'end' && <div className={styles.endBox}><div className={styles.endTitle}>{rope < 0 ? `${teamA} yutdi!` : rope > 0 ? `${teamB} yutdi!` : 'Durrang'}</div><div className={styles.endText}>{teamA}: {scoreA} | {teamB}: {scoreB}</div><button className="btn" onClick={start}>Yana o‘ynash</button></div>}
    </div>
  )
}
