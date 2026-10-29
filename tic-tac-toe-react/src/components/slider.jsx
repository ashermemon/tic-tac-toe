import React from "react";

export default function Slider({ text, boardSize, onSlide }) {
  return (
    <>
      <input
        type="range"
        value={boardSize}
        onChange={onSlide}
        name="size"
        min="2"
        max="10"
        step="1"
      />
      <p>
        {text}
        <span>{boardSize}</span>
      </p>
    </>
  );
}
