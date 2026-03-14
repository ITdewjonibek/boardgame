# Nebula Pro - Startup & Verification Guide

## Quick Start (Easiest Method)

### Windows
1. Double-click `start.bat`
2. Backend starts in one window, frontend in another
3. Browser opens to http://localhost:5173/games automatically

### macOS/Linux
```bash
chmod +x start.sh
./start.sh
```

## Manual Startup

If the startup scripts don't work, follow these manual steps:

### Terminal 1: Start Backend
```bash
cd Uzgame
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Database tables verified/created
INFO:     Verifying default test sets for all games...
INFO:     Default test set verification complete
INFO:     System ready: 25 games loaded.
INFO:     Application startup complete
```

### Terminal 2: Start Frontend
```bash
npm run dev
```

**Expected output:**
```
  Local:        http://localhost:5173/
  ➜  Web:       http://localhost:5173/
```

## Verify Installation

### Option 1: Automated Health Check
```bash
python verify_platform.py
```

**Expected output:**
```
✅ Backend is running
✅ Games loaded: 25 total
   Pro games: 15
   Subject games: 10
✅ Sample games have valid default test sets
✅ Multiplayer room created: ABC123
✅ ALL CHECKS PASSED - Platform is ready!
```

### Option 2: Manual Browser Verification

1. **Open browser:** http://localhost:5173/games
2. **Check games load:**
   - See 25 game cards in grid
   - Games organized by section (Pro/Subject)
3. **Test game click:**
   - Click any game → GamePage opens
   - Default test set auto-selected
   - Question preview shows 3+ questions
4. **Test solo mode:**
   - Click "Start Solo Game"
   - Timer appears (10:00)
   - Can select and answer questions
5. **Test multiplayer:**
   - Back to game, select Multiplayer mode
   - Click "Create New Room"
   - Room code appears
   - Player list shows current user

## Troubleshooting

### Backend Won't Start

**Error: "Port 8000 already in use"**
```bash
# Find process using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # macOS/Linux

# Kill the process
taskkill /PID <PID> /F         # Windows
kill -9 <PID>                  # macOS/Linux
```

**Error: "ModuleNotFoundError"**
```bash
cd Uzgame
pip install -r requirements.txt
```

**Error: "database.db locked"**
- Close all instances of the app
- Delete `Uzgame/nebula_pro.db`
- Restart backend (will recreate database)

### Frontend Won't Start

**Error: "Port 5173 already in use"**
```bash
# Kill existing npm process
taskkill /IM node.exe          # Windows
pkill -f "npm run dev"         # macOS/Linux
```

**Error: "Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Calls Failing

**Error: 401 Unauthorized**
- Login is required
- Get JWT token from /auth/login
- Token included in subsequent requests

**Error: 404 Not Found**
- Backend not running
- Check http://localhost:8000 responds
- Run health check script

**Error: CORS errors**
- Backend CORS is enabled for all origins
- Check API_URL in frontend is correct
- Default: http://localhost:8000

### Games Not Loading

**Check backend console:**
```
Verifying default test sets for all games...
```

Should show this line. If not:
- Restart backend
- Check Uzgame/nebula_pro.db exists
- Delete db and restart if corrupted

### WebSocket Connection Failed

**For multiplayer mode:**
1. Check backend is running
2. Check firewall allows port 8000
3. Refresh page and try again
4. Check browser console (F12) for errors

## File Structure for Reference

```
├── start.bat / start.sh          # Startup scripts
├── verify_platform.py             # Health check script
├── Uzgame/
│   ├── app/
│   │   ├── main.py               # FastAPI app
│   │   ├── models/base.py         # Database models
│   │   ├── core/seed.py           # Game seeding
│   │   └── routers/
│   │       ├── games.py           # GET /games
│   │       ├── game_tests.py       # Test sets & questions
│   │       └── multiplayer.py      # WebSocket rooms
│   └── requirements.txt            # Backend dependencies
├── src/
│   ├── Services/
│   │   ├── gameApi.ts            # API client
│   │   └── gameHooks.ts          # React hooks
│   ├── Components/Games/
│   │   ├── GamesList.tsx         # Game browser
│   │   ├── GamePage.tsx          # Game launcher
│   │   ├── SoloGameMode.tsx       # Solo gameplay
│   │   └── MultiplayerGameMode.tsx # Multiplayer gameplay
│   └── App.tsx                   # Routes
├── package.json                  # Frontend dependencies
└── vite.config.ts               # Vite config
```

## Development Workflow

### Making Backend Changes
1. Edit files in `Uzgame/app/`
2. Backend auto-reloads (--reload flag)
3. Refresh frontend (auto-refresh in dev mode)

### Making Frontend Changes
1. Edit files in `src/`
2. Frontend auto-refreshes
3. Changes visible immediately in browser

### Adding New Games
1. Edit `Uzgame/app/core/seed.py`
2. Add to `GAMES` list (or modify `_ensure_game` calls)
3. Restart backend
4. New games appear on /games

### Debugging

**Backend debugging:**
```bash
# Add print statements in app code
# Check output in terminal running `uvicorn`
```

**Frontend debugging:**
1. Press F12 to open browser console
2. Check Network tab for API calls
3. Check for JavaScript errors

**WebSocket debugging:**
```bash
# In browser console:
# Open WS connection to see traffic
# Check MultiplayerGameMode.tsx for message types
```

## Environment Variables

### Backend (.env in Uzgame/)
```
DATABASE_URL=sqlite:///./nebula_pro.db
SQLALCHEMY_ECHO=false
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
API_HOST=0.0.0.0
API_PORT=8000
LOG_LEVEL=INFO
```

### Frontend (.env in root)
```
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## Production Deployment

See `PLATFORM_SETUP.md` section "Production Deployment" for:
- Docker configuration
- Environment variables for production
- Database setup for PostgreSQL
- Security considerations
- Performance optimization

## Support

For issues not covered above:
1. Check `PLATFORM_SETUP.md` for detailed API reference
2. Review error messages in console/browser
3. Check `BACKEND_FIX.md` for known fixes
4. Review relevant component code comments

## Quick Links

- Games List: http://localhost:5173/games
- Backend Health: http://localhost:8000/docs (Swagger UI)
- Logs: Check terminal running backend
- Database: `Uzgame/nebula_pro.db` (SQLite)
