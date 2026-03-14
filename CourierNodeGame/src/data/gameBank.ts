export type GameKey =
  | 'courier-road'
  | 'neo-2048'
  | 'lucky-ticket'
  | 'lucky-wheel'
  | 'tug-of-war'
  | 'math'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'history'
  | 'geography'
  | 'english'
  | 'mother-language'
  | 'informatics'
  | 'logic'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type QuizQuestion = {
  id: string
  topic: string
  difficulty: Difficulty
  prompt: string
  options: string[]
  correctIndex: number
}

export const PRO_GAMES = [
  { key: 'courier-road', title: 'Courier Road Quiz', subtitle: 'Yo\'l, mashina va split-screen test', badge: 'PRO', difficulty: 'Mixed', color: 'from-fuchsia-500 to-cyan-400' },
  { key: 'neo-2048', title: 'NEO 2048 Gate', subtitle: 'Merge + quiz gate challenge', badge: 'PRO', difficulty: 'Hard', color: 'from-sky-500 to-violet-500' },
  { key: 'lucky-ticket', title: 'Omadli Chipta', subtitle: 'Random chipta ochiladi va savol chiqadi', badge: 'PRO', difficulty: 'Medium', color: 'from-amber-400 to-rose-400' },
  { key: 'lucky-wheel', title: 'Omadli Baraban', subtitle: 'Baraban to\'xtagan raqamga mos savol', badge: 'PRO', difficulty: 'Mixed', color: 'from-violet-500 to-emerald-400' },
  { key: 'tug-of-war', title: 'Arqon Tortish Battle', subtitle: '2 jamoa, to\'g\'ri javob — arqon siz tomonga', badge: 'TEAM', difficulty: 'Medium', color: 'from-red-500 to-blue-500' },
] as const

export const SUBJECT_GAMES = [
  { key: 'math', title: 'Matematika Arena', subtitle: 'Sonlar, algebra, geometriya', color: 'from-sky-500 to-emerald-400' },
  { key: 'physics', title: 'Fizika Lab', subtitle: 'Kuch, energiya, tezlik, elektr', color: 'from-cyan-400 to-violet-500' },
  { key: 'chemistry', title: 'Kimyo Zone', subtitle: 'Element, formula va reaksiyalar', color: 'from-pink-500 to-amber-400' },
  { key: 'biology', title: 'Biologiya Eco', subtitle: 'Hujayra, DNK, fotosintez', color: 'from-emerald-400 to-cyan-400' },
  { key: 'history', title: 'Tarix Timeline', subtitle: 'Davrlar va voqealar', color: 'from-rose-500 to-orange-400' },
  { key: 'geography', title: 'Geografiya Globe', subtitle: 'Davlatlar va tabiat', color: 'from-blue-500 to-teal-400' },
  { key: 'english', title: 'English Duel', subtitle: 'Vocabulary va grammar', color: 'from-lime-400 to-sky-500' },
  { key: 'mother-language', title: 'Ona Tili Pro', subtitle: 'Imlo, gap va so\'z turkumlari', color: 'from-violet-500 to-pink-500' },
  { key: 'informatics', title: 'Informatika Tech', subtitle: 'Kompyuter va algoritm', color: 'from-slate-500 to-cyan-400' },
  { key: 'logic', title: 'Mantiq Puzzle', subtitle: 'Mantiqiy savollar va topqirlik', color: 'from-fuchsia-500 to-indigo-500' },
] as const

const make = (q: Omit<QuizQuestion, 'id'> & { id?: string }): QuizQuestion => ({ id: q.id ?? Math.random().toString(36).slice(2), ...q })

export const QUESTION_BANK: QuizQuestion[] = [
  make({ topic: 'courier-road', difficulty: 'easy', prompt: 'Qizil chiroqda nima qilinadi?', options: ['To\'xtash', 'Tezlashish', 'Signal chalish', 'Chapga burilish'], correctIndex: 0 }),
  make({ topic: 'courier-road', difficulty: 'easy', prompt: '1 daqiqa nechta soniya?', options: ['30', '45', '60', '90'], correctIndex: 2 }),
  make({ topic: 'courier-road', difficulty: 'medium', prompt: '12 + 8 = ?', options: ['18', '19', '20', '22'], correctIndex: 2 }),
  make({ topic: 'courier-road', difficulty: 'medium', prompt: '20 ta postdan 5 tasi o\'tildi. Necha foiz yo\'l yurildi?', options: ['20%', '25%', '30%', '40%'], correctIndex: 1 }),
  make({ topic: 'courier-road', difficulty: 'hard', prompt: 'Mashina 4 ta to\'g\'ri javob bilan 4 qadam, 1 ta xato bilan 1 qadam orqaga yursa, natija?', options: ['2', '3', '4', '5'], correctIndex: 2 }),

  make({ topic: 'neo-2048', difficulty: 'easy', prompt: '2 ning kvadrati nechchi?', options: ['2', '3', '4', '6'], correctIndex: 2 }),
  make({ topic: 'neo-2048', difficulty: 'medium', prompt: '2 + 2 + 4 = ?', options: ['6', '8', '10', '12'], correctIndex: 1 }),
  make({ topic: 'neo-2048', difficulty: 'hard', prompt: '5! nechchiga teng?', options: ['60', '120', '240', '720'], correctIndex: 1 }),

  make({ topic: 'lucky-ticket', difficulty: 'easy', prompt: '7 + 5 = ?', options: ['10', '11', '12', '13'], correctIndex: 2 }),
  make({ topic: 'lucky-ticket', difficulty: 'easy', prompt: 'O\'zbekiston poytaxti?', options: ['Samarqand', 'Toshkent', 'Buxoro', 'Nukus'], correctIndex: 1 }),
  make({ topic: 'lucky-ticket', difficulty: 'medium', prompt: 'H2O bu?', options: ['Suv', 'Tuz', 'Gaz', 'Kislota'], correctIndex: 0 }),
  make({ topic: 'lucky-ticket', difficulty: 'hard', prompt: '9 tomonga ega shakl nima?', options: ['Oktagon', 'Nonagon', 'Dekagon', 'Pentagon'], correctIndex: 1 }),

  make({ topic: 'lucky-wheel', difficulty: 'easy', prompt: '10 - 3 = ?', options: ['5', '6', '7', '8'], correctIndex: 2 }),
  make({ topic: 'lucky-wheel', difficulty: 'medium', prompt: 'Elektr kuchlanish birligi?', options: ['Vatt', 'Amper', 'Volt', 'Om'], correctIndex: 2 }),
  make({ topic: 'lucky-wheel', difficulty: 'hard', prompt: 'DNK to\'liq nomi?', options: ['Deoksiribonuklein kislota', 'Ribonuklein kislota', 'Karbonat kislota', 'Sulfat kislota'], correctIndex: 0 }),

  make({ topic: 'tug-of-war', difficulty: 'easy', prompt: '6 + 7 = ?', options: ['12', '13', '14', '15'], correctIndex: 1 }),
  make({ topic: 'tug-of-war', difficulty: 'easy', prompt: '18 - 16 = ?', options: ['1', '2', '3', '4'], correctIndex: 1 }),
  make({ topic: 'tug-of-war', difficulty: 'medium', prompt: '8 × 7 = ?', options: ['54', '56', '58', '62'], correctIndex: 1 }),
  make({ topic: 'tug-of-war', difficulty: 'hard', prompt: '144 ning kvadrat ildizi?', options: ['10', '11', '12', '14'], correctIndex: 2 }),

  make({ topic: 'math', difficulty: 'easy', prompt: '3 + 9 = ?', options: ['10', '11', '12', '13'], correctIndex: 2 }),
  make({ topic: 'math', difficulty: 'medium', prompt: 'x + 5 = 12, x = ?', options: ['5', '6', '7', '8'], correctIndex: 2 }),
  make({ topic: 'math', difficulty: 'hard', prompt: '49 ning kvadrat ildizi?', options: ['5', '6', '7', '8'], correctIndex: 2 }),

  make({ topic: 'physics', difficulty: 'easy', prompt: 'Tezlik formulasi?', options: ['v=s/t', 'v=t/s', 'v=s×t', 'v=s-t'], correctIndex: 0 }),
  make({ topic: 'physics', difficulty: 'medium', prompt: 'Kuch formulasi?', options: ['F=m×a', 'F=m/a', 'F=a/m', 'F=m+a'], correctIndex: 0 }),
  make({ topic: 'physics', difficulty: 'hard', prompt: '1 kV nechta V?', options: ['10', '100', '1000', '10000'], correctIndex: 2 }),

  make({ topic: 'chemistry', difficulty: 'easy', prompt: 'Suv formulasi?', options: ['CO2', 'H2O', 'O2', 'NaCl'], correctIndex: 1 }),
  make({ topic: 'chemistry', difficulty: 'medium', prompt: 'NaCl bu?', options: ['Shakar', 'Tuz', 'Suv', 'Gaz'], correctIndex: 1 }),
  make({ topic: 'chemistry', difficulty: 'hard', prompt: 'Atom markazida nima bo\'ladi?', options: ['Elektron', 'Yadro', 'Neyron tarmoq', 'Proyektor'], correctIndex: 1 }),

  make({ topic: 'biology', difficulty: 'easy', prompt: 'Hujayra energiya stansiyasi?', options: ['Yadro', 'Mitoxondriya', 'Membrana', 'Vakuola'], correctIndex: 1 }),
  make({ topic: 'biology', difficulty: 'medium', prompt: 'DNK qayerda joylashadi?', options: ['Yadro', 'Ko\'z', 'Jigar', 'Suyak'], correctIndex: 0 }),
  make({ topic: 'biology', difficulty: 'hard', prompt: 'Fotosintez pigmenti?', options: ['Gemoglobin', 'Insulin', 'Xlorofill', 'Keratin'], correctIndex: 2 }),

  make({ topic: 'history', difficulty: 'easy', prompt: 'Amir Temur qaysi hududda hukmronlik qilgan?', options: ['Movarounnahr', 'Kanada', 'Yaponiya', 'Braziliya'], correctIndex: 0 }),
  make({ topic: 'history', difficulty: 'medium', prompt: '1945 yilda tugagan urush?', options: ['1-jahon', '2-jahon', 'Koreya', 'Sovuq urush'], correctIndex: 1 }),
  make({ topic: 'history', difficulty: 'hard', prompt: 'G\'arbiy Rim imperiyasi taxminan qachon qulagan?', options: ['476', '1066', '1492', '1917'], correctIndex: 0 }),

  make({ topic: 'geography', difficulty: 'easy', prompt: 'Eng katta okean?', options: ['Atlantika', 'Hind', 'Tinch', 'Shimoliy Muz'], correctIndex: 2 }),
  make({ topic: 'geography', difficulty: 'medium', prompt: 'O\'zbekistonga qo\'shni davlat?', options: ['Fransiya', 'Qirg\'iziston', 'Kanada', 'Hindiston'], correctIndex: 1 }),
  make({ topic: 'geography', difficulty: 'hard', prompt: 'Ekvator nimani bo\'ladi?', options: ['Yer sharini 2 qismga', 'Okeanni 4 qismga', 'Oy yuzasini', 'Atmosferani'], correctIndex: 0 }),

  make({ topic: 'english', difficulty: 'easy', prompt: 'I ___ a student.', options: ['am', 'is', 'are', 'be'], correctIndex: 0 }),
  make({ topic: 'english', difficulty: 'medium', prompt: 'Past tense of go?', options: ['goed', 'went', 'gone', 'goes'], correctIndex: 1 }),
  make({ topic: 'english', difficulty: 'hard', prompt: 'If I ___ time, I would help.', options: ['have', 'had', 'has', 'will have'], correctIndex: 1 }),

  make({ topic: 'mother-language', difficulty: 'easy', prompt: 'Ot nima bildiradi?', options: ['Harakat', 'Belgi', 'Predmet', 'Holat'], correctIndex: 2 }),
  make({ topic: 'mother-language', difficulty: 'medium', prompt: 'Gap oxiriga nima qo\'yiladi?', options: ['Vergul', 'Nuqta', 'Ikki nuqta', 'Qavs'], correctIndex: 1 }),
  make({ topic: 'mother-language', difficulty: 'hard', prompt: 'Sifat nimani bildiradi?', options: ['Harakat', 'Belgini', 'Predmetni', 'Sonni'], correctIndex: 1 }),

  make({ topic: 'informatics', difficulty: 'easy', prompt: 'Kompyuter miyasi?', options: ['Monitor', 'Klaviatura', 'Protsessor', 'Sichqoncha'], correctIndex: 2 }),
  make({ topic: 'informatics', difficulty: 'medium', prompt: 'Algoritm nima?', options: ['Rasm', 'Buyruqlar ketma-ketligi', 'O\'yin', 'Sarlavha'], correctIndex: 1 }),
  make({ topic: 'informatics', difficulty: 'hard', prompt: 'HTML nima uchun?', options: ['Stil berish', 'Sahifa tuzish', 'Server boshqarish', 'Audio yozish'], correctIndex: 1 }),

  make({ topic: 'logic', difficulty: 'easy', prompt: '2, 4, 6, ? ketma-ketlik', options: ['7', '8', '9', '10'], correctIndex: 1 }),
  make({ topic: 'logic', difficulty: 'medium', prompt: 'Barcha gullar o\'simlik. Atirgul gul. Demak?', options: ['Atirgul daraxt', 'Atirgul o\'simlik', 'Atirgul hayvon', 'Atirgul suv'], correctIndex: 1 }),
  make({ topic: 'logic', difficulty: 'hard', prompt: '3 ta kalitdan bittasi eshikni ochadi. Eng kamida nechta urinish kerak?', options: ['1', '2', '3', '4'], correctIndex: 2 }),
]

export function getQuestions(topic: string, difficulty: Difficulty, count = 10) {
  const pool = QUESTION_BANK.filter((q) => q.topic === topic && q.difficulty === difficulty)
  const fallback = QUESTION_BANK.filter((q) => q.topic === topic)
  const source = pool.length ? pool : fallback
  return Array.from({ length: count }, (_, i) => source[i % source.length])
}

export function getMixedQuestions(topic: string, count = 10) {
  const pool = QUESTION_BANK.filter((q) => q.topic === topic)
  return Array.from({ length: count }, (_, i) => pool[i % pool.length])
}

export function difficultyLabel(d: Difficulty) {
  return d === 'easy' ? 'Oson' : d === 'medium' ? 'O\'rta' : 'Qiyin'
}
