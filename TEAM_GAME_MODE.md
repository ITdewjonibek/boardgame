# 🎮 Jamoaviy O'yin Rejimi (Team Game Mode) - Matematika Chotkasi

Taklif: Matematika Chotkasi o'yiniga yangi jamoaviy o'yin rejimi qo'shildi. Ushbu rejimda ikki jamoa bir-biriga raqobat qiladi, har bo'limda turni almashtirib savollarni javoblardan.

## 🎯 Xususiyatlari

### Bosh Menyu
- **Chap Sidebar**: 10 ta bo'lim (Bo'lim 1 - 10)
- **O'ng Taraf**: Team 1 vs Team 2 ballari
- **Raqobat**: Ikkita jamoa turini almashtirib o'ynaydi

### Bo'lim Tuzilishi
Har **bo'limda**:
- 3 ta **qiyinlik darajasi**: Oson (🟢), O'rta (🟡), Qiyin (🔴)
- **20 ta savol** har qiyinlikka = 60 jami savol
- **Turli vaqt**: 
  - Oson: 30 sekund/savol
  - O'rta: 45 sekund/savol
  - Qiyin: 60 sekund/savol

### Izohli Savollar
Har bir savol **modal** shaklidagi qayta boshlash funksiyasiga ega:
- Bo'limni tugatgandan keyin, tugallanishni ko'rsatish uchun ✅ belgisi paydo bo'ladi
- Yana bir bor o'ynamoqchi bo'lsangiz, bo'lim tugmachasini bosing
- Modal oynasi chiqadi va qiyinlikni tanlashingizni so'raydi

### Natija Ekrani
- **Jamoa Ballari**: Team 1 va Team 2 finaliy ballari
- **Yutuvchi**: Kim eng ko'p ball to'pladi?
- **Keyingi Bo'limga O'tish**: 2-bo'limga o'tish tugmasi

## 📊 API Endpoints

### Backend Endpoints

#### 1. Jamoaviy O'yni Boshlash
```
POST /team-games/start
Body: {
  "game_name": "math",
  "section_number": 1,
  "difficulty": "Oson",
  "team1_player_id": 123,
  "team2_player_id": 456,
  "total_questions": 20
}
Response: TeamGameProgress object
```

#### 2. Jamoa Ballni Yangilash
```
PUT /team-games/{game_id}/update-score
Query: 
  - team: 1 yoki 2
  - score: yangi ball
Response: TeamGameProgress object
```

#### 3. Jamoaviy O'yni Tugatish
```
PUT /team-games/{game_id}/finish
Body: {
  "total_time_spent": 125.5 (sekund)
}
Response: TeamGameProgress object (winner field included)
```

#### 4. O'yin Natijalari
```
GET /team-games/{game_id}
GET /team-games/section/{game_name}/{section_number}
GET /team-games/game/{game_name}/all-results
GET /team-games/stats/{game_name}?difficulty=O'rta
```

## 💾 Database Model

```python
class TeamGameProgress(Base):
    __tablename__ = "team_game_progress"
    
    id: int (Primary Key)
    game_name: str (index: "math", "physics", etc)
    section_number: int (1-10, indexed)
    difficulty: str ("Oson", "O'rta", "Qiyin")
    team1_player_id: int (nullable)
    team2_player_id: int (nullable)
    team1_score: int (default: 0)
    team2_score: int (default: 0)
    total_questions: int (default: 20)
    completed: bool (default: False)
    winner: str ("team1", "team2", "draw", nullable)
    total_time_spent: float (sekund, default: 0)
    created_at: datetime
    completed_at: datetime (nullable)
```

## 🎨 Frontend Komponenti

### MathQuizTeamMode.tsx
- **Props**: Hech qanday (standalone komponenti)
- **State**:
  - currentSection: faol bo'lim
  - selectedDifficulty: tanlangan qiyinlik
  - teamScores: Team 1 va Team 2 ballari
  - currentTeam: qaysi jamoa o'ynayotgani
  - sectionProgress: har bo'limning holati
  
### Oyna Tuzilishi

#### 1. Bo'lim Tanlab Olish Ekrani
```
┌─ TEAM SCORES (Yuqori) ─────────────────┐
│    Team 1: X    VS    Team 2: Y        │
├─ SIDEBAR (Chap)  MAIN (O'ng) ─────────┤
│                                        │
│ Bo'lim 1-10        |  Qiyinlik Selector|
│ (Chap tomonda)     |  - 🟢 Oson        │
│                    |  - 🟡 O'rta       │
│                    |  - 🔴 Qiyin       │
│                    |                   │
│                    |  [BOSHLASH]       │
│                    |                   │
└────────────────────────────────────────┘
```

#### 2. O'yin Ekrani
```
┌─ QAYTA BILGILARI ──────────────────────┐
│ Team 1 O'ynayotgan | O'rta | 13s       │
├───────────────────────────────────────┤
│  Team 1: 5   Team 2: 7                 │
│                                        │
│        ❓ 2 + 3 = ?                    │
│                                        │
│  [A: 4]  [B: 5]  [C: 6]  [D: 7]       │
│                                        │
│       [➡️ Keyingi]                     │
│                                        │
└───────────────────────────────────────┘
```

## 🔄 O'yin Oqimi

1. **Bo'lim Tanlang** → Qiyinlikni Tanlang → Boshlang
2. **Team 1 O'ynaydi** → Savol + Javoblar → Keyingi
3. **Team 2 O'ynaydi** → Savol + Javoblar → Keyingi
4. **20 Savol Tugadi** → Bo'lim Tugatildi ✅
5. **Bo'limni Qayta Boshlash** → Modal → Qiyinlik Tanlang
6. **2-10 Bo'limlarda Takrorla**
7. **Natijalar Sohifasi** → Final Ballari va Yutuvchi

## 🛠️ Foydalanishni Boshlash

### Frontend
```bash
# MathQuizTeamMode komponentasini ishlatish
import { MathQuizTeamMode } from './Components/Games';

// Route qo'shish
<Route path="/game/team/math-quiz" element={<MathQuizTeamMode />} />
```

### Backend

#### Alembic Migration
```bash
cd Uzgame
alembic upgrade head
```

#### API Ishlat
```bash
# 1. O'yni Boshlash
curl -X POST http://localhost:8000/team-games/start \
  -H "Content-Type: application/json" \
  -d '{
    "game_name": "math",
    "section_number": 1,
    "difficulty": "Oson",
    "team1_player_id": 1,
    "team2_player_id": 2,
    "total_questions": 20
  }'

# 2. Ball Yangilash
curl -X PUT "http://localhost:8000/team-games/1/update-score?team=1&score=5"

# 3. O'yni Tugatish
curl -X PUT http://localhost:8000/team-games/1/finish \
  -H "Content-Type: application/json" \
  -d '{"total_time_spent": 125.5}'

# 4. Natijalari Ko'rish
curl http://localhost:8000/team-games/1
curl http://localhost:8000/team-games/stats/math
```

## 📱 Responsive Design
- ✅ Desktop (1200px+): Full sidebar + center game
- ✅ Tablet (768px-1199px): Collapsible sidebar
- ✅ Mobile (< 768px): Bottom sections grid

## 🎓 Savollari Database

20 ta savol × 3 qiyinlik = **60 savol har bo'limda**
- **Oson (🟢)**: Asosiy arifmetika, qo'shish, ayirish
- **O'rta (🟡)**: Daraja, ildiz, foiz hisoblash
- **Qiyin (🔴)**: Integral, logaritm, trigonometriya

## 🚀 Keyingi Yangilanishlar
- [ ] Eksklyuziv hadyalar (yutuvchiga mukofot)
- [ ] Turnir rejimi (16 jamoa)
- [ ] Vaqt bonusi - to'g'ri javobga qo'shimcha vaqt
- [ ] Lider taxtasi
- [ ] Fotosuratlar va medallar

## 📞 Yordam
Agar savollar bo'lsa, loyiha egasi bilan bog'laning!
