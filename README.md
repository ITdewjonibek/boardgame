# Boardgame — Tic-Tac-Toe

A classic two-player Tic-Tac-Toe game built with plain HTML, CSS, and JavaScript. No build tools or dependencies required.

## How to Play

1. Open `index.html` in any modern web browser.
2. Player **X** always goes first.
3. Players take turns clicking empty cells on the 3×3 grid.
4. The first player to get three of their marks in a row (horizontally, vertically, or diagonally) wins.
5. If all nine cells are filled without a winner, the game is a draw.
6. Click **New Game** to start a fresh round. Scores are preserved across rounds.

## Features

- Two-player local multiplayer
- Win, draw, and turn detection
- Winning cells highlighted
- Persistent scoreboard for the session
- Responsive layout for mobile screens

## Project Structure

```
boardgame/
├── index.html   # Game markup
├── style.css    # Styling and animations
└── game.js      # Game logic
```