import { useState } from "react";
import Board from "./components/board";
import Slider from "./components/slider";

function App() {
  const [boardSize, setBoardSize] = useState(3);
  const [board, setBoard] = useState(
    Array.from({ length: boardSize }, () => Array(boardSize).fill("")),
  );
  const [gameId, setGameId] = useState(0);
  const [isAiMoving, setIsAiMoving] = useState(false);
  const [gameState, setGameState] = useState("inactive");
  const [winner, setWinner] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [AI, setAI] = useState("");
  const [aiEnabled, setAiEnabled] = useState(false);

  const onSlide = (event) => {
    const newSize = parseInt(event.target.value);
    setBoardSize(newSize);
    reset(newSize);
  };

  function selectCell(r, c) {
    if (board[r][c] != "" || winner || gameState !== "playing") {
      return null;
    }

    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer((prev) => (prev == "X" ? "O" : "X"));
    checkCondition(currentPlayer, newBoard);
  }

  function reset(size = boardSize) {
    setGameId((prev) => prev + 1);
    setIsAiMoving(false);
    setGameState("inactive");

    setBoard(Array.from({ length: size }, () => Array(size).fill("")));
    setWinner("");
    setCurrentPlayer("X");
    setAI(Math.floor(Math.random() * 2) == 0 ? "X" : "O");
  }

  function checkCondition(player, board) {
    if (
      checkDiag(player, board) ||
      checkRow(player, board) ||
      checkCol(player, board)
    ) {
      setWinner(player);
      setGameState("won");
    } else if (checkTie(board)) {
      setGameState("tied");
    }
  }
  function checkTie(board) {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] == "") {
          return false;
        }
      }
    }
    return true;
  }
  function checkDiag(player, board) {
    let diagWon;
    for (let diag = 0; diag < 2; diag++) {
      diagWon = true;
      for (let i = 0; i < board.length; i++) {
        if (
          !board[i][diag == 1 ? boardSize - 1 - i : i] ||
          board[i][diag == 1 ? boardSize - 1 - i : i] != player
        ) {
          diagWon = false;
          break;
        }
      }
      if (diagWon) return true;
    }
    return false;
  }
  function checkRow(player, board) {
    let rowWon;

    for (let r = 0; r < board.length; r++) {
      rowWon = true;
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] !== player) {
          rowWon = false;
          break;
        }
      }
      if (rowWon) return true;
    }
    return false;
  }
  function checkCol(player, board) {
    let colWon;

    for (let c = 0; c < board.length; c++) {
      colWon = true;
      for (let r = 0; r < board[c].length; r++) {
        if (board[r][c] !== player) {
          colWon = false;
          break;
        }
      }
      if (colWon) return true;
    }
    return false;
  }

  return (
    <>
      <div className="container">
        <header>
          <h1>Tic-Tac-Toe</h1>
        </header>

        <section className="status-panel">
          <div id="status-message" className="status-message">
            {gameState === "inactive" || gameState === "playing"
              ? aiEnabled
                ? AI === currentPlayer
                  ? `AI's Turn (${currentPlayer})`
                  : `Player ${currentPlayer}'s Turn`
                : `Player ${currentPlayer}'s Turn`
              : gameState === "won"
                ? aiEnabled && AI == winner
                  ? "You lost to AI 😭😭😭 Congrats " + winner + "!"
                  : "Congrats " + winner + "! You win!"
                : "It's a tie! Play again?"}
          </div>
          <Slider
            text="Board Size: "
            boardSize={boardSize}
            onSlide={onSlide}
            disabled={gameState !== "inactive"}
          />
          <p>
            <b>
              <span id="gamemode">Use HTML version to play against AI</span>
            </b>
          </p>

          <button
            id="human-btn"
            className="btn"
            hidden
            disabled={gameState !== "inactive"}
          >
            Play Against Human
          </button>
          <button
            id="reset-btn"
            className="btn"
            onClick={() =>
              gameState !== "inactive" ? reset() : setGameState("playing")
            }
          >
            {gameState !== "inactive" ? "Reset Game" : "Start Game"}
          </button>
        </section>

        <Board board={board} boardSize={boardSize} selectCell={selectCell} />
      </div>
    </>
  );
}

export default App;
