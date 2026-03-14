#!/bin/bash
# Render build script - Database migrations va setup

set -e  # Exit on error

echo "🔧 Installing dependencies..."
pip install -r requirements.txt

echo "🗄️ Running database migrations..."
cd backend || cd . 2>/dev/null || true

# Check if migrate.py exists
if [ -f "migrate.py" ]; then
    python migrate.py
else
    echo "⚠️ migrate.py not found, skipping migrations"
fi

# Check if seed_all.py exists and run it
if [ -f "seed_all.py" ]; then
    echo "🌱 Seeding initial data..."
    python seed_all.py || true
fi

echo "✅ Build complete!"
