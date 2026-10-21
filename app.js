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
let aiDifficulty = "hard";
let isAiMoving = false;
let gameId = 0;
let gameStarted = false;

// ==========================================================================
// DOM Elements
// ==========================================================================
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status-message");
const resetBtn = document.getElementById("reset-btn");
const aiEBtn = document.getElementById("ai-btn-e");
const aiHBtn = document.getElementById("ai-btn-h");
const humanBtn = document.getElementById("human-btn");
const gamemode = document.getElementById("gamemode");
const slider = document.getElementById("size");
const output = document.getElementById("slider-value");

// ==========================================================================
// Initialization
// ==========================================================================

// Listen for the HTML document to fully load before running our JS
document.addEventListener("DOMContentLoaded", reset);

// Attach event listener to the reset button
resetBtn.addEventListener("click", resetGame);
function setMode(enabled, difficulty) {
  aiEnabled = enabled;
  aiDifficulty = difficulty;
  aiEBtn.hidden = enabled;
  aiHBtn.hidden = enabled;
  humanBtn.hidden = !enabled;
  gamemode.innerHTML = !enabled
    ? "Human vs Human"
    : difficulty == "easy"
      ? "Human vs Easy AI"
      : "Human vs Hard AI";
  reset();
}
aiEBtn.addEventListener("click", () => setMode(true, "easy"));
aiHBtn.addEventListener("click", () => setMode(true, "hard"));
humanBtn.addEventListener("click", () => setMode(false, aiDifficulty));

function setModeButtonsDisabled(disabled) {
  aiEBtn.disabled = disabled;
  aiHBtn.disabled = disabled;
  humanBtn.disabled = disabled;
}
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
  setModeButtonsDisabled(false);
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
  setModeButtonsDisabled(true);
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
  setModeButtonsDisabled(true);

  const clickedCell = event.target;
  place(
    parseInt(clickedCell.dataset.row),
    parseInt(clickedCell.dataset.column),
  );
}

async function aiTurn() {
  const currentGame = gameId;
  slider.disabled = true;
  setModeButtonsDisabled(true);
  isAiMoving = true;
  await wait(1500);
  if (currentGame !== gameId) {
    return;
  }
  const [r, c] = aiDifficulty == "easy" ? selectMove() : findBestMove();
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

  if (checkWin(currentPlayer)) {
    slider.disabled = false;
    setModeButtonsDisabled(false);
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
    setModeButtonsDisabled(false);
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
function checkWin(player) {
  // TODO

  if (checkRow(player) || checkColumn(player) || checkDiagonal(player)) {
    winner = player;
    isGameActive = false;
    return true;
  }

  return false;
}

function checkRow(player) {
  let rowWon;
  for (let r = 0; r < board.length; r++) {
    rowWon = true;
    for (let c = 0; c < board[r].length; c++) {
      if (!board[r][c] || board[r][c] != player) {
        rowWon = false;
        break;
      }
    }
    if (rowWon) return true;
  }
  return false;
}
function checkColumn(player) {
  let columnWon;
  for (let c = 0; c < board.length; c++) {
    columnWon = true;
    for (let r = 0; r < board[c].length; r++) {
      if (!board[r][c] || board[r][c] != player) {
        columnWon = false;
        break;
      }
    }
    if (columnWon) return true;
  }
  return false;
}
function checkDiagonal(player) {
  let diagWon;
  for (let diag = 0; diag < 2; diag++) {
    diagWon = true;
    for (let i = 0; i < board.length; i++) {
      if (
        !board[i][diag == 1 ? boardsize - 1 - i : i] ||
        board[i][diag == 1 ? boardsize - 1 - i : i] != player
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
