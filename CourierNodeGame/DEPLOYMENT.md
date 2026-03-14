# 🚀 Deployment Guide - Kuryer Node O'yini

## 🎯 Deployment Variantlari

Loyihani deploy qilishning eng oson usullari:

---

## 1️⃣ Vercel (Tavsiya ❤️)

**Afzalliklari**: 
- ✅ Eng tez
- ✅ 1-click deploy
- ✅ Bepul HTTPS
- ✅ Automatic deploys

### Steps:

1. **GitHub'ga push qiling**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/courier-node-game.git
   git push -u origin main
   ```

2. **Vercel'ga kirish**
   - [vercel.com](https://vercel.com)
   - "Sign Up" bosing
   - GitHub connect qiling

3. **Deploy**
   - "New Project" bosing
   - Your repo select qiling
   - "Deploy" bosing

4. **Done!** ✅
   - URL: `https://yourname.vercel.app`

---

## 2️⃣ Netlify

**Afzalliklari**:
- ✅ Oddiy setup
- ✅ Bepul SSL
- ✅ Form handling
- ✅ Serverless functions

### Steps:

1. **Build qiling**
   ```bash
   npm run build
   ```

2. **Deploy**
   - [netlify.com](https://netlify.com) adresi
   - "New site from Git" bosing
   - GitHub connect qiling
   - `dist/` folder select qiling

3. **Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Done!** ✅
   - URL avtomatik generate bo'ladi

---

## 3️⃣ GitHub Pages

**Afzalliklari**:
- ✅ Bepul
- ✅ GitHub ga tightly integrated
- ✅ Custom domain mumkin

### Steps:

1. **vite.config.ts update qiling**
   ```typescript
   export default defineConfig({
     base: '/courier-node-game/',
     // ...
   })
   ```

2. **package.json update qiling**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **gh-pages o'rnatish**
   ```bash
   npm install --save-dev gh-pages
   ```

4. **Deploy qiling**
   ```bash
   npm run deploy
   ```

5. **GitHub Settings**
   - Repository Settings → Pages
   - Source: gh-pages branch
   - Save

6. **Done!** ✅
   - URL: `https://username.github.io/courier-node-game/`

---

## 4️⃣ Docker + Server

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "run", "preview"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

### Deploy

```bash
docker build -t courier-node .
docker run -p 3000:3000 courier-node
```

---

## 5️⃣ Traditional Hosting (cPanel, Cpanel)

### Steps:

1. **Local build**
   ```bash
   npm run build
   ```

2. **SSH connect**
   ```bash
   ssh user@yourdomain.com
   ```

3. **Upload dist/ folder**
   ```bash
   scp -r dist/* user@yourdomain.com:/public_html/
   ```

4. **.htaccess setup** (Apache)
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## 📊 Comparison Table

| Platform | Price | Speed | Setup | Support |
|----------|-------|-------|-------|---------|
| Vercel | 🟢 Free | ⚡⚡⚡ | Easy | Excellent |
| Netlify | 🟢 Free | ⚡⚡⚡ | Easy | Good |
| GitHub Pages | 🟢 Free | ⚡⚡ | Medium | Good |
| Docker | 💰 Low | ⚡⚡ | Hard | Self |
| Traditional | 💰 Cheap | ⚡ | Medium | Variable |

---

## 🔐 Environment Variables

### Vercel

1. Project Settings → Environment Variables
2. Add variables:
   ```
   VITE_API_URL=https://api.example.com
   VITE_ENABLE_BACKEND=true
   ```

### Netlify

1. Site settings → Build & deploy → Environment
2. Add same variables

### Docker

1. `.env.production` fayl yarating
2. Docker'da mount qiling

---

## 🚨 Pre-Deployment Checklist

- [ ] `npm run build` ishlay-di ✅
- [ ] `npm run preview` ishlay-di ✅
- [ ] Barcha environment variables set
- [ ] API endpoints configured
- [ ] localStorage keys reviewed
- [ ] Error handling checked
- [ ] Performance tested
- [ ] Mobile responsive checked

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📈 Performance Optimization

### Before Deploy:

1. **Minify**
   ```bash
   npm run build
   # Vite avtomatik minify qiladi
   ```

2. **Check Bundle Size**
   ```bash
   npm run build -- --stats
   ```

3. **Optimize Images**
   - PNG → WebP convert qiling
   - Sizes reduce qiling

4. **Enable Compression**
   - GZIP enabled
   - Brotli (optional)

---

## 📊 Monitoring

### Vercel Analytics
- Built-in
- Automatic

### Google Analytics Setup
```typescript
// Add to App.tsx
import { useEffect } from 'react'

export function Analytics() {
  useEffect(() => {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_ID'
    document.head.appendChild(script)
    
    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', 'GA_ID')
  }, [])
}
```

---

## 🆘 Troubleshooting

### Build fails
```bash
# Clear cache
rm -rf node_modules .vite
npm install
npm run build
```

### 404 errors
- Base URL configure qiling
- `.htaccess` setup (Apache)
- nginx config (Nginx)

### Slow loading
- Lazy loading implement qiling
- Image optimization
- Code splitting

---

## 🎓 Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/build.html)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [GitHub Pages](https://pages.github.com)

---

**Recommendation**: Vercel ✅ (fastest + easiest)

---

**Version**: 1.0.0
**Last Update**: March 2024
