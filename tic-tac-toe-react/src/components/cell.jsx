import React from "react";

export default function Cell({ boardSize, value }) {
  return (
    <div
      className={"cell"}
      style={{ fontSize: `${(1 / boardSize) * 12}rem` }}
      // onClick={() => handleCellClick(rIndex, cIndex)}
    >
      {value}
    </div>
  );
}
