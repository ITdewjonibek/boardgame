import { useMemo, useState } from 'react'
import { CarFront, Gauge, Timer } from 'lucide-react'
import { difficultyLabel, getQuestions, type Difficulty } from '../data/gameBank'

export default function CourierRoadGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [index, setIndex] = useState(0)
  const [carStep, setCarStep] = useState(0)
  const [score, setScore] = useState(0)
  const questions = useMemo(() => getQuestions('courier-road', difficulty, 20), [difficulty])
  const q = questions[index % questions.length]

  const answer = (idx: number) => {
    if (idx === q.correctIndex) {
      setScore((s) => s + 10)
      setCarStep((s) => Math.min(20, s + 1))
    } else {
      setScore((s) => Math.max(0, s - 5))
      setCarStep((s) => Math.max(0, s - 1))
    }
    setIndex((i) => i + 1)
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="premium-card overflow-hidden p-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="premium-pill"><CarFront size={14} /> Kuryer yo'li</span>
          <span className="premium-pill"><Timer size={14} /> 20 checkpoint</span>
          <span className="premium-pill"><Gauge size={14} /> Ball: {score}</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="premium-side-info">
            <h3 className="text-xl font-black text-white">O'yin haqida</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">Ekran ikkiga bo'lingan: chap tomonda mashina yo'lda harakat qiladi, o'ng tomonda test turadi. To'g'ri javob bersangiz mashina oldinga yuradi.</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button key={d} onClick={() => { setDifficulty(d); setIndex(0); setCarStep(0); setScore(0) }} className={`premium-button ${difficulty === d ? '' : 'secondary'}`}>{difficultyLabel(d)}</button>
              ))}
            </div>
          </div>
          <div className="road-scene">
            <div className="road-sky" />
            <div className="road-track">
              <div className="road-lane lane-1" />
              <div className="road-lane lane-2" />
              <div className="finish-line" />
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className={`checkpoint ${i < carStep ? 'done' : i === carStep ? 'active' : ''}`} style={{ left: `${6 + i * 4.6}%` }} />
              ))}
              <div className="car-wrap" style={{ left: `${8 + carStep * 4.5}%` }}>
                <div className="car-shadow" />
                <div className="car-body-premium">
                  <span className="window" />
                  <span className="wheel left" />
                  <span className="wheel right" />
                </div>
              </div>
            </div>
            <div className="progress-shell"><div className="progress-bar" style={{ width: `${(carStep / 20) * 100}%` }} /></div>
          </div>
        </div>
      </div>

      <div className="premium-card p-6">
        <div className="text-xs uppercase tracking-[0.28em] text-slate-400">TEST PANEL</div>
        <div className="mt-3 text-3xl font-black text-white">Checkpoint #{Math.min(carStep + 1, 20)}</div>
        <div className="mt-2 text-sm text-slate-400">{difficultyLabel(difficulty)} daraja • Savol #{index + 1}</div>
        <div className="quiz-shell mt-6">
          <div className="text-2xl font-black text-white">{q.prompt}</div>
          <div className="mt-5 grid gap-3">
            {q.options.map((opt, i) => (
              <button key={opt} onClick={() => answer(i)} className="quiz-option">{opt}</button>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
            <span>To'g'ri javob = mashina oldinga</span>
            <span>Qolgan masofa: {20 - carStep}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
