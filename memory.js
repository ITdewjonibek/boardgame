/**
 * Memory Match Game
 */

const cardEmojis = ['🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '🎲', '🎳'];
let memoryCards = [];
let flippedCards = [];
let matchedCards = new Set();
let moveCount = 0;
let isMemoryLocked = false;

function initMemoryGame() {
  const board = document.getElementById('memory-board');
  board.innerHTML = '';
  
  memoryCards = [...cardEmojis, ...cardEmojis].sort(() => Math.random() - 0.5);
  flippedCards = [];
  matchedCards = new Set();
  moveCount = 0;
  isMemoryLocked = false;
  
  updateMemoryStats();
  
  memoryCards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.index = index;
    card.textContent = '?';
    
    card.addEventListener('click', () => flipMemoryCard(card, index));
    board.appendChild(card);
  });
}

function flipMemoryCard(cardEl, index) {
  if (isMemoryLocked || matchedCards.has(index) || flippedCards.includes(index)) return;
  
  flippedCards.push(index);
  cardEl.classList.add('flipped');
  cardEl.textContent = memoryCards[index];
  soundManager.playClick();
  
  if (flippedCards.length === 2) {
    isMemoryLocked = true;
    moveCount++;
    updateMemoryStats();
    
    const [first, second] = flippedCards;
    
    if (memoryCards[first] === memoryCards[second]) {
      matchedCards.add(first);
      matchedCards.add(second);
      soundManager.playSuccess();
      
      setTimeout(() => {
        document.querySelector(`[data-index="${first}"]`).classList.add('matched');
        document.querySelector(`[data-index="${second}"]`).classList.add('matched');
        flippedCards = [];
        isMemoryLocked = false;
        
        if (matchedCards.size === memoryCards.length) {
          setMemoryGameOver();
        }
      }, 600);
    } else {
      soundManager.playCollision();
      
      setTimeout(() => {
        document.querySelector(`[data-index="${first}"]`).classList.remove('flipped');
        document.querySelector(`[data-index="${second}"]`).classList.remove('flipped');
        document.querySelector(`[data-index="${first}"]`).textContent = '?';
        document.querySelector(`[data-index="${second}"]`).textContent = '?';
        flippedCards = [];
        isMemoryLocked = false;
      }, 800);
    }
  }
}

function updateMemoryStats() {
  document.getElementById('memory-moves').textContent = moveCount;
  document.getElementById('memory-matches').textContent = matchedCards.size / 2;
}

function setMemoryGameOver() {
  const status = document.createElement('div');
  status.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(26, 26, 46, 0.95); padding: 40px; border-radius: 16px; text-align: center; z-index: 1000; border: 2px solid var(--primary);';
  status.innerHTML = `
    <h2 style="color: var(--accent); font-size: 1.8rem; margin-bottom: 16px;">You Won!</h2>
    <p style="font-size: 1.2rem; margin-bottom: 20px;">Moves: ${moveCount}</p>
  `;
  document.body.appendChild(status);
  soundManager.playSuccess();
  
  setTimeout(() => {
    status.remove();
  }, 3000);
}

function resetMemoryGame() {
  const board = document.getElementById('memory-board');
  if (board) board.innerHTML = '';
  memoryCards = [];
  flippedCards = [];
  matchedCards = new Set();
  moveCount = 0;
  isMemoryLocked = false;
}

document.getElementById('memory-restart')?.addEventListener('click', () => {
  initMemoryGame();
  soundManager.playClick();
});
