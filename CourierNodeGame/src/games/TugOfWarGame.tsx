import { useMemo, useState } from 'react'
import { Flag, Users } from 'lucide-react'
import { getQuestions } from '../data/gameBank'

export default function TugOfWarGame() {
  const [turn, setTurn] = useState<'A' | 'B'>('A')
  const [offset, setOffset] = useState(0)
  const [index, setIndex] = useState(0)
  const qs = useMemo(() => getQuestions('tug-of-war', 'medium', 20), [])
  const q = qs[index % qs.length]

  const answer = (idx: number) => {
    const correct = idx === q.correctIndex
    setOffset((o) => Math.max(-40, Math.min(40, o + (correct ? (turn === 'A' ? -10 : 10) : (turn === 'A' ? 6 : -6)))))
    setTurn((t) => (t === 'A' ? 'B' : 'A'))
    setIndex((i) => i + 1)
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="premium-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="premium-kicker"><Users size={14} /> JAMOAVIY MUSOBAQA</div>
            <div className="text-3xl font-black text-white">Arqon tortish battle</div>
          </div>
          <div className="premium-pill"><Flag size={14} /> {turn === 'A' ? '1-Jamoa' : '2-Jamoa'} navbatda</div>
        </div>
        <div className="rope-stage">
          <div className="mid-line" />
          <img src="/assets/rope-left.png" className="rope-player left" style={{ transform: `translateX(${offset}px)` }} />
          <img src="/assets/rope-right.png" className="rope-player right" style={{ transform: `translateX(${offset}px)` }} />
          <div className="rope-line" style={{ transform: `translateX(${offset}px)` }} />
        </div>
        <div className="mt-4 text-center text-sm text-slate-400">Qaysi jamoa to'g'ri javob bersa, arqon shu tomonga siljiydi.</div>
      </div>
      <div className="premium-card p-6">
        <div className="text-xs uppercase tracking-[0.28em] text-slate-400">JAMOA TEST PANELI</div>
        <div className="mt-3 flex gap-3"><span className="premium-pill">1-Jamoa</span><span className="premium-pill">2-Jamoa</span></div>
        <div className="quiz-shell mt-6">
          <div className="text-2xl font-black text-white">{q.prompt}</div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {q.options.map((opt, i) => <button key={opt} className="quiz-option" onClick={() => answer(i)}>{opt}</button>)}
          </div>
        </div>
      </div>
    </div>
  )
}
