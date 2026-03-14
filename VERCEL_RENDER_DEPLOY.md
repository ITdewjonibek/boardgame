# Quick Vercel + Render Deployment Guide

## 🚀 FRONTEND - VERCEL'DA DEPLOY QILISH

### Step 1: Vercel'ga kiring
```
https://vercel.com
```
- GitHub bilan login qiling yoki sign up qiling

### Step 2: Project import qiling
```
1. "New Project" tugmasini bosing
2. GitHub'dan repository'ni tanlang: "ITdewjonibek/boardgame"
3. "Import" bosing
```

### Step 3: Build Settings (Avtomatik to'g'ri)
- Framework Preset: **Vite**
- Build Command: **npm run build** ✓
- Output Directory: **dist** ✓
- Install Command: **npm install** ✓

### Step 4: Environment Variables
Qo'ying:
```
VITE_API_URL = https://boardgame-backend.onrender.com
```

### Step 5: Deploy!
- "Deploy" tugmasini bosing
- 2-3 minutda sahifa jonli bo'ladi

### Vercel URL:
```
https://boardgame.vercel.app (avtomatik beriladi)
```

---

## 🚀 BACKEND - RENDER'DA DEPLOY QILISH

### Step 1: Render'ga kiring
```
https://render.com
```
- GitHub bilan login qiling

### Step 2: PostgreSQL Database yaratish
1. Dashboard'ga kiring
2. "New +" → "PostgreSQL"
3. Sozlamalar:
   - Name: `boardgame-db`
   - Region: `Singapore` (yoki sizga yaqin)
   - PostgreSQL Version: `15`
4. "Create Database" bosing
5. `External Database URL` nusxalang (kerak bo'ladi!)

### Step 3: Web Service yaratish
1. "New +" → "Web Service"
2. GitHub repository'ni tanlang: `ITdewjonibek/boardgame`
3. Branch: `becendrot1` (IMPORTANT!)

### Step 4: Sozlamalar
```
Name: boardgame-backend
Environment: Python 3.11
Region: Singapore (yoki sizga yaqin)
Build Command: pip install -r requirements.txt && python migrate.py
Start Command: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Step 5: Environment Variables qo'ying
```
DATABASE_URL = (PostgreSQL'dan nusxalangan URL)
SECRET_KEY = your-super-secret-key-123456789
ALGORITHM = HS256
CORS_ORIGINS = ["https://boardgame.vercel.app"]
ENVIRONMENT = production
```

### Step 6: Deploy!
- "Create Web Service" bosing
- 3-5 minutda deploy bo'ladi
- Build logs'ni kuzating

### Render URL:
```
https://boardgame-backend.onrender.com (avtomatik beriladi)
```

---

## 🔗 CONNECTION TEST

Deploy'dan keyin test qiling:

1. Vercel'dagi saytga kiring:
   ```
   https://boardgame.vercel.app
   ```

2. Render backend'i check qiling:
   ```
   https://boardgame-backend.onrender.com/docs
   ```

3. Frontend va Backend'i bog'langanini tekshiring:
   - Login qilish
   - Profil o'zgartirish
   - O'yin o'ynash
   - Ball saqlash

---

## 📝 CHECKLIST

- [ ] GitHub akkaunt tayyorlab qo'ygan
- [ ] Vercel'ga GitHub bog'lagan
- [ ] Render'ga GitHub bog'lagan
- [ ] `main` branch'da Frontend kodi bor
- [ ] `becendrot1` branch'da Backend kodi bor
- [ ] Vercel project import qilgan
- [ ] PostgreSQL database Render'da yaratgan
- [ ] Web Service Render'da yaratgan
- [ ] Environment variables bar Render'da qo'ygan
- [ ] Deploy complete
- [ ] Frontend va Backend test qilgan

---

## 🆘 MUAMMOLAR

### Vercel: Build xato
- `npm run build` locally test qiling
- `package.json`'ni tekshiring

### Render: Database xato
- PostgreSQL ishlayotganini tekshiring
- CONNECTION_URL to'g'rimi?
- Migrations ran?

### Frontend -> Backend bog'lanmay
- VITE_API_URL to'g'rimi?
- CORS_ORIGINS to'g'rimi Render'da?
- Backend logs'ni kuzating

---

## ✨ JUDA MUHIM!

1. **branch'larni tekshiring:**
   - Frontend (main)
   - Backend (becendrot1)

2. **Environment variables:**
   - DATABASE_URL (Render'dan nusxalang)
   - VITE_API_URL (Render URL'si)
   - SECRET_KEY (kuchli!)

3. **Logs kuzating:**
   - Vercel: Deployments → Logs
   - Render: Service → Logs

---

## 🎉 TAYYOR!

Barcha narsani o'rnatib bo'lgach:
- Frontend: https://boardgame.vercel.app
- Backend: https://boardgame-backend.onrender.com

**Oydin buni toping va menga ayt, qo'shimcha moslamalar qilaman!**
