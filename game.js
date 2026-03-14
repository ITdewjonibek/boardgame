/**
 * Enhanced Tic-Tac-Toe Game with AI and Navigation
 */

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let scores = { X: 0, O: 0, draws: 0 };
let gameMode = 'pvp';
let difficulty = 'medium';
let isAIThinking = false;

const hubContainer = document.getElementById('hub-container');
const gameContainer = document.getElementById('game-container');
const gameCardsContainer = document.getElementById('games-grid');

// Tic-Tac-Toe Elements
const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const winsXEl = document.getElementById('wins-x');
const winsOEl = document.getElementById('wins-o');
const drawsEl = document.getElementById('draws');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const backBtn = document.getElementById('back-btn');

// Game Mode Selection
const modeRadios = document.querySelectorAll('input[name="mode"]');
const difficultySelect = document.getElementById('difficulty');

// Navigation
function showGame(gameName) {
  hubContainer.style.display = 'none';
  gameContainer.style.display = 'flex';
  
  // Hide all game views
  document.querySelectorAll('.game-view').forEach(view => {
    view.style.display = 'none';
  });
  
  // Show selected game
  const gameView = document.getElementById(`${gameName}-game`);
  if (gameView) {
    gameView.style.display = 'block';
  }
}

function goBackToHub() {
  hubContainer.style.display = 'block';
  gameContainer.style.display = 'none';
  resetGame();
  resetMemoryGame();
  resetSnakeGame();
  reset2048Game();
  resetCheckersGame();
}

// Game Card Click Handlers
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    const gameName = card.dataset.game;
    if (gameName === 'tictactoe') {
      showGame('tictactoe');
    } else if (gameName === 'memory') {
      showGame('memory');
      initMemoryGame();
    } else if (gameName === 'snake') {
      showGame('snake');
      initSnakeGame();
    } else if (gameName === '2048') {
      showGame('2048');
      init2048Game();
    } else if (gameName === 'checkers') {
      showGame('checkers');
      initCheckersGame();
    }
    soundManager.playClick();
  });
});

backBtn.addEventListener('click', goBackToHub);

// Tic-Tac-Toe Game Logic
function getWinner(boardState) {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return { winner: boardState[a], line: [a, b, c] };
    }
  }
  return null;
}

function isDraw(boardState) {
  return boardState.every(cell => cell !== null);
}

function countWins(boardState, player) {
  let count = 0;
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    const line = [boardState[a], boardState[b], boardState[c]];
    if (line.filter(cell => cell === player).length === 2 && line.includes(null)) count += 10;
    if (line.filter(cell => cell === player).length === 3) count += 100;
    if (line.filter(cell => cell === 'X' || cell === 'O').filter(cell => cell !== player).length === 2 && line.includes(null)) count += 8;
  }
  return count;
}

function getAIMove(boardState) {
  const emptyMoves = boardState
    .map((cell, index) => cell === null ? index : null)
    .filter(val => val !== null);

  if (emptyMoves.length === 0) return null;

  if (difficulty === 'easy') {
    return emptyMoves[Math.floor(Math.random() * emptyMoves.length)];
  }

  let bestScore = -Infinity;
  let bestMove = emptyMoves[0];

  for (const move of emptyMoves) {
    const testBoard = [...boardState];
    testBoard[move] = 'O';
    let score = countWins(testBoard, 'O') - countWins(testBoard, 'X');
    
    if (difficulty === 'medium' && Math.random() < 0.3) {
      score += (Math.random() - 0.5) * 5;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function setStatus(text, className) {
  statusEl.textContent = text;
  statusEl.className = 'status' + (className ? ' ' + className : '');
}

function updateActiveScore() {
  scoreXEl.classList.toggle('active-x', currentPlayer === 'X' && !gameOver);
  scoreOEl.classList.toggle('active-o', currentPlayer === 'O' && !gameOver);
}

function handleCellClick(event) {
  const index = parseInt(event.target.dataset.index, 10);

  if (gameOver || board[index] !== null || isAIThinking) return;
  if (gameMode === 'pva' && currentPlayer === 'O') return;

  makeMove(index);
  soundManager.playClick();

  if (gameMode === 'pva' && !gameOver) {
    setTimeout(aiMove, 500);
  }
}

function makeMove(index) {
  board[index] = currentPlayer;
  const cell = cells[index];
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.disabled = true;

  const result = getWinner(board);

  if (result) {
    gameOver = true;
    scores[result.winner]++;
    updateScoreboard();
    setStatus(`Player ${result.winner} wins!`, `winner-${result.winner.toLowerCase()}`);
    result.line.forEach(i => cells[i].classList.add('winning'));
    disableAllCells();
    soundManager.playSuccess();
    updateActiveScore();
    return;
  }

  if (isDraw(board)) {
    gameOver = true;
    scores.draws++;
    updateScoreboard();
    setStatus("It's a draw!", 'draw');
    soundManager.playSuccess();
    updateActiveScore();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  setStatus(`Player ${currentPlayer}'s turn`);
  updateActiveScore();
}

function aiMove() {
  if (gameOver) return;
  isAIThinking = true;
  const move = getAIMove(board);
  if (move !== null) {
    makeMove(move);
    soundManager.playClick();
  }
  isAIThinking = false;
}

function disableAllCells() {
  cells.forEach(cell => { cell.disabled = true; });
}

function updateScoreboard() {
  winsXEl.textContent = scores.X;
  winsOEl.textContent = scores.O;
  drawsEl.textContent = scores.draws;
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  isAIThinking = false;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
    cell.disabled = false;
  });

  setStatus("Player X's turn");
  updateActiveScore();
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', () => {
  resetGame();
  soundManager.playClick();
});

modeRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    gameMode = e.target.value;
    resetGame();
    soundManager.playClick();
  });
});

difficultySelect?.addEventListener('change', (e) => {
  difficulty = e.target.value;
  resetGame();
  soundManager.playClick();
});

updateActiveScore();
