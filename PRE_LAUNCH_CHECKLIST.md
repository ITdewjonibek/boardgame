# Nebula Pro - Pre-Launch Checklist

This checklist helps verify everything is working before you start using the platform.

## ✅ System Prerequisites

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Python 3.9+ installed (`python --version`)
- [ ] npm installed (`npm --version`)
- [ ] pip installed (`pip --version`)
- [ ] Git installed (`git --version`)

## ✅ Environment Setup

- [ ] All dependencies installed (`npm install` in root, `pip install -r requirements.txt` in Uzgame/)
- [ ] Virtual environment created (optional but recommended)
- [ ] `.env` files configured (or using defaults)
- [ ] No conflicting processes on ports 8000 and 5173

## ✅ Backend Initialization

### Start Backend
```bash
cd Uzgame
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- [ ] Backend starts without errors
- [ ] Logs show "Database tables verified/created"
- [ ] Logs show "Verifying default test sets..."
- [ ] Logs show "Default test set verification complete"
- [ ] Logs show "System ready: 25 games loaded."
- [ ] Swagger docs available at http://localhost:8000/docs

### Database Verification
- [ ] Database file created: `Uzgame/nebula_pro.db`
- [ ] Tables created (check with DB browser if needed)
- [ ] All 25 games inserted into database
- [ ] Default test sets created for each game

## ✅ Backend API Endpoints

Test each endpoint with Swagger UI (http://localhost:8000/docs) or curl:

### Games Endpoints
```bash
# Get all games
curl http://localhost:8000/games

# Get Pro games only
curl "http://localhost:8000/games?section=pro"

# Get Subject games only
curl "http://localhost:8000/games?section=subject"

# Get single game
curl http://localhost:8000/games/logic-grid
```

- [ ] GET /games returns 25 games
- [ ] Section filtering works (pro: 15, subject: 10)
- [ ] Individual game retrieval works
- [ ] Each game has: id, key, title, section, icon_key, difficulty

### Test Sets Endpoints
```bash
# Get test sets for a game
curl http://localhost:8000/game-tests/sets/logic-grid

# Get questions for a test set
curl http://localhost:8000/game-tests/questions/1
```

- [ ] GET /game-tests/sets/{gameKey} returns at least 1 set
- [ ] Default set has is_default=true
- [ ] GET /game-tests/questions/{setId} returns 20 questions
- [ ] Each question has: id, prompt, options[], explanation

### Multiplayer Endpoints
```bash
# Create a multiplayer room
curl -X POST "http://localhost:8000/ws/rooms/create?game_key=logic-grid"

# Get room status
curl http://localhost:8000/ws/rooms/{roomCode}
```

- [ ] POST /ws/rooms/create returns room_code
- [ ] GET /ws/rooms/{code} returns room details
- [ ] Room has: room_code, game_key, status, created_at

## ✅ Frontend Initialization

### Start Frontend
```bash
npm run dev
```

- [ ] Frontend starts without errors
- [ ] Vite dev server running on http://localhost:5173
- [ ] No "VITE_API_URL" environment warnings
- [ ] Hot module reloading active

## ✅ Frontend Pages

Navigate to http://localhost:5173 and check each page:

### Games List Page
```
http://localhost:5173/games
```
- [ ] Page loads without errors
- [ ] Grid displays all 25 game cards
- [ ] Filter buttons visible (All Games, Pro, Subject)
- [ ] Game cards show: icon, title, difficulty, section badge
- [ ] Clicking game navigates to game page
- [ ] Filter buttons toggle section views
- [ ] Responsive layout works on mobile

### Game Page (Single Game)
```
http://localhost:5173/games/logic-grid
```
- [ ] Page loads with game details
- [ ] Game icon and title displayed
- [ ] Left sidebar shows:
  - [ ] Game info section
  - [ ] SOLO/MULTI mode toggle buttons
  - [ ] Test set list with "Default" badge
  - [ ] "Add Test Set" button
- [ ] Main area shows:
  - [ ] Question preview (first 3 questions)
  - [ ] Question count ("20 questions")
  - [ ] Game description
  - [ ] "Start Game" button
- [ ] Default test set auto-selected
- [ ] Mode toggle switches between SOLO and MULTI
- [ ] Start button is enabled

## ✅ Solo Game Mode

### Start Solo Game
1. Go to any game page
2. Select SOLO mode
3. Click "Start Game"

- [ ] Game page transitions to SoloGameMode
- [ ] Header shows: game title, progress (Q: 1/20), timer (10:00)
- [ ] Question displays with prompt
- [ ] 4 answer options appear with A, B, C, D labels
- [ ] Options highlight on hover
- [ ] Clicking option selects it
- [ ] Selected option shows different background
- [ ] Progress bar shows question progress
- [ ] Question grid on sidebar shows completion status
- [ ] Timer counts down every second
- [ ] "Next" button appears and works
- [ ] "Exit Game" button appears
- [ ] Can navigate through all 20 questions
- [ ] On last question, button says "Finish"
- [ ] Clicking "Finish" shows results screen

### Solo Results Screen
- [ ] Results page shows: award icon, final score, accuracy %
- [ ] Score calculation is correct (1 point per correct answer)
- [ ] Accuracy % calculated correctly
- [ ] List of each question with:
  - [ ] Question text
  - [ ] Your answer
  - [ ] Correct answer (highlighted in green)
  - [ ] Explanation text
- [ ] "Play Again" button returns to game page
- [ ] Test set list refreshed after game
- [ ] Timer warning at <60 seconds shows in red

## ✅ Multiplayer Game Mode

### Create Multiplayer Room
1. Go to any game page
2. Select MULTI mode
3. Click "Start Game"
4. Click "Create New Room"

- [ ] Setup phase shows "Create New Room" and "Join by Code"
- [ ] Room code generated (e.g., ABC123)
- [ ] Room code displayed on screen
- [ ] Copy button works (code in clipboard)
- [ ] "Start Game" button appears
- [ ] Waiting phase shows player list
- [ ] Current player shown with "You" badge
- [ ] Player list shows email and score
- [ ] Can click "Start Game" (as room creator)

### Multiplayer Countdown
- [ ] Countdown appears with large number (3, 2, 1)
- [ ] Animation plays for each number
- [ ] Smooth transition to game

### Multiplayer Game
- [ ] Real-time player list updates
- [ ] Live score updates visible
- [ ] Question displays same as solo mode
- [ ] Can answer questions
- [ ] Progress synchronized across players
- [ ] Option to exit game

### Multiplayer Results
- [ ] Final rankings displayed
- [ ] Sorted by score (highest first)
- [ ] Shows: player email, final score, rank
- [ ] "Play Again" button returns to game page

### Join Multiplayer Room
1. Create room in one browser window (get room code)
2. In another window, go to same game
3. Select MULTI mode
4. Click "Start Game"
5. Click "Join by Code"
6. Enter room code

- [ ] "Join by Code" input appears
- [ ] Can paste room code
- [ ] Join button works
- [ ] Player list updates on both windows
- [ ] Second player name appears in list
- [ ] Both show "You" for their own name
- [ ] First player's "Start Game" triggers countdown
- [ ] Both players see same questions
- [ ] Scores update in real-time on both sides

## ✅ Browser DevTools Verification

Press F12 in browser and check:

### Console Tab
- [ ] No JavaScript errors (red X icons)
- [ ] No "404 Not Found" errors
- [ ] No "CORS" errors
- [ ] No "undefined" errors
- [ ] Token-related messages if logging in

### Network Tab
- [ ] GET /games returns 200
- [ ] GET /game-tests/* returns 200
- [ ] POST /ws/rooms/create returns 200
- [ ] WebSocket connection (WS protocol)
- [ ] API calls include Authorization header
- [ ] No failed requests

### Application Tab
- [ ] localStorage shows auth token (if logged in)
- [ ] Cookies created for session management
- [ ] No console errors logged

## ✅ Authentication (if enabled)

```bash
# Test login endpoint
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'

curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=testpass"
```

- [ ] Registration endpoint works
- [ ] Login returns access token
- [ ] Token stored in localStorage
- [ ] Protected endpoints require token
- [ ] Invalid token returns 401 Unauthorized

## ✅ Performance Checks

### Backend Performance
- [ ] Game list loads in <100ms
- [ ] Test sets load in <50ms
- [ ] Questions load in <50ms
- [ ] Room creation in <50ms
- [ ] WebSocket messages arrive <500ms

### Frontend Performance
- [ ] Games page loads in <1s
- [ ] Game page loads in <1s
- [ ] Game transitions smooth (no lag)
- [ ] Options click responds immediately
- [ ] Timer updates smooth (no stuttering)

## ✅ Cross-Browser Testing

Test on each browser (if available):

- [ ] Chrome/Chromium - Full functionality
- [ ] Firefox - Full functionality
- [ ] Safari - Full functionality
- [ ] Edge - Full functionality
- [ ] Mobile browser - Responsive layout

## ✅ Responsive Design

Test on different screen sizes:

### Desktop (1920px+)
- [ ] Layout optimized for wide screens
- [ ] Sidebar visible and functional
- [ ] Game grid shows 3+ columns

### Tablet (768px - 1024px)
- [ ] Sidebar responsive
- [ ] Game grid adjusts to 2 columns
- [ ] Touch interactions work
- [ ] No horizontal scroll

### Mobile (320px - 767px)
- [ ] Single column layout
- [ ] Hamburger menu (if applicable)
- [ ] Touch-friendly buttons
- [ ] No horizontal scroll
- [ ] Readable text size
- [ ] Game options stack vertically

## ✅ Error Handling

### Test error scenarios:

**Backend down:**
- [ ] Frontend shows "Cannot connect to backend" message
- [ ] Graceful error handling (no white screen)

**Invalid request:**
- [ ] API returns proper error messages
- [ ] Frontend shows user-friendly error

**Network error:**
- [ ] Timeout handling works
- [ ] Retry mechanism (if implemented)
- [ ] Error message displayed

**Missing data:**
- [ ] No crash if game has no questions
- [ ] Empty state message shown
- [ ] User can navigate back

## ✅ Data Persistence

### Test data integrity:

- [ ] Create test set → data saved to database
- [ ] Add questions → persist across refresh
- [ ] Play game → score saved to database
- [ ] Multiplayer → room data persists
- [ ] Reload page → game state recovers (if applicable)

## ✅ Security Checks

- [ ] Passwords hashed (never stored plain text)
- [ ] JWT tokens used for auth
- [ ] CORS configured properly
- [ ] No sensitive data in frontend code
- [ ] No API keys visible in browser
- [ ] HTTPS ready for production
- [ ] SQL injection protection (SQLAlchemy ORM)

## ✅ Documentation

- [ ] README.md exists and is current
- [ ] PLATFORM_SETUP.md covers all setup steps
- [ ] API endpoints documented
- [ ] Component structure explained
- [ ] Troubleshooting guide available
- [ ] Deployment guide included

## ✅ Production Readiness

- [ ] Environment variables configured
- [ ] Database backed up
- [ ] Error logging enabled
- [ ] Performance optimized
- [ ] Security audit completed
- [ ] Load testing done (optional)

## Final Verification Script

Run the automated health check:
```bash
python verify_platform.py
```

Expected output:
```
✅ Backend is running
✅ Games loaded: 25 total
   Pro games: 15
   Subject games: 10
✅ Sample games have valid default test sets
✅ Multiplayer room created: ABC123
✅ ALL CHECKS PASSED - Platform is ready!
```

## Sign-Off

When all checkboxes are completed:

- [ ] Platform is fully functional
- [ ] All games working
- [ ] Solo and multiplayer modes working
- [ ] Database verified
- [ ] Frontend responsive
- [ ] No console errors
- [ ] Documentation complete
- [ ] Ready for deployment

---

**Platform Status:** ✅ PRODUCTION READY

**Last Verified:** [Date]
**Verified By:** [Your Name]
**Version:** 1.0.0

---

## Next Steps

1. **Deploy to production** - See PLATFORM_SETUP.md
2. **Monitor performance** - Set up logging and monitoring
3. **Gather user feedback** - Collect feature requests
4. **Plan updates** - Plan next version features
5. **Security review** - Annual security audit recommended

Congratulations! Your Nebula Pro platform is fully operational! 🚀
