import type { Question, TestSection } from './types'

const easyQuestions: Question[] = [
  {
    id: '1',
    prompt: '2 + 2 = ?',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    difficulty: 'oson',
    sectionId: 'default',
  },
  {
    id: '2',
    prompt: 'O\'zbekiston poytaxti qaysi shahar?',
    options: ['Samarqand', 'Buxoro', 'Toshkent', 'Andijon'],
    correctIndex: 2,
    difficulty: 'oson',
    sectionId: 'default',
  },
  {
    id: '3',
    prompt: 'Dunyo qaysi sayyora?',
    options: ['Mars', 'Yer', 'Venera', 'Yupiter'],
    correctIndex: 1,
    difficulty: 'oson',
    sectionId: 'default',
  },
  {
    id: '4',
    prompt: 'Suvning kimyoviy formulasi nima?',
    options: ['H2O', 'CO2', 'O2', 'N2'],
    correctIndex: 0,
    difficulty: 'oson',
    sectionId: 'default',
  },
  {
    id: '5',
    prompt: 'Qush qanday hayvon?',
    options: ['Baliq', 'Hasharot', 'Qushqoqi', 'Quruqlikda yashovchi'].map((v) => v),
    correctIndex: 2,
    difficulty: 'oson',
    sectionId: 'default',
  },
]

const mediumQuestions: Question[] = [
  {
    id: '6',
    prompt: 'Kvadratning tomoni 5 ga teng, maydoni nimaga teng?',
    options: ['10', '15', '25', '35'],
    correctIndex: 2,
    difficulty: 'orta',
    sectionId: 'default',
  },
  {
    id: '7',
    prompt: 'Internet qaysi yilda ixtiro qilindi?',
    options: ['1970', '1980', '1990', '2000'],
    correctIndex: 0,
    difficulty: 'orta',
    sectionId: 'default',
  },
  {
    id: '8',
    prompt: 'DNA qanday molekuladir?',
    options: ['Protein', 'Nukleotid', 'Karbohydrat', 'Lemma'],
    correctIndex: 1,
    difficulty: 'orta',
    sectionId: 'default',
  },
  {
    id: '9',
    prompt: 'O\'zbekiston qaysi yilda mustaqil davlat bo\'ldi?',
    options: ['1989', '1990', '1991', '1992'],
    correctIndex: 2,
    difficulty: 'orta',
    sectionId: 'default',
  },
  {
    id: '10',
    prompt: 'Svetoforning qizil rangi nimani anglatadi?',
    options: ['Oldinga yo\'l bor', 'To\'xtang', 'Tayyorlaning', 'Perekrestka'],
    correctIndex: 1,
    difficulty: 'orta',
    sectionId: 'default',
  },
]

const hardQuestions: Question[] = [
  {
    id: '11',
    prompt: 'Pifalgoraning teoremasini ayting?',
    options: [
      'a + b = c',
      'a² + b² = c²',
      'a × b = c',
      'a - b = c²',
    ],
    correctIndex: 1,
    difficulty: 'qiyin',
    sectionId: 'default',
  },
  {
    id: '12',
    prompt: 'Fotosintez jarayonida qanday gaz ishlatiladi?',
    options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Sulfur dioxide'],
    correctIndex: 2,
    difficulty: 'qiyin',
    sectionId: 'default',
  },
  {
    id: '13',
    prompt: 'Birinchi Jahon urushi qaysi yillarda bo\'ldi?',
    options: ['1910-1918', '1914-1918', '1920-1925', '1905-1910'],
    correctIndex: 1,
    difficulty: 'qiyin',
    sectionId: 'default',
  },
  {
    id: '14',
    prompt: 'Elektronnite negativ zaryadli qoldiqlar nima deyiladi?',
    options: ['Proton', 'Neytron', 'Positron', 'Electron'],
    correctIndex: 3,
    difficulty: 'qiyin',
    sectionId: 'default',
  },
  {
    id: '15',
    prompt: 'Qaysi davlatning poytaxti Moskva?',
    options: ['Qozog\'iston', 'Rossiya', 'Belorussiya', 'Ukraina'],
    correctIndex: 1,
    difficulty: 'qiyin',
    sectionId: 'default',
  },
]

export function generateMockQuestions() {
  return [...easyQuestions, ...mediumQuestions, ...hardQuestions]
}

export function getMockSections(): TestSection[] {
  return [
    {
      id: 'sec_1',
      name: 'Matematika Asoslari',
      description: 'Asosiy matematika savollari',
      questions: easyQuestions.slice(0, 5),
      difficulty: 'oson',
      createdAt: Date.now(),
      teacherId: 'teacher_1',
    },
    {
      id: 'sec_2',
      name: 'Biologiya va Kimyo',
      description: 'Biologiya va kimyo darslari',
      questions: mediumQuestions.slice(0, 5),
      difficulty: 'orta',
      createdAt: Date.now() + 1000,
      teacherId: 'teacher_1',
    },
  ]
}
