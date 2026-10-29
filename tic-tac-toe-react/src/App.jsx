import { useState } from "react";
import Board from "./components/board";
import Slider from "./components/slider";

function App() {
  const [boardSize, setBoardSize] = useState(3);
  const [board, setBoard] = useState(
    Array.from({ length: 3 }, () => Array(3).fill("")),
  );

  const onSlide = (event) => {
    const newSize = parseInt(event.target.value);
    setBoardSize(newSize);
    reset(newSize);
  };

  function reset(size = boardSize) {
    // gameId++;
    // isAiMoving = false;
    // gameStarted = false;
    // slider.disabled = false;
    // setModeButtonsDisabled(false);

    setBoard(Array.from({ length: size }, () => Array(size).fill("")));
    // isGameActive = false;
    // winner = "";
    // currentPlayer = "X";
    // Math.floor(Math.random() * 2) == 0 ? (aiPlayer = "X") : (aiPlayer = "O");

    // boardElement.innerHTML = "";
    // statusElement.innerHTML = aiEnabled
    //   ? aiPlayer == currentPlayer
    //     ? "AI's Turn (" + currentPlayer + ")"
    //     : "Player " + currentPlayer + "'s Turn"
    //   : "Player " + currentPlayer + "'s Turn";
    // resetBtn.innerHTML = isGameActive ? "Reset Game" : "Start Game";
  }

  return (
    <>
      <div className="container">
        <header>
          <h1>Tic-Tac-Toe</h1>
        </header>

        <section className="status-panel">
          <div id="status-message" className="status-message">
            Player X's Turn
          </div>
          <Slider text="Board Size: " boardSize={boardSize} onSlide={onSlide} />
          <p>
            Gamemode:
            <b>
              <span id="gamemode">Human vs Human</span>
            </b>
          </p>
          <button id="ai-btn-e" className="btn">
            Easy AI
          </button>
          <button id="ai-btn-h" className="btn">
            Hard AI
          </button>
          <button id="human-btn" className="btn" hidden>
            Play Against Human
          </button>
          <button id="reset-btn" className="btn">
            Start Game
          </button>
        </section>

        <Board board={board} boardSize={boardSize} />
      </div>
    </>
  );
}

export default App;
