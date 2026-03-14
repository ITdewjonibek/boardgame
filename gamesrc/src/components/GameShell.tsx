import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { GAMES } from '../data/games'
import CourierNode from '../games/CourierNode/CourierNode'
import Neo2048 from '../games/Neo2048/Neo2048'
import LuckyTicket from '../games/LuckyTicket/LuckyTicket'
import LuckyWheel from '../games/LuckyWheel/LuckyWheel'
import RopeBattle from '../games/RopeBattle/RopeBattle'
import SubjectQuiz from '../games/SubjectQuiz/SubjectQuiz'
import styles from './GameShell.module.css'

export default function GameShell() {
  const { key } = useParams()
  const game = useMemo(() => GAMES.find((g) => g.key === key), [key])

  if (!game) {
    return (
      <div className="container">
        <div className="card" style={{ padding: 22, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Game not found</div>
          <div style={{ opacity: 0.7, marginTop: 6 }}>Bu o‘yin topilmadi. /games sahifasiga qayting.</div>
          <div style={{ marginTop: 14 }}>
            <Link className="btn" to="/games">Back to Games</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.topbar}>
        <Link to="/games" className="btn secondary">
          <ArrowLeft size={16} /> Games
        </Link>
        <div className={styles.titleWrap}>
          <div className={styles.title}>{game.title}</div>
          <div className={styles.subtitle}>{game.subtitle}</div>
        </div>
        <div className={styles.right}>
          <span className="pill">{game.section.toUpperCase()}</span>
          <span className="pill">{game.difficulty}</span>
        </div>
      </div>

      <div className={styles.body}>
        {game.key === 'courier-node' && <CourierNode />}
        {game.key === 'neo-2048' && <Neo2048 />}
        {game.key === 'lucky-ticket' && <LuckyTicket />}
        {game.key === 'lucky-wheel' && <LuckyWheel />}
        {game.key === 'rope-battle' && <RopeBattle />}
        {game.section === 'subject' && <SubjectQuiz gameKey={game.key} />}
      </div>
    </div>
  )
}
