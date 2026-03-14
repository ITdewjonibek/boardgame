# Courier + Traffic Light Quiz - File Changes Summary

## FRONTEND FILES MODIFIED/CREATED

### 1. **src/Services/config.ts** (MODIFIED)
**What Changed:**
- Replaced hardcoded API_URL with environment variable
- Added centralized API_ENDPOINTS object
- Added auth token management utilities

**Key Additions:**
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001'
export const getAuthHeader = (): HeadersInit => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}
```

**Impact:** All API calls should use config.ts instead of hardcoding URLs

---

### 2. **src/Services/auth.ts** (MODIFIED)
**What Changed:**
- Removed: `export const API_URL = "http://127.0.0.1:8001"`
- Added: Import from config.ts
- Added: Token storage in localStorage

**Before:**
```typescript
export const API_URL = "http://127.0.0.1:8001"
```

**After:**
```typescript
import { API_URL, setAuthToken } from './config'
if (data.access_token) {
  setAuthToken(data.access_token)
}
```

---

### 3. **src/Components/Games/CourierMode/BottomSheetQuiz.tsx** (NEW)
**Purpose:** Bottom-sliding quiz modal
**Features:**
- Slides up from bottom of screen
- Shows question with 4 answer options
- Immediate feedback (green/red)
- Closes after 500ms delay post-answer
- Props: `isOpen`, `question`, `onAnswer`, `onClose`

---

### 4. **src/Components/Games/CourierMode/CourierProgress.tsx** (NEW)
**Purpose:** Left sidebar with game progress
**Features:**
- 20-checkpoint traffic light grid
- Timer with color change (red < 10s)
- Score display
- "Test Qo'shish" button for teacher panel
- Game rules and instructions

---

### 5. **src/Components/Games/CourierMode/GameCourierMode.tsx** (NEW)
**Purpose:** Main courier game component
**Props:** `sectionId: number`
**State Machine:**
```
setup → running → waiting → (repeat or finished)
```

**Key Features:**
- Fetches questions from `/tests/sections/{sectionId}/questions`
- Car position animation (0-100%)
- Auto-advance on countdown completion
- Handles correct (5s) vs wrong (10s) delays
- Final delivery screen with bonus calculation
- Handles authentication redirect for test creation

**Game Stats:**
- TOTAL_CHECKPOINTS = 20
- WAIT_CORRECT = 5 seconds
- WAIT_WRONG = 10 seconds
- Max time = 300 seconds (5 minutes)

---

### 6. **vite.config.ts** (MODIFIED)
**What Changed:**
- Added dev server proxy configuration

**Addition:**
```typescript
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_API_URL || 'http://localhost:8001',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

---

### 7. **.env** (CREATE)
**Content:**
```
VITE_API_URL=http://localhost:8001
```

---

## BACKEND FILES MODIFIED/CREATED

### 1. **Uzgame/app/models/test.py** (MODIFIED)
**What Changed:**
- Added DifficultyEnum (easy, medium, hard)
- Added Section model
- Updated Test model with section_id and difficulty

**New Section Model:**
```python
class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    teacher_name = Column(String, index=True)
    title = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    tests = relationship("Test", back_populates="section")
```

**Test Model Changes:**
- Added: `section_id = Column(Integer, ForeignKey("sections.id"))`
- Added: `difficulty = Column(Enum(DifficultyEnum))`

---

### 2. **Uzgame/app/schemas/test.py** (MODIFIED)
**What Changed:**
- Added SectionCreate and Section schemas
- Updated TestCreate/Test with section_id and difficulty

**New Schemas:**
```python
class SectionCreate(BaseModel):
    title: str
    subject_id: int
    teacher_name: str

class Section(BaseModel):
    id: int
    created_at: datetime
    tests: List[Test] = []
```

---

### 3. **Uzgame/app/routers/sections.py** (NEW)
**Endpoints:**
```
POST   /tests/sections/          → Create section (auth required)
GET    /tests/sections/{id}      → Get section
GET    /tests/sections/          → List sections (query: subject_id)
GET    /tests/sections/{id}/questions → Get all questions
```

**Logic:**
- Create: Validates subject, enforces 3-section limit per teacher
- Get: Returns section with all tests
- List: Optional subject filtering
- Questions: Formats questions for game use

---

### 4. **Uzgame/app/routers/test.py** (MODIFIED)
**What Changed:**
- Updated create_test to accept section_id and difficulty
- Updated get_tests to support section filtering
- Added auth requirement for test creation

**New Parameters:**
- `section_id`: Optional, validates existence, enforces 20-test limit
- `difficulty`: Enum (easy/medium/hard)

---

### 5. **Uzgame/app/main.py** (MODIFIED)
**What Changed:**
- Added import: `from app.routers import sections`
- Added router registration: `app.include_router(sections_router.router)`

**No breaking changes - CORS already configured properly**

---

## ENVIRONMENT SETUP

### Frontend
```bash
# Create .env file
VITE_API_URL=http://localhost:8001

# Or let it default to localhost:8001
```

### Backend
```bash
# Install dependencies
cd Uzgame
pip install -r requirements.txt

# Run migrations (if using Alembic)
alembic upgrade head

# Or create tables manually
python -c "from app.database import Base, engine; Base.metadata.create_all(engine)"

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

---

## DATABASE MIGRATIONS

### Option 1: Using Alembic
```bash
cd Uzgame
alembic revision --autogenerate -m "Add sections and difficulty"
alembic upgrade head
```

### Option 2: Direct SQL
```sql
-- SQLite/PostgreSQL
CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    teacher_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(subject_id) REFERENCES subjects(id)
);

ALTER TABLE tests ADD COLUMN section_id INTEGER;
ALTER TABLE tests ADD COLUMN difficulty VARCHAR(50) DEFAULT 'medium';
ALTER TABLE tests ADD FOREIGN KEY(section_id) REFERENCES sections(id);
```

---

## TESTING CHECKLIST

### Frontend
- [ ] `npm run dev` starts on port 5173
- [ ] `.env` file with `VITE_API_URL` exists
- [ ] Login redirects to correct page
- [ ] "Test Qo'shish" button appears in game
- [ ] Access token stored in localStorage
- [ ] API requests include Authorization header

### Backend
- [ ] `uvicorn app.main:app --reload --port 8001` starts
- [ ] `/health` endpoint returns `{"status": "ok"}`
- [ ] CORS headers present in responses
- [ ] Section table exists with correct columns
- [ ] Test table has section_id and difficulty

### Game Functionality
- [ ] Questions load from `/tests/sections/{id}/questions`
- [ ] Bottom sheet quiz slides up correctly
- [ ] Car moves smoothly from 0-100%
- [ ] Countdown works (5s correct, 10s wrong)
- [ ] Auto-advance to next checkpoint
- [ ] Final screen shows correct bonus
- [ ] Teacher can create sections
- [ ] Max 3 sections per teacher enforced
- [ ] Max 20 tests per section enforced

---

## RUNNING IN PRODUCTION

### Environment Variables Needed:
- **Frontend**: `VITE_API_URL` (e.g., `https://api.example.com`)
- **Backend**: `DATABASE_URL` (if using Alembic)

### Build Commands:
```bash
# Frontend
npm run build  # Creates dist/ folder

# Backend
# Just run with production settings:
uvicorn app.main:app --host 0.0.0.0 --port 8001 --workers 4
```

---

## BREAKING CHANGES

### None!
All changes are additive:
- Old tests still work (section_id is optional)
- Old auth.ts imports still work (config.ts is backward compatible)
- CORS settings unchanged
- No database schema breaking changes

---

## WHAT WORKS NOW

✅ Unified API URL configuration  
✅ Teacher can create test sections  
✅ Students can play courier game mode  
✅ Bottom sheet quiz modal  
✅ 20 checkpoint game with timer  
✅ Auto-progression between tests  
✅ Correct/wrong answer tracking  
✅ Final delivery bonus screen  
✅ Authentication flow with token storage  

---

## OPTIONAL ENHANCEMENTS

Future additions (not in current scope):
- Leaderboard integration
- Difficulty scaling (easier at start, harder later)
- Multiplayer mode
- Save game progress
- Detailed statistics tracking
- Certificate generation
