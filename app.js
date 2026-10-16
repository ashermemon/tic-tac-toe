// ==========================================================================
// Global State Variables
// ==========================================================================

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let boardsize = 3;
let board = Array.from({ length: boardsize }, () => Array(boardsize).fill(""));
let currentPlayer = "X";
let isGameActive = true;
let winner = "";
let aiEnabled = false;
let aiPlayer = "";
let isAiMoving = false;
let gameId = 0;
let gameStarted = false;

// ==========================================================================
// DOM Elements
// ==========================================================================
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status-message");
const resetBtn = document.getElementById("reset-btn");
const aiBtn = document.getElementById("ai-btn");
const slider = document.getElementById("size");
const output = document.getElementById("slider-value");

// ==========================================================================
// Initialization
// ==========================================================================

// Listen for the HTML document to fully load before running our JS
document.addEventListener("DOMContentLoaded", reset);

// Attach event listener to the reset button
resetBtn.addEventListener("click", resetGame);
aiBtn.addEventListener("click", () => {
  aiEnabled = !aiEnabled;
  aiBtn.innerHTML = aiEnabled ? "Play Against Human" : "Play Against AI";
  reset();
});
slider.oninput = function () {
  boardsize = parseInt(this.value);
  reset();
};

/**
 * Sets up the initial game board by creating 9 div elements,
 * attaching click listeners to them, and putting them on the screen.
 */
function reset() {
  gameId++;
  isAiMoving = false;
  gameStarted = false;
  slider.disabled = false;
  aiBtn.disabled = false;
  // Clear any existing HTML inside the board container
  // This is important for resetting the game

  boardElement.style.gridTemplateColumns = `repeat(${boardsize}, 1fr)`;
  boardElement.style.gridTemplateRows = `repeat(${boardsize}, 1fr)`;
  board = Array.from({ length: boardsize }, () => Array(boardsize).fill(""));
  output.innerHTML = boardsize;
  isGameActive = false;
  winner = "";
  currentPlayer = "X";
  Math.floor(Math.random() * 2) == 0 ? (aiPlayer = "X") : (aiPlayer = "O");

  boardElement.innerHTML = "";
  statusElement.innerHTML = aiEnabled
    ? aiPlayer == currentPlayer
      ? "AI's Turn (" + currentPlayer + ")"
      : "Player " + currentPlayer + "'s Turn"
    : "Player " + currentPlayer + "'s Turn";
  resetBtn.innerHTML = isGameActive ? "Reset Game" : "Start Game";

  // Loop n^2 times to create the nxn grid
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      // 1. Create a new div element
      const cell = document.createElement("div");

      // 2. Add the 'cell' CSS class to it
      cell.classList.add("cell");
      cell.style.fontSize = `${(1 / boardsize) * 12}rem`;

      // 3. Store the index (0-8) inside the HTML element so we know which one was clicked
      cell.dataset.row = r;
      cell.dataset.column = c;

      // 4. Attach an event listener: When this cell is clicked, call handleCellClick
      cell.addEventListener("click", handleCellClick);

      // 5. Append the cell to the board element in the DOM
      boardElement.appendChild(cell);
    }
  }
}

function initGame() {
  gameStarted = true;
  isGameActive = true;
  resetBtn.innerHTML = "Reset Game";
  slider.disabled = true;
  aiBtn.disabled = true;
  if (aiEnabled && aiPlayer == currentPlayer) {
    aiTurn();
  }
}

// ==========================================================================
// Game Logic & Event Handling
// ==========================================================================

/**
 * Handles what happens when a user clicks on a cell.
 * @param {Event} event - The click event object
 */
function handleCellClick(event) {
  if (isAiMoving) return;
  if (!isGameActive) return;
  // 'event.target' refers to the exact HTML element that was clicked
  slider.disabled = true;
  aiBtn.disabled = true;

  const clickedCell = event.target;
  place(
    parseInt(clickedCell.dataset.row),
    parseInt(clickedCell.dataset.column),
  );
}

async function aiTurn() {
  const currentGame = gameId;
  slider.disabled = true;
  aiBtn.disabled = true;
  isAiMoving = true;
  await wait(1500);
  if (currentGame !== gameId) {
    return;
  }
  const [r, c] = selectMove(board);
  place(r, c);

  isAiMoving = false;
}

function place(cellRow, cellColumn) {
  // Check if the cell is already filled OR if the game is over.
  // If either is true, exit the function early (do nothing).
  if (board[cellRow][cellColumn] !== "" || isGameActive === false) {
    return;
  }

  // TODO 1: Update the internal state (the 'board' array) with the current player

  board[cellRow][cellColumn] = currentPlayer;
  const clickedCell = boardElement.children[cellRow * boardsize + cellColumn];
  // TODO 2: Update the DOM to reflect the internal state!

  clickedCell.classList.remove("x", "o");
  clickedCell.innerHTML = currentPlayer;
  clickedCell.classList.add(currentPlayer.toLowerCase());

  // you may need to update both inner html and css classes of DOM elements

  // TODO 3: Check for (and possibly handle) a winner (Call the checkWin() function)

  if (checkWin()) {
    slider.disabled = false;
    aiBtn.disabled = false;
    statusElement.innerHTML =
      aiEnabled && aiPlayer == currentPlayer
        ? "You lost to AI 😭😭😭😭😭😭 Congrats " + winner + "!"
        : "Congrats " + winner + "! You win!";
    resetBtn.innerHTML = "Play Again";
    return;
  }

  // TODO 4: Check for (and possibly handle) a tie (Call the checkTie() function)

  if (checkTie()) {
    slider.disabled = false;
    aiBtn.disabled = false;
    statusElement.innerHTML = "It's a tie! Play again?";
    resetBtn.innerHTML = "Play Again";
    return;
  }

  // TODO 5: Swap the currentPlayer from 'X' to 'O' or 'O' to 'X'

  currentPlayer = currentPlayer == "X" ? "O" : "X";

  // TODO 6: Update the statusElement to show whose turn it is now
  statusElement.innerHTML = aiEnabled
    ? aiPlayer == currentPlayer
      ? "AI's Turn (" + currentPlayer + ")"
      : "Player " + currentPlayer + "'s Turn"
    : "Player " + currentPlayer + "'s Turn";

  if (aiEnabled && aiPlayer == currentPlayer) {
    aiTurn();
  }
}

/**
 * Checks for a winner.
 * @returns {boolean} true if there is a winner, false otherwise
 */
function checkWin() {
  // TODO

  if (checkRow() || checkColumn() || checkDiagonal()) {
    winner = currentPlayer;
    isGameActive = false;
    return true;
  }

  return false;
}

function checkRow() {
  let rowWon;
  for (let r = 0; r < board.length; r++) {
    rowWon = true;
    for (let c = 0; c < board[r].length; c++) {
      if (!board[r][c] || board[r][c] != currentPlayer) {
        rowWon = false;
        break;
      }
    }
    if (rowWon) return true;
  }
  return false;
}
function checkColumn() {
  let columnWon;
  for (let c = 0; c < board.length; c++) {
    columnWon = true;
    for (let r = 0; r < board[c].length; r++) {
      if (!board[r][c] || board[r][c] != currentPlayer) {
        columnWon = false;
        break;
      }
    }
    if (columnWon) return true;
  }
  return false;
}
function checkDiagonal() {
  let diagWon;
  for (let diag = 0; diag < 2; diag++) {
    diagWon = true;
    for (let i = 0; i < board.length; i++) {
      if (
        !board[i][diag == 1 ? boardsize - 1 - i : i] ||
        board[i][diag == 1 ? boardsize - 1 - i : i] != currentPlayer
      ) {
        diagWon = false;
        break;
      }
    }
    if (diagWon) return true;
  }
  return false;
}

/**
 * Checks for a tie game.
 * @returns {boolean} true if it's a tie, false otherwise
 */
function checkTie() {
  // TODO
  if (winner != "") {
    return false;
  }

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] == "") {
        return false;
      }
    }
  }

  isGameActive = false;
  return true;
}

/**
 * Resets all state variables and the DOM to start a new game.
 */
function resetGame() {
  // TODO: reset internal state
  if (gameStarted) {
    reset();
  } else {
    initGame();
  }
  // To clear the DOM easily, just call initGame() again to rebuild the empty cells!
}
