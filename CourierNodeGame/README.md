# 🚗 Kuryer Node O'yini

Uzbek tilidagi interaktiv o'qitish o'yini — React + TypeScript + Tailwind CSS da.

## 🎮 O'yin Haqida

**Kuryer Node** — yetkazib berish simulator o'yini. O'quvchilar yo'l bo'ylab 20 ta svetaforni o'tib ketishadi. Har bir svetaforga yaqinlashganda test/quiz chiqadi:

- ✅ **To'g'ri javob** → 5 soniya kutadi, +1 ball
- ❌ **Xato javob** → 10 soniya kutadi, -10 ball
- ⏱️ **Vaqt chegarasi** → 120 soniya (2 daqiqa)
- 🎁 **Bonus** → O'z vaqtida yetib borsa +10,000 so'm

## ⚙️ Boshlash

### 1. Dependencies o'rnatish

```bash
cd CourierNodeGame
npm install
```

### 2. Rivojlantirish serveri

```bash
npm run dev
```

Sayt avtomatik ochiladi `http://localhost:5173` da.

### 3. Build qilish

```bash
npm run build
```

## 📁 Loyiha Struktura

```
CourierNodeGame/
├── src/
│   ├── components/
│   │   ├── GameScreen.tsx           # Asosiy o'yin ekrani
│   │   ├── LeftPanel.tsx            # Chap panel (info, sozlamalar)
│   │   ├── RoadAndCar.tsx           # Yo'l va mashina animatsiyasi
│   │   ├── TrafficLightTestModal.tsx # Test modal
│   │   ├── AdminLoginPage.tsx       # O'qituvchi kirish
│   │   └── TestManagementPage.tsx   # Test boshqaruvi
│   ├── App.tsx                      # Routing va layout
│   ├── types.ts                     # TypeScript tiplar
│   ├── store.ts                     # Zustand store
│   ├── mockData.ts                  # Mock testlar
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global stilllar
├── index.html                       # HTML shablon
├── tailwind.config.ts              # Tailwind sozlamasi
├── vite.config.ts                  # Vite sozlamasi
└── package.json                    # Dependencies
```

## 🎨 Dizayn Asosiy O'ziga Xosliklari

- **Dark Mode**: Purple-Black gradient fon
- **Neon Effektlar**: Chiroyli shriftlar va border
- **Glass Effect**: Modern blurred backgrounds
- **Responsive**: Barcha ekran o'lchamlariga mos

## 🕹️ Komponentlar

### GameScreen
Asosiy o'yin ekrani. Boshlanish ekrani, o'yin jarayoni, yakuniy natija.

### LeftPanel
- O'yin haqida ma'lumot
- Vaqt, ball, taraqqiyot
- "Testlar Qo'shish" tugmasi

### RoadAndCar
- Uzun yo'l perspektivada
- Sariq Yandex mashina
- 20 ta svetafor
- Yetkazib berish uyi

### TrafficLightTestModal
- Test/quiz modal
- Pastki qismda chiqadi
- 4 ta javob varianti (A,B,C,D)
- Natija ko'rsatish

### AdminLoginPage
- O'qituvchi login
- Email va username

### TestManagementPage
- Bo'lim qo'shish
- Testlar boshqaruvi
- 3 ta bepul bo'lim

## 📊 Zustand Store

```typescript
useAuthStore()      // Login va profil
useSectionStore()   // Bo'lim va testlar
useGamePlayStore()  // O'yin holati
```

Barcha data `localStorage` ga saqlanadi.

## 🎯 O'yin Mexanikasi

1. **Setup** → Darajani tanlash
2. **Running** → 120 soniya vaqt, 20 ta test
3. **Delivery** → Bonus ko'rsatish (vaqt qolsa +10,000)
4. **Finished** → Vaqt tugasa, xabar

## 🔧 Mock Data

Default 15 ta test:
- 5 ta **Oson** savol
- 5 ta **O'rta** savol
- 5 ta **Qiyin** savol

Kodsiz test qo'shish/o'chirish imkoni.

## 💾 localStorage Keys

- `currentTeacher` - Login qilgan o'qituvchi
- `testSections` - Bo'lim va testlar

## 🚀 Kelallashtirish Yo'li

1. ✅ Frontend to'liq (React)
2. ⬜ Backend API (Node.js/Express)
3. ⬜ Database (PostgreSQL/MongoDB)
4. ⬜ Deploy (Vercel/Heroku)

## 📝 Litsenziya

MIT

---

**Muallif**: Jonibek Jojorayev
**Yil**: 2024
