# 🐓 Rooster Runner Database Integration Guide

## Status: ✅ COMPLETE

All code changes are complete. Rooster Runner now fetches questions from the database instead of hardcoded arrays.

---

## 📋 What Changed

### 1. **Backend: FastAPI Router Created** ✅
- **File**: `Uzgame/app/routers/rooster.py` (251 lines)
- **Purpose**: REST API endpoints for Rooster questions management
- **Endpoints**:
  - `GET /api/rooster/questions` - Fetch all 100 questions
  - `GET /api/rooster/questions/{number}` - Fetch specific question
  - `POST /api/rooster/questions` - Create single question
  - `POST /api/rooster/questions/bulk` - Create multiple questions
  - `PUT /api/rooster/questions/{number}` - Update question
  - `DELETE /api/rooster/questions/{number}` - Delete question
  - `POST /api/rooster/questions/init-defaults` - Initialize database with all 100 questions

### 2. **Backend: Main Application Updated** ✅
- **File**: `Uzgame/app/main.py`
- **Changes**:
  - Added import: `from app.routers import rooster`
  - Registered router: `app.include_router(rooster.router)`

### 3. **Frontend: React Component Refactored** ✅
- **File**: `src/Components/Games/RoosterRunner/RoosterRunner.tsx`
- **Changes**:
  - Removed hardcoded 100-question array (160+ lines deleted)
  - Added state variables:
    - `allQuestions` - Questions from database
    - `isLoading` - Fetch status
    - `error` - Error messages
  - Added `useEffect` hook to fetch questions from `http://127.0.0.1:8000/api/rooster/questions`
  - Added fallback mechanism: `getFallbackQuestions()` returns first 20 questions offline
  - Added loading UI: Shows "⏳ Savollar yuklanyapti..." during fetch
  - Added error UI: Shows error message if database unavailable
  - Updated `generateQuestion` callback to use state variable

### 4. **Database: New RoosterQuestion Table** ✅
- **Table Structure**:
  ```
  rooster_questions:
    - id (int, primary key)
    - number (int, unique) - Question position 1-100
    - question (string) - Question text
    - options (JSON) - Array of 4 answer options
    - correctAnswer (int) - Index of correct option (0-3)
    - category (string) - "Math"
  ```

---

## 🚀 Setup Instructions

### Step 1: Start FastAPI Backend
```powershell
# Navigate to the Uzgame directory
cd Uzgame

# Install dependencies (if not already done)
pip install fastapi uvicorn sqlalchemy

# Start the FastAPI server
python -m uvicorn app.main:app --reload
```
Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 2: Initialize Database with 100 Questions
```powershell
# From the project root directory
python init_rooster_db.py
```

Expected output:
```
🚀 Rooster Runner database ni ishga tushirmoqda...
✅ Muvaffaqiyat! Database ishga tushirildi.
📊 Qo'shilgan savollar: 100
```

### Step 3: Verify Backend API
Open browser and test the endpoint:
```
http://127.0.0.1:8000/api/rooster/questions
```
Should return JSON array with 100 questions.

### Step 4: Start React Frontend
```powershell
# From the project root directory
npm run dev
```

### Step 5: Test Rooster Runner Game
1. Navigate to Rooster Runner game in the application
2. Game should automatically fetch questions from database
3. Loading message "⏳ Savollar yuklanyapti..." appears briefly
4. 100 math questions load from database
5. Game works as before, but with persistent database storage

---

## 🔄 How It Works

### Frontend Flow (React):
```
1. Component mounts
   ↓
2. useEffect triggers
   ↓
3. Fetch from http://127.0.0.1:8000/api/rooster/questions
   ↓
4. If successful: Save to state `allQuestions`
   If failed: Use fallback questions from `getFallbackQuestions()`
   ↓
5. Show loading UI while fetching
   ↓
6. On game start: Use `generateQuestion()` to get questions from state
   ↓
7. Display questions 1-100 with answers randomized
```

### Backend Flow (FastAPI):
```
1. Frontend requests GET /api/rooster/questions
   ↓
2. FastAPI queries RoosterQuestion table
   ↓
3. Returns all questions ordered by number
   ↓
4. Frontend stores in state and uses for game
```

### Database Persistence:
```
1. Questions stored in rooster_questions table
2. Each game session loads from database
3. No questions lost between app restarts
4. Can easily add/update questions via API endpoints
```

---

## ✅ Question Format

All 100 questions follow this structure:
```json
{
  "number": 1,
  "question": "12+8=?",
  "options": ["20", "18", "22", "16"],
  "correctAnswer": 0,
  "category": "Math"
}
```

**Difficulty Progression**:
- **Positions 1-10**: OSON (Basic math, no trivial questions)
- **Positions 11-20**: O'RTA (Medium difficulty)
- **Positions 21-30**: MEDIUM-HARD (Complex calculations)
- **Positions 31-40**: QIYIN (Hard formulas and squares)
- **Positions 41-100**: Progressive difficulty to ULTIMATE CHALLENGE

---

## 🛠️ Troubleshooting

### Issue: "Savollar yuklashda xato..." (Error loading questions)

**Solution 1**: Make sure FastAPI backend is running
```powershell
# Check if running on 127.0.0.1:8000
python -m uvicorn app.main:app --reload
```

**Solution 2**: Verify database is initialized
```powershell
python init_rooster_db.py
```

**Solution 3**: Check browser console for network errors
- Open DevTools (F12)
- Check Network tab for failed requests
- Check Console for JavaScript errors

### Issue: Questions don't load but fallback works

**Diagnosis**: Database fetch failed, using local fallback
- Check FastAPI server is running
- Check database connection in `Uzgame/app/database.py`
- Check API endpoint is accessible: `http://127.0.0.1:8000/api/rooster/questions`

### Issue: Database not initialized with questions

**Solution**:
```powershell
# Make sure FastAPI is running first
python -m uvicorn app.main:app --reload

# Then in another terminal
python init_rooster_db.py
```

---

## 📊 Testing Checklist

- [ ] FastAPI backend starts without errors
- [ ] `http://127.0.0.1:8000/api/rooster/questions` returns 100 questions
- [ ] `python init_rooster_db.py` completes successfully
- [ ] React app starts without console errors
- [ ] Rooster Runner game loads
- [ ] Loading message appears briefly during fetch
- [ ] Questions display correctly with randomized answers
- [ ] All 100 questions are progressively harder
- [ ] Game works when database is unavailable (uses fallback)
- [ ] Score tracking works correctly

---

## 📁 Files Modified/Created

**Created**:
- ✅ `Uzgame/app/routers/rooster.py` - FastAPI router with CRUD endpoints
- ✅ `init_rooster_db.py` - Database initialization script

**Modified**:
- ✅ `Uzgame/app/main.py` - Added rooster router registration
- ✅ `src/Components/Games/RoosterRunner/RoosterRunner.tsx` - Database integration

**Removed**:
- ✅ 100-question hardcoded array from RoosterRunner.tsx (~160 lines)

---

## 🎮 Game Features

### Rooster Runner with Database:
- ✅ 100 math questions stored in database
- ✅ Progressive difficulty from OSON to ULTIMATE
- ✅ Randomized answer options (A, B, C, D)
- ✅ Persistent storage across sessions
- ✅ Graceful fallback if database unavailable
- ✅ Loading feedback during fetch
- ✅ Error messages in Uzbek
- ✅ Real-time score tracking
- ✅ Best score persistence

---

## 🔗 API Documentation

### GET /api/rooster/questions
Fetch all 100 questions
```bash
curl http://127.0.0.1:8000/api/rooster/questions
```

### GET /api/rooster/questions/{number}
Fetch specific question by position
```bash
curl http://127.0.0.1:8000/api/rooster/questions/1
```

### POST /api/rooster/questions
Create a single question
```bash
curl -X POST http://127.0.0.1:8000/api/rooster/questions \
  -H "Content-Type: application/json" \
  -d '{
    "number": 101,
    "question": "50+50=?",
    "options": ["100", "99", "101", "98"],
    "correctAnswer": 0,
    "category": "Math"
  }'
```

### POST /api/rooster/questions/init-defaults
Initialize database with all 100 default questions
```bash
curl -X POST http://127.0.0.1:8000/api/rooster/questions/init-defaults
```

### PUT /api/rooster/questions/{number}
Update an existing question
```bash
curl -X PUT http://127.0.0.1:8000/api/rooster/questions/1 \
  -H "Content-Type: application/json" \
  -d '{
    "number": 1,
    "question": "15+5=?",
    "options": ["20", "18", "22", "16"],
    "correctAnswer": 0,
    "category": "Math"
  }'
```

### DELETE /api/rooster/questions/{number}
Delete a question
```bash
curl -X DELETE http://127.0.0.1:8000/api/rooster/questions/1
```

---

## 🎯 Next Steps (Optional)

1. **Add Question Management UI**: Create admin panel to add/edit/delete questions
2. **Statistics**: Track which questions students struggle with
3. **Difficulty Selection**: Let players choose difficulty level
4. **Time Limits**: Add countdown timer for harder questions
5. **Leaderboard**: Track top scores globally or by user
6. **Question Categories**: Separate math questions by topic (algebra, geometry, etc.)

---

## ❓ Questions?

Check the following files for implementation details:
- `Uzgame/app/routers/rooster.py` - Backend API logic
- `src/Components/Games/RoosterRunner/RoosterRunner.tsx` - Frontend integration
- `Uzgame/app/database.py` - Database configuration

---

**Status**: ✅ Ready for testing and deployment
**Last Updated**: Today
**Database**: Fully integrated with SQLAlchemy ORM
