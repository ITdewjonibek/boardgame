# 🎨 Yandeks Delivery - Visual & Design Guide

## 🎯 Game Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    YANDEKS DELIVERY GAME                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: SETUP                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  LEFT PANEL:                RIGHT PANEL:                    │
│  ┌───────────────┐         ┌───────────────────────────┐    │
│  │ YANDEKS       │         │     [Beautiful Sky/      │    │
│  │ DELIVERY      │         │      Stars Background]   │    │
│  │               │         │                           │    │
│  │ Qiyinchilik:  │         │                           │    │
│  │ [Easy/Med/H]  │         │   [Difficulty info]       │    │
│  │               │         │                           │    │
│  │ ▶ START       │         │                           │    │
│  │               │         │                           │    │
│  └───────────────┘         └───────────────────────────┘    │
│                                                              │
│ + [Testlar qo'sh] button in top-right corner               │
└─────────────────────────────────────────────────────────────┘

         ⬇️ Player clicks START

┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: RUNNING GAME                                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  LEFT PANEL:                RIGHT PANEL (ROAD):            │
│  ┌───────────────┐         ┌───────────────────────────┐    │
│  │ VAQT: 45s     │         │ [Sky with Stars]          │    │
│  │               │         │                           │    │
│  │ BALL: 12      │         │                           │    │
│  │               │         │  [City Buildings/Sky]     │    │
│  │ BONUS: +10000 │         │                           │    │
│  │               │         │  [LONG ROAD]              │    │
│  │               │         │  🔵 🔵 🔵 🔵 🔵          │    │
│  │               │         │  (test markers)           │    │
│  │               │         │                           │    │
│  │               │         │     🟡 🚗 (moving)        │    │
│  │               │         │  [Yellow Yandex car]      │    │
│  │               │         │                           │    │
│  └───────────────┘         │ "Test 12/20" display      │    │
│                             └───────────────────────────┘    │
│
│  [QUIZ MODAL appears when car reaches test]
│  ┌──────────────────────────────┐
│  │    SAVOL MATNINI KIRITING    │
│  │                              │
│  │ [A] Javob 1    [B] Javob 2   │
│  │ [C] Javob 3    [D] Javob 4   │
│  └──────────────────────────────┘
│
└─────────────────────────────────────────────────────────────┘

         After wrong answer:
         ⬇️ Display wait card

┌─────────────────────────────────────────────────────────────┐
│ WAIT CARD (Wrong Answer)                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│         ┌─────────────────────────────┐                     │
│         │     ❌ Noto'g'ri!           │                     │
│         │                             │                     │
│         │           10s               │                     │
│         │                             │                     │
│         │  Tekshirib ko'ring...       │                     │
│         └─────────────────────────────┘                     │
│                                                              │
│  (Car paused, player waits)                                 │
└─────────────────────────────────────────────────────────────┘

         After all 20 tests completed:
         ⬇️ DELIVERY SCENE

┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: DELIVERY HANDOFF                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│            ┌───────────────────────────────┐                │
│            │  🎉 MAHSULOT TOPSHIRISH      │                │
│            │                               │                │
│            │  Vaqtida yetkazdingiz!        │                │
│            │                               │                │
│            │  ┌─────────────────────────┐  │                │
│            │  │ +10000 SO'M              │  │                │
│            │  │ (green gradient text)    │  │                │
│            │  └─────────────────────────┘  │                │
│            │                               │                │
│            │  Klient mahsulotni            │                │
│            │  qabul qildi ✅               │                │
│            │  Siz muvaffaqiyatli kuryer!   │                │
│            │                               │                │
│            │   [Davom] button              │                │
│            └───────────────────────────────┘                │
│                                                              │
│  (Scene overlays the road with semi-transparent bg)         │
└─────────────────────────────────────────────────────────────┘

         ⬇️ Player clicks DAVOM

┌─────────────────────────────────────────────────────────────┐
│ PHASE 4: RESULTS                                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  LEFT PANEL:                                                │
│  ┌─────────────────────────────┐                            │
│  │ O'YIN TUGADI                │                            │
│  │                             │                            │
│  │ 🎉 MUVAFFAQIYAT!            │                            │
│  │ 20 test yechdiniz!          │                            │
│  │                             │                            │
│  │ ┌───────────────────────┐   │                            │
│  │ │ To'g'ri javob: 20     │   │                            │
│  │ │ Bonus:        +10000  │   │                            │
│  │ │ Minus:        0       │   │                            │
│  │ │ ─────────────────────── │  │                            │
│  │ │ JAMI:         10020   │   │                            │
│  │ └───────────────────────┘   │                            │
│  │                             │                            │
│  │  [Qayta O'yn] button         │                            │
│  └─────────────────────────────┘                            │
│                                                              │
│  RIGHT PANEL:                                               │
│  [Same sky/road in background, faded]                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Palette

```
Primary Colors:
🟡 Yellow/Gold:     #FFD700, #FFA500      (Yandex delivery car)
🟠 Orange:          #FF6B35, #FF8C42      (Main actions)
🟢 Green:           #10B981, #34D399      (Success, bonuses, delivery)
🔵 Purple:          #6366F1, #8B5CF6      (Premium, secondary)

Backgrounds:
Dark Navy:          #0a0f23, #141932      (Night sky)
Dark Gray:          #2A2E4A, #1A1D2E      (Road surface)
Transparent White:  rgba(255,255,255,..)  (Glass morphism)
Transparent Dark:   rgba(0,0,0,..)        (Overlays)

Gradients:
Orange → Yellow:    #FF6B35 → #FF8C42
Green → Teal:       #10B981 → #34D399
Purple → Blue:      #6366F1 → #8B5CF6
```

---

## 🚗 Car Design

```
         Yellow Delivery Car
         
    ╔════════════════════════╗
    ║  🟦  (window)          ║   
    ║────────────────────────║
    ║                        ║
    ║  Y A N D E K S        ║
    ║                        ║
    ║         (glow halo)    ║
    ╚════════════════════════╝
    ●                      ●    (wheels)
    
Features:
- Yellow gradient body
- Window detail on left side
- Two black wheels
- Glow effect around car
- Smooth movement animation
```

---

## 🛣️ Road Design

```
Road Layout:
                
┌─────────────────────────────────────────────────────┐
│                    [SKY BACKGROUND]                 │
│                                                     │
│                                                     │
│                  [CITY BUILDINGS]                   │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │                    [ROAD]                    │  │
│  │                                               │  │
│  │  | | | | | | | | | | | | | | | | | | | |    │  │
│  │  (test markers for all 20 stops)              │  │
│  │                                               │  │
│  │              🟡🚗 (moving car)              │  │
│  │                                               │  │
│  │  ────────────────────────────────────────     │  │
│  │         (center line, subtle)                 │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘

Car Progress:
Start (0%)     │████░░░░░░░░░░│      Middle (50%)    │░░░░░░░░████░░░░│     End (100%)
🚗 ━━━━          🚗 ━━━━━━━━         🚗 ━━━━━━━━
```

---

## 👨‍🏫 Teacher Portal Design

```
TEST MANAGEMENT MODAL

Header:
┌─────────────────────────────────────────────────┐
│ ← │  TITLE (Login / Bo'limlar / Testlar)  │  × │
└─────────────────────────────────────────────────┘

---

SCREEN 1: LOGIN
┌─────────────────────────────────────────────────┐
│                                                 │
│  Email                                          │
│  ┌──────────────────────────────────┐           │
│  │ your@email.com                   │           │
│  └──────────────────────────────────┘           │
│                                                 │
│  Parol                                          │
│  ┌──────────────────────────────────┐           │
│  │ ••••••••                         │           │
│  └──────────────────────────────────┘           │
│                                                 │
│         [KIRISH] (purple button)                │
│                                                 │
│  💡 Test bo'limlarini boshqarish...            │
│                                                 │
└─────────────────────────────────────────────────┘

---

SCREEN 2: SECTIONS
┌─────────────────────────────────────────────────┐
│                                                 │
│  Salom, O'qituvchi! 👋                          │
│  3 ta bo'limni bepul tahrirlashingiz mumkin     │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Matematika                              │   │
│  │ Sonlar va arifmetika                    │   │
│  │ 8 test                    [hover: glow] │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Ingliz tili                             │   │
│  │ Grammatika va so'zlar                   │   │
│  │ 12 test                                 │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Tabiiy fanlar                           │   │
│  │ Fizika va kimyo                         │   │
│  │ 5 test                                  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Qo'shimcha bo'lim         🔒 PREMIUM    │   │
│  │ Premium bo'lim                          │   │
│  │ 0 test                    [locked]       │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│     [🚪 CHIQISH] (red button)                   │
│                                                 │
└─────────────────────────────────────────────────┘

---

SCREEN 3: ADD TESTS
┌─────────────────────────────────────────────────┐
│                                                 │
│  ┌─ Matematika ─────────────────────────────┐  │
│  │ 8 ta test                                │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ╔═ Yaniy test qo'shish ═════════════════════╗ │
│  ║                                           ║ │
│  ║  Savol                                    ║ │
│  ║  ┌──────────────────────────────────────┐ ║ │
│  ║  │ Savol matnini kiriting...            │ ║ │
│  ║  │                                      │ ║ │
│  ║  │                                      │ ║ │
│  ║  └──────────────────────────────────────┘ ║ │
│  ║                                           ║ │
│  ║  To'g'ri javob                            ║ │
│  ║  ┌──────────────────────────────────────┐ ║ │
│  ║  │ To'g'ri javob...                     │ ║ │
│  ║  └──────────────────────────────────────┘ ║ │
│  ║                                           ║ │
│  ║  Noto'g'ri javob 1                        ║ │
│  ║  ┌──────────────────────────────────────┐ ║ │
│  ║  │                                      │ ║ │
│  ║  └──────────────────────────────────────┘ ║ │
│  ║                                           ║ │
│  ║  Noto'g'ri javob 2, 3 (same as above)    ║ │
│  ║                                           ║ │
│  ║      [+ TEST QO'SHISH] (green)           ║ │
│  ║                                           ║ │
│  ╚═══════════════════════════════════════════╝ │
│                                                 │
│  💡 Qo'shilgan testlar databasega saqlanadi... │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📊 UI Components Summary

| Component | Color | Size | Purpose |
|-----------|-------|------|---------|
| Start Button | Orange | Large | Begin game |
| Difficulty Buttons | Orange | Medium | Select difficulty |
| Testlar qo'sh | Purple | Medium | Open test management |
| Test Markers | Blue/Green | Small | Show test positions |
| Car | Yellow | Medium | Player representation |
| Delivery Scene | Green | Large | Show bonus |
| Delivery Button | Green | Large | Continue after delivery |
| Qayta O'yn | Orange | Large | Restart game |
| Kirish Button | Purple | Large | Login |
| Chiqish Button | Red | Medium | Logout |

---

## 🎬 Animation Details

### Car Movement
- **Duration**: 0.35s per movement unit
- **Easing**: ease (smooth)
- **Path**: Linear along road from left (8%) to right (100%)

### Wait Card
- **Entrance**: Fade in + scale up
- **Duration**: Appears for wait time (5s or 10s)
- **Exit**: Fade out

### Delivery Scene
- **Entrance**: Fade in + blur background
- **Background**: Semi-transparent dark overlay
- **Content**: Card with green gradient text
- **Exit**: Fade out when button clicked

### Other Effects
- Button hover: slight lift (translateY -2px)
- Card hover: subtle shadow increase
- Text animation: gradient background for bonus amount
- Glow effects: subtle radial gradients around car

---

## 📱 Responsive Behavior

### Desktop (> 980px)
- 2-column layout: Left panel (420px) | Right panel (1fr)
- Top button sticky
- Modal max-width: 620px

### Tablet (768px - 980px)
- 1-column layout
- Full-width panels
- Modal width: 95%
- Top button smaller

### Mobile (< 768px)
- Single column, stacked
- Full-width everything
- Modal: 90% width
- Touch-friendly button sizes

---

## 🎯 Final Design Vision

**Modern Courier Theme** with real-world Yandex Delivery aesthetic
- Clean, minimalist road design
- Bright yellow delivery car
- Green success states
- Purple premium elements
- Dark background for contrast
- Smooth, responsive interactions

**Professional Teacher Portal** for easy test management
- Intuitive login flow
- Clear section organization
- Simple form for adding questions
- Locked/premium indicators
- One-click logout

**Engaging Gameplay** with visual feedback
- Car movement shows progress
- Wait cards show time
- Delivery scene celebrates success
- Bonus display motivates players
- Results screen shows score breakdown
