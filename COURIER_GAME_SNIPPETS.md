# 🔧 COURIER GAME - CODE EXAMPLES & SNIPPETS

## Integration Guide with Code Samples

---

## 1. USING THE CONFIG IN YOUR COMPONENTS

### Example 1: Fetch Questions
```typescript
import { API_ENDPOINTS, getAuthHeader } from '@/Services/config'

async function loadQuestions(sectionId: number) {
  try {
    const response = await fetch(
      API_ENDPOINTS.GAME_QUESTIONS(sectionId),
      {
        headers: getAuthHeader(),
      }
    )
    if (!response.ok) throw new Error('Failed to load')
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### Example 2: Create Section (Teacher)
```typescript
import { API_ENDPOINTS, getAuthHeader, getAuthToken } from '@/Services/config'

async function createSection(subjectId: number, title: string) {
  const token = getAuthToken()
  if (!token) {
    navigate('/login')
    return
  }

  const response = await fetch(API_ENDPOINTS.SECTIONS_CREATE, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({
      subject_id: subjectId,
      teacher_name: 'current_user', // In real app, get from auth
      title: title,
    }),
  })
  
  return await response.json()
}
```

### Example 3: Login with Token Storage
```typescript
import { loginUser } from '@/Services/auth'
import { getAuthToken } from '@/Services/config'

async function handleLogin(username: string, password: string) {
  try {
    const result = await loginUser(username, password)
    // Token automatically stored by auth.ts
    
    if (getAuthToken()) {
      // Redirect to game or teacher panel
      navigate('/games/courier-mode')
    }
  } catch (error) {
    // Show error message
  }
}
```

---

## 2. GAME STATE MANAGEMENT PATTERN

### State Hook
```typescript
const [phase, setPhase] = useState<'setup' | 'running' | 'waiting' | 'finished'>('setup')
const [checkpointIndex, setCheckpointIndex] = useState(0)
const [waitCountdown, setWaitCountdown] = useState<number | null>(null)
```

### State Transitions
```typescript
// Setup → Running
const startGame = () => {
  setPhase('running')
  setCheckpointIndex(0)
  showNextQuestion()
}

// Running → Waiting
const handleAnswer = (isCorrect: boolean) => {
  setPhase('waiting')
  setWaitCountdown(isCorrect ? 5 : 10)
}

// Waiting → Running (auto-advance)
useEffect(() => {
  if (waitCountdown === null || waitCountdown > 0) return
  
  if (checkpointIndex < 19) {
    setCheckpointIndex(i => i + 1)
    showNextQuestion()
  } else {
    setPhase('finished')
  }
}, [waitCountdown])
```

---

## 3. BACKEND USAGE EXAMPLES

### Create Section (FastAPI)
```python
# POST /tests/sections/
@router.post("/", response_model=SectionSchema)
def create_section(
    section: SectionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Logic here
    db_section = Section(
        title=section.title,
        subject_id=section.subject_id,
        teacher_name=current_user['username']
    )
    db.add(db_section)
    db.commit()
    return db_section
```

### Fetch Questions Endpoint
```python
# GET /tests/sections/{section_id}/questions
@router.get("/{section_id}/questions")
def get_section_questions(section_id: int, db: Session = Depends(get_db)):
    section = db.query(Section).filter(Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404)
    
    questions = []
    for test in section.tests:
        for q in test.questions:
            questions.append({
                "id": q.id,
                "question": q.text,
                "options": [opt.text for opt in q.options],
                "correctIndex": q.correct_option,
                "testId": test.id
            })
    
    return {"questions": questions}
```

### Test Creation with Section
```python
# POST /tests/ with section_id
@router.post("/", response_model=TestSchema)
def create_test(
    test: TestCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Validate section
    if test.section_id:
        section = db.query(Section).filter(
            Section.id == test.section_id
        ).first()
        if not section:
            raise HTTPException(status_code=404, detail="Section not found")
        
        # Check 20-test limit
        count = db.query(Test).filter(
            Test.section_id == test.section_id
        ).count()
        if count >= 20:
            raise HTTPException(status_code=400, detail="Section limit reached")
    
    # Create test with section_id and difficulty
    db_test = Test(
        title=test.title,
        subject_id=test.subject_id,
        teacher_name=current_user['username'],
        section_id=test.section_id,
        difficulty=test.difficulty  # "easy", "medium", or "hard"
    )
    db.add(db_test)
    db.commit()
    return db_test
```

---

## 4. COMMON API CALL PATTERNS

### Pattern: Fetch with Auth
```typescript
// Reusable function
async function apiCall(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: any
) {
  const headers = getAuthHeader()
  const options: RequestInit = {
    method,
    headers,
  }
  
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body)
  }
  
  const response = await fetch(endpoint, options)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  
  return response.json()
}

// Usage
const questions = await apiCall(
  API_ENDPOINTS.GAME_QUESTIONS(1)
)

const section = await apiCall(
  API_ENDPOINTS.SECTIONS_CREATE,
  'POST',
  { subject_id: 1, title: "Test Section" }
)
```

---

## 5. QUIZ ANSWER HANDLING

### Question Format (from backend)
```typescript
interface Question {
  id: number
  question: string
  options: string[]
  correctIndex: number
  testId: number
}
```

### Answer Validation
```typescript
function handleAnswer(selectedIndex: number, question: Question): boolean {
  const isCorrect = selectedIndex === question.correctIndex
  
  if (isCorrect) {
    setScore(s => s + 10)
    setWaitCountdown(5)
  } else {
    setPenalty(p => p + 1)
    setWaitCountdown(10)
  }
  
  return isCorrect
}
```

---

## 6. CAR POSITION ANIMATION

### Calculate Position
```typescript
const TOTAL_CHECKPOINTS = 20

useEffect(() => {
  // Position as percentage (0-100)
  const position = (checkpointIndex / TOTAL_CHECKPOINTS) * 100
  setCarPosition(position)
}, [checkpointIndex])

// In JSX
<div style={{ left: `${carPosition}%` }} className="car">
  🚐
</div>
```

### CSS for Smooth Animation
```css
.car {
  position: absolute;
  transition: left 0.5s ease-out;
  font-size: 48px;
  z-index: 2;
}
```

---

## 7. COUNTDOWN TIMER PATTERN

### Correct Answer (5s)
```typescript
const [countdown, setCountdown] = useState<number | null>(null)

// Start countdown
setCountdown(5)

// Timer logic
useEffect(() => {
  if (countdown === null || countdown <= 0) {
    // Auto-advance
    setCheckpointIndex(i => i + 1)
    return
  }
  
  const timer = setInterval(() => {
    setCountdown(c => (c ?? 0) - 1)
  }, 1000)
  
  return () => clearInterval(timer)
}, [countdown])
```

### Rendering Overlay
```typescript
{countdown !== null && countdown > 0 && (
  <div className="countdown-overlay">
    <div className="countdown-box">
      <div className="emoji">✅</div>
      <div className="time">{countdown}s</div>
      <div className="text">To'g'ri javob!</div>
    </div>
  </div>
)}
```

---

## 8. BONUS CALCULATION

### Formula
```
finalBonus = BASE_BONUS - (wrongAnswers × PENALTY)
finalBonus = max(0, finalBonus)  // Never negative

Example:
- 20 correct, 0 wrong → 10,000
- 18 correct, 2 wrong → 10,000 - 2,000 = 8,000
- 0 correct, 20 wrong → 10,000 - 20,000 = 0 (clamped)
```

### Implementation
```typescript
const BASE_BONUS = 10000
const PENALTY_PER_WRONG = 1000

function calculateBonus(wrongCount: number): number {
  return Math.max(0, BASE_BONUS - wrongCount * PENALTY_PER_WRONG)
}

// Usage
useEffect(() => {
  if (phase === 'finished') {
    const bonus = calculateBonus(penalty)
    setFinalBonus(bonus)
  }
}, [phase, penalty])
```

---

## 9. ERROR HANDLING PATTERN

### Frontend
```typescript
const [error, setError] = useState<string | null>(null)
const [loading, setLoading] = useState(false)

async function loadGame(sectionId: number) {
  try {
    setLoading(true)
    setError(null)
    
    const response = await fetch(
      API_ENDPOINTS.GAME_QUESTIONS(sectionId),
      { headers: getAuthHeader() }
    )
    
    if (response.status === 401) {
      navigate('/login')
      return
    }
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    
    const data = await response.json()
    setQuestions(data.questions)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error')
  } finally {
    setLoading(false)
  }
}

// In JSX
{loading && <LoadingSpinner />}
{error && <ErrorMessage message={error} />}
{!loading && !error && <GameContent />}
```

### Backend
```python
from fastapi import HTTPException

@router.get("/{section_id}")
def get_section(section_id: int, db: Session = Depends(get_db)):
    section = db.query(Section).filter(Section.id == section_id).first()
    
    if not section:
        raise HTTPException(
            status_code=404,
            detail="Section not found"
        )
    
    return section
```

---

## 10. TESTING ENDPOINTS WITH CURL

### Create Section
```bash
curl -X POST http://localhost:8001/tests/sections/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "subject_id": 1,
    "teacher_name": "john_doe",
    "title": "Matematika 1-dars"
  }'
```

### Create Test
```bash
curl -X POST http://localhost:8001/tests/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test 1",
    "subject_id": 1,
    "section_id": 1,
    "difficulty": "medium",
    "questions": [
      {
        "text": "2 + 2 = ?",
        "correct_option": 2,
        "options": [
          {"text": "3"},
          {"text": "5"},
          {"text": "4"},
          {"text": "6"}
        ]
      }
    ]
  }'
```

### Get Questions
```bash
curl -X GET http://localhost:8001/tests/sections/1/questions \
  -H "Authorization: Bearer YOUR_TOKEN"

# Response:
{
  "questions": [
    {
      "id": 1,
      "question": "2 + 2 = ?",
      "options": ["3", "5", "4", "6"],
      "correctIndex": 2,
      "testId": 1
    }
  ]
}
```

---

## 11. ROUTE REGISTRATION EXAMPLE

### Adding Game Route in React Router
```typescript
import GameCourierMode from '@/Components/Games/CourierMode/GameCourierMode'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'games/courier-mode',
        element: <GameCourierMode sectionId={1} />,
      },
      // ... other routes
    ],
  },
])
```

### Using Route Parameters
```typescript
// In router config
{
  path: 'games/courier-mode/:sectionId',
  element: <GameCourierMode />,
}

// In component
import { useParams } from 'react-router-dom'

function GameCourierMode() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const id = parseInt(sectionId || '1', 10)
  
  // Use id for API calls
}
```

---

## 12. LOCAL STORAGE PATTERNS

### Token Management
```typescript
// Save
localStorage.setItem('access_token', token)

// Retrieve
const token = localStorage.getItem('access_token')

// Clear (on logout)
localStorage.removeItem('access_token')

// Use in config.ts helpers
export function getAuthToken(): string | null {
  return localStorage.getItem('access_token')
}

export function setAuthToken(token: string): void {
  localStorage.setItem('access_token', token)
}

export function clearAuthToken(): void {
  localStorage.removeItem('access_token')
}
```

### Game Progress (Optional)
```typescript
// Save checkpoint
localStorage.setItem(`game_checkpoint_${sectionId}`, checkpointIndex.toString())

// Resume game
const saved = localStorage.getItem(`game_checkpoint_${sectionId}`)
if (saved) setCheckpointIndex(parseInt(saved))
```

---

## QUICK REFERENCE CHEATSHEET

| Task | Code |
|------|------|
| Get API URL | `import { API_URL } from '@/Services/config'` |
| Call API | `fetch(API_ENDPOINTS.GAME_QUESTIONS(id), {headers: getAuthHeader()})` |
| Store token | `setAuthToken(token)` in login |
| Check auth | `if (!getAuthToken()) navigate('/login')` |
| Start game | `setPhase('running'); showNextQuestion()` |
| Answer quiz | `handleAnswer(isCorrect)` triggers countdown |
| Update progress | `setCheckpointIndex(i => i + 1)` |
| Calculate bonus | `Math.max(0, 10000 - wrong_count * 1000)` |

---

**Happy Coding! 🚀**
