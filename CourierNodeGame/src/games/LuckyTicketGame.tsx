import { useMemo, useState } from 'react'
import { Dice5, Tickets, Trophy, Users } from 'lucide-react'
import { difficultyLabel, getQuestions, type Difficulty } from '../data/gameBank'

export default function LuckyTicketGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [mode, setMode] = useState<'SOLO' | 'TEAM'>('TEAM')
  const [opened, setOpened] = useState<number[]>([])
  const [current, setCurrent] = useState<number | null>(null)
  const [turn, setTurn] = useState<'A' | 'B'>('A')
  const [scoreA, setScoreA] = useState(0)
  const [scoreB, setScoreB] = useState(0)
  const qs = useMemo(() => getQuestions('lucky-ticket', difficulty, 15), [difficulty])

  const roll = () => {
    const remain = Array.from({ length: 15 }, (_, i) => i + 1).filter((n) => !opened.includes(n))
    if (!remain.length) return
    const next = remain[Math.floor(Math.random() * remain.length)]
    setCurrent(next)
    setOpened((prev) => [...prev, next])
  }

  const answer = (idx: number) => {
    const q = qs[(current ?? 1) - 1]
    const correct = idx === q.correctIndex
    if (mode === 'SOLO') {
      if (correct) setScoreA((s) => s + 10)
    } else {
      if (correct) turn === 'A' ? setScoreA((s) => s + 10) : setScoreB((s) => s + 10)
      setTurn((t) => (t === 'A' ? 'B' : 'A'))
    }
    setCurrent(null)
  }

  const q = current ? qs[current - 1] : null

  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="premium-card p-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="premium-pill"><Tickets size={14} /> 15 ta chipta</span>
          <button className={`premium-button ${mode === 'SOLO' ? '' : 'secondary'}`} onClick={() => setMode('SOLO')}>SOLO</button>
          <button className={`premium-button ${mode === 'TEAM' ? '' : 'secondary'}`} onClick={() => setMode('TEAM')}><Users size={16} /> TEAM</button>
        </div>
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="premium-side-info">
            <div className="text-2xl font-black text-white">Omadli raqam</div>
            <div className="mt-4 reveal-card">{current ?? '--'}</div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button key={d} className={`premium-button ${difficulty === d ? '' : 'secondary'}`} onClick={() => setDifficulty(d)}>{difficultyLabel(d)}</button>
              ))}
            </div>
            <button className="premium-button mt-4 w-full" onClick={roll}><Dice5 size={18} /> Random chipta</button>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <span>1-Jamoa: <b>{scoreA}</b></span>
              <span>2-Jamoa: <b>{scoreB}</b></span>
            </div>
          </div>
          <div className="ticket-grid">
            {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
              <div key={n} className={`ticket-card ${opened.includes(n) ? 'open' : ''} ${current === n ? 'current' : ''}`}>
                <div className="ticket-number">{n}</div>
                <div className="ticket-label">CHIPTA</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="premium-card p-6">
        <div className="text-xs uppercase tracking-[0.28em] text-slate-400">QUIZ PANEL</div>
        <div className="mt-3 text-3xl font-black text-white">{current ? `Chipta #${current}` : 'Random tugmani bosing'}</div>
        <div className="mt-2 text-sm text-slate-400">{mode === 'TEAM' ? `${turn === 'A' ? '1-Jamoa' : '2-Jamoa'} navbatda` : 'Yakka tartib'}</div>
        {q ? (
          <div className="quiz-shell mt-6">
            <div className="text-2xl font-black text-white">{q.prompt}</div>
            <div className="mt-5 grid gap-3">
              {q.options.map((opt, i) => <button key={opt} className="quiz-option" onClick={() => answer(i)}>{opt}</button>)}
            </div>
          </div>
        ) : (
          <div className="empty-panel mt-6">Random tugmasi bosilganda chiqqan raqamga tegishli chipta shu yerda ochiladi.</div>
        )}
      </div>
    </div>
  )
}
