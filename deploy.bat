@echo off
REM Automated Deploy Script for Vercel + Render (Windows)

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║   BoardGame Platform - Vercel + Render Deploy     ║
echo ║         Avtomatik Deployment Script               ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Colors setup (Windows doesn't support ANSI by default)
setlocal enabledelayedexpansion

REM Check prerequisites
echo 📋 TEKSHIRUV
echo.

REM Check git
git --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Git o'rnatilmagan!
    exit /b 1
)
echo ✓ Git o'rnatilgan

REM Check node
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js o'rnatilmagan!
    exit /b 1
)
echo ✓ Node.js o'rnatilgan

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ✗ npm o'rnatilmagan!
    exit /b 1
)
echo ✓ npm o'rnatilgan

REM Check vercel
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ⚠ Vercel CLI o'rnatilmagan, o'rnatilmoqda...
    call npm install -g vercel
)
echo ✓ Vercel CLI o'rnatilgan

REM Check package.json
if not exist "package.json" (
    echo ✗ package.json topilmadi!
    exit /b 1
)
echo ✓ package.json topildi

echo.
echo 🚀 DEPLOY JARAYONI
echo.

REM Push to GitHub
echo 📤 GitHub'ga push qilmoqda...
git add .
git commit -m "Deploy: Frontend + Backend automated deployment" 2>nul
git push origin main
echo ✓ GitHub'ga push qilindi

echo.

REM Frontend deployment
echo 🚀 FRONTEND - VERCEL'DA DEPLOY QILISH
echo.
echo Vercel CLI qo'lda login qilish uchun aytadi:
echo 1. https://vercel.com/auth/login qo'ldan kiring
echo 2. 'Continue with GitHub' bosing
echo 3. Vercel CLI'da ruxsat bering
echo.

call vercel --prod

echo.
echo ✅ FRONTEND DEPLOY TUGADI!
echo.

REM Backend deployment info
echo 🚀 BACKEND - RENDER'DA DEPLOY QILISH
echo.
echo Render.com'da qo'lda deploy qilishingiz kerak:
echo.
echo 1. https://render.com ga kiring (GitHub bilan login)
echo 2. 'New +' → 'PostgreSQL' bosing
echo    - Name: boardgame-db
echo    - PostgreSQL: 15
echo    - Create Database
echo.
echo 3. 'New +' → 'Web Service' bosing
echo    - Repository: ITdewjonibek/boardgame
echo    - Branch: becendrot1
echo    - Build Command: pip install -r requirements.txt ^&^& python migrate.py
echo    - Start Command: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
echo.
echo 4. Environment Variables qo'ying:
echo    - DATABASE_URL (PostgreSQL'dan)
echo    - SECRET_KEY=tajriba123456789
echo    - ALGORITHM=HS256
echo    - CORS_ORIGINS=["https://boardgame.vercel.app"]
echo.
echo 5. Create Web Service
echo.

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║              ✅ DEPLOY TUGADI!                    ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo Frontend (Vercel):
echo   https://boardgame.vercel.app
echo.
echo Backend (Render):
echo   https://boardgame-backend.onrender.com
echo   (Qo'lda Render.com'da yaratishingiz kerak)
echo.
echo Keyingi qadamlar:
echo   1. Frontend saytga kiring
echo   2. Login/Register test qiling
echo   3. O'yin o'ynab ko'ring
echo   4. Backend Render'da yarating
echo.
pause
