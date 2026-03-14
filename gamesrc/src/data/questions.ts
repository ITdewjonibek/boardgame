import type { Difficulty } from './games'

export type MCQ = {
  id: string
  topic: string
  difficulty: Difficulty
  prompt: string
  options: string[]
  correctIndex: number
  explanation?: string
  section?: string
}

type StudioQuestion = MCQ

const STORAGE_KEY = 'ultimate-games-question-studio-v2'
const q = (x: MCQ) => x

const BANK: MCQ[] = [
  q({ id: 'c1', topic: 'courier', difficulty: 'easy', section: 'Yo‘l qoidalari', prompt: 'Svetafor qizil bo‘lsa nima qilinadi?', options: ['To‘xtash', 'Tezlashish', 'Signal chalish', 'Orqaga qaytish'], correctIndex: 0, explanation: 'Qizil — to‘xtash.' }),
  q({ id: 'c2', topic: 'courier', difficulty: 'easy', section: 'Asosiy hisob', prompt: '1 daqiqa nechta soniya?', options: ['30', '45', '60', '90'], correctIndex: 2 }),
  q({ id: 'c3', topic: 'courier', difficulty: 'medium', section: 'Asosiy hisob', prompt: '12 + 8 = ?', options: ['18', '19', '20', '22'], correctIndex: 2 }),
  q({ id: 'c4', topic: 'courier', difficulty: 'medium', section: 'Logistika', prompt: 'Agar 3 ta svetaforda xato qilib 10s kutsa, jami qancha kutadi?', options: ['20s', '25s', '30s', '40s'], correctIndex: 2 }),
  q({ id: 'c5', topic: 'courier', difficulty: 'hard', section: 'Logistika', prompt: 'Yo‘l: 20 svetafor. Har biridan o‘tish 3s. Xato: 2 marta (10s), to‘g‘ri: qolganlari (0s). Jami vaqt?', options: ['40s', '60s', '80s', '100s'], correctIndex: 2 }),

  q({ id: 'g1', topic: 'gate', difficulty: 'easy', section: 'Arifmetika', prompt: '2 ning kvadrati nechchi?', options: ['2', '3', '4', '6'], correctIndex: 2 }),
  q({ id: 'g2', topic: 'gate', difficulty: 'easy', section: 'English mix', prompt: '"is" fe’li qaysi gapda to‘g‘ri?', options: ['I is happy', 'He is happy', 'They is happy', 'You is happy'], correctIndex: 1 }),
  q({ id: 'g3', topic: 'gate', difficulty: 'medium', section: 'Matematika', prompt: '5! (faktorial) nechchi?', options: ['60', '100', '120', '240'], correctIndex: 2 }),
  q({ id: 'g4', topic: 'gate', difficulty: 'hard', section: 'Kasrlar', prompt: '1/2 + 1/3 = ?', options: ['5/6', '2/5', '1/6', '3/5'], correctIndex: 0 }),

  q({ id: 't1', topic: 'ticket', difficulty: 'easy', section: 'Asosiy', prompt: '7 + 5 = ?', options: ['10', '11', '12', '13'], correctIndex: 2 }),
  q({ id: 't2', topic: 'ticket', difficulty: 'easy', section: 'Geografiya', prompt: 'O‘zbekiston poytaxti?', options: ['Samarqand', 'Toshkent', 'Buxoro', 'Andijon'], correctIndex: 1 }),
  q({ id: 't3', topic: 'ticket', difficulty: 'medium', section: 'Kimyo', prompt: 'H2O bu ...', options: ['Tuz', 'Suv', 'Kislorod', 'Vodorod'], correctIndex: 1 }),
  q({ id: 't4', topic: 'ticket', difficulty: 'medium', section: 'English', prompt: 'English: "book" so‘zi tarjimasi?', options: ['Daftar', 'Kitob', 'Qalam', 'Stol'], correctIndex: 1 }),
  q({ id: 't5', topic: 'ticket', difficulty: 'hard', section: 'Geometriya', prompt: 'Kvadrat perimetri: tomoni 9 bo‘lsa?', options: ['18', '27', '36', '45'], correctIndex: 2 }),

  q({ id: 'w1', topic: 'wheel', difficulty: 'easy', section: 'Matematika', prompt: '10 - 3 = ?', options: ['5', '6', '7', '8'], correctIndex: 2 }),
  q({ id: 'w2', topic: 'wheel', difficulty: 'easy', section: 'Astronomiya', prompt: 'Yer sayyorasi qaysi yulduz atrofida aylanadi?', options: ['Oy', 'Quyosh', 'Saturn', 'Mars'], correctIndex: 1 }),
  q({ id: 'w3', topic: 'wheel', difficulty: 'medium', section: 'Fizika', prompt: 'Elektr kuchlanishining o‘lchov birligi?', options: ['Amper', 'Volt', 'Vatt', 'Om'], correctIndex: 1 }),
  q({ id: 'w4', topic: 'wheel', difficulty: 'hard', section: 'Biologiya', prompt: 'DNK ning to‘liq nomi?', options: ['Deoksiribonuklein kislota', 'Dinamika kislota', 'Nuklein deoksid', 'Ribonuklein kislota'], correctIndex: 0 }),

  q({ id: 'r1', topic: 'rope', difficulty: 'easy', section: 'Qo‘shish', prompt: '6 + 7 = ?', options: ['12', '13', '14', '15'], correctIndex: 1 }),
  q({ id: 'r2', topic: 'rope', difficulty: 'easy', section: 'Ayirish', prompt: '9 - 4 = ?', options: ['3', '4', '5', '6'], correctIndex: 2 }),
  q({ id: 'r3', topic: 'rope', difficulty: 'medium', section: 'Ko‘paytirish', prompt: '8 × 7 = ?', options: ['54', '56', '58', '62'], correctIndex: 1 }),
  q({ id: 'r4', topic: 'rope', difficulty: 'hard', section: 'Ildiz', prompt: '144 ning kvadrat ildizi?', options: ['10', '11', '12', '14'], correctIndex: 2 }),

  q({ id: 'm1', topic: 'math', difficulty: 'easy', section: 'Arifmetika', prompt: '3 + 9 = ?', options: ['10', '11', '12', '13'], correctIndex: 2 }),
  q({ id: 'm2', topic: 'math', difficulty: 'medium', section: 'Algebra', prompt: 'x + 5 = 12, x = ?', options: ['5', '6', '7', '8'], correctIndex: 2 }),
  q({ id: 'm3', topic: 'math', difficulty: 'hard', section: 'Trigonometria', prompt: 'Sin(90°) = ?', options: ['0', '1', '-1', '0.5'], correctIndex: 1 }),

  q({ id: 'p1', topic: 'physics', difficulty: 'easy', section: 'Tezlik', prompt: 'Tezlik formulasi?', options: ['v = s/t', 'v = t/s', 'v = s·t', 'v = s - t'], correctIndex: 0 }),
  q({ id: 'p2', topic: 'physics', difficulty: 'medium', section: 'Kuch', prompt: 'Kuch formulasi?', options: ['F = m·a', 'F = m/a', 'F = a/m', 'F = m + a'], correctIndex: 0 }),
  q({ id: 'p3', topic: 'physics', difficulty: 'hard', section: 'Elektr', prompt: '1 kV nechta V?', options: ['10', '100', '1000', '10000'], correctIndex: 2 }),

  q({ id: 'e1', topic: 'english', difficulty: 'easy', section: 'Grammar', prompt: 'Choose: I ___ a student.', options: ['am', 'is', 'are', 'be'], correctIndex: 0 }),
  q({ id: 'e2', topic: 'english', difficulty: 'medium', section: 'Grammar', prompt: 'Past tense of "go"?', options: ['goed', 'went', 'gone', 'going'], correctIndex: 1 }),
  q({ id: 'e3', topic: 'english', difficulty: 'hard', section: 'Conditionals', prompt: 'Correct: "If I ___ time, I would help."', options: ['have', 'had', 'will have', 'has'], correctIndex: 1 }),

  q({ id: 'b1', topic: 'biology', difficulty: 'easy', section: 'Hujayra', prompt: 'Hujayraning energiya stansiyasi?', options: ['Yadro', 'Mitoxondriya', 'Ribosoma', 'Xloroplast'], correctIndex: 1 }),
  q({ id: 'b2', topic: 'biology', difficulty: 'medium', section: 'DNK', prompt: 'DNK qayerda saqlanadi?', options: ['Sitoplazma', 'Yadro', 'Membrana', 'Vakuola'], correctIndex: 1 }),
  q({ id: 'b3', topic: 'biology', difficulty: 'hard', section: 'Fotosintez', prompt: 'Fotosintezda asosiy pigment?', options: ['Gemoglobin', 'Xlorofill', 'Keratin', 'Insulin'], correctIndex: 1 }),

  q({ id: 'h1', topic: 'history', difficulty: 'easy', section: 'Shaxslar', prompt: 'Amir Temur qaysi hududda hukmronlik qilgan?', options: ['Movarounnahr', 'Misr', 'Yaponiya', 'Kanada'], correctIndex: 0 }),
  q({ id: 'h2', topic: 'history', difficulty: 'medium', section: 'Urushlar', prompt: '1945-yilda tugagan urush?', options: ['Birinchi jahon', 'Ikkinchi jahon', 'Sovuq urush', 'Koreya urushi'], correctIndex: 1 }),
  q({ id: 'h3', topic: 'history', difficulty: 'hard', section: 'Qadimgi dunyo', prompt: 'Rim imperiyasi g‘arbiy qismi qachon qulagan (taxminan)?', options: ['476', '1066', '1492', '1917'], correctIndex: 0 }),

  q({ id: 'ch1', topic: 'chemistry', difficulty: 'easy', section: 'Elementlar', prompt: 'Suvning formulasi?', options: ['H2O', 'CO2', 'O2', 'NaCl'], correctIndex: 0 }),
  q({ id: 'ch2', topic: 'chemistry', difficulty: 'medium', section: 'Davriy jadval', prompt: 'Oltinning kimyoviy belgisi?', options: ['Ag', 'Au', 'Fe', 'Cu'], correctIndex: 1 }),
  q({ id: 'ch3', topic: 'chemistry', difficulty: 'hard', section: 'Reaksiyalar', prompt: 'Kislota va asos reaksiyasidan nima hosil bo‘ladi?', options: ['Faqat gaz', 'Tuz va suv', 'Faqat suv', 'Metall'], correctIndex: 1 }),

  q({ id: 'gq1', topic: 'geography', difficulty: 'easy', section: 'Asosiy', prompt: 'Yer sharining modeli nima?', options: ['Atlas', 'Globus', 'Kompas', 'Termometr'], correctIndex: 1 }),
  q({ id: 'gq2', topic: 'geography', difficulty: 'medium', section: 'Iqlim', prompt: 'Eng katta okean?', options: ['Atlantika', 'Tinch', 'Hind', 'Shimoliy muz'], correctIndex: 1 }),
  q({ id: 'gq3', topic: 'geography', difficulty: 'hard', section: 'Xarita', prompt: 'Geografik koordinatalar nimalardan iborat?', options: ['En va bo‘y', 'Rang va belgilar', 'Masofa va vaqt', 'Suv va quruqlik'], correctIndex: 0 }),

  q({ id: 'it1', topic: 'it', difficulty: 'easy', section: 'Hardware', prompt: 'CPU nimaning qisqartmasi?', options: ['Central Process Unit', 'Central Processing Unit', 'Computer Power Unit', 'Control Processing Utility'], correctIndex: 1 }),
  q({ id: 'it2', topic: 'it', difficulty: 'medium', section: 'Software', prompt: 'Brauzer nima uchun ishlatiladi?', options: ['Rasm chizish', 'Internet ko‘rish', 'Faqat kod yozish', 'Printer boshqarish'], correctIndex: 1 }),
  q({ id: 'it3', topic: 'it', difficulty: 'hard', section: 'Programming', prompt: 'HTML nima?', options: ['Dasturlash tili', 'Belgilash tili', 'Operatsion tizim', 'Brauzer'], correctIndex: 1 }),

  q({ id: 'l1', topic: 'literature', difficulty: 'easy', section: 'Nazariya', prompt: 'She’r nima?', options: ['Ritmli badiiy matn', 'Qonun hujjati', 'Faqat maqola', 'Hisobot'], correctIndex: 0 }),
  q({ id: 'l2', topic: 'literature', difficulty: 'medium', section: 'Janrlar', prompt: 'Roman qaysi turga kiradi?', options: ['Lirika', 'Epik', 'Dramatik', 'Publitsistik'], correctIndex: 1 }),
  q({ id: 'l3', topic: 'literature', difficulty: 'hard', section: 'Badiiyat', prompt: 'Tashbeh nimani bildiradi?', options: ['Taqqoslash', 'Takrorlash', 'Qisqartirish', 'Sarlavha'], correctIndex: 0 }),

  q({ id: 'lo1', topic: 'logic', difficulty: 'easy', section: 'Ketma-ketlik', prompt: '2, 4, 6, 8, ... keyingi son?', options: ['9', '10', '11', '12'], correctIndex: 1 }),
  q({ id: 'lo2', topic: 'logic', difficulty: 'medium', section: 'Tahlil', prompt: 'Barcha mushuklar hayvon. Momiq mushuk. Demak?', options: ['Momiq qush', 'Momiq hayvon', 'Momiq daraxt', 'Hech narsa'], correctIndex: 1 }),
  q({ id: 'lo3', topic: 'logic', difficulty: 'hard', section: 'Mantiq', prompt: 'Agar barcha A lar B bo‘lsa va barcha B lar C bo‘lsa, unda barcha A lar ...?', options: ['A', 'B', 'C', 'D'], correctIndex: 2 }),
]

function readStudioBank(): StudioQuestion[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StudioQuestion[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveStudioQuestion(question: Omit<StudioQuestion, 'id'>) {
  if (typeof window === 'undefined') return
  const next = [...readStudioBank(), { ...question, id: `custom-${Date.now()}` }]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function getAllQuestions() {
  return [...BANK, ...readStudioBank()]
}

export function getSections(topic: string) {
  return Array.from(new Set(getAllQuestions().filter((x) => x.topic === topic).map((x) => x.section || 'Asosiy')))
}

export function getQuestions(topic: string, difficulty: Difficulty, count: number, section?: string): MCQ[] {
  const pool = getAllQuestions().filter((x) => x.topic === topic && x.difficulty === difficulty && (!section || (x.section || 'Asosiy') === section))
  if (pool.length === 0) return []
  const start = Math.floor(Math.random() * pool.length)
  return Array.from({ length: count }, (_, i) => pool[(start + i) % pool.length])
}

export function getMixedQuestions(topic: string, count: number, section?: string): MCQ[] {
  const pool = getAllQuestions().filter((x) => x.topic === topic && (!section || (x.section || 'Asosiy') === section))
  if (pool.length === 0) return []
  const start = Math.floor(Math.random() * pool.length)
  return Array.from({ length: count }, (_, i) => pool[(start + i) % pool.length])
}

export function formatDifficulty(d: Difficulty) {
  return d === 'easy' ? 'Oson' : d === 'medium' ? 'O‘rta' : 'Qiyin'
}
