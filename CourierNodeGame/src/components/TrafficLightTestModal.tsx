import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { Question } from '../types'

interface TrafficLightTestModalProps {
  question: Question
  onAnswer: (correct: boolean) => void
}

export default function TrafficLightTestModal({
  question,
  onAnswer,
}: TrafficLightTestModalProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const isCorrect = selectedIdx === question.correctIndex

  const handleSubmit = () => {
    if (selectedIdx === null) return
    setSubmitted(true)
    setTimeout(() => {
      onAnswer(isCorrect)
      setSelectedIdx(null)
      setSubmitted(false)
    }, 800)
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-[90vw]">
      <div className="bg-gradient-card border-2 border-brand-primary/50 rounded-2xl p-6 shadow-2xl">
        {/* Question */}
        <h3 className="text-xl font-bold text-white mb-6 leading-snug">
          {question.prompt}
        </h3>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {question.options.map((option, idx) => {
            const selected = selectedIdx === idx
            const showResult = submitted
            const correct = idx === question.correctIndex

            let baseClass = 'p-4 rounded-lg border-2 font-bold text-left transition-all cursor-pointer'

            if (showResult) {
              if (correct) {
                baseClass += ' bg-success/20 border-success'
              } else if (selected) {
                baseClass += ' bg-error/20 border-error'
              } else {
                baseClass += ' bg-dark-border border-dark-border opacity-50'
              }
            } else if (selected) {
              baseClass += ' bg-brand-primary/30 border-brand-primary'
            } else {
              baseClass += ' bg-dark-border border-dark-border hover:bg-dark-border/80'
            }

            return (
              <button
                key={idx}
                onClick={() => !submitted && setSelectedIdx(idx)}
                disabled={submitted}
                className={baseClass}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg">{String.fromCharCode(65 + idx)}</span>
                  <span className="flex-1 text-sm text-gray-200">{option}</span>
                  {showResult && correct && <CheckCircle2 size={18} className="text-success flex-shrink-0" />}
                  {showResult && selected && !correct && <XCircle size={18} className="text-error flex-shrink-0" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Submit Button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={selectedIdx === null}
            className="w-full py-3 bg-gradient-primary hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-lg transition"
          >
            Javob Bering
          </button>
        )}

        {submitted && (
          <div className="text-center">
            <p className={`text-lg font-bold ${isCorrect ? 'text-success' : 'text-error'}`}>
              {isCorrect ? '✅ To\'g\'ri!' : '❌ Xato!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
