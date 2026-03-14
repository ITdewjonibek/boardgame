# Quick Reference Guide - Kuryer Node O'yini

## 🚀 Boshlash

### Windows
```powershell
cd CourierNodeGame
.\start.bat
```

### macOS / Linux
```bash
cd CourierNodeGame
bash start.sh
```

### Manual
```bash
npm install
npm run dev
```

---

## 🎮 O'yin Qaydasi

### Setup
1. **Darajani tanlang**: Oson / O'rta / Qiyin
2. **Oyun boshladi**: 120 soniyali timer boshlanadi

### Running
- 🚗 Sariq mashina yo'l bo'ylab harakatlanadi
- 🚦 20 ta svetafor = 20 ta test
- ✅ To'g'ri javob → 5 sec wait → +1 ball
- ❌ Xato javob → 10 sec wait → -10 ball

### Delivery (Agar vaqt qolsa)
- 🎁 **+10,000 so'm bonus!**
- 📊 Yakuniy natija ko'rsatiladi

### Finished (Vaqt tugasa)
- ❌ Xatosi: Vaqt tugadi
- 📊 O'tgan testlar ko'rsatiladi

---

## 👨‍🏫 O'qituvchi Uchun

### Login
1. "Testlar Qo'shish" tugmasini bosing
2. Email + Username kiriting
3. TestManagementPage ochiladi

### Bo'lim Yaratish
1. "Bo'lim Qo'shish" tugmasini bosing
2. Nomi va darajasini kiriting (Oson/O'rta/Qiyin)
3. "Yaratish" bosing

### Test Qo'shish
1. Bo'limni expand qiling (ChevronDown)
2. "Test Qo'shish" bosing
3. Savol va 4 ta variant kiriting
4. To'g'ri javob indeksini tanlang (0-3)

### Cheklov
- ⭐ 3 ta bepul bo'lim
- ⭐ 20 ta test = 1 bo'lim
- 🔒 Qo'shimcha bo'limlar: Pullik

---

## 🗂️ File Structure

```
CourierNodeGame/
├── src/
│   ├── components/          # React komponentlari
│   ├── App.tsx             # Main routing
│   ├── types.ts            # TypeScript tiplar
│   ├── store.ts            # Zustand state
│   ├── mockData.ts         # Default testlar
│   └── index.css           # Global CSS
├── package.json            # NPM dependencies
├── tailwind.config.ts      # Tailwind sozlamasi
└── README.md               # Bu fayl
```

---

## 🔑 Key Components

| Komponent | Vazifasi |
|-----------|----------|
| `GameScreen` | Asosiy o'yin ekrani |
| `LeftPanel` | Statistika paneli |
| `RoadAndCar` | Yo'l va mashina animatsiyasi |
| `TrafficLightTestModal` | Test qafasi |
| `AdminLoginPage` | Login |
| `TestManagementPage` | Test boshqaruvi |

---

## 💾 localStorage Keys

```javascript
currentTeacher   // { id, email, username, sections }
testSections     // Array<TestSection>
```

---

## 🎨 Design Colors

```
Purple    #8B5CF6  brand-primary
Pink      #EC4899  brand-secondary
Gold      #FBBF24  brand-accent
Dark      #0F172A  dark-bg
Green     #10B981  success
Red       #EF4444  error
```

---

## 🐛 Common Issues

### "Module not found"
```bash
npm install
npm run dev
```

### Tailwind CSS ishlamayapti
```bash
npm run build
```

### Port 5173 band
```bash
npm run dev -- --port 3000
```

---

## 📊 O'yin Statistics

| Metric | Qiymat |
|--------|--------|
| Jami testlar | 20 |
| Vaqt chegarasi | 120 sec |
| To'g'ri ball | +1 |
| Xato ball | -10 |
| Bonus | +10,000 so'm |
| Wait (to'g'ri) | 5 sec |
| Wait (xato) | 10 sec |

---

## 🔄 Game Flow Diagram

```
START
  ↓
[Setup Phase] - Darajani tanlash
  ↓
[Running Phase] - 120 sec timer, 20 ta test
  ├→ Test chiqadi
  ├→ Javob beradi
  ├→ Wait card (5-10 sec)
  ├→ Mashina harakat qiladi
  ├→ Keyingi test chiqadi
  └→ Repeat...
  ↓
[Delivery Phase] - Vaqt qolsa?
  ├→ YES: +10,000 bonus ✅
  └→ NO: Xata ❌
  ↓
[Finished] - Yakuniy natija

```

---

## 🚀 Build & Deploy

### Production Build
```bash
npm run build
```

Output: `dist/` folder

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Netlify
```bash
npm run build
# Drag & drop 'dist' to Netlify
```

---

## 📚 API Endpoints (Future)

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/teacher/:id
POST   /api/sections
GET    /api/sections/:id
POST   /api/questions
GET    /api/results
POST   /api/results
```

---

## 🆘 Support

- 📧 Email: jonibek@example.com
- 🐙 GitHub: github.com/jonibekjonjorayev4
- 📱 Telegram: @jonibek_dev

---

**Version**: 1.0.0
**Last Update**: March 2024
**Status**: ✅ Production Ready
