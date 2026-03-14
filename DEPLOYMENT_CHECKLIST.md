# ✅ DEPLOYMENT CHECKLIST

## PART 1: FRONTEND (VERCEL) - DONE ✅

- [x] Repository on GitHub
- [x] Connected to Vercel
- [x] Deployed successfully
- [x] Environment variables set
- [x] Re-deployed with VITE_API_URL
- [x] Frontend accessible: https://boardgame.vercel.app

---

## PART 2: BACKEND (RENDER) - TO DO ⏳

### A) Database Setup
- [ ] Open https://render.com/dashboard
- [ ] Create PostgreSQL Database
  - [ ] Name: boardgame-db
  - [ ] PostgreSQL 15
  - [ ] Region: Singapore
- [ ] Copy External Database URL
- [ ] Save it: `postgresql://...`

### B) Web Service Setup
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub: ITdewjonibek/boardgame
- [ ] Select branch: `becendrot1`
- [ ] Fill settings:
  - [ ] Name: boardgame-backend
  - [ ] Environment: Python 3.11
  - [ ] Build: `pip install -r requirements.txt && python migrate.py`
  - [ ] Start: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
- [ ] Add Environment Variables:
  - [ ] DATABASE_URL = (PostgreSQL URL)
  - [ ] SECRET_KEY = your-secret
  - [ ] ALGORITHM = HS256
  - [ ] CORS_ORIGINS = ["https://boardgame.vercel.app"]
- [ ] Create Web Service
- [ ] Wait for build (3-5 min)
- [ ] Copy Service URL: `https://boardgame-backend-xxx.onrender.com`

---

## PART 3: CONNECT FRONTEND TO BACKEND ⏳

- [ ] Go to https://vercel.com/dashboard
- [ ] Select: boardgame project
- [ ] Settings → Environment Variables
- [ ] Update VITE_API_URL:
  - [ ] New value: (Paste Render URL)
  - [ ] Save
- [ ] Go to Deployments
- [ ] Click "Redeploy Latest"
- [ ] Wait for deployment (2 min)

---

## PART 4: DOMAIN (OPTIONAL) ⏳

### Option A: Use Free Vercel Domain (BEST)
- [ ] Already set: https://boardgame.vercel.app ✅

### Option B: Get Free .tk Domain
- [ ] Go to https://www.freenom.com
- [ ] Search: boardgame.tk
- [ ] Select 12 months FREE
- [ ] Checkout
- [ ] Manage DNS
- [ ] Add CNAME: boardgame.vercel.app
- [ ] Wait 24 hours

---

## PART 5: TESTING ✅

- [ ] Frontend loads: https://boardgame.vercel.app
- [ ] Backend API works: https://boardgame-backend-xxx.onrender.com/docs
- [ ] Can login
- [ ] Can play games
- [ ] Scores save (need Backend)

---

## FINAL STATUS

```
✅ Frontend: DEPLOYED
⏳ Backend: IN PROGRESS
⏳ Database: IN PROGRESS
⏳ Domain: OPTIONAL
```

---

**Start from PART 2 now!** 🚀
