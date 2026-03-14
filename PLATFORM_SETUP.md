# Nebula Pro Platform - Complete Setup Guide

## Overview

This is a production-grade educational gaming platform with:
- **25 games** (15 Pro + 10 Subject)
- **Solo & Multiplayer modes**
- **Real-time WebSocket support**
- **Teacher test creation**
- **Score tracking & rankings**
- **Professional Nebula theme**

## Project Structure

```
c:\react Jonibek\vite-project/
├── src/                           # Frontend (React + TypeScript)
│   ├── Components/Games/
│   │   ├── GamePage.tsx          # Game selector & launcher
│   │   ├── SoloGameMode.tsx      # Single player mode
│   │   └── MultiplayerGameMode.tsx # Multiplayer mode
│   ├── Services/
│   │   ├── api.ts                # Base API client
│   │   ├── gameApi.ts            # Game-specific API
│   │   └── gameHooks.ts          # React hooks
│   └── main.tsx
├── Uzgame/                        # Backend (FastAPI + SQLAlchemy)
│   ├── app/
│   │   ├── main.py               # FastAPI app
│   │   ├── database.py           # DB setup
│   │   ├── models/
│   │   │   └── base.py           # ORM models (unique table names)
│   │   ├── routers/
│   │   │   ├── games.py          # GET /games
│   │   │   ├── game_tests.py     # GET/POST test sets
│   │   │   ├── multiplayer.py    # WebSocket + room mgmt
│   │   │   └── scores.py         # Score endpoints
│   │   ├── core/
│   │   │   └── seed.py           # Database seed + verification
│   │   └── auth/
│   │       └── auth.py           # JWT authentication
│   └── .env
├── package.json
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL (optional, SQLite works for dev)

### Backend Setup

```bash
# 1. Navigate to backend directory
cd Uzgame

# 2. Create virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure .env (copy from .env.example)
cp .env.example .env
# Edit .env with your database URL

# 5. Start backend (with auto-reload)
cd ..
npm run dev:server
# OR directly:
python -m uvicorn app.main:app --app-dir Uzgame --host 127.0.0.1 --port 8000 --reload
```

On startup, the backend will:
- Create database tables
- Seed all 25 games (first run only)
- Create default test set for each game with 20 questions
- Verify test sets exist on every startup

**Expected console output:**
```
INFO:     Application startup complete
Database tables verified/created
Verifying default test sets for all games...
Default test set verification complete
System ready: 25 games loaded.
```

### Frontend Setup

```bash
# 1. In project root (c:\react Jonibek\vite-project)
npm install

# 2. Create .env (copy from .env.example)
cp .env.example .env
# VITE_API_URL should point to backend (usually http://localhost:8000)

# 3. Start dev server
npm run dev:client
# Opens on http://localhost:5173
```

### Full Development Mode

```bash
# Run both simultaneously
npm run dev
# Client: http://localhost:5173
# Server: http://localhost:8000
# Health check: http://localhost:8000/health
```

## API Endpoints

### Authentication
```
POST   /register          # Create account
POST   /token             # Login (returns JWT)
GET    /users/me          # Get current user profile
```

### Games
```
GET    /games             # List all games
GET    /games?section=pro      # Filter by section
GET    /games/{key}       # Get single game
```

### Test Sets
```
GET    /game-tests/sets/{game_key}        # Get test sets for game
GET    /game-tests/questions/{set_id}     # Get questions in set
GET    /game-tests/random?game_key=...&count=20  # Random questions
POST   /game-tests/sets                   # Create new test set (teacher)
```

### Multiplayer
```
POST   /ws/rooms/create?game_key=...      # Create room
GET    /ws/rooms/{room_code}              # Get room status
WS     /ws/rooms/{room_code}/{player_email}  # Connect to game
```

### Scores
```
GET    /scores?user_id=...                # Get user scores
POST   /scores                            # Save score
```

## Database Schema

### Unique Table Names
```sql
-- Users
users
├── id (PK)
├── email (UNIQUE)
├── hashed_password
├── role (student|teacher)
└── created_at

-- Games
games
├── id (PK)
├── key (UNIQUE)
├── title
├── section (pro|subject)
├── icon_key
└── difficulty

-- Test Sets
gt_sets (NOT "test_sets" - prevents conflicts)
├── id (PK)
├── game_id (FK)
├── owner_teacher_id (FK, nullable for defaults)
├── name
└── created_at

-- Questions
gt_questions (NOT "questions" - prevents conflicts)
├── id (PK)
├── set_id (FK)
├── prompt
├── explanation
├── qhash (UNIQUE)
└── options

-- Options
gt_options (NOT "options" - prevents conflicts)
├── id (PK)
├── question_id (FK)
├── text
└── is_correct

-- Multiplayer
multiplayer_rooms
├── id (PK)
├── room_code (UNIQUE)
├── game_id (FK)
├── status (waiting|playing|finished)
└── created_at

-- Scores
scores
├── id (PK)
├── user_id (FK)
├── game_id (FK)
├── room_id (FK, nullable)
├── score
└── created_at
```

## Games Included

### Pro Games (15 total)
1. logic-grid - Logic Grid Solver
2. code-breaker - Code Breaker
3. strategy-arena - Strategy Arena
4. pattern-ai - Pattern Prediction AI
5. memory-matrix - Memory Matrix Advanced
6. maze-escape - Maze AI Escape
7. reaction-pro - Reaction Speed Pro
8. decision-sim - Decision Simulator
9. risk-calc - Risk Calculation Game
10. cipher-cracker - Cipher Cracker
11. sequence-builder - Sequence Builder
12. prob-duel - Probability Duel
13. resource-strat - Resource Strategy
14. reflex-arena - Reflex Arena
15. tactical-quiz - Tactical Quiz Battle

### Subject Games (10 total)
1. math-pro - Math Challenge Pro
2. physics-sim - Physics Simulation Quiz
3. english-duel - English Grammar Duel
4. chem-reactor - Chemistry Reaction Builder
5. bio-synth - Biology System Builder
6. geo-map - Geography Map Strategy
7. history-time - History Timeline War
8. info-code - Informatics Logic Code
9. lit-analysis - Literature Analysis Game
10. iq-trainer - Advanced IQ Trainer

Each game has:
- Default test set (always created)
- Exactly 20 questions
- 4 options per question (first is correct)
- Full explanation for each

## Frontend Features

### Game Page (GamePage.tsx)
- **Left Sidebar:**
  - Game icon & title
  - SOLO / MULTI toggle
  - Test set list with default highlighted
  - "Add Test" button for teachers

- **Main Area:**
  - Question preview (shows first 3 questions)
  - Question count badge
  - "Start Game" button
  - Loading states
  - Empty state fallback

### Solo Mode (SoloGameMode.tsx)
- 10-minute timer with warning at <60s
- Progress bar
- Current question display
- 4-option multiple choice (A, B, C, D)
- Score tracking in sidebar
- Question completion indicators
- Full results screen with:
  - Final score & accuracy %
  - Review of each answer
  - Explanations
  - Comparison with correct answers

### Multiplayer Mode (MultiplayerGameMode.tsx)
- Room creation with unique code
- Room join by code
- Real-time player list
- Live score updates
- Countdown before game start
- Final rankings
- WebSocket reconnection support

## Design System

### Colors (Nebula Theme)
```
Primary:      #8b5cf6 (Violet)
Secondary:    #6366f1 (Indigo)
Accent:       #00d4ff (Cyan)
Background:   #0a0e27 (Deep Navy)
Surface:      #1a1f3a (Dark Blue)
Text:         #e0e0e0 (Light Gray)
Muted:        #a0a0a0 (Gray)
Dark:         #606060 (Dark Gray)
```

### Typography
- Headings: 600-700 weight
- Body: 400-500 weight
- Small: 12-13px
- Base: 14-15px
- Large: 18-24px

### Components
- Glass surfaces with 0.05 opacity
- Gradient buttons with hover states
- Rounded corners (6-8px)
- Lucide icons throughout
- Smooth transitions (0.2s)
- Professional spacing system

## Testing Endpoints

### Health Check
```bash
curl http://localhost:8000/health
# Response: {"status":"ok","version":"1.0.0-pro"}
```

### Get Games
```bash
curl http://localhost:8000/games
# Response: [{"id":1,"key":"logic-grid","title":"Logic Grid Solver",...}]
```

### Get Test Sets
```bash
curl http://localhost:8000/game-tests/sets/logic-grid
# Response: [{"id":1,"name":"default","is_default":true,...}]
```

### Get Random Questions
```bash
curl "http://localhost:8000/game-tests/random?game_key=logic-grid&count=20"
# Response: [{"id":1,"prompt":"...","options":[...]}, ...]
```

## Troubleshooting

### SQLAlchemy Table Conflict
**Error:** "duplicate table name"
**Solution:** Table names use unique prefixes:
- `gt_sets` not `test_sets`
- `gt_questions` not `questions`
- `gt_options` not `options`

### No Default Tests
**Error:** Game page shows "No questions available"
**Solution:** Backend automatically creates on startup. Check console for:
```
Verifying default test sets for all games...
Default test set verification complete
```

### WebSocket Connection Fails
**Error:** Cannot connect to room
**Solution:** Ensure:
- Backend running on 8000
- `VITE_API_URL=http://localhost:8000`
- WebSocket URL uses `ws://` not `wss://`

### Cors Errors
**Solution:** Backend already has CORS middleware configured for all origins.
If still issues, verify:
```python
allow_origins=["*"]  # In main.py
```

## Production Deployment

### Environment Variables
Set before deployment:
```
DATABASE_URL=postgresql://...
SECRET_KEY=<strong-random-key>
API_HOST=0.0.0.0
API_PORT=8000
```

### Database Migration
```bash
# Use Alembic for schema changes
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Building Frontend
```bash
npm run build
# Creates dist/ folder
```

### Running Backend with Gunicorn
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

## Performance Optimization

- Database indexed on: `key`, `game_id`, `qhash`, `room_code`
- WebSocket uses in-memory room management
- JWT tokens validated once per request
- Questions cached via React hooks
- Debounced score updates

## Security

- Passwords hashed with bcrypt
- JWT tokens with 60-minute expiry
- CORS configured
- SQL injection prevention via SQLAlchemy ORM
- HTTPS recommended in production

## Support

For issues:
1. Check backend logs for errors
2. Verify database connectivity
3. Check frontend console (F12)
4. Ensure ports 5173 and 8000 are available

## License

Commercial use - Nebula Pro Platform
