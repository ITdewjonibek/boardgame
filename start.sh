#!/bin/bash
# Quick Start Script

echo "🚗 Kuryer Node Oyini - Tezkor Boshlash"
echo "========================================"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js o'rnatilmagan. Bugungi.dev/node dan o'rnatib oling"
    exit 1
fi

echo "✅ Node.js topildi: $(node -v)"

# Install dependencies
echo ""
echo "📦 Dependencies o'rnatilmoqda..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install xatosi"
    exit 1
fi

echo "✅ Dependencies o'rnatildi"

# Build Tailwind
echo ""
echo "🎨 Tailwind CSS tayyorlanmoqda..."
npx tailwindcss -i ./src/index.css -o ./src/output.css

echo "✅ Tailwind CSS tayyor"

# Start dev server
echo ""
echo "🚀 Dev server boshlanimoqda..."
echo "📱 Sayt: http://localhost:5173"
echo "⌨️  q+Enter = Stop"
echo ""

npm run dev
