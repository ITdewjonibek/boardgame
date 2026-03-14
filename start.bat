@echo off
REM Quick Start Script for Windows

echo 🚗 Kuryer Node Oyini - Tezkor Boshlash
echo ======================================

REM Check Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js o'rnatilmagan. nodejs.org dan o'rnatib oling
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js topildi: %NODE_VERSION%

REM Install dependencies
echo.
echo 📦 Dependencies o'rnatilmoqda...
call npm install

if errorlevel 1 (
    echo ❌ npm install xatosi
    exit /b 1
)

echo ✅ Dependencies o'rnatildi

REM Build Tailwind
echo.
echo 🎨 Tailwind CSS tayyorlanmoqda...
call npx tailwindcss -i ./src/index.css -o ./src/output.css

echo ✅ Tailwind CSS tayyor

REM Start dev server
echo.
echo 🚀 Dev server boshlanimoqda...
echo 📱 Sayt: http://localhost:5173
echo ⌨️  Ctrl+C = Stop
echo.

call npm run dev

pause
