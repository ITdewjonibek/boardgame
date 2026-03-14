export type Difficulty = 'easy' | 'medium' | 'hard'

export type GameSection = 'pro' | 'subject'

export type GameDef = {
  key: string
  title: string
  subtitle: string
  section: GameSection
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed'
  modes: Array<'SOLO' | 'TEAM'>
  theme: {
    a: string
    b: string
  }
}

export const GAMES: GameDef[] = [
  { key: 'courier-node', title: 'Neon Road Quiz Race', subtitle: 'Split-screen poyga: chapda yo‘l va mashina, o‘ngda test boshqaruvi.', section: 'pro', difficulty: 'Mixed', modes: ['SOLO'], theme: { a: '#b86bff', b: '#22d3ee' } },
  { key: 'neo-2048', title: 'NEO 2048 + Quiz Gate', subtitle: 'Premium 2048 arena, har 10 qadamda gate savol.', section: 'pro', difficulty: 'Hard', modes: ['SOLO'], theme: { a: '#22d3ee', b: '#60a5fa' } },
  { key: 'lucky-ticket', title: 'Omadli Chipta Deluxe', subtitle: 'Random chipta ochiladi va shu chiptaga mos savol chiqadi.', section: 'pro', difficulty: 'Medium', modes: ['SOLO', 'TEAM'], theme: { a: '#f59e0b', b: '#fb7185' } },
  { key: 'lucky-wheel', title: 'Omadli Baraban Ultra', subtitle: 'Aniq spin logikasi: tushgan raqam bilan savol 1:1 mos.', section: 'pro', difficulty: 'Mixed', modes: ['SOLO', 'TEAM'], theme: { a: '#a78bfa', b: '#34d399' } },
  { key: 'rope-battle', title: 'Arqon Tortish Battle', subtitle: '2 jamoa, premium keypad va vizual tug-of-war sahna.', section: 'pro', difficulty: 'Medium', modes: ['TEAM'], theme: { a: '#ef4444', b: '#60a5fa' } },

  { key: 'math-quiz-arena', title: 'Matematika Quiz Arena', subtitle: 'Arifmetika, algebra va trigonometria savollari.', section: 'subject', difficulty: 'Mixed', modes: ['SOLO', 'TEAM'], theme: { a: '#60a5fa', b: '#22c55e' } },
  { key: 'physics-quiz-lab', title: 'Fizika Quiz Lab', subtitle: 'Formulalar, kuch, energiya va elektr.', section: 'subject', difficulty: 'Mixed', modes: ['SOLO', 'TEAM'], theme: { a: '#22d3ee', b: '#a78bfa' } },
  { key: 'english-vocab-duel', title: 'Ingliz Tili Vocab Duel', subtitle: 'So‘zlar, grammar va sentence builder.', section: 'subject', difficulty: 'Mixed', modes: ['SOLO', 'TEAM'], theme: { a: '#34d399', b: '#f59e0b' } },
  { key: 'bio-quiz-ecosystem', title: 'Biologiya Ecosystem Quiz', subtitle: 'Hujayra, DNK, organlar va ekotizim.', section: 'subject', difficulty: 'Mixed', modes: ['SOLO', 'TEAM'], theme: { a: '#22c55e', b: '#22d3ee' } },
  { key: 'history-timeline', title: 'Tarix Timeline Quiz', subtitle: 'Davrlar, voqealar va shaxslar.', section: 'subject', difficulty: 'Mixed', modes: ['SOLO', 'TEAM'], theme: { a: '#fb7185', b: '#f59e0b' } },
  { key: 'chemistry-reactor', title: 'Kimyo Reactor Quiz', subtitle: 'Elementlar, reaksiyalar va formulalar.', section: 'subject', difficulty: 'Mixed', modes: ['SOLO', 'TEAM'], theme: { a: '#7c3aed', b: '#22d3ee' } },
  { key: 'geography-globe', title: 'Geografiya Globe Quiz', subtitle: 'Xarita, iqlim va dunyo bo‘yicha savollar.', section: 'subject', difficulty: 'Mixed', modes: ['SOLO', 'TEAM'], theme: { a: '#0ea5e9', b: '#10b981' } },
  { key: 'it-code-zone', title: 'Informatika Code Zone', subtitle: 'Kompyuter, internet va dasturlash asoslari.', section: 'subject', difficulty: 'Mixed', modes: ['SOLO', 'TEAM'], theme: { a: '#38bdf8', b: '#6366f1' } },
  { key: 'literature-verse', title: 'Adabiyot Verse Quiz', subtitle: 'Janr, she’r va badiiy tasvir vositalari.', section: 'subject', difficulty: 'Mixed', modes: ['SOLO', 'TEAM'], theme: { a: '#f97316', b: '#ec4899' } },
  { key: 'logic-master', title: 'Mantiq Master Quiz', subtitle: 'Ketma-ketlik, topishmoq va tahliliy savollar.', section: 'subject', difficulty: 'Mixed', modes: ['SOLO', 'TEAM'], theme: { a: '#22c55e', b: '#8b5cf6' } },
]

export const PRO_GAMES = GAMES.filter((g) => g.section === 'pro')
export const SUBJECT_GAMES = GAMES.filter((g) => g.section === 'subject')
