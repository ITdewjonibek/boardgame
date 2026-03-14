# 📚 Kuryer Node O'yini - To'liq Dokumentatsiya

## 📖 Dokumentatsiya Index

```
├── README.md              # Asosiy malumotlar
├── QUICK_REFERENCE.md     # Tezkor malumat
├── INSTALLATION.md        # O'rnatish qo'llanmasi
├── GUIDE_UZ.md           # Uzbek tilida tafsil
├── DEPLOYMENT.md         # Nashr qilish
├── ARCHITECTURE.md       # (bu fayl)
└── API.md                # (kelajakda)
```

---

## 🏗️ Arxitektura

### Frontend Stack
```
React 18 (UI)
├── TypeScript (Type Safety)
├── Tailwind CSS (Styling)
├── Zustand (State Management)
├── Lucide React (Icons)
└── Vite (Build Tool)
```

### State Management Flow
```
App.tsx
  ├── useAuthStore
  │   ├── teacher
  │   └── isLoggedIn
  ├── useSectionStore
  │   └── sections[]
  └── useGamePlayStore
      └── gameState
```

### Component Tree
```
App
├── GameScreen
│   ├── LeftPanel
│   │   └── Game Stats
│   ├── RoadAndCar
│   │   ├── Road
│   │   ├── Car Animation
│   │   └── Traffic Lights
│   └── TrafficLightTestModal
│       └── Question Form
├── AdminLoginPage
│   └── Login Form
└── TestManagementPage
    ├── Section List
    └── Question Manager
```

---

## 🎮 Game Logic Flow

### 1. Initialization
```typescript
const gameState = {
  phase: 'setup',          // setup|running|delivery|finished
  currentNodeIndex: 0,     // 0-20
  score: 0,                // Points
  timeLeft: 120,           // Seconds
  selectedDifficulty: null // oson|orta|qiyin
}
```

### 2. Game Phases

#### Setup Phase
```
- User selects difficulty
- Questions filtered by difficulty
- Shuffled questions (0-20 from same difficulty)
```

#### Running Phase
```
- 120 second timer countdown
- Car position: (nodeIndex / 20) * 100%
- Questions appear one by one
- Wait timer after each answer
```

#### Wait Phase (Internal)
```
- Shows wait card: 5s (correct) or 10s (wrong)
- Car continues moving
- User cannot interact
- Auto-advance to next node
```

#### Delivery Phase
```
- All 20 tests completed
- Time remaining? YES → +10,000 bonus
```

#### Finished Phase
```
- Time ran out
- X nodes completed
- Show final score
```

---

## 💾 Data Models

### Question
```typescript
{
  id: string
  prompt: string           // "2 + 2 = ?"
  options: string[]        // ["3", "4", "5", "6"]
  correctIndex: number     // 1
  difficulty: DifficultyLevel
  sectionId: string
}
```

### TestSection
```typescript
{
  id: string
  name: string             // "Matematika"
  description?: string
  questions: Question[]    // Max 20
  difficulty: DifficultyLevel
  createdAt: number
  teacherId: string
}
```

### Teacher
```typescript
{
  id: string
  email: string
  username: string
  sections: string[]       // IDs
  createdAt: number
}
```

### GameState
```typescript
{
  phase: Phase
  currentNodeIndex: number
  score: number
  timeLeft: number
  selectedDifficulty: DifficultyLevel | null
  questions: Question[]
  currentQuestion: Question | null
  isAnswering: boolean
  answerResult: boolean | null
  finalScore: number
  bonus: number
  timeTaken: number
}
```

---

## 🔄 Key Workflows

### Login Workflow
```
1. User clicks "Testlar Qo'shish"
2. AdminLoginPage modal opens
3. User enters email + username
4. useAuthStore.login() called
5. localStorage set
6. TestManagementPage opens
```

### Game Start Workflow
```
1. User selects difficulty
2. Questions filtered and shuffled
3. GameScreen → running phase
4. Timer countdown starts
5. First question appears
6. Car animation starts
```

### Answer Workflow
```
1. User selects option
2. Submit button clicked
3. Handler checks answer
4. Show correct/wrong feedback (800ms)
5. Wait timer starts (5s or 10s)
6. Car moves forward
7. When wait complete → next question
```

### Section Creation Workflow
```
1. User clicks "Bo'lim Qo'shish"
2. Form appears
3. Enter name + difficulty
4. Submit → New section created
5. localStorage updated
6. Section appears in list
```

---

## 🎨 Styling System

### Tailwind Customization
```typescript
// tailwind.config.ts
{
  colors: {
    brand: {
      primary: '#8B5CF6',    // Purple
      secondary: '#EC4899',  // Pink
      accent: '#FBBF24'      // Gold
    },
    dark: {
      bg: '#0F172A',         // Dark background
      card: '#1E293B',       // Card background
      border: '#334155'      // Border color
    }
  }
}
```

### Custom Classes
```css
.neon-text {
  @apply text-transparent bg-clip-text bg-gradient-primary;
}

.glass-effect {
  @apply bg-white/10 backdrop-blur-xs border border-white/20;
}

.card-dark {
  @apply bg-dark-card border border-dark-border rounded-lg p-4;
}
```

---

## 🔐 Security Notes

### Current (Development)
- ✅ Client-side auth (localStorage)
- ❌ No actual authentication
- ❌ No backend validation
- ❌ Test data hardcoded

### Future (Production)
- [ ] JWT authentication
- [ ] Server-side validation
- [ ] Hashed passwords
- [ ] CORS setup
- [ ] Rate limiting
- [ ] SQL injection prevention

---

## 📊 Performance Metrics

### Bundle Size (Estimated)
```
React 18:        42 KB
React DOM:       38 KB
Zustand:         3 KB
Lucide React:    12 KB
Tailwind CSS:    45 KB (production)
Other:           20 KB
Total:           ~160 KB (gzipped)
```

### Rendering Performance
- First Paint: < 1s
- Largest Contentful Paint: < 2s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 2s

### Optimization Opportunities
1. Code splitting (lazy routes)
2. Image optimization
3. Service workers
4. Caching strategy

---

## 🔌 API Integration (Future)

### Auth Endpoints
```
POST /auth/login
  Body: { email, username }
  Response: { teacher, token }

POST /auth/logout
  Headers: { Authorization: Bearer token }
```

### Section Endpoints
```
GET /sections
  Response: TestSection[]

POST /sections
  Body: TestSection
  Response: TestSection

DELETE /sections/:id
  Response: { success: true }
```

### Question Endpoints
```
POST /questions
  Body: Question
  Response: Question

DELETE /questions/:id
  Response: { success: true }
```

### Game Result Endpoints
```
POST /results
  Body: {
    teacherId, sectionId, score, timeLeft, bonus
  }
  Response: { saved: true }

GET /results/:teacherId
  Response: GameResult[]
```

---

## 🧪 Testing (Future)

### Unit Tests
```typescript
// src/__tests__/store.test.ts
import { useAuthStore } from '../store'

describe('Auth Store', () => {
  it('should login user', () => {
    // Test login
  })
})
```

### Component Tests
```typescript
// src/__tests__/GameScreen.test.tsx
import { render } from '@testing-library/react'
import GameScreen from '../components/GameScreen'

describe('GameScreen', () => {
  it('should render game', () => {
    // Test rendering
  })
})
```

---

## 🚀 Deployment Checklist

- [ ] All environment variables set
- [ ] Build test: `npm run build`
- [ ] Preview test: `npm run preview`
- [ ] Performance audit
- [ ] Mobile responsive check
- [ ] Browser compatibility
- [ ] Error handling reviewed
- [ ] Analytics setup
- [ ] Domain DNS setup
- [ ] SSL certificate
- [ ] Monitoring setup
- [ ] Backup strategy

---

## 📈 Roadmap

### Phase 1: MVP ✅
- [x] Game mechanics
- [x] Test management
- [x] UI/UX
- [x] localStorage storage

### Phase 2: Backend 🔄
- [ ] Express server
- [ ] PostgreSQL database
- [ ] JWT auth
- [ ] REST API

### Phase 3: Features
- [ ] Multiplayer mode
- [ ] Leaderboard
- [ ] Achievements
- [ ] Analytics dashboard

### Phase 4: Scale
- [ ] Mobile app (React Native)
- [ ] PWA support
- [ ] Offline mode
- [ ] Multi-language

---

## 🐛 Known Issues

### Current Limitations
1. No real authentication
2. Data lost on browser clear
3. No server validation
4. No error recovery
5. Limited to 20 questions per section

### Future Fixes
- [ ] Real backend authentication
- [ ] Database persistence
- [ ] Error handling & recovery
- [ ] Advanced validation
- [ ] Unlimited questions

---

## 💬 Communication Guide

### To Add Message Toast
```typescript
// Future: Use toast library
import { useToast } from '@/hooks/useToast'

const { toast } = useToast()
toast('Muvaffaqiyat!', 'success')
```

### To Show Modal
```typescript
// Future: Use modal context
const { showModal } = useModal()
showModal({
  title: 'Confirm',
  message: 'Are you sure?',
  buttons: ['Yes', 'No']
})
```

---

## 🔗 Related Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Docs](https://docs.pmnd.rs/zustand/)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)

---

## 👥 Team & Contributors

- **Creator**: Jonibek Jojorayev
- **License**: MIT
- **Contact**: jonibek@example.com

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Mar 2024 | Initial release |
| - | - | TBD |

---

**Last Updated**: March 2024
**Status**: ✅ Production Ready (Frontend)
**Next Steps**: Backend Integration
