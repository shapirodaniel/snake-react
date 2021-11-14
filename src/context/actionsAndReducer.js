const CHANGE_DIRECTION = "CHANGE_DIRECTION";
const MOVE = "MOVE";
const EAT_APPLE = "EAT_APPLE";
const EAT_SELF = "EAT_SELF";
const OUT_OF_BOUNDS = "OUT_OF_BOUNDS";

const PREGAME = "PREGAME";
const PLAYING = "PLAYING";
const WON = "WON";
const LOST = "LOST";

const START_GAME = "START_GAME";
const PAUSE_GAME = "PAUSE_GAME";
const RESUME_GAME = "RESUME_GAME";
const RESET_GAME = "RESET_GAME";

const directions = {
  37: [0, -1], // left
  38: [-1, 0], // up
  39: [0, 1], // right
  40: [1, 0], // down
};

const initApple = [12, 16];
const initSnake = [
  [9, 5],
  [9, 6],
  [9, 7],
];

function getNewBoard() {
  return new Array(20).fill(null).map((_, rowIdx) =>
    new Array(20).fill(0).map((_, colIdx) => {
      const [appleRow, appleCol] = initApple;
      const isApple = appleRow === rowIdx && appleCol === colIdx;
      const isSnake = initSnake.some(
        ([snakeRow, snakeCol]) => snakeRow === rowIdx && snakeCol === colIdx
      );

      switch (true) {
        case isSnake:
          return 1;
        case isApple:
          return 2;
        default:
          return 0;
      }
    })
  );
}

export const initState = {
  board: getNewBoard(),
  directionCode: 39,
  apple: initApple,
  snake: initSnake,
  status: PREGAME,
  gameInterval: null,
  speed: 500,
};

export function gameReducer(state, { type, payload }) {
  switch (type) {
    case CHANGE_DIRECTION:
      // prevent changing direction along same axis, ie left if currently moving right, down if currently moving up
      if (Math.abs(state.directionCode - payload) === 2) return state;
      return { ...state, directionCode: payload };

    case MOVE: {
      const [headRow, headCol] = state.snake[state.snake.length - 1];
      const [rowMod, colMod] = directions[state.directionCode];
      const newHead = [headRow + rowMod, headCol + colMod];

      return { ...state, snake: [...state.snake.slice(1), newHead] };
    }

    case EAT_APPLE: {
      const head = state.snake[state.snake.length - 1];
      const [rowMod, colMod] = directions[state.directionCode];
      const apple = [head[0] + rowMod, head[1] + colMod];

      return { ...state, snake: [...state.snake, apple] };
    }

    case EAT_SELF || OUT_OF_BOUNDS:
      return { ...state, status: LOST };

    case RESET_GAME:
      return initState;

    default:
      return state;
  }
}
