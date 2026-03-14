/**
 * Checkers Game
 */

const BOARD_SIZE = 8;
let checkersBoard = [];
let selectedSquare = null;
let validMoves = [];
let redPieces = 12;
let blackPieces = 12;

// Piece types
const EMPTY = 0;
const RED = 1;
const RED_KING = 2;
const BLACK = 3;
const BLACK_KING = 4;

function initCheckersGame() {
  checkersBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY));
  
  // Place red pieces
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if ((i + j) % 2 === 1) {
        checkersBoard[i][j] = RED;
      }
    }
  }
  
  // Place black pieces
  for (let i = BOARD_SIZE - 3; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if ((i + j) % 2 === 1) {
        checkersBoard[i][j] = BLACK;
      }
    }
  }
  
  redPieces = 12;
  blackPieces = 12;
  selectedSquare = null;
  validMoves = [];
  
  renderCheckersBoard();
  updateCheckersPieces();
}

function renderCheckersBoard() {
  const board = document.getElementById('checkers-board');
  board.innerHTML = '';
  
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const square = document.createElement('div');
      square.className = 'checkers-square';
      square.classList.add((i + j) % 2 === 0 ? 'light' : 'dark');
      square.dataset.row = i;
      square.dataset.col = j;
      
      const piece = checkersBoard[i][j];
      if (piece === RED) {
        square.textContent = '🔴';
      } else if (piece === RED_KING) {
        square.textContent = '♚';
      } else if (piece === BLACK) {
        square.textContent = '⚫';
      } else if (piece === BLACK_KING) {
        square.textContent = '♛';
      }
      
      if (selectedSquare && selectedSquare.row === i && selectedSquare.col === j) {
        square.classList.add('selected');
      }
      
      square.addEventListener('click', () => handleCheckersClick(i, j, square));
      board.appendChild(square);
    }
  }
}

function handleCheckersClick(row, col, squareEl) {
  // If clicking selected square, deselect
  if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
    selectedSquare = null;
    validMoves = [];
    renderCheckersBoard();
    return;
  }
  
  const piece = checkersBoard[row][col];
  
  // If trying to move to valid square
  if (validMoves.some(move => move.row === row && move.col === col)) {
    moveCheckersPiece(selectedSquare.row, selectedSquare.col, row, col);
    selectedSquare = null;
    validMoves = [];
    renderCheckersBoard();
    return;
  }
  
  // If selecting a red piece
  if (piece === RED || piece === RED_KING) {
    selectedSquare = { row, col };
    validMoves = getCheckersValidMoves(row, col);
    renderCheckersBoard();
    soundManager.playClick();
  }
}

function getCheckersValidMoves(row, col) {
  const piece = checkersBoard[row][col];
  const moves = [];
  
  // Regular moves (one diagonal forward)
  const directions = piece === RED || piece === RED_KING
    ? [[1, 1], [1, -1]]
    : [[-1, 1], [-1, -1]];
  
  // If king, can move in all diagonal directions
  if (piece === RED_KING || piece === BLACK_KING) {
    directions.push([-1, 1], [-1, -1], [1, 1], [1, -1]);
  }
  
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
      if (checkersBoard[newRow][newCol] === EMPTY) {
        moves.push({ row: newRow, col: newCol, isCapture: false });
      } else if (isOpponentPiece(piece, checkersBoard[newRow][newCol])) {
        // Check for capture
        const captureRow = newRow + dr;
        const captureCol = newCol + dc;
        
        if (captureRow >= 0 && captureRow < BOARD_SIZE && captureCol >= 0 && captureCol < BOARD_SIZE) {
          if (checkersBoard[captureRow][captureCol] === EMPTY) {
            moves.push({ row: captureRow, col: captureCol, isCapture: true, capturedRow: newRow, capturedCol: newCol });
          }
        }
      }
    }
  }
  
  return moves;
}

function isOpponentPiece(piece, otherPiece) {
  if (piece === RED || piece === RED_KING) {
    return otherPiece === BLACK || otherPiece === BLACK_KING;
  } else {
    return otherPiece === RED || otherPiece === RED_KING;
  }
}

function moveCheckersPiece(fromRow, fromCol, toRow, toCol) {
  const piece = checkersBoard[fromRow][fromCol];
  
  // Find the move in valid moves to check if it's a capture
  const move = validMoves.find(m => m.row === toRow && m.col === toCol);
  
  checkersBoard[toRow][toCol] = piece;
  checkersBoard[fromRow][fromCol] = EMPTY;
  
  // Handle capture
  if (move && move.isCapture) {
    checkersBoard[move.capturedRow][move.capturedCol] = EMPTY;
    if (piece === RED || piece === RED_KING) {
      blackPieces--;
    } else {
      redPieces--;
    }
    soundManager.playSuccess();
  } else {
    soundManager.playClick();
  }
  
  // Promote to king
  if ((piece === RED && toRow === BOARD_SIZE - 1) || (piece === BLACK && toRow === 0)) {
    checkersBoard[toRow][toCol] = piece === RED ? RED_KING : BLACK_KING;
    soundManager.playSuccess();
  }
  
  updateCheckersPieces();
  renderCheckersBoard();
  
  // Simple AI move
  setTimeout(makeCheckersAIMove, 1000);
}

function makeCheckersAIMove() {
  const moves = [];
  
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const piece = checkersBoard[i][j];
      if (piece === BLACK || piece === BLACK_KING) {
        const pieceMoves = getCheckersValidMoves(i, j);
        pieceMoves.forEach(move => {
          moves.push({ from: { row: i, col: j }, to: move });
        });
      }
    }
  }
  
  if (moves.length === 0) return;
  
  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  moveCheckersPiece(randomMove.from.row, randomMove.from.col, randomMove.to.row, randomMove.to.col);
}

function updateCheckersPieces() {
  document.getElementById('checkers-red').textContent = redPieces;
  document.getElementById('checkers-black').textContent = blackPieces;
  
  if (redPieces === 0 || blackPieces === 0) {
    const winner = redPieces === 0 ? 'Black' : 'Red';
    soundManager.playGameOver();
    
    const status = document.createElement('div');
    status.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(26, 26, 46, 0.95); padding: 40px; border-radius: 16px; text-align: center; z-index: 1000; border: 2px solid var(--primary);';
    status.innerHTML = `
      <h2 style="color: var(--primary); font-size: 1.8rem; margin-bottom: 16px;">${winner} Wins!</h2>
    `;
    document.body.appendChild(status);
    
    setTimeout(() => {
      status.remove();
    }, 3000);
  }
}

function resetCheckersGame() {
  checkersBoard = [];
  selectedSquare = null;
  validMoves = [];
  redPieces = 0;
  blackPieces = 0;
}

document.getElementById('checkers-restart')?.addEventListener('click', () => {
  resetCheckersGame();
  initCheckersGame();
  soundManager.playClick();
});
