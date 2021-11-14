import { React, createContext } from "react";

export const GameContext = createContext();

const PREGAME = "PREGAME";
const PLAYING = "PLAYING";
const WON = "WON";
const LOST = "LOST";
const ROW = "ROW";
const COLUMN = "COLUMN";

const initSnake = [
  [4, 2],
  [4, 3],
  [4, 4],
];

function chooseRandomCell() {
  return Math.floor(Math.random() * 20);
}

const initState = {
  board: new Array(20).fill(null).map(() => new Array(20).fill(null)),
  snake: initSnake,
  score: 0,
  speedInMilliseconds: 500,
  status: PREGAME,
  gameInterval: null,
  lastKeyPress: 39, // default to snake moving right
  apple: (() => {
    let appleRow = chooseRandomCell();
    let appleCol = chooseRandomCell();

    while (
      // eslint-disable-next-line no-loop-func
      initSnake.some(([row, col]) => row === appleRow && col === appleCol)
    ) {
      appleRow = chooseRandomCell();
      appleCol = chooseRandomCell();
    }

    return [appleRow, appleCol];
  })(),
};

const directions = {
  38: [-1, 0], // up
  40: [1, 0], // down
  37: [0, -1], // left
  39: [0, 1], // right
};

function cloneState() {
  return JSON.parse(JSON.stringify(initState));
}

let state = cloneState();

function endGame() {
  clearInterval(state.gameInterval);
}

function chooseApple() {
  let randomRow = chooseRandomCell();
  let randomCol = chooseRandomCell();

  while (
    // eslint-disable-next-line no-loop-func
    state.snake.some(([row, col]) => {
      return row === randomRow && col === randomCol;
    })
  ) {
    randomRow = chooseRandomCell();
    randomCol = chooseRandomCell();
  }

  state = { ...state, apple: [randomRow, randomCol] };
}

function updateSnake(direction) {
  const [headRow, headCol] = state.snake[state.snake.length - 1];
  const [appleRow, appleCol] = state.apple;
  const isApple = headRow === appleRow && headCol === appleCol;

  if (isApple) {
    const newHead = [headRow + direction[0], headCol + direction[1]];
    state = { ...state, snake: [...state.snake, newHead] };
  } else {
    const tail = state.snake[0];
    state = { ...state, snake: [...state.snake.slice(1), tail] };
  }
}

function renderGame() {
  const direction = directions[state.lastKeyPress];

  checkLoss(direction);
  checkAllOccupied();

  if (state.status === LOST || state.status === WON) {
    endGame();
    return;
  }

  updateSnake(direction);
  chooseApple();
}

function updateSpeed(newSpeedInMilliseconds) {
  state = { ...state, speedInMilliseconds: newSpeedInMilliseconds };
}

function isOutOfBounds(selector, value) {
  return (
    value < 0 ||
    (selector === ROW && value === state.snake.length) ||
    (selector === COLUMN && value === state.snake[0].length)
  );
}

function checkLoss(direction) {
  const [headRow, headCol] = state.snake[state.snake.length - 1];
  const nextRow = headRow + direction[0];
  const nextCol = headCol + direction[1];

  if (isOutOfBounds(ROW, nextRow) || isOutOfBounds(COLUMN, nextCol)) {
    state = { ...state, status: LOST };
  }
}

function checkAllOccupied() {
  const allOccupied = state.board.every((coord) => !!coord);

  if (allOccupied) {
    state = { ...state, status: WON };
  }
}

function startGame() {
  state = { ...state, status: PLAYING };
}

export default function GameProvider({ children }) {
  const providerValue = {
    state,
    updateSnake,
    startGame,
    updateSpeed,
    renderGame,
  };

  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  );
}
