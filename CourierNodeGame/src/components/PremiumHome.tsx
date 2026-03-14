import { GraduationCap, PlusCircle, Sparkles, Trophy } from 'lucide-react'
import { PRO_GAMES, SUBJECT_GAMES, type GameKey } from '../data/gameBank'

export default function PremiumHome({ onOpenGame, onAddTests }: { onOpenGame: (key: GameKey) => void; onAddTests: () => void }) {
  return (
    <div className="min-h-screen px-6 py-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="premium-card overflow-hidden p-8">
          <div className="absolute inset-0 premium-hero-glow" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="premium-pill mb-4"><Sparkles size={14} /> Ultimate Games Platform</div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">Udar o'yinlar + fan quiz platforma</h1>
              <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
                Saytingiz dizayniga mos premium qora stil. Yuqorida boshqotirmali o'yinlar, pastda 10 ta fanga oid testlar.
                Har bir karta jonli, neon va ishlaydigan sahifaga olib kiradi.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button className="premium-button" onClick={onAddTests}><PlusCircle size={18} /> Test qo'shish</button>
              <div className="premium-stat">
                <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Pro Games</span>
                <span className="text-3xl font-black text-white">5</span>
              </div>
              <div className="premium-stat">
                <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Fan Quiz</span>
                <span className="text-3xl font-black text-white">10</span>
              </div>
              <div className="premium-stat">
                <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Mode</span>
                <span className="text-3xl font-black text-white">Team</span>
              </div>
            </div>
          </div>
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="premium-kicker"><Trophy size={14} /> PREMIUM GAMES</div>
              <h2 className="text-2xl font-black text-white">Top 5 ta udar o'yin</h2>
            </div>
            <div className="premium-pill">Neon • Team • Premium</div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {PRO_GAMES.map((game) => (
              <button key={game.key} onClick={() => onOpenGame(game.key)} className="premium-tile text-left">
                <div className={`premium-tile-glow bg-gradient-to-br ${game.color}`} />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="premium-badge">{game.badge}</span>
                    <span className="premium-badge muted">{game.difficulty}</span>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{game.title}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-300">{game.subtitle}</div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="premium-link">Boshlash</span>
                    <span className="premium-pill muted">Split Screen</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="pt-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="premium-kicker"><GraduationCap size={14} /> SUBJECT TESTS</div>
              <h2 className="text-2xl font-black text-white">Pastda 10 ta fanga oid testlar</h2>
            </div>
            <div className="premium-pill">Teacher-ready</div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SUBJECT_GAMES.map((game) => (
              <button key={game.key} onClick={() => onOpenGame(game.key)} className="premium-tile compact text-left">
                <div className={`premium-tile-glow bg-gradient-to-br ${game.color}`} />
                <div className="relative space-y-3">
                  <span className="premium-badge">SUBJECT</span>
                  <div className="text-xl font-black text-white">{game.title}</div>
                  <div className="text-sm leading-6 text-slate-300">{game.subtitle}</div>
                  <div className="premium-link">Quizni ochish</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
