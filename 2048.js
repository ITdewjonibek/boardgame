/**
 * 2048 Game
 */

let grid2048 = [];
let score2048 = 0;
let best2048 = localStorage.getItem('best2048') || 0;
let canMove2048 = true;

const tileColors = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

function init2048Game() {
  grid2048 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  
  score2048 = 0;
  canMove2048 = true;
  
  addNewTile2048();
  addNewTile2048();
  
  document.getElementById('score-2048').textContent = score2048;
  document.getElementById('best-2048').textContent = best2048;
  
  render2048();
  document.addEventListener('keydown', handle2048Input);
}

function addNewTile2048() {
  const emptyCells = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid2048[i][j] === 0) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }
  
  if (emptyCells.length === 0) return false;
  
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid2048[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
  
  return true;
}

function move2048(direction) {
  if (!canMove2048) return;
  
  const oldGrid = JSON.parse(JSON.stringify(grid2048));
  
  if (direction === 'left') move2048Left();
  else if (direction === 'right') move2048Right();
  else if (direction === 'up') move2048Up();
  else if (direction === 'down') move2048Down();
  
  const moved = JSON.stringify(oldGrid) !== JSON.stringify(grid2048);
  
  if (moved) {
    if (!addNewTile2048()) {
      if (!canMove2048Game()) {
        end2048Game();
      }
    }
    render2048();
    soundManager.playClick();
  }
}

function move2048Left() {
  for (let i = 0; i < 4; i++) {
    grid2048[i] = compress2048(grid2048[i]);
    grid2048[i] = merge2048(grid2048[i], 'left');
    grid2048[i] = compress2048(grid2048[i]);
  }
}

function move2048Right() {
  for (let i = 0; i < 4; i++) {
    grid2048[i].reverse();
    grid2048[i] = compress2048(grid2048[i]);
    grid2048[i] = merge2048(grid2048[i], 'right');
    grid2048[i] = compress2048(grid2048[i]);
    grid2048[i].reverse();
  }
}

function move2048Up() {
  for (let j = 0; j < 4; j++) {
    let column = [grid2048[0][j], grid2048[1][j], grid2048[2][j], grid2048[3][j]];
    column = compress2048(column);
    column = merge2048(column, 'left');
    column = compress2048(column);
    for (let i = 0; i < 4; i++) {
      grid2048[i][j] = column[i];
    }
  }
}

function move2048Down() {
  for (let j = 0; j < 4; j++) {
    let column = [grid2048[0][j], grid2048[1][j], grid2048[2][j], grid2048[3][j]];
    column.reverse();
    column = compress2048(column);
    column = merge2048(column, 'left');
    column = compress2048(column);
    column.reverse();
    for (let i = 0; i < 4; i++) {
      grid2048[i][j] = column[i];
    }
  }
}

function compress2048(row) {
  return row.filter(val => val !== 0);
}

function merge2048(row, direction) {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      score2048 += row[i];
      row.splice(i + 1, 1);
      soundManager.playSuccess();
    }
  }
  return row.concat(Array(4 - row.length).fill(0));
}

function canMove2048Game() {
  // Check if there are empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid2048[i][j] === 0) return true;
    }
  }
  
  // Check if any moves are possible
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const current = grid2048[i][j];
      if ((j < 3 && current === grid2048[i][j + 1]) ||
          (i < 3 && current === grid2048[i + 1][j])) {
        return true;
      }
    }
  }
  
  return false;
}

function render2048() {
  const board = document.getElementById('board-2048');
  board.innerHTML = '';
  
  document.getElementById('score-2048').textContent = score2048;
  
  if (score2048 > parseInt(best2048)) {
    best2048 = score2048;
    localStorage.setItem('best2048', best2048);
    document.getElementById('best-2048').textContent = best2048;
  }
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const value = grid2048[i][j];
      const tile = document.createElement('div');
      tile.className = 'tile-2048';
      
      if (value === 0) {
        tile.textContent = '';
        tile.style.background = 'rgba(255, 255, 255, 0.02)';
      } else {
        tile.textContent = value;
        const color = tileColors[value] || tileColors[2048];
        tile.style.background = color;
        tile.style.color = value <= 4 ? '#776e65' : '#f9f6f2';
        
        if (value >= 1024) {
          tile.style.fontSize = '1.4rem';
        } else if (value >= 128) {
          tile.style.fontSize = '1.6rem';
        }
      }
      
      board.appendChild(tile);
    }
  }
}

function handle2048Input(e) {
  if (!canMove2048) return;
  
  if (e.key === 'ArrowLeft') {
    move2048('left');
    e.preventDefault();
  } else if (e.key === 'ArrowRight') {
    move2048('right');
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    move2048('up');
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    move2048('down');
    e.preventDefault();
  }
}

function end2048Game() {
  canMove2048 = false;
  soundManager.playGameOver();
  
  const status = document.createElement('div');
  status.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(26, 26, 46, 0.95); padding: 40px; border-radius: 16px; text-align: center; z-index: 1000; border: 2px solid var(--secondary);';
  status.innerHTML = `
    <h2 style="color: var(--secondary); font-size: 1.8rem; margin-bottom: 16px;">Game Over!</h2>
    <p style="font-size: 1.2rem; margin-bottom: 20px;">Score: ${score2048}</p>
  `;
  document.body.appendChild(status);
  
  setTimeout(() => {
    status.remove();
  }, 3000);
}

function reset2048Game() {
  canMove2048 = false;
  document.removeEventListener('keydown', handle2048Input);
  grid2048 = [];
  score2048 = 0;
}

document.getElementById('restart-2048')?.addEventListener('click', () => {
  reset2048Game();
  init2048Game();
  soundManager.playClick();
});
