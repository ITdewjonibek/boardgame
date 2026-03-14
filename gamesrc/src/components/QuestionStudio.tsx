import { useMemo, useState } from 'react'
import { PlusCircle, Settings2, Sparkles, X } from 'lucide-react'
import type { Difficulty } from '../data/games'
import { formatDifficulty, getAllQuestions, getSections, saveStudioQuestion } from '../data/questions'
import styles from './QuestionStudio.module.css'

type Props = {
  open: boolean
  onClose: () => void
  topic: string
  topicLabel: string
}

export default function QuestionStudio({ open, onClose, topic, topicLabel }: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [section, setSection] = useState('Yangi bo‘lim')
  const [prompt, setPrompt] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(0)
  const [savedAt, setSavedAt] = useState(0)

  const sections = useMemo(() => getSections(topic), [topic, savedAt])
  const recent = useMemo(() => getAllQuestions().filter((x) => x.topic === topic).slice(-8).reverse(), [topic, savedAt])

  if (!open) return null

  const submit = () => {
    if (!prompt.trim() || options.some((o) => !o.trim())) return
    saveStudioQuestion({ topic, difficulty, section, prompt, options, correctIndex })
    setPrompt('')
    setOptions(['', '', '', ''])
    setCorrectIndex(0)
    setSavedAt(Date.now())
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.head}>
          <div>
            <div className="pill"><Sparkles size={14} /> Test Studio</div>
            <div className={styles.title}>{topicLabel} uchun premium test qo‘shish</div>
            <div className={styles.sub}>Bo‘lim yarating, savol yozing, 4 variant kiriting. Saqlangan savollar localStorage ga tushadi va shu topic bilan bog‘liq barcha o‘yinlarda ishlaydi.</div>
          </div>
          <button className="btn secondary" onClick={onClose}><X size={16} /> Yopish</button>
        </div>

        <div className={styles.grid}>
          <div className={styles.formCard}>
            <div className={styles.blockTitle}><Settings2 size={16} /> Savol konstruktori</div>
            <div className={styles.row}>
              <div>
                <div className="pill" style={{ marginBottom: 8 }}>Qiyinchilik</div>
                <select className={styles.select} value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((item) => <option key={item} value={item}>{formatDifficulty(item)}</option>)}
                </select>
              </div>
              <div>
                <div className="pill" style={{ marginBottom: 8 }}>Bo‘lim</div>
                <input className={styles.input} value={section} onChange={(e) => setSection(e.target.value)} placeholder="Masalan: 1-bo‘lim" />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="pill" style={{ marginBottom: 8 }}>Savol matni</div>
              <textarea className={styles.textarea} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Savolni kiriting" />
            </div>

            <div className={styles.options}>
              {options.map((item, index) => (
                <div key={index} className={styles.optionRow}>
                  <button className={correctIndex === index ? 'btn success' : 'btn secondary'} onClick={() => setCorrectIndex(index)}>{String.fromCharCode(65 + index)}</button>
                  <input className={styles.input} value={item} onChange={(e) => setOptions((prev) => prev.map((v, i) => i === index ? e.target.value : v))} placeholder={`${index + 1}-variant`} />
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <button className="btn" onClick={submit}><PlusCircle size={16} /> Savolni saqlash</button>
            </div>
          </div>

          <div className={styles.listCard}>
            <div className={styles.blockTitle}>Mavjud bo‘limlar</div>
            <div className={styles.tagGrid}>
              {sections.map((item) => <span key={item} className={styles.tag}>{item}</span>)}
            </div>

            <div className={styles.blockTitle} style={{ marginTop: 16 }}>Oxirgi savollar</div>
            <div className={styles.list}>
              {recent.map((item) => (
                <div className={styles.item} key={item.id}>
                  <div className={styles.itemTop}>
                    <span className="pill">{item.section || 'Asosiy'}</span>
                    <span className="pill">{formatDifficulty(item.difficulty)}</span>
                  </div>
                  <div className={styles.itemPrompt}>{item.prompt}</div>
                  <div className={styles.itemOptions}>{item.options.map((option, i) => <div key={i} className={i === item.correctIndex ? styles.good : ''}>{String.fromCharCode(65 + i)}. {option}</div>)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
