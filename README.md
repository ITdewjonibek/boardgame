# Interaktiv-ta'lim

Ta'lim platformasi — 15+ interaktiv o'yin, testlar va database bilan integratsiya.

## Ishga tushirish

### 1. PostgreSQL

PostgreSQL o'rnating va database yarating. `.env` da `DATABASE_URL` ni o'rnating:

```env
DATABASE_URL=postgresql://postgres:PAROL@localhost:5432/postgres
SECRET_KEY=sizning-maxfiy-kalitingiz
```

### 2. Backend

```bash
# Sarflanmalarni o'rnatish
cd backend
pip install -r requirements.txt

# Users jadvalini tuzatish (agar xato bo'lsa)
python migrate_db.py

# Database'ni to'ldirish (o'yinlar, testlar)
python seed.py

# Backend ishga tushirish
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Yoki root papkada:
```bash
npm run migrate   # users jadvalini tuzatish
npm run seed      # seed
npm run backend   # backend
```

### 3. Frontend

```bash
npm install
npm run dev
```

Sahifa: **http://localhost:5173**

### 4. Login

- **Admin:** `admin` / `admin123` (seed qilgandan keyin)
- Backend ishlamasa: demo rejim — `admin` / `admin123` bilan UI ko'rish mumkin

## Texnologiyalar

- **Frontend:** React, Vite, TailwindCSS, TypeScript
- **Backend:** FastAPI, SQLAlchemy
- **Database:** PostgreSQL

## Xususiyatlar

- 15 ta interaktiv o'yin (Baraban, Arqon tortish, Viktorina, Millioner, Xotira, va boshqalar)
- Test qo'shish — database'ga saqlanadi
- Login tizimi
- Responsive dizayn
- Backend status indikatori
