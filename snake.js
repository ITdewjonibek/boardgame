/**
 * Snake Game
 */

const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }];
let food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
let dx = 1;
let dy = 0;
let nextDx = 1;
let nextDy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameLoopId = null;

const scoreDisplay = document.getElementById('snake-score');
const highScoreDisplay = document.getElementById('snake-high-score');

function initSnakeGame() {
  snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }];
  food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
  dx = 1;
  dy = 0;
  nextDx = 1;
  nextDy = 0;
  score = 0;
  gameRunning = true;
  
  scoreDisplay.textContent = score;
  highScoreDisplay.textContent = highScore;
  
  if (gameLoopId) clearInterval(gameLoopId);
  gameLoopId = setInterval(updateSnakeGame, 100);
  
  document.addEventListener('keydown', handleSnakeInput);
}

function handleSnakeInput(e) {
  if (!gameRunning) return;
  
  switch(e.key) {
    case 'ArrowUp':
      if (dy === 0) { nextDx = 0; nextDy = -1; }
      e.preventDefault();
      break;
    case 'ArrowDown':
      if (dy === 0) { nextDx = 0; nextDy = 1; }
      e.preventDefault();
      break;
    case 'ArrowLeft':
      if (dx === 0) { nextDx = -1; nextDy = 0; }
      e.preventDefault();
      break;
    case 'ArrowRight':
      if (dx === 0) { nextDx = 1; nextDy = 0; }
      e.preventDefault();
      break;
  }
}

function updateSnakeGame() {
  dx = nextDx;
  dy = nextDy;
  
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  
  // Check wall collision
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    endSnakeGame();
    return;
  }
  
  // Check self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endSnakeGame();
    return;
  }
  
  snake.unshift(head);
  
  // Check food collision
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreDisplay.textContent = score;
    soundManager.playPowerUp();
    
    // Generate new food
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    
    // Make sure food doesn't spawn on snake
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
      food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    }
  } else {
    snake.pop();
  }
  
  drawSnakeGame();
}

function drawSnakeGame() {
  // Clear canvas
  ctx.fillStyle = 'rgba(15, 52, 96, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  ctx.strokeStyle = 'rgba(83, 169, 255, 0.1)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= tileCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvas.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.stroke();
  }
  
  // Draw snake
  snake.forEach((segment, index) => {
    if (index === 0) {
      // Head
      ctx.fillStyle = '#53a9ff';
      ctx.shadowColor = 'rgba(83, 169, 255, 0.5)';
      ctx.shadowBlur = 8;
    } else {
      // Body
      ctx.fillStyle = 'rgba(83, 169, 255, 0.7)';
      ctx.shadowColor = 'rgba(83, 169, 255, 0.3)';
      ctx.shadowBlur = 4;
    }
    
    ctx.fillRect(
      segment.x * gridSize + 2,
      segment.y * gridSize + 2,
      gridSize - 4,
      gridSize - 4
    );
  });
  
  ctx.shadowColor = 'transparent';
  
  // Draw food
  ctx.fillStyle = '#ff6b6b';
  ctx.shadowColor = 'rgba(255, 107, 107, 0.5)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    gridSize / 2 - 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.shadowColor = 'transparent';
}

function endSnakeGame() {
  gameRunning = false;
  if (gameLoopId) clearInterval(gameLoopId);
  
  if (score > parseInt(highScore)) {
    highScore = score;
    localStorage.setItem('snakeHighScore', highScore);
    highScoreDisplay.textContent = highScore;
  }
  
  soundManager.playGameOver();
  
  const status = document.createElement('div');
  status.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(26, 26, 46, 0.95); padding: 40px; border-radius: 16px; text-align: center; z-index: 1000; border: 2px solid var(--secondary);';
  status.innerHTML = `
    <h2 style="color: var(--secondary); font-size: 1.8rem; margin-bottom: 16px;">Game Over!</h2>
    <p style="font-size: 1.2rem; margin-bottom: 20px;">Score: ${score}</p>
  `;
  document.body.appendChild(status);
  
  setTimeout(() => {
    status.remove();
  }, 3000);
}

function resetSnakeGame() {
  gameRunning = false;
  if (gameLoopId) clearInterval(gameLoopId);
  snake = [];
  food = {};
  document.removeEventListener('keydown', handleSnakeInput);
}

document.getElementById('snake-restart')?.addEventListener('click', () => {
  resetSnakeGame();
  initSnakeGame();
  soundManager.playClick();
});
