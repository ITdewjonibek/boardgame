import { useMemo, useState } from 'react'
import { Coins, Dice5, Settings2, Sparkles, Ticket, Users } from 'lucide-react'
import Toast from '../../components/Toast'
import QuestionStudio from '../../components/QuestionStudio'
import { useToast } from '../../components/useToast'
import type { Difficulty } from '../../data/games'
import { formatDifficulty, getQuestions, getSections, type MCQ } from '../../data/questions'
import styles from './LuckyTicket.module.css'

const TOTAL = 15
const MONEY_PER_POINT = 1000

export default function LuckyTicket() {
  const [mode, setMode] = useState<'SOLO' | 'TEAM'>('SOLO')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [section, setSection] = useState('Asosiy')
  const [studioOpen, setStudioOpen] = useState(false)
  const [opened, setOpened] = useState<boolean[]>(() => Array.from({ length: TOTAL }, () => false))
  const [currentIdx, setCurrentIdx] = useState<number | null>(null)
  const [question, setQuestion] = useState<MCQ | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState(false)
  const [pointsA, setPointsA] = useState(0)
  const [pointsB, setPointsB] = useState(0)
  const [turn, setTurn] = useState<'A' | 'B'>('A')
  const { msg, toast } = useToast(2200)
  const sections = useMemo(() => getSections('ticket'), [studioOpen])
  const pool = useMemo(() => getQuestions('ticket', difficulty, 80, section), [difficulty, section, studioOpen])

  const reset = () => {
    setOpened(Array.from({ length: TOTAL }, () => false)); setCurrentIdx(null); setQuestion(null); setSelected(null); setFeedback(false); setPointsA(0); setPointsB(0); setTurn('A'); toast('Yangi chipta sessiyasi ✅')
  }

  const pickRandom = () => {
    const remaining = opened.map((x, i) => (!x ? i : -1)).filter((i) => i >= 0)
    if (!remaining.length) return toast('Hammasi ochildi!')
    const idx = remaining[Math.floor(Math.random() * remaining.length)]
    setCurrentIdx(idx)
    setQuestion(pool[(idx * 5) % Math.max(pool.length, 1)] || null)
    setSelected(null)
    setFeedback(false)
  }

  const submit = () => {
    if (!question || currentIdx === null || selected === null) return
    const correct = selected === question.correctIndex
    setFeedback(true)
    window.setTimeout(() => {
      setOpened((o) => o.map((item, i) => i === currentIdx ? true : item))
      if (correct) {
        if (mode === 'SOLO' || turn === 'A') setPointsA((p) => p + 10)
        else setPointsB((p) => p + 10)
        toast('To‘g‘ri! +10 ball = 10 000 so‘m 💸')
      } else toast('Xato… bu chipta pul bermadi')
      if (mode === 'TEAM') setTurn((t) => t === 'A' ? 'B' : 'A')
      setSelected(null)
      setFeedback(false)
    }, 520)
  }

  const done = opened.every(Boolean)
  return (
    <div className={styles.wrap}>
      <Toast msg={msg} />
      <QuestionStudio open={studioOpen} onClose={() => setStudioOpen(false)} topic="ticket" topicLabel="Omadli Chipta" />

      <div className={styles.hero}>
        <div>
          <div className="pill"><Sparkles size={14} /> Lucky Ticket Deluxe</div>
          <div className={styles.title}>Premium chipta tanlash sahnasi</div>
          <div className={styles.sub}>Random tugma endi premium ko‘rinishda. Bosilganda katta ekranda raqam chiqadi va aynan shu raqamga mos test o‘ng panelda ochiladi.</div>
        </div>
        <div className={styles.controls}><button className={`btn secondary ${mode === 'SOLO' ? styles.active : ''}`} onClick={() => setMode('SOLO')}>SOLO</button><button className={`btn secondary ${mode === 'TEAM' ? styles.active : ''}`} onClick={() => setMode('TEAM')}><Users size={16} /> TEAM</button><button className="btn secondary" onClick={() => setStudioOpen(true)}><Settings2 size={16} /> Test Studio</button></div>
      </div>

      <div className={styles.grid}>
        <section className={styles.leftCard}>
          <div className={styles.topRow}>
            <div className={styles.moneyBox}>
              <div className={styles.moneyHead}><span className="pill"><Coins size={14} /> Ball → Pul</span><span className="pill">Daraja: {formatDifficulty(difficulty)}</span></div>
              <div className={styles.moneyGrid}><div className={styles.moneyCard}><div className={styles.teamLabel}>{mode === 'TEAM' ? '1-Jamoa' : 'Siz'}</div><div className={styles.points}>{pointsA} ball</div><div className={styles.money}>{(pointsA * MONEY_PER_POINT).toLocaleString('uz-UZ')} so‘m</div><div className={styles.turn}>{mode === 'TEAM' ? `Navbat: ${turn === 'A' ? '1-jamoa' : '2-jamoa'}` : 'Solo rejim'}</div></div>{mode === 'TEAM' && <div className={styles.moneyCard2}><div className={styles.teamLabel}>2-Jamoa</div><div className={styles.points}>{pointsB} ball</div><div className={styles.money}>{(pointsB * MONEY_PER_POINT).toLocaleString('uz-UZ')} so‘m</div></div>}</div>
              <div className={styles.diffRow}>{(['easy','medium','hard'] as Difficulty[]).map((d)=><button key={d} className={`btn secondary ${difficulty===d?styles.active:''}`} onClick={()=>setDifficulty(d)}>{formatDifficulty(d)}</button>)}</div>
              <div className={styles.diffRow}>{sections.map((item)=><button key={item} className={`btn secondary ${section===item?styles.active:''}`} onClick={()=>setSection(item)}>{item}</button>)}</div>
            </div>

            <div className={styles.actionBox}>
              <div className={styles.actionTitle}>Random tanlash</div>
              <div className={styles.actionSub}>15 ta chipta ichidan bittasi tanlanadi. Har chipta 1 marta ishlatiladi.</div>
              <button className={styles.randomBtn} onClick={pickRandom} disabled={done}><Dice5 size={20} /> {done ? 'Hammasi ochildi' : 'Random chipta'}</button>
              <div className={styles.small}>Qolgan: {opened.filter((x) => !x).length}/{TOTAL}</div>
            </div>
          </div>

          <div className={styles.featuredTicket}>
            <div className={styles.featureInner}>
              <div className={styles.featureLabel}><Ticket size={16} /> Tanlangan chipta</div>
              <div className={styles.featureNumber}>{currentIdx !== null ? currentIdx + 1 : '--'}</div>
              <div className={styles.featureText}>{currentIdx !== null ? `Chipta #${currentIdx + 1} ochildi` : 'Random tugmani bosing'}</div>
            </div>
          </div>

          <div className={styles.ticketGrid}>{Array.from({ length: TOTAL }).map((_, i) => { const isOpen = opened[i]; const isCur = i === currentIdx; return <button key={i} className={`${styles.ticket} ${isOpen ? styles.open : ''} ${isCur ? styles.cur : ''}`} onClick={() => { setCurrentIdx(i); setQuestion(pool[(i * 5) % Math.max(pool.length, 1)] || null); setSelected(null); setFeedback(false) }}><div className={styles.num}>{i + 1}</div><div className={styles.tag}>{isOpen ? 'OCHILGAN' : 'CHIPTA'}</div></button> })}</div>
        </section>

        <section className={styles.rightCard}>
          <div className={styles.rightTitle}>Chipta testi</div>
          <div className={styles.rightSub}>Chiqqan raqam shu yerdagi savol bilan bog‘langan bo‘ladi.</div>
          {!question ? <div className={styles.blank}>Random bosilganda yoki chipta tanlanganda test chiqadi.</div> : <div className={styles.questionBox}><div className="pill">Chipta #{(currentIdx ?? 0) + 1}</div><div className={styles.prompt}>{question.prompt}</div><div className={styles.options}>{question.options.map((option, idx)=>{ const active=selected===idx; const correct=feedback && idx===question.correctIndex; const wrong=feedback && active && idx!==question.correctIndex; return <button key={idx} className={`${styles.option} ${active?styles.optionActive:''} ${correct?styles.optionGood:''} ${wrong?styles.optionBad:''}`} onClick={()=>setSelected(idx)} disabled={feedback}><span>{String.fromCharCode(65+idx)}</span><b>{option}</b></button> })}</div><button className="btn" style={{ width:'100%', marginTop: 12 }} onClick={submit}>Tasdiqlash</button></div>}
        </section>
      </div>
    </div>
  )
}
