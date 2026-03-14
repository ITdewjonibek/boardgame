import { useMemo, useState } from 'react'
import { BookOpen, Users } from 'lucide-react'
import { difficultyLabel, getQuestions, type Difficulty } from '../data/gameBank'

export default function SubjectQuizGame({ topic }: { topic: string }) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [mode, setMode] = useState<'SOLO' | 'TEAM'>('SOLO')
  const [turn, setTurn] = useState<'A' | 'B'>('A')
  const [idx, setIdx] = useState(0)
  const [scoreA, setScoreA] = useState(0)
  const [scoreB, setScoreB] = useState(0)
  const qs = useMemo(() => getQuestions(topic, difficulty, 10), [topic, difficulty])
  const q = qs[idx % qs.length]

  const answer = (i: number) => {
    const correct = i === q.correctIndex
    if (correct) {
      if (mode === 'SOLO') setScoreA((s) => s + 1)
      else turn === 'A' ? setScoreA((s) => s + 1) : setScoreB((s) => s + 1)
    }
    setIdx((x) => x + 1)
    if (mode === 'TEAM') setTurn((t) => (t === 'A' ? 'B' : 'A'))
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="premium-card p-6">
        <div className="premium-kicker"><BookOpen size={14} /> SUBJECT MODE</div>
        <div className="mt-3 text-3xl font-black text-white">{topic.toUpperCase()}</div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button className={`premium-button ${mode === 'SOLO' ? '' : 'secondary'}`} onClick={() => setMode('SOLO')}>SOLO</button>
          <button className={`premium-button ${mode === 'TEAM' ? '' : 'secondary'}`} onClick={() => setMode('TEAM')}><Users size={16} /> TEAM</button>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => <button key={d} className={`premium-button ${difficulty === d ? '' : 'secondary'}`} onClick={() => { setDifficulty(d); setIdx(0); setScoreA(0); setScoreB(0) }}>{difficultyLabel(d)}</button>)}
        </div>
        <div className="subject-score mt-5">
          <div><span>1-Jamoa / Siz</span><b>{scoreA}</b></div>
          <div><span>2-Jamoa</span><b>{scoreB}</b></div>
        </div>
      </div>
      <div className="premium-card p-6">
        <div className="text-xs uppercase tracking-[0.28em] text-slate-400">FANGA OID TEST</div>
        <div className="mt-3 text-3xl font-black text-white">{mode === 'TEAM' ? `${turn === 'A' ? '1-Jamoa' : '2-Jamoa'} navbatda` : `Savol #${idx + 1}`}</div>
        <div className="quiz-shell mt-6">
          <div className="text-2xl font-black text-white">{q.prompt}</div>
          <div className="mt-5 grid gap-3">
            {q.options.map((opt, i) => <button key={opt} className="quiz-option" onClick={() => answer(i)}>{opt}</button>)}
          </div>
        </div>
      </div>
    </div>
  )
}
