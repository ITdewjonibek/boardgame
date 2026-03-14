#!/bin/bash
# Courier Game Mode - Quick Start Setup

echo "🚀 Courier + Traffic Light Quiz Game Setup"
echo "==========================================="
echo ""

# Frontend setup
echo "📦 Frontend Setup..."
if [ ! -f ".env" ]; then
    echo "VITE_API_URL=http://localhost:8001" > .env
    echo "✅ Created .env file"
else
    echo "✅ .env already exists"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Backend setup
echo ""
echo "📦 Backend Setup..."
cd Uzgame

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate venv and install dependencies
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

pip install -r requirements.txt
echo "✅ Backend dependencies installed"

# Database setup
echo ""
echo "🗄️  Database Setup..."
python -c "from app.database import Base, engine; Base.metadata.create_all(engine); print('✅ Tables created')" 2>/dev/null || echo "⚠️  Tables may already exist"

cd ..

# Summary
echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1️⃣  Start Backend:"
echo "   cd Uzgame"
echo "   uvicorn app.main:app --reload --port 8001"
echo ""
echo "2️⃣  Start Frontend (in new terminal):"
echo "   npm run dev"
echo ""
echo "3️⃣  Open in browser:"
echo "   http://localhost:5173"
echo ""
echo "4️⃣  Login and create test section to play!"
