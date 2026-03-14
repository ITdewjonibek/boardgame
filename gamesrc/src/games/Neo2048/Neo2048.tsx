import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Settings2, ShieldCheck, Sparkles } from 'lucide-react'
import Toast from '../../components/Toast'
import QuestionStudio from '../../components/QuestionStudio'
import { useToast } from '../../components/useToast'
import type { Difficulty } from '../../data/games'
import { formatDifficulty, getQuestions, getSections, type MCQ } from '../../data/questions'
import styles from './Neo2048.module.css'

type Grid = number[][]
const SIZE = 4
const emptyGrid = (): Grid => Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => 0))
const clone = (g: Grid): Grid => g.map((r) => r.slice())
function addTile(g: Grid) { const next = clone(g); const empties: Array<[number,number]> = []; for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++) if(next[r][c]===0) empties.push([r,c]); if(!empties.length) return next; const [r,c] = empties[Math.floor(Math.random()*empties.length)]; next[r][c] = Math.random() < 0.9 ? 2 : 4; return next }
function compress(row: number[]) { const nonZero = row.filter(Boolean); const out:number[]=[]; let scoreAdd=0; for (let i=0;i<nonZero.length;i++){ if(i<nonZero.length-1 && nonZero[i]===nonZero[i+1]){ const merged = nonZero[i]*2; out.push(merged); scoreAdd += merged; i++; } else out.push(nonZero[i]); } while(out.length<SIZE) out.push(0); return {out,scoreAdd} }
function moveLeft(g: Grid) { let moved=false; let add=0; const next = g.map((row)=>{ const {out,scoreAdd}=compress(row); if(!moved && out.some((v,i)=>v!==row[i])) moved=true; add+=scoreAdd; return out }); return { next, moved, add } }
function rotateRight(g: Grid): Grid { const n = emptyGrid(); for (let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++) n[c][SIZE-1-r]=g[r][c]; return n }
function rotateLeft(g: Grid): Grid { const n = emptyGrid(); for (let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++) n[SIZE-1-c][r]=g[r][c]; return n }
function move(g: Grid, dir:'left'|'right'|'up'|'down') { if(dir==='left') return moveLeft(g); if(dir==='right'){ const rotated=g.map((r)=>r.slice().reverse()); const res=moveLeft(rotated); return { next: res.next.map((r)=>r.slice().reverse()), moved: res.moved, add: res.add } } if(dir==='up'){ const rot=rotateLeft(g); const res=moveLeft(rot); return { next: rotateRight(res.next), moved: res.moved, add: res.add } } const rot=rotateRight(g); const res=moveLeft(rot); return { next: rotateLeft(res.next), moved: res.moved, add: res.add } }
function canMove(g: Grid){ for(let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++) if(g[r][c]===0) return true; for(let r=0;r<SIZE;r++) for(let c=0;c<SIZE-1;c++) if(g[r][c]===g[r][c+1]) return true; for(let c=0;c<SIZE;c++) for(let r=0;r<SIZE-1;r++) if(g[r][c]===g[r+1][c]) return true; return false }

export default function Neo2048() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [section, setSection] = useState('Asosiy')
  const [studioOpen, setStudioOpen] = useState(false)
  const [grid, setGrid] = useState<Grid>(() => addTile(addTile(emptyGrid())))
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [history, setHistory] = useState<{ grid: Grid; score: number; moves: number }[]>([])
  const [gateActive, setGateActive] = useState(false)
  const [gateQ, setGateQ] = useState<MCQ | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState(false)
  const { msg, toast } = useToast(2200)
  const sections = useMemo(() => getSections('gate'), [studioOpen])
  const pool = useMemo(() => getQuestions('gate', difficulty, 120, section), [difficulty, section, studioOpen])

  useEffect(() => { if(sections.length && !sections.includes(section)) setSection(sections[0]) }, [sections, section])

  const reset = () => { setGrid(addTile(addTile(emptyGrid()))); setScore(0); setMoves(0); setHistory([]); setGateActive(false); setGateQ(null); setSelected(null); setFeedback(false); toast('Yangi run 🔥') }

  const attemptMove = (dir:'left'|'right'|'up'|'down') => {
    if (gateActive) return
    const res = move(grid, dir)
    if (!res.moved) return
    const next = addTile(res.next)
    setHistory((h) => [{ grid: clone(grid), score, moves }, ...h].slice(0, 20))
    setGrid(next)
    setScore((s) => s + res.add)
    setMoves((m) => {
      const nextMoves = m + 1
      if (nextMoves % 10 === 0) {
        const q = pool[(nextMoves * 3) % Math.max(pool.length, 1)] || null
        setGateQ(q)
        setGateActive(true)
        toast('Gate savol chiqdi ⚡')
      }
      return nextMoves
    })
    if (!canMove(next)) toast('Board to‘ldi — reset qiling')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if(e.key==='ArrowLeft') attemptMove('left'); if(e.key==='ArrowRight') attemptMove('right'); if(e.key==='ArrowUp') attemptMove('up'); if(e.key==='ArrowDown') attemptMove('down') }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const submitGate = () => {
    if (!gateQ || selected === null) return
    const correct = selected === gateQ.correctIndex
    setFeedback(true)
    window.setTimeout(() => {
      if (correct) toast('To‘g‘ri ✅ Davom eting!')
      else setHistory((h) => { const top = h[0]; if(top){ setGrid(clone(top.grid)); setScore(top.score); setMoves(top.moves); toast('Xato ❌ 1 qadam orqaga qaytdingiz'); return h.slice(1) } return h })
      setGateActive(false)
      setGateQ(null)
      setSelected(null)
      setFeedback(false)
    }, 520)
  }

  return (
    <div className={styles.wrap}>
      <Toast msg={msg} />
      <QuestionStudio open={studioOpen} onClose={() => setStudioOpen(false)} topic="gate" topicLabel="2048 Gate" />
      <div className={styles.grid}>
        <section className={styles.boardCard}>
          <div className={styles.head}>
            <div>
              <div className="pill"><Sparkles size={14} /> NEO 2048 Premium</div>
              <div className={styles.title}>2048 arena + yon panel gate test</div>
              <div className={styles.sub}>Endi oddiy emas: chapda neon board, o‘ngda gate kontrol panel. Modalga bog‘lanmagan premium ko‘rinish.</div>
            </div>
            <div className={styles.btns}><button className="btn secondary" onClick={() => setStudioOpen(true)}><Settings2 size={16} /> Test Studio</button><button className="btn secondary" onClick={reset}><RotateCcw size={16} /> Reset</button></div>
          </div>

          <div className={styles.stats}><span className="pill">Score: {score}</span><span className="pill">Moves: {moves}</span><span className="pill">Gate: har 10 yurish</span></div>
          <div className={styles.board}>{grid.flatMap((row,r)=>row.map((v,c)=><div key={`${r}-${c}`} className={`${styles.cell} ${v===0?styles.empty:''}`} data-v={v||''}>{v!==0 && <div className={styles.tile}>{v}</div>}</div>))}</div>
          <div className={styles.controls}><button className="btn secondary" onClick={()=>attemptMove('up')}><ArrowUp size={18} /></button><div className={styles.row}><button className="btn secondary" onClick={()=>attemptMove('left')}><ArrowLeft size={18} /></button><button className="btn secondary" onClick={()=>attemptMove('down')}><ArrowDown size={18} /></button><button className="btn secondary" onClick={()=>attemptMove('right')}><ArrowRight size={18} /></button></div><div className={styles.tip}>Klaviatura: ← ↑ → ↓</div></div>
        </section>

        <section className={styles.sideCard}>
          <div className={styles.sideTitle}>Quiz Gate boshqaruvi</div>
          <div className={styles.sideSub}>10-yurishda savol chiqadi. Xato bo‘lsa 1 ta tarix orqaga qaytasiz.</div>
          <div className={styles.sectionRow}>{(['easy','medium','hard'] as Difficulty[]).map((d)=><button key={d} className={`btn secondary ${difficulty===d?styles.active:''}`} onClick={()=>setDifficulty(d)}><ShieldCheck size={14} /> {formatDifficulty(d)}</button>)}</div>
          <div className={styles.sectionRow}>{sections.map((item)=><button key={item} className={`btn secondary ${section===item?styles.active:''}`} onClick={()=>setSection(item)}>{item}</button>)}</div>

          {!gateActive || !gateQ ? (
            <div className={styles.waitCard}><div className={styles.waitTitle}>Gate kutish rejimi</div><div className={styles.waitHuge}>{10 - (moves % 10 || 10)}</div><div className={styles.waitText}>yana shuncha yurishdan keyin savol chiqadi</div></div>
          ) : (
            <div className={styles.questionBox}>
              <div className="pill">Gate savol</div>
              <div className={styles.prompt}>{gateQ.prompt}</div>
              <div className={styles.options}>{gateQ.options.map((option, idx)=>{ const active=selected===idx; const correct=feedback && idx===gateQ.correctIndex; const wrong=feedback && active && idx!==gateQ.correctIndex; return <button key={idx} className={`${styles.option} ${active?styles.optionActive:''} ${correct?styles.optionGood:''} ${wrong?styles.optionBad:''}`} onClick={()=>setSelected(idx)} disabled={feedback}><span>{String.fromCharCode(65+idx)}</span><b>{option}</b></button> })}</div>
              <button className="btn" style={{ width:'100%', marginTop: 12 }} onClick={submitGate}>Tasdiqlash</button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
