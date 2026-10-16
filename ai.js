function selectMove(board) {
  let availableOptions = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] == "") {
        availableOptions.push([r, c]);
      }
    }
  }
  return availableOptions[Math.floor(Math.random() * availableOptions.length)];
}
