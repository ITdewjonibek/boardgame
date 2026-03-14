# Uzgame v3 (Fan o'yinlari + Boshqotirma + DB testlar)

## 1) Backend (FastAPI + SQLAlchemy + PostgreSQL)

### .env (Uzgame/.env)
PostgreSQL ishlatish uchun:

```
DATABASE_URL=postgresql+psycopg2://postgres:YOUR_PASSWORD@127.0.0.1:5432/uzgame
SECRET_KEY=change_me
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> PGAdmin4 da `uzgame` bazasini ochsangiz `game_test_sets`, `game_questions`, `game_options`, `users` tablitsalari ko'rinadi.

### Run
```
cd Uzgame
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

## 2) Frontend (Vite)

`.env` (Vite project root) tavsiya:

```
VITE_API_URL=http://127.0.0.1:8000
```

Run:
```
npm install
npm run dev
```

## 3) Test qo'shish (O'qituvchi)

1. `/login` -> Register paytida `O'qituvchi` ni tanlang.
2. Istalgan o'yinga kiring.
3. Chap panel -> **Test qo'shish**.
4. Bitta to'plam: max 20 savol.
5. Har bir o'qituvchi uchun har bir o'yinda **2 ta to'plam bepul**. 3-to'plamda 402 qaytadi va UI `2$ga sotib oling` deydi.
6. Takror testlar (savol + variantlar) global bo'yicha qattiq tekshiriladi.

## API
- `POST /game-tests/sets` (Bearer token, role=teacher)
- `GET /game-tests/random?game_key=quiz&count=10`
