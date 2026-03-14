import { useEffect, useMemo, useRef, useState } from 'react'
import { Dice6, ListChecks, RotateCw, Settings2, Sparkles } from 'lucide-react'
import Toast from '../../components/Toast'
import QuestionStudio from '../../components/QuestionStudio'
import { useToast } from '../../components/useToast'
import type { Difficulty } from '../../data/games'
import { formatDifficulty, getQuestions, getSections, type MCQ } from '../../data/questions'
import styles from './LuckyWheel.module.css'

const N = 30
function drawWheel(ctx: CanvasRenderingContext2D, size: number, rotationRad: number) {
  const r = size / 2
  ctx.clearRect(0, 0, size, size)
  ctx.save(); ctx.translate(r, r); ctx.rotate(rotationRad)
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * Math.PI * 2; const a1 = ((i + 1) / N) * Math.PI * 2; const hue = (i * 360) / N
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 8, a0, a1); ctx.closePath(); ctx.fillStyle = `hsla(${hue}, 90%, 56%, 0.96)`; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.20)'; ctx.lineWidth = 2; ctx.stroke()
    const mid = (a0 + a1) / 2
    ctx.save(); ctx.rotate(mid); ctx.translate(r * 0.72, 0); ctx.rotate(Math.PI / 2); ctx.fillStyle = 'rgba(0,0,0,0.78)'; ctx.font = '800 18px ui-sans-serif, system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(i + 1), 0, 0); ctx.restore()
  }
  ctx.beginPath(); ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2); ctx.fillStyle = 'rgba(10,12,24,0.9)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.font = '900 14px ui-sans-serif, system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('SPIN', 0, 0); ctx.restore()
}

export default function LuckyWheel() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [section, setSection] = useState('Asosiy')
  const [studioOpen, setStudioOpen] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [answered, setAnswered] = useState<Set<number>>(() => new Set())
  const [question, setQuestion] = useState<MCQ | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState(false)
  const { msg, toast } = useToast(2200)
  const sections = useMemo(() => getSections('wheel'), [studioOpen])
  const pool = useMemo(() => getQuestions('wheel', difficulty, 120, section), [difficulty, section, studioOpen])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => { const canvas = canvasRef.current; if(!canvas) return; const ctx = canvas.getContext('2d'); if(!ctx) return; const dpr = window.devicePixelRatio || 1; const size = 420; canvas.width = size * dpr; canvas.height = size * dpr; canvas.style.width = size + 'px'; canvas.style.height = size + 'px'; ctx.scale(dpr, dpr); drawWheel(ctx, size, rotation * Math.PI * 2) }, [rotation])

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    const extra = 4 + Math.random() * 4
    const endRot = rotation + extra
    const start = performance.now(); const dur = 2600; const from = rotation; const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const raf = (now: number) => {
      const p = Math.min(1, (now - start) / dur); const v = from + (endRot - from) * ease(p); setRotation(v)
      if (p < 1) requestAnimationFrame(raf)
      else {
        setSpinning(false)
        const turn = v % 1; const angle = (1 - turn) * Math.PI * 2; const normalized = (angle + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2); const idx = Math.floor((normalized / (Math.PI * 2)) * N); const number = idx + 1
        setPicked(number)
        setQuestion(pool[(number * 7) % Math.max(pool.length, 1)] || null)
        setSelected(null)
        setFeedback(false)
        toast(`Baraban: ${number} raqam tushdi!`)
      }
    }
    requestAnimationFrame(raf)
  }

  const submit = () => {
    if (!question || !picked || selected === null) return
    const correct = selected === question.correctIndex
    setFeedback(true)
    window.setTimeout(() => {
      if (correct) { toast(`To‘g‘ri ✅ #${picked} yopildi`); setAnswered((s) => new Set([...Array.from(s), picked])) }
      else toast(`Xato ❌ #${picked} keyin yana tushishi mumkin`)
      setSelected(null)
      setFeedback(false)
    }, 520)
  }

  const reset = () => { setAnswered(new Set()); setPicked(null); setQuestion(null); setRotation(0); setSelected(null); setFeedback(false); toast('Yangi baraban sessiyasi 🎯') }

  return (
    <div className={styles.wrap}>
      <Toast msg={msg} />
      <QuestionStudio open={studioOpen} onClose={() => setStudioOpen(false)} topic="wheel" topicLabel="Omadli Baraban" />
      <div className={styles.grid}>
        <section className={styles.left}>
          <div className={styles.card}>
            <div className={styles.head}><div><div className="pill"><Sparkles size={14} /> Lucky Wheel Ultra</div><div className={styles.title}>Aniq spin, premium start tugmasi</div><div className={styles.sub}>Tushgan raqam va savol endi to‘liq bog‘langan. Start tugmasi va raqam paneli qayta ishlangan.</div></div><div className={styles.topBtns}><button className="btn secondary" onClick={() => setStudioOpen(true)}><Settings2 size={16} /> Test Studio</button><button className="btn secondary" onClick={reset}><RotateCw size={16} /> Reset</button></div></div>
            <div className={styles.diffRow}>{(['easy', 'medium', 'hard'] as Difficulty[]).map((d)=><button key={d} className={`btn secondary ${difficulty===d?styles.active:''}`} onClick={()=>setDifficulty(d)}>{formatDifficulty(d)}</button>)}<span className="pill"><ListChecks size={14} /> Yopilgan: {answered.size}/{N}</span></div>
            <div className={styles.diffRow}>{sections.map((item)=><button key={item} className={`btn secondary ${section===item?styles.active:''}`} onClick={()=>setSection(item)}>{item}</button>)}</div>
            <div className={styles.wheelWrap}><div className={styles.pointer} /><canvas ref={canvasRef} /><div className={styles.ring} /></div>
            <button className={styles.startBtn} onClick={spin} disabled={spinning}><Dice6 size={18} /> {spinning ? 'Aylanmoqda...' : 'START SPIN'}</button>
          </div>
        </section>
        <section className={styles.right}><div className={styles.side}><div className={styles.sideTitle}>Raqamlar paneli</div><div className={styles.sideSub}>Barabandan tushgan raqam yoritiladi. To‘g‘ri javobdan keyin raqam yashil holatga o‘tadi.</div><div className={styles.nums}>{Array.from({ length: N }).map((_, i) => { const num = i + 1; const ok = answered.has(num); const cur = picked === num; return <div key={num} className={`${styles.num} ${ok ? styles.ok : ''} ${cur ? styles.cur : ''}`}>{num}</div> })}</div>{!question ? <div className={styles.blank}>Start tugmasini bosing — test shu yerda chiqadi.</div> : <div className={styles.questionBox}><div className="pill">Raqam #{picked}</div><div className={styles.prompt}>{question.prompt}</div><div className={styles.options}>{question.options.map((option, idx)=>{ const active=selected===idx; const correct=feedback && idx===question.correctIndex; const wrong=feedback && active && idx!==question.correctIndex; return <button key={idx} className={`${styles.option} ${active?styles.optionActive:''} ${correct?styles.optionGood:''} ${wrong?styles.optionBad:''}`} onClick={()=>setSelected(idx)} disabled={feedback}><span>{String.fromCharCode(65+idx)}</span><b>{option}</b></button> })}</div><button className="btn" style={{ width:'100%', marginTop:12 }} onClick={submit}>Tasdiqlash</button></div>}</div></section>
      </div>
    </div>
  )
}
