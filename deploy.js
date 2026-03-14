#!/usr/bin/env node

/**
 * Automated Vercel + Render Deployment Script
 * Vercel va Render'ga avtomatik deploy qilish uchun
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.blue}${msg}${colors.reset}\n`),
};

function checkGit() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function installVercelCLI() {
  log.info('Vercel CLI o\'rnatilmoqda...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    log.success('Vercel CLI o\'rnatildi');
    return true;
  } catch {
    log.error('Vercel CLI o\'rnatilmadi');
    return false;
  }
}

function deployFrontend() {
  log.title('🚀 FRONTEND - VERCEL\'DA DEPLOY QILISH');
  
  try {
    log.info('Vercel CLI bilan login qilmoqda...');
    execSync('vercel login', { stdio: 'inherit' });
    
    log.info('Frontend deploy qilmoqda...');
    execSync('vercel --prod', { stdio: 'inherit', cwd: path.join(__dirname) });
    
    log.success('Frontend muvaffaqiyatli deploy qilindi!');
    return true;
  } catch (error) {
    log.error('Frontend deploy qilishda xato: ' + error.message);
    return false;
  }
}

function deployBackend() {
  log.title('🚀 BACKEND - RENDER\'DA DEPLOY QILISH');
  
  log.warn('Render.com\'da qo\'lda deploy qilishingiz kerak:');
  log.info('1. https://render.com ga kiring');
  log.info('2. "New Web Service" yaratish');
  log.info('3. Branch: becendrot1 tanlang');
  log.info('4. Build Command: pip install -r requirements.txt && python migrate.py');
  log.info('5. Start Command: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000');
  log.info('6. Environment Variables qo\'ying (DATABASE_URL, SECRET_KEY, CORS_ORIGINS)');
  
  return true;
}

function main() {
  console.log(`
${colors.bright}${colors.green}
╔════════════════════════════════════════════════════╗
║   BoardGame Platform - Vercel + Render Deploy     ║
║         Avtomatik Deployment Script               ║
╚════════════════════════════════════════════════════╝
${colors.reset}
  `);

  // Check prerequisites
  log.title('📋 TEKSHIRUV');
  
  if (!checkGit()) {
    log.error('Git o\'rnatilmagan!');
    process.exit(1);
  }
  log.success('Git o\'rnatilgan');

  if (!checkVercelCLI()) {
    log.warn('Vercel CLI o\'rnatilmagan');
    if (!installVercelCLI()) {
      process.exit(1);
    }
  } else {
    log.success('Vercel CLI o\'rnatilgan');
  }

  // Check package.json
  if (!fs.existsSync('package.json')) {
    log.error('package.json topilmadi!');
    process.exit(1);
  }
  log.success('package.json topildi');

  // Check git remote
  try {
    const remotes = execSync('git remote -v', { encoding: 'utf-8' });
    if (remotes.includes('ITdewjonibek/boardgame')) {
      log.success('GitHub repository bog\'langan');
    } else {
      log.error('GitHub repository bog\'lanmagan!');
      process.exit(1);
    }
  } catch {
    log.error('Git remote tekshirilmadi');
    process.exit(1);
  }

  // Deploy process
  log.title('🚀 DEPLOY JARAYONI');

  log.info('Oxirgi o\'zgarishlар push qilmoqda...');
  try {
    execSync('git push origin main', { stdio: 'inherit' });
    log.success('GitHub\'ga push qilindi');
  } catch {
    log.warn('Push qilinmadi (mumkin allaqachon push qilgan)');
  }

  // Deploy frontend
  if (!deployFrontend()) {
    log.error('Frontend deploy xatosi');
    process.exit(1);
  }

  // Deploy backend info
  deployBackend();

  // Summary
  log.title('✅ DEPLOY TUGADI!');
  
  console.log(`
${colors.green}Frontend (Vercel):${colors.reset}
  https://boardgame.vercel.app

${colors.green}Backend (Render):${colors.reset}
  https://boardgame-backend.onrender.com
  (Qo\'lda Render.com\'da yaratishingiz kerak)

${colors.green}Keyingi qadamlar:${colors.reset}
  1. Frontend saytga kiring
  2. Login/Register test qiling
  3. O\'yin o\'ynab ko\'ring
  4. Backend Render'da yarating

${colors.yellow}Muammo bo'lsa:${colors.reset}
  - Vercel logs: https://vercel.com/dashboard
  - Render logs: https://render.com/dashboard
  - GitHub: https://github.com/ITdewjonibek/boardgame

${colors.bright}Deploy qilgan: AI Copilot${colors.reset}
  `);
}

main();
