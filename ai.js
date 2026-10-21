function getAvailableOptions() {
  let availableOptions = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] == "") {
        availableOptions.push([r, c]);
      }
    }
  }
  return availableOptions;
}

function selectMove() {
  return getAvailableOptions()[
    Math.floor(Math.random() * getAvailableOptions().length)
  ];
}
function hasWon(player) {
  return checkRow(player) || checkColumn(player) || checkDiagonal(player);
}

function isBoardFull() {
  return board.every((row) => row.every((cell) => cell !== ""));
}

function checkBoard() {
  if (hasWon(aiPlayer)) return 10;
  if (hasWon(aiPlayer == "X" ? "O" : "X")) return -10;
  if (isBoardFull()) return 0;
  return null;
}

function minimax(depth, isMax) {
  let boardState = checkBoard();

  if (boardState != null) {
    if (boardState > 0) return { score: boardState - depth, move: null };
    if (boardState < 0) return { score: boardState + depth, move: null };
    return { score: 0, move: null };
  }

  let bestScore = isMax ? -Infinity : Infinity;
  let bestMove = null;
  let availableOptions = getAvailableOptions();

  availableOptions.forEach(([r, c]) => {
    const currentPlayerSim = isMax ? aiPlayer : aiPlayer == "X" ? "O" : "X";
    board[r][c] = currentPlayerSim;
    const score = minimax(depth + 1, !isMax).score;
    board[r][c] = "";

    if (isMax) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = [r, c];
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = [r, c];
      }
    }
  });
  return { score: bestScore, move: bestMove };
}

function findBestMove() {
  return minimax(0, true).move;
}
