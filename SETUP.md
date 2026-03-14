# TestPlay - O'quv o'yinlari platformasi

## Talablar

- Node.js 18+
- Python 3.10+
- PostgreSQL (pgAdmin4)

## 1. Database sozlash

1. pgAdmin4 da yangi database yarating: `testplay`
2. `.env` fayl yarating: `backend/.env`

```
DATABASE_URL=postgresql://postgres:SIZNING_PAROLINGIZ@localhost:5432/testplay
SECRET_KEY=supersecretkey123
```

`SIZNING_PAROLINGIZ` o'rniga PostgreSQL parolingizni yozing.

## 2. Backend

```bash
pip install -r backend/requirements.txt
npm run seed
npm run backend
```

Backend `http://localhost:8000` da ishga tushadi.

## 3. Frontend

```bash
npm install
npm run dev
```

Frontend `http://localhost:5173` da ishga tushadi.

## 4. Kirish

- **Login**: admin / admin123

## 5. Test qo'shish

1. Kirish tugmasini bosing va login qiling
2. "Test qo'shish" sahifasiga o'ting
3. O'yinni tanlang
4. Yangi bo'lim qo'shing (har bo'limga max 20 ta test)
5. Bo'limni tanlang va testlarni qo'shing

## O'yinlar

- **Baraban** — Barabanni aylantiring, tanlangan o'quvchi testga javob beradi
- **Arqon tortish** — Jamoa testni to'g'ri yechsa arqonni tortadi
- **So'z qidiruv** — So'z toping, keyin test yeching
- **Viktorina** — Testlar asosida viktorina
- **Chempion o'quvchi** — Turnir: testni yechgan g'olib
- **Davlatni top** — Bayroq + test
- **Millioner** — Yutuqli savol-javob
- **Xotira o'yini** — Juft toping, test yeching
- **Tezkor hisob** — Matematik testlar
- **So'z topish** — Harflardan so'z tuzing, test yeching
