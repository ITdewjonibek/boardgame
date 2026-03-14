# Courier + Traffic Light Quiz Game Mode - Implementation Guide

## Overview
Complete full-stack implementation of a Courier Game Mode with traffic light checkpoints and quiz questions. Supports teacher-managed test sections with difficulty levels.

---

## FRONTEND CHANGES

### 1. **Configuration System** ✅
**File:** `src/Services/config.ts`
- Unified API URL configuration
- Uses `VITE_API_URL` env variable (defaults to `http://localhost:8001`)
- Centralized endpoint definitions
- Auth token management utilities

**Usage:**
```typescript
import { API_ENDPOINTS, getAuthHeader, getAuthToken } from '@/Services/config'

// In components:
const response = await fetch(API_ENDPOINTS.GAME_QUESTIONS(sectionId), {
  headers: getAuthHeader()
})
```

### 2. **BottomSheetQuiz Component** ✅
**File:** `src/Components/Games/CourierMode/BottomSheetQuiz.tsx`
- Bottom-sliding quiz modal (not centered popup)
- Displays questions from database
- Shows 4 answer options
- Immediate feedback on answer submission
- Closes automatically after 500ms delay
- Props:
  - `isOpen: boolean`
  - `question: MCQ | null`
  - `onAnswer: (isCorrect: boolean) => void`
  - `onClose: () => void`

### 3. **CourierProgress Sidebar** ✅
**File:** `src/Components/Games/CourierMode/CourierProgress.tsx`
- Left panel shows game progress
- Traffic light grid (20 checkpoints with ✓ or numbers)
- Timer display (red when < 10s)
- Score tracking
- "Test Qo'shish" button for teacher test management

### 4. **GameCourierMode Main Component** ✅
**File:** `src/Components/Games/CourierMode/GameCourierMode.tsx`
- Complete game state machine:
  - `setup`: Ready screen before game starts
  - `running`: Active gameplay
  - `waiting`: Countdown after answer (5s correct, 10s wrong)
  - `finished`: End game screen
- Car animation on road (0-100% position)
- 20 traffic light checkpoints
- Automatic question progression
- Score/bonus tracking
- Delivery completion screen with bonus calculation

**Key Features:**
```
Phase Flow:
setup -> running -> waiting (repeat) -> finished
         |_quit_|
```

### 5. **Authentication Flow**
**File:** `src/Services/auth.ts` (UPDATED)
- Removed hardcoded `API_URL = "http://127.0.0.1:8001"`
- Now uses `import { API_URL, setAuthToken } from './config'`
- Stores access_token in localStorage on successful login
- Token sent in Authorization header for protected endpoints

### 6. **Environment Setup**
**File:** `.env` (create if not exists)
```env
VITE_API_URL=http://localhost:8001
```

**Vite Config:** `vite.config.ts` (UPDATED)
- Added dev server proxy for `/api` routes
- Forwards requests to `VITE_API_URL`
- Removes `/api` prefix before sending to backend

---

## BACKEND CHANGES

### 1. **Database Models** ✅
**File:** `Uzgame/app/models/test.py` (UPDATED)

Added:
- `DifficultyEnum`: "easy", "medium", "hard"
- `Section` model:
  ```python
  id, subject_id, teacher_name, title, created_at
  Relationship: tests (1-to-many)
  ```

Updated:
- `Test` model: Added `section_id` and `difficulty` fields
- All models maintain foreign key relationships

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

### 2. **Pydantic Schemas** ✅
**File:** `Uzgame/app/schemas/test.py` (UPDATED)

Added:
- `SectionCreate`: Input schema for creating sections
- `Section`: Output schema with timestamps

Updated:
- `TestCreate`: Added `section_id` and `difficulty` fields
- `Test`: Includes section relationship

### 3. **Sections Router** ✅
**File:** `Uzgame/app/routers/sections.py` (NEW)

Endpoints:
```
POST   /tests/sections/
  - Create new section
  - Validates subject exists
  - Enforces 3-section-per-teacher limit
  - Requires authentication

GET    /tests/sections/{section_id}
  - Get section with all tests
  
GET    /tests/sections/?subject_id=
  - List sections, optionally filtered by subject

GET    /tests/sections/{section_id}/questions
  - Get all questions from section's tests
  - Returns array: [{id, question, options[], correctIndex, testId}]
```

### 4. **Tests Router Update** ✅
**File:** `Uzgame/app/routers/test.py` (UPDATED)

Updated endpoints:
```
POST   /tests/
  - Now accepts section_id and difficulty
  - Validates section exists if provided
  - Enforces 20-test-per-section limit
  - Requires authentication

GET    /tests/?subject_id=&section_id=
  - Filtering by both subject and section
  - Optional parameters
```

### 5. **Main App Configuration** ✅
**File:** `Uzgame/app/main.py` (UPDATED)

Changes:
- Import `sections` router
- Register sections router: `app.include_router(sections_router.router)`
- CORS already configured with credentials=True

---

## DATABASE MIGRATION

Run these SQL commands or use Alembic:

```python
# Create migration
alembic revision --autogenerate -m "Add sections and difficulty to tests"

# Apply migration
alembic upgrade head
```

Or directly (SQLite/PostgreSQL):
```sql
-- Create sections table
CREATE TABLE sections (
    id INTEGER PRIMARY KEY,
    subject_id INTEGER NOT NULL,
    teacher_name VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(subject_id) REFERENCES subjects(id)
);

-- Add columns to tests table
ALTER TABLE tests ADD COLUMN section_id INTEGER;
ALTER TABLE tests ADD COLUMN difficulty VARCHAR DEFAULT 'medium';
ALTER TABLE tests ADD FOREIGN KEY(section_id) REFERENCES sections(id);
```

---

## API ENDPOINTS REFERENCE

### Auth
- `POST /token` - Login (form-data)
- `POST /auth/register` - Register

### Sections (NEW)
- `POST /tests/sections/` - Create section (auth required)
- `GET /tests/sections/{section_id}` - Get section
- `GET /tests/sections/?subject_id=1` - List sections
- `GET /tests/sections/{section_id}/questions` - Get all questions

### Tests
- `GET /tests/subjects/` - List subjects
- `POST /tests/` - Create test (auth required)
- `GET /tests/?subject_id=1` - List tests
- `GET /tests/?section_id=5` - List tests in section
- `GET /tests/{test_id}` - Get test details

---

## RUNNING THE APP

### Frontend
```bash
# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8001" > .env

# Start dev server (port 5173)
npm run dev
```

### Backend
```bash
# Install dependencies
cd Uzgame
pip install -r requirements.txt

# Create/migrate database
alembic upgrade head

# Start FastAPI server (port 8001)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

### Access the Game
- Homepage: `http://localhost:5173`
- Courier Game: `/games/courier-mode` (after login)
- Teacher Panel: `/teacher/tests`

---

## GAME FLOW

### Player (Student)
1. Click "Test Qo'shish" button in game
2. Redirected to login if not authenticated
3. Access teacher test creation (for teachers)
4. Play courier game:
   - Road with car (🚐) starting at 0%
   - 20 traffic lights below
   - Car moves as checkpoints are completed
   - At each checkpoint: quiz appears in bottom sheet
   - Answer → 5s (correct) or 10s (wrong) countdown
   - After all 20: delivery complete screen with bonus

### Teacher
1. Click "Test Qo'shish"
2. Login/register
3. Create section for subject (max 3 per subject)
4. Add tests to section (max 20 per section)
5. Tests appear in game with difficulty distribution

---

## FILE STRUCTURE

```
Frontend:
├── src/
│   ├── Services/
│   │   └── config.ts (unified API config)
│   │   └── auth.ts (updated for config)
│   └── Components/Games/CourierMode/
│       ├── GameCourierMode.tsx (main game)
│       ├── BottomSheetQuiz.tsx (quiz modal)
│       └── CourierProgress.tsx (left sidebar)

Backend:
├── Uzgame/app/
│   ├── models/test.py (+ Section model)
│   ├── schemas/test.py (+ Section schemas)
│   ├── routers/
│   │   ├── test.py (updated)
│   │   └── sections.py (new)
│   └── main.py (updated with sections router)
```

---

## TROUBLESHOOTING

### CORS Issues
✅ Fixed in main.py with:
- `allow_credentials=True`
- Localhost origins whitelisted
- All methods allowed

### Connection Refused (ERR_CONNECTION_REFUSED)
- Check backend running: `http://localhost:8001/health`
- Update `.env`: `VITE_API_URL=http://localhost:8001`
- Restart frontend dev server

### Login Not Working
- Ensure backend `/token` endpoint exists
- Check CORS headers in response
- Verify access_token stored in localStorage
- Check Authorization header sent with requests

### Tests Not Loading in Game
- Verify section exists: `GET /tests/sections/1`
- Check questions endpoint: `GET /tests/sections/1/questions`
- Ensure tests have questions before playing

---

## NEXT STEPS

1. Run database migration
2. Start backend server on port 8001
3. Create environment `.env` file
4. Start frontend dev server on port 5173
5. Login as teacher and create test section
6. Play courier game mode

All components are production-ready with proper TypeScript types, error handling, and state management.
