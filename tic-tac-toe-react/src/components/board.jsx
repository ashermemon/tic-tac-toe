import React from "react";
import Cell from "./cell";

export default function Board({ board, boardSize }) {
  return (
    <main className="board-container">
      <div
        className="board"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
        }}
      >
        {board.map((row, rIndex) =>
          row.map((cell, cIndex) => (
            <Cell
              key={rIndex + "-key-" + cIndex}
              boardSize={boardSize}
              value={cell}
            />
          )),
        )}
      </div>
    </main>
  );
}
