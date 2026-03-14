import { useEffect, useMemo, useState } from 'react'
import { Move, ShieldCheck } from 'lucide-react'
import { getQuestions } from '../data/gameBank'

type Board = number[]
const size = 4

function spawn(board: Board) {
  const empty = board.map((v, i) => (v === 0 ? i : -1)).filter((x) => x >= 0)
  if (!empty.length) return board
  const idx = empty[Math.floor(Math.random() * empty.length)]
  const next = [...board]
  next[idx] = Math.random() < 0.9 ? 2 : 4
  return next
}

function slide(line: number[]) {
  const arr = line.filter(Boolean)
  const out: number[] = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] && arr[i] === arr[i + 1]) {
      out.push(arr[i] * 2)
      i++
    } else out.push(arr[i])
  }
  while (out.length < size) out.push(0)
  return out
}

function move(board: Board, dir: 'left' | 'right' | 'up' | 'down') {
  const next = [...board]
  const getRow = (r: number) => next.slice(r * size, r * size + size)
  const setRow = (r: number, vals: number[]) => vals.forEach((v, i) => { next[r * size + i] = v })
  const getCol = (c: number) => Array.from({ length: size }, (_, r) => next[r * size + c])
  const setCol = (c: number, vals: number[]) => vals.forEach((v, r) => { next[r * size + c] = v })

  if (dir === 'left' || dir === 'right') {
    for (let r = 0; r < size; r++) {
      const row = getRow(r)
      const shifted = dir === 'left' ? slide(row) : slide([...row].reverse()).reverse()
      setRow(r, shifted)
    }
  } else {
    for (let c = 0; c < size; c++) {
      const col = getCol(c)
      const shifted = dir === 'up' ? slide(col) : slide([...col].reverse()).reverse()
      setCol(c, shifted)
    }
  }
  return JSON.stringify(next) === JSON.stringify(board) ? board : spawn(next)
}

export default function Neo2048Game() {
  const [board, setBoard] = useState<Board>(() => spawn(spawn(Array(16).fill(0))))
  const [moves, setMoves] = useState(0)
  const [gate, setGate] = useState(false)
  const [gateScore, setGateScore] = useState(32)
  const qs = useMemo(() => getQuestions('neo-2048', 'medium', 10), [])
  const q = qs[(moves / 4) % qs.length]
  const maxTile = Math.max(...board)

  const doMove = (dir: 'left' | 'right' | 'up' | 'down') => {
    if (gate) return
    setBoard((b) => move(b, dir))
    setMoves((m) => m + 1)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') doMove('left')
      if (e.key === 'ArrowRight') doMove('right')
      if (e.key === 'ArrowUp') doMove('up')
      if (e.key === 'ArrowDown') doMove('down')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  useEffect(() => {
    if (maxTile >= gateScore) setGate(true)
  }, [maxTile, gateScore])

  const answer = (idx: number) => {
    if (idx === q.correctIndex) {
      setGate(false)
      setGateScore((s) => s * 2)
    } else {
      setBoard((b) => spawn([...b].sort((a, b2) => a - b2)))
      setGate(false)
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.92fr]">
      <div className="premium-card p-6">
        <div className="mb-4 flex flex-wrap gap-3">
          <span className="premium-pill"><Move size={14} /> Arrow keys</span>
          <span className="premium-pill"><ShieldCheck size={14} /> Gate: {gateScore}</span>
          <span className="premium-pill">Moves: {moves}</span>
        </div>
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="premium-side-info">
            <div className="text-xl font-black text-white">NEO 2048</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">2048 premium qora stilga o'tkazildi. Muayyan tile ga yetganda o'ng panelda quiz gate ochiladi.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {(['left','up','down','right'] as const).map((dir) => <button key={dir} className="premium-button secondary" onClick={() => doMove(dir)}>{dir.toUpperCase()}</button>)}
            </div>
          </div>
          <div className="board-2048">
            {board.map((cell, i) => <div key={i} className={`tile tile-${cell || 0}`}>{cell || ''}</div>)}
          </div>
        </div>
      </div>
      <div className="premium-card p-6">
        <div className="text-xs uppercase tracking-[0.28em] text-slate-400">QUIZ GATE</div>
        <div className="mt-3 text-3xl font-black text-white">{gate ? `Tile ${gateScore} gate` : "O'yinni davom ettiring"}</div>
        {gate ? (
          <div className="quiz-shell mt-6">
            <div className="text-2xl font-black text-white">{q?.prompt}</div>
            <div className="mt-5 grid gap-3">
              {q?.options.map((opt, i) => <button key={opt} className="quiz-option" onClick={() => answer(i)}>{opt}</button>)}
            </div>
          </div>
        ) : <div className="empty-panel mt-6">32, 64, 128 kabi qiymatlarga yetganda test chiqadi.</div>}
      </div>
    </div>
  )
}
