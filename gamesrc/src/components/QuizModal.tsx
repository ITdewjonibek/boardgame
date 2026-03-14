import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Sparkles, XCircle } from 'lucide-react'
import type { MCQ } from '../data/questions'

export type QuizResult = { correct: boolean }

type Props = {
  open: boolean
  title: string
  question: MCQ | null
  onClose?: () => void
  onAnswer: (res: QuizResult) => void
  inline?: boolean
}

export default function QuizModal({ open, title, question, onClose, onAnswer, inline = false }: Props) {
  const [picked, setPicked] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setPicked(null)
    setSubmitted(false)
  }, [question?.id])

  const isCorrect = useMemo(() => {
    if (!question || picked === null) return false
    return picked === question.correctIndex
  }, [picked, question])

  if (!open || !question) return null

  const submit = () => {
    if (picked === null) return
    setSubmitted(true)
    window.setTimeout(() => onAnswer({ correct: isCorrect }), inline ? 450 : 700)
  }

  const content = (
    <div className="modal" onMouseDown={(e) => e.stopPropagation()} style={inline ? { width: '100%', maxWidth: '100%', position: 'relative' } : undefined}>
      <div className="modalHeader">
        <div style={{ fontWeight: 950, display: 'flex', alignItems: 'center', gap: 8 }}><Sparkles size={16} /> {title}</div>
        {onClose && !inline && <button className="btn secondary" onClick={onClose}>Yopish</button>}
      </div>
      <div className="modalBody">
        <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.35 }}>{question.prompt}</div>
        <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
          {question.options.map((opt, idx) => {
            const active = picked === idx
            const showState = submitted
            const correct = idx === question.correctIndex
            const stateBg = showState ? (correct ? 'rgba(34,197,94,.18)' : active ? 'rgba(239,68,68,.18)' : 'rgba(255,255,255,.06)') : active ? 'rgba(184,107,255,.18)' : 'rgba(255,255,255,.06)'
            const stateBorder = showState ? (correct ? 'rgba(34,197,94,.35)' : active ? 'rgba(239,68,68,.35)' : 'rgba(255,255,255,.12)') : active ? 'rgba(184,107,255,.35)' : 'rgba(255,255,255,.12)'
            return (
              <button
                key={idx}
                className="btn secondary"
                style={{ textAlign: 'left', justifyContent: 'space-between', display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', borderRadius: 16, background: stateBg, borderColor: stateBorder }}
                disabled={submitted}
                onClick={() => setPicked(idx)}
              >
                <span style={{ fontWeight: 800 }}>{opt}</span>
                {submitted && correct && <CheckCircle2 size={18} />}
                {submitted && active && !correct && <XCircle size={18} />}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ opacity: 0.7, fontSize: 12 }}>{question.explanation ? `Izoh: ${question.explanation}` : 'Variantni tanlang va tasdiqlang.'}</div>
          <button className="btn" disabled={picked === null || submitted} onClick={submit}>Tasdiqlash</button>
        </div>
      </div>
    </div>
  )

  return inline ? content : <div className="modalOverlay" onMouseDown={onClose}>{content}</div>
}
