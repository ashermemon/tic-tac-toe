// ==========================================================================
// Global State Variables
// ==========================================================================
let board = ["", "", "", "", "", "", "", "", ""]; // 9 empty spaces
let currentPlayer = "X";
let isGameActive = true;
let winner = "";

// ==========================================================================
// DOM Elements
// ==========================================================================
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status-message");
const resetBtn = document.getElementById("reset-btn");

// ==========================================================================
// Initialization
// ==========================================================================

// Listen for the HTML document to fully load before running our JS
document.addEventListener("DOMContentLoaded", initGame);

/**
 * Sets up the initial game board by creating 9 div elements,
 * attaching click listeners to them, and putting them on the screen.
 */
function initGame() {
  // Clear any existing HTML inside the board container
  // This is important for resetting the game
  isGameActive = true;
  winner = "";
  currentPlayer = "X";

  boardElement.innerHTML = "";
  statusElement.innerHTML = "Player " + currentPlayer + "'s Turn";
  // Loop 9 times to create the 3x3 grid
  for (let i = 0; i < 9; i++) {
    // 1. Create a new div element
    const cell = document.createElement("div");

    // 2. Add the 'cell' CSS class to it
    cell.classList.add("cell");

    // 3. Store the index (0-8) inside the HTML element so we know which one was clicked
    cell.dataset.index = i;

    // 4. Attach an event listener: When this cell is clicked, call handleCellClick
    cell.addEventListener("click", handleCellClick);

    // 5. Append the cell to the board element in the DOM
    boardElement.appendChild(cell);
  }

  // Attach event listener to the reset button
  resetBtn.addEventListener("click", resetGame);
}

// ==========================================================================
// Game Logic & Event Handling
// ==========================================================================

/**
 * Handles what happens when a user clicks on a cell.
 * @param {Event} event - The click event object
 */
function handleCellClick(event) {
  // 'event.target' refers to the exact HTML element that was clicked
  const clickedCell = event.target;

  // Retrieve the index we stored earlier and convert it to a number
  const cellIndex = parseInt(clickedCell.dataset.index);

  // Check if the cell is already filled OR if the game is over.
  // If either is true, exit the function early (do nothing).
  if (board[cellIndex] !== "" || isGameActive === false) {
    return;
  }

  // TODO 1: Update the internal state (the 'board' array) with the current player

  board[cellIndex] = currentPlayer;

  // TODO 2: Update the DOM to reflect the internal state!

  clickedCell.classList.remove("x", "o");
  clickedCell.innerHTML = currentPlayer;
  clickedCell.classList.add(currentPlayer.toLowerCase());

  // you may need to update both inner html and css classes of DOM elements

  // TODO 3: Check for (and possibly handle) a winner (Call the checkWin() function)

  if (checkWin()) {
    statusElement.innerHTML = "Congrats " + winner + "! You win!";
    return;
  }

  // TODO 4: Check for (and possibly handle) a tie (Call the checkTie() function)

  if (checkTie()) {
    statusElement.innerHTML = "It's a tie! Play again?";
    return;
  }

  // TODO 5: Swap the currentPlayer from 'X' to 'O' or 'O' to 'X'

  currentPlayer = currentPlayer == "X" ? "O" : "X";

  // TODO 6: Update the statusElement to show whose turn it is now

  statusElement.innerHTML = "Player " + currentPlayer + "'s Turn";
}

/**
 * Checks for a winner.
 * @returns {boolean} true if there is a winner, false otherwise
 */
function checkWin() {
  // TODO

  let l = Math.sqrt(board.length);

  for (let s = 0; s < l; s++) {
    if (checkRow(s * l) || checkColumn(s)) {
      winner = currentPlayer;
      isGameActive = false;
      return true;
    }
  }
  if (checkDiagonal()) {
    winner = currentPlayer;
    isGameActive = false;
    return true;
  }

  return false;
}

function checkRow(first) {
  if (!board[first] || !board[first + 1] || !board[first + 2]) {
    return false;
  }
  if (board[first] == board[first + 1] && board[first] == board[first + 2]) {
    return true;
  }
  return false;
}
function checkColumn(first) {
  if (!board[first] || !board[first + 3] || !board[first + 6]) {
    return false;
  }
  if (board[first] == board[first + 3] && board[first] == board[first + 6]) {
    return true;
  }
  return false;
}
function checkDiagonal() {
  if (
    board[0] &&
    board[4] &&
    board[8] &&
    board[0] == board[4] &&
    board[0] == board[8]
  ) {
    return true;
  } else if (
    board[2] &&
    board[4] &&
    board[6] &&
    board[2] == board[4] &&
    board[2] == board[6]
  ) {
    console.log("diagonal");
    return true;
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

  for (let i = 0; i < board.length; i++) {
    if (board[i] == "") {
      return false;
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
  board.fill("");

  // To clear the DOM easily, just call initGame() again to rebuild the empty cells!
  initGame();
}
