import React from "react";

export default function Slider({ text, boardSize, onSlide, disabled }) {
  return (
    <>
      <input
        type="range"
        value={boardSize}
        onChange={onSlide}
        disabled={disabled}
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
