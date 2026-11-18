export default function Cell({ boardSize, value, r, c, selectCell }) {
  return (
    <div
      className={`cell ${value === "X" ? "x" : "o"} ${value ? "taken" : ""}`}
      style={{ fontSize: `${(1 / boardSize) * 12}rem` }}
      onClick={() => selectCell(r, c)}
    >
      {value}
    </div>
  );
}
