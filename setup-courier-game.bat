@echo off
REM Courier Game Mode - Quick Start Setup for Windows

echo.
echo 🚀 Courier + Traffic Light Quiz Game Setup
echo ===========================================
echo.

REM Frontend setup
echo 📦 Frontend Setup...
if not exist ".env" (
    (
        echo VITE_API_URL=http://localhost:8001
    ) > .env
    echo ✅ Created .env file
) else (
    echo ✅ .env already exists
)

if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

REM Backend setup
echo.
echo 📦 Backend Setup...
cd Uzgame

if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    echo ✅ Virtual environment created
)

REM Activate venv and install dependencies
call venv\Scripts\activate.bat
pip install -r requirements.txt
echo ✅ Backend dependencies installed

REM Database setup
echo.
echo 🗄️  Database Setup...
python -c "from app.database import Base, engine; Base.metadata.create_all(engine); print('✅ Tables created')" 2>nul || echo ⚠️  Tables may already exist

cd ..

REM Summary
echo.
echo ✅ Setup Complete!
echo.
echo Next steps:
echo 1️⃣  Start Backend:
echo    cd Uzgame
echo    uvicorn app.main:app --reload --port 8001
echo.
echo 2️⃣  Start Frontend ^(in new terminal^):
echo    npm run dev
echo.
echo 3️⃣  Open in browser:
echo    http://localhost:5173
echo.
echo 4️⃣  Login and create test section to play!
echo.
pause
