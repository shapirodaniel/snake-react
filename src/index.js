import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import GameProvider from "./context/gameContext";

function generateBoard() {
  let result = [],
    n = 0;

  while (n < 5) {
    result.push("box ".repeat(5).split(" "));
    n++;
  }

  return result;
}

const state = {
  board: generateBoard(),
};

const boardJSX = () => (
  <div style={{ width: "100%", padding: "1em" }}>
    {new Array(5).fill(null).map(() => (
      <div style={{ padding: "1em" }}>
        {new Array(5).fill(null).map(() => (
          <span style={{ padding: "1em" }}>box</span>
        ))}
      </div>
    ))}
  </div>
);

const boardExperiment = () => (
  <div style={{ boxSizing: "border-box", width: "100%", padding: "1em" }}>
    {state.board.map((row, rowIdx) => (
      <div key={rowIdx} style={{ width: "400px" }}>
        {row.map((col, colIdx) => (
          <div
            key={colIdx}
            style={{
              display: "inline-flex",
              width: "20px",
              height: "20px",
              padding: "1em",
            }}
          >
            {state.board[rowIdx][colIdx]}
          </div>
        ))}
      </div>
    ))}
  </div>
);

ReactDOM.render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
