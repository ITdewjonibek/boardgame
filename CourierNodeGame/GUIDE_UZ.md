# 🛠️ Kuryer Node - Tafsil Qo'llanma

## 🎯 Loyiha Maqsadi

Uzbek o'qituvchilari va o'quvchilari uchun interaktiv online o'qitish o'yini.

**O'qituvchi uchun**: Test qo'shish, bo'lim yaratish, o'quvchi natijalari
**O'quvchi uchun**: Mashina harakatlantirish, testlar yechish, vaqt ichida tugatish

---

## 📋 Asosiy Xususiyatlar

### 1. **Oyun Mexanikasi**
- 20 ta svetafor = 20 ta test
- Vaqt chegarasi: 120 soniya
- Sariq mashina animatsiyasi
- Real-time timer

### 2. **Test Sistema**
- 3 ta darajasi: Oson / O'rta / Qiyin
- To'qquv javoblari: A, B, C, D
- Avtomatik ball hisoblash
- Vaqt bonus: +10,000 so'm

### 3. **O'qituvchi Portali**
- Login/Register
- Bo'lim (section) yaratish
- Testlar qo'shish (20 ta bo'limda)
- 3 ta bepul bo'lim

---

## 🗂️ Fayllar Tuzilmasi

### `src/types.ts`
Barcha TypeScript tiplar:
```typescript
Question       // Test savoli
TestSection    // Bo'lim
Teacher        // O'qituvchi profili
GameState      // O'yin holati
```

### `src/store.ts`
Zustand store (state management):
- `useAuthStore()` - Login/Logout
- `useSectionStore()` - Bo'lim va testlar
- `useGamePlayStore()` - O'yin jarayoni

### `src/mockData.ts`
15 ta default test:
```javascript
easyQuestions    // 5 ta oson
mediumQuestions  // 5 ta o'rta
hardQuestions    // 5 ta qiyin
```

### `src/App.tsx`
Routing va layout:
- `game` - Oyun ekrani
- `login` - O'qituvchi kirish
- `admin` - Test boshqaruvi

### `src/components/GameScreen.tsx`
Asosiy o'yin logikasi:
- 4 ta phase: setup → running → delivery → finished
- Timer countdown
- Test integratsiyasi
- Bonus hisoblash

### `src/components/LeftPanel.tsx`
Chap panel bilgi va sozlamalar:
- O'yin statistikasi
- Vaqt ko'rsatish
- Darajani tanlash
- Testlar qo'shish tugmasi

### `src/components/RoadAndCar.tsx`
Yo'l va mashina:
- Perspektiv yo'l
- Sariq mashina (Yandex uslubida)
- 20 ta svetafor animatsiyasi
- Masofta ko'rsatgich

### `src/components/TrafficLightTestModal.tsx`
Test modal:
- Savol va 4 variant
- To'g'ri/Xato ko'rsatish
- Pastki qismda chiqadi

### `src/components/AdminLoginPage.tsx`
Login sahifasi:
- Email va username
- localStorage ga saqlanadi
- Oddiy validatsiya

### `src/components/TestManagementPage.tsx`
O'qituvchi paneli:
- Bo'lim yaratish
- Testlar qo'shish (expand/collapse)
- Bo'limni o'chirish
- 3 ta bepul bo'lim limiti

---

## 🔄 O'yin Jarayoni

### Setup Phase
```
- "Darajani tanlang" ekrani
- Oson / O'rta / Qiyin tugmalari
- Boshlash tugmasi
```

### Running Phase
```
- Mashina harakat qiladi
- 120 soniyali timer boshlanadi
- Svetaforga yaqinlashganda test chiqadi
- Test/jawob -> Wait card -> Keyingi test
```

### Wait Phase (ichki)
```
- To'g'ri: 5 soniya kutish
- Xato: 10 soniya kutish
- Mashina oldinga yurib boradi
- Svetafor xuddi yashil->qizil o'zgaradi
```

### Delivery Phase
```
- Barcha 20 ta testdan o'tdi
- Vaqt qolsa: +10,000 so'm bonus
- Yakuniy natija
```

### Finished Phase
```
- Vaqt tugadi
- Faqat X ta svetafordan o'tdi
- Ball ko'rsatiladi
```

---

## 💾 Data Saqlanishi

Hamma data **localStorage** da:

```javascript
localStorage.setItem('currentTeacher', JSON.stringify(teacher))
localStorage.setItem('testSections', JSON.stringify(sections))
```

Jonibek: Haqiqiy backend uchun bu yerlarni API call bilan almashtirib ketish kerak.

---

## 🎨 Tailwind CSS Sozlamasi

Custom colors:
```javascript
brand.primary   // #8B5CF6 (Purple)
brand.secondary // #EC4899 (Pink)
brand.accent    // #FBBF24 (Gold)
dark.bg         // #0F172A
dark.card       // #1E293B
dark.border     // #334155
success         // #10B981
error           // #EF4444
warning         // #F59E0B
```

Custom utilities:
- `.neon-text` - Gradient text
- `.glass-effect` - Blur background
- `.card-dark` - Dark card style
- `.neon-border` - Gradient border

---

## 📱 Responsive Design

```css
/* Desktop */
.layout { grid-template-columns: 30% 1fr }

/* Tablet/Mobile */
@media (max-width: 980px) {
  .layout { grid-template-columns: 1fr }
}
```

---

## 🔐 Keysallar

### Auth Oqini
1. "Testlar Qo'shish" tugmasini bosish
2. Email va username kiriting
3. `useAuthStore.login()` chaqiriladi
4. localStorage'ga saqlanadi
5. TestManagementPage ochiladi

### Test Qo'shish Oqini
1. Bo'lim yaratish (New Section)
2. "Test Qo'shish" bosgach...
3. Question formani to'ldirish
4. `addQuestionToSection()` chaqiriladi
5. localStorage'ga saqlanadi

### O'yin Boshlash Oqini
1. Difficulty tanlash (Oson/O'rta/Qiyin)
2. `GameScreen` -> `running` phase
3. Questions filtrlangan va shuffled
4. Timer boshlandi
5. First test auto-open 🚀

---

## 🐛 Debugging Tips

### Browser Console
```javascript
// Check auth
localStorage.getItem('currentTeacher')

// Check sections
localStorage.getItem('testSections')

// Clear all
localStorage.clear()
```

### React DevTools
- `useAuthStore` -> teacher, isLoggedIn
- `useSectionStore` -> sections ro'yxati
- `useGamePlayStore` -> gameState

---

## 📈 Kelallashtirish Yo'li

### Phase 1: ✅ Frontend
- React components ✅
- Zustand store ✅
- localStorage ✅
- Tailwind styling ✅

### Phase 2: Backend
- Node.js/Express setup
- MongoDB/PostgreSQL
- API endpoints:
  - POST /auth/login
  - POST /sections
  - GET /sections/:id
  - POST /questions
  - POST /results

### Phase 3: Database
- Teachers table
- Sections table
- Questions table
- Results table
- Authentication (JWT)

### Phase 4: Deploy
- Vercel (Frontend)
- Heroku/Render (Backend)
- Environment variables
- CORS setup

---

## 🎓 Learning Resources

- [React 18 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)

---

## 🤝 Hissa Qo'shish

Pull requestlarni yuboring! Barcha taklif va xatolar xush kelibdi.

---

**Last Updated**: 2024
**Version**: 1.0.0
