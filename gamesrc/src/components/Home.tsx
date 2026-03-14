import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Crown, FlaskConical, Gamepad2, GraduationCap } from 'lucide-react'
import { GAMES, PRO_GAMES, SUBJECT_GAMES, type GameSection } from '../data/games'
import styles from './Home.module.css'

export default function Home() {
  const [filter, setFilter] = useState<'all' | GameSection>('all')

  const list = useMemo(() => {
    if (filter === 'all') return GAMES
    return GAMES.filter((g) => g.section === filter)
  }, [filter])

  return (
    <div className="container">
      <div className={styles.hero}>
        <div>
          <div className="pill"><Gamepad2 size={14} /> Ultimate Games Platform</div>
          <h1 className="h1">Games</h1>
          <p className="h2">Premium dizayn • Quiz + Pro o‘yinlar • Oson / O‘rta / Qiyin</p>
        </div>
        <div className={styles.filters}>
          <button className={`btn secondary ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>
            <Gamepad2 size={16} /> All
          </button>
          <button className={`btn secondary ${filter === 'pro' ? styles.active : ''}`} onClick={() => setFilter('pro')}>
            <Crown size={16} /> Pro
          </button>
          <button className={`btn secondary ${filter === 'subject' ? styles.active : ''}`} onClick={() => setFilter('subject')}>
            <GraduationCap size={16} /> Subject
          </button>
        </div>
      </div>

      <div className={styles.sectionRow}>
        <div className={styles.sectionTitle}>
          <span className={styles.dot} />
          <div>
            <div className={styles.kicker}>PRO GAMES COLLECTION</div>
            <div className={styles.desc}>Boshqotirma + interaktiv: 5 ta “udar” o‘yin</div>
          </div>
        </div>
        <div className={styles.sectionMeta}>
          <span className="pill"><Crown size={14} /> {PRO_GAMES.length} ta</span>
        </div>
      </div>

      <div className={styles.cards}>
        {list
          .filter((x) => x.section === 'pro' || filter === 'all')
          .map((g) => (
            <Link key={g.key} to={`/games/${g.key}`} className={styles.card} style={{ ['--a' as any]: g.theme.a, ['--b' as any]: g.theme.b }}>
              <div className={styles.cardTop}>
                <div className={styles.badges}>
                  <span className={styles.badge}>{g.section.toUpperCase()}</span>
                  <span className={styles.badge2}>{g.difficulty}</span>
                </div>
                <div className={styles.modes}>
                  {g.modes.map((m) => (
                    <span key={m} className="pill">{m}</span>
                  ))}
                </div>
              </div>
              <div className={styles.title}>{g.title}</div>
              <div className={styles.subtitle}>{g.subtitle}</div>
              <div className={styles.ctaRow}>
                <button className="btn">O‘ynash</button>
                <span className={styles.hint}>Enter</span>
              </div>
            </Link>
          ))}
      </div>

      <div className={styles.sectionRow} style={{ marginTop: 28 }}>
        <div className={styles.sectionTitle}>
          <span className={styles.dot2} />
          <div>
            <div className={styles.kicker}>CORE SUBJECTS</div>
            <div className={styles.desc}>Fanlarga oid premium quiz o‘yinlar (10 ta fan)</div>
          </div>
        </div>
        <div className={styles.sectionMeta}>
          <span className="pill"><FlaskConical size={14} /> {SUBJECT_GAMES.length} ta</span>
        </div>
      </div>

      <div className={styles.cards}>
        {list
          .filter((x) => x.section === 'subject' || filter === 'all')
          .map((g) => (
            <Link key={g.key} to={`/games/${g.key}`} className={styles.card} style={{ ['--a' as any]: g.theme.a, ['--b' as any]: g.theme.b }}>
              <div className={styles.cardTop}>
                <div className={styles.badges}>
                  <span className={styles.badge}>{g.section.toUpperCase()}</span>
                  <span className={styles.badge2}>{g.difficulty}</span>
                </div>
                <div className={styles.modes}>
                  {g.modes.map((m) => (
                    <span key={m} className="pill">{m}</span>
                  ))}
                </div>
              </div>
              <div className={styles.title}>{g.title}</div>
              <div className={styles.subtitle}>{g.subtitle}</div>
              <div className={styles.ctaRow}>
                <button className="btn">Boshlash</button>
                <span className={styles.hint}>Space</span>
              </div>
            </Link>
          ))}
      </div>

      <div className={styles.footer}>
        <span className="pill">Tip: klaviatura <span className="kbd">←</span><span className="kbd">↑</span><span className="kbd">→</span><span className="kbd">↓</span> bilan 2048 o‘ynang.</span>
      </div>
    </div>
  )
}
