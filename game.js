/**
 * Tic-Tac-Toe game logic
 */

const WINNING_COMBINATIONS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let scores = { X: 0, O: 0, draws: 0 };

const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const winsXEl = document.getElementById('wins-x');
const winsOEl = document.getElementById('wins-o');
const drawsEl = document.getElementById('draws');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');

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

  if (gameOver || board[index] !== null) return;

  board[index] = currentPlayer;
  const cell = event.target;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.disabled = true;

  const result = getWinner(board);

  if (result) {
    gameOver = true;
    scores[result.winner]++;
    updateScoreboard();
    setStatus(`Player ${result.winner} wins! 🎉`, `winner-${result.winner.toLowerCase()}`);
    result.line.forEach(i => cells[i].classList.add('winning'));
    disableAllCells();
    updateActiveScore();
    return;
  }

  if (isDraw(board)) {
    gameOver = true;
    scores.draws++;
    updateScoreboard();
    setStatus("It's a draw! 🤝", 'draw');
    updateActiveScore();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  setStatus(`Player ${currentPlayer}'s turn`);
  updateActiveScore();
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

  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
    cell.disabled = false;
  });

  setStatus("Player X's turn");
  updateActiveScore();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', resetGame);

updateActiveScore();
