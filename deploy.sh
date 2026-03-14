#!/bin/bash
# Automated Deploy Script for Vercel + Render

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║   BoardGame Platform - Vercel + Render Deploy     ║"
echo "║         Avtomatik Deployment Script               ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}📋 TEKSHIRUV${NC}"
echo ""

# Check git
if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git o'rnatilmagan!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Git o'rnatilgan${NC}"

# Check node
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js o'rnatilmagan!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js o'rnatilgan${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm o'rnatilmagan!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm o'rnatilgan${NC}"

# Install Vercel CLI if not exists
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠ Vercel CLI o'rnatilmagan, o'rnatilmoqda...${NC}"
    npm install -g vercel
fi
echo -e "${GREEN}✓ Vercel CLI o'rnatilgan${NC}"

# Check package.json
if [ ! -f "package.json" ]; then
    echo -e "${RED}✗ package.json topilmadi!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ package.json topildi${NC}"

echo ""
echo -e "${BLUE}🚀 DEPLOY JARAYONI${NC}"
echo ""

# Push to GitHub
echo -e "${BLUE}📤 GitHub'ga push qilmoqda...${NC}"
git add .
git commit -m "Deploy: Frontend + Backend automated deployment" 2>/dev/null || true
git push origin main
echo -e "${GREEN}✓ GitHub'ga push qilindi${NC}"

echo ""

# Frontend deployment
echo -e "${BLUE}🚀 FRONTEND - VERCEL'DA DEPLOY QILISH${NC}"
echo ""
echo -e "${YELLOW}Vercel CLI qo'lda login qilish uchun aytadi:${NC}"
echo "1. https://vercel.com/auth/login qo'ldan kiring"
echo "2. 'Continue with GitHub' bosing"
echo "3. Vercel CLI'da ruxsat bering"
echo ""

# Deploy frontend
vercel --prod

echo ""
echo -e "${BLUE}✅ FRONTEND DEPLOY TUGADI!${NC}"
echo ""

# Backend deployment info
echo -e "${BLUE}🚀 BACKEND - RENDER'DA DEPLOY QILISH${NC}"
echo ""
echo -e "${YELLOW}Render.com'da qo'lda deploy qilishingiz kerak:${NC}"
echo ""
echo "1. https://render.com ga kiring (GitHub bilan login)"
echo "2. 'New +' → 'PostgreSQL' bosing"
echo "   - Name: boardgame-db"
echo "   - PostgreSQL: 15"
echo "   - Create Database"
echo ""
echo "3. 'New +' → 'Web Service' bosing"
echo "   - Repository: ITdewjonibek/boardgame"
echo "   - Branch: becendrot1"
echo "   - Build Command: pip install -r requirements.txt && python migrate.py"
echo "   - Start Command: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"
echo ""
echo "4. Environment Variables qo'ying:"
echo "   - DATABASE_URL (PostgreSQL'dan)"
echo "   - SECRET_KEY=tajriba123456789"
echo "   - ALGORITHM=HS256"
echo "   - CORS_ORIGINS=[\"https://boardgame.vercel.app\"]"
echo ""
echo "5. Create Web Service"
echo ""

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ DEPLOY TUGADI!                    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Frontend (Vercel):${NC}"
echo "  https://boardgame.vercel.app"
echo ""
echo -e "${BLUE}Backend (Render):${NC}"
echo "  https://boardgame-backend.onrender.com"
echo "  (Qo'lda Render.com'da yaratishingiz kerak)"
echo ""
echo -e "${YELLOW}Keyingi qadamlar:${NC}"
echo "  1. Frontend saytga kiring"
echo "  2. Login/Register test qiling"
echo "  3. O'yin o'ynab ko'ring"
echo "  4. Backend Render'da yarating"
echo ""
