# 📦 O'rnatish Qo'llanmasi

## Talablar

- **Node.js**: 16.0.0 yoki undan yuqori
- **npm**: 7.0.0 yoki undan yuqori
- **Git**: (ixtiyoriy)

## 1️⃣ Node.js O'rnatish

### Windows
1. [nodejs.org](https://nodejs.org/) ga boring
2. LTS versiyasini download qiling
3. Installer'ni oching va "Next" bosing
4. Terminal'da tekshiring:
   ```bash
   node -v
   npm -v
   ```

### macOS
```bash
# Homebrew ishlatib
brew install node
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nodejs npm
```

---

## 2️⃣ Loyihani O'rnatish

### GitHub'dan Clone Qilish
```bash
git clone https://github.com/jonibekjonjorayev4/courier-node-game.git
cd courier-node-game/CourierNodeGame
```

### Yoki Manual Yuklash
1. [ZIP](https://github.com/jonibekjonjorayev4/courier-node-game/archive/refs/heads/main.zip) download qiling
2. Extracting qiling
3. `CourierNodeGame` papkasiga boring

---

## 3️⃣ Dependencies O'rnatish

```bash
npm install
```

Yoki Yarn ishlatmoqchi bo'lsangiz:
```bash
yarn install
```

### Tez O'rnatish (Skip optional)
```bash
npm install --production
```

---

## 4️⃣ Dev Server Boshlash

### Avtomatik Start Script
**Windows:**
```bash
start.bat
```

**macOS/Linux:**
```bash
bash start.sh
```

### Manual Start
```bash
npm run dev
```

Browser avtomatik ochiladi: `http://localhost:5173`

---

## 5️⃣ Production Build

```bash
npm run build
```

Output folder: `dist/`

Preview:
```bash
npm run preview
```

---

## 🔧 Sozlamalar (Optional)

### .env Fayl Yaratish

```bash
cp .env.example .env.local
```

Keyin `.env.local` ni o'zgartiring:

```env
VITE_API_URL=http://localhost:3000/api
VITE_ENABLE_DEBUG=true
```

---

## ✅ Tekshirish

Hammasi to'g'rimi?

### 1. Server Ishlamoqda
```bash
npm run dev
# "Local: http://localhost:5173" ko'rsatilsa ✅
```

### 2. Saytni Ochish
1. Browser'da `http://localhost:5173` adresi
2. "Kuryer Node O'yiniga Xush Kelibsiz" ko'rinsa ✅

### 3. Test Qo'shish
1. "Testlar Qo'shish" tugmasini bosing
2. Email va username kiriting
3. TestManagementPage ochilsa ✅

### 4. O'yin Boshlash
1. "Oson" darajasini tanlang
2. Oyun boshlansa ✅

---

## 🐛 Xato Fixlash

### `npm install` Xatosi

**Problem**: npm command topilmaydi
```bash
# Solution: Node.js reinstall qiling
nodejs.org dan download
```

**Problem**: ERR! peer dep missing
```bash
npm install --legacy-peer-deps
```

### Port 5173 Band
```bash
# Port o'zgartirish
npm run dev -- --port 3000
```

### Module Not Found
```bash
# node_modules o'chirish
rm -rf node_modules package-lock.json

# Qayta o'rnatish
npm install
```

---

## 📝 Texnik Sozlamalar

| Sozlama | Qiymat | Tasnif |
|---------|--------|--------|
| Node | 16+ | Talab |
| npm | 7+ | Talab |
| React | 18.2 | Auto |
| TypeScript | 5.2 | Auto |
| Tailwind | 3.3 | Auto |

---

## 📂 Folder Structure

```
CourierNodeGame/
├── src/
│   ├── components/   # React components
│   ├── App.tsx
│   ├── types.ts
│   ├── store.ts
│   ├── main.tsx
│   └── index.css
├── public/          # Static files
├── node_modules/    # Dependencies (auto)
├── dist/           # Build output (auto)
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

---

## 🚀 Kelallashtirish

### Deploy to Vercel (Recommended)

1. Vercel'ga kirish: [vercel.com](https://vercel.com)
2. GitHub connect qiling
3. Deploy qiling (1 click)

### Deploy to Netlify

1. Netlify'ga kirish: [netlify.com](https://netlify.com)
2. `npm run build` ni run qiling
3. `dist/` folder'ni drag-drop qiling

### Deploy to Custom Server

```bash
# 1. Build
npm run build

# 2. dist/ folder'ni server'ga upload qiling
scp -r dist/* user@server:/var/www/html/

# 3. Server'da serve qiling (nginx, Apache, etc.)
```

---

## 💡 Tips & Tricks

### Faster Installation
```bash
npm install --legacy-peer-deps --prefer-offline
```

### Clean Install
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Development dengan Hot Reload
```bash
npm run dev
# File saqlaganingizda avtomatik reload
```

### Linting
```bash
npm run lint
```

---

## 📚 Qo'shimcha Manbalar

- [Node.js Documentation](https://nodejs.org/docs/)
- [npm Guide](https://docs.npmjs.com/)
- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)

---

## ❓ FAQ

**Q: Node.js versiyasini qanday bilib olaman?**
```bash
node -v
```

**Q: npm update qilish kerakmi?**
```bash
npm install -g npm@latest
```

**Q: Multiple versions o'rnatish mumkinmi?**
```bash
# nvm ishlatib (Node Version Manager)
nvm install 16
nvm use 16
```

**Q: Project o'chirish uchun?**
```bash
rm -rf CourierNodeGame
```

---

**Last Update**: March 2024
**Version**: 1.0.0
