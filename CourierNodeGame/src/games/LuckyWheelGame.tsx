import { useMemo, useState } from 'react'
import { RotateCw } from 'lucide-react'
import { difficultyLabel, getQuestions, type Difficulty } from '../data/gameBank'

export default function LuckyWheelGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [rotation, setRotation] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const qs = useMemo(() => getQuestions('lucky-wheel', difficulty, 12), [difficulty])

  const spin = () => {
    const n = Math.floor(Math.random() * 12) + 1
    setPicked(n)
    setRotation((r) => r + 1080 + n * 30)
  }

  const q = picked ? qs[(picked - 1) % qs.length] : null

  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="premium-card p-6">
        <div className="mb-5 flex flex-wrap gap-3">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => <button key={d} className={`premium-button ${difficulty === d ? '' : 'secondary'}`} onClick={() => setDifficulty(d)}>{difficultyLabel(d)}</button>)}
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="wheel-scene">
            <div className="wheel-pointer" />
            <div className="wheel-disc" style={{ transform: `rotate(${rotation}deg)` }}>
              {Array.from({ length: 12 }, (_, i) => <div key={i} className="wheel-segment" style={{ transform: `rotate(${i * 30}deg)` }}><span>{i + 1}</span></div>)}
            </div>
            <button className="premium-button mt-5 w-full" onClick={spin}><RotateCw size={18} /> START</button>
          </div>
          <div className="premium-side-info">
            <div className="text-xl font-black text-white">Baraban natijasi</div>
            <div className="reveal-card mt-5">{picked ?? '--'}</div>
            <p className="mt-4 text-sm leading-7 text-slate-300">Baraban qaysi raqamga tushsa, shu raqamdagi savol avtomatik tanlanadi. Tugma premium ko'rinishda yangilandi.</p>
          </div>
        </div>
      </div>
      <div className="premium-card p-6">
        <div className="text-xs uppercase tracking-[0.28em] text-slate-400">TEST PANEL</div>
        <div className="mt-3 text-3xl font-black text-white">{picked ? `Raqam #${picked}` : 'START ni bosing'}</div>
        {q ? (
          <div className="quiz-shell mt-6">
            <div className="text-2xl font-black text-white">{q.prompt}</div>
            <div className="mt-5 grid gap-3">
              {q.options.map((opt, i) => <button key={opt} className={`quiz-option ${i === q.correctIndex ? 'hint' : ''}`}>{opt}</button>)}
            </div>
          </div>
        ) : <div className="empty-panel mt-6">Baraban aylangach shu yerda savol chiqadi.</div>}
      </div>
    </div>
  )
}
