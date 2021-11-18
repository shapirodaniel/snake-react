const CHANGE_DIRECTION = "CHANGE_DIRECTION";
const CHANGE_SPEED = "CHANGE_SPEED";
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

export const actions = {
  CHANGE_DIRECTION,
  CHANGE_SPEED,
  MOVE,
  EAT_APPLE,
  EAT_SELF,
  OUT_OF_BOUNDS,
  PREGAME,
  PLAYING,
  WON,
  LOST,
  START_GAME,
  PAUSE_GAME,
  RESUME_GAME,
  RESET_GAME,
};

export const directions = {
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

export function getNextAction(state) {
  const [snakeRow, snakeCol] = state.snake[state.snake.length - 1];
  const [rowMod, colMod] = directions[state.directionCode];

  const newRow = snakeRow + rowMod;
  const newCol = snakeCol + colMod;

  console.log({ action: state.status });

  if (
    newRow < 0 ||
    newRow >= state.board.length ||
    newCol < 0 ||
    newCol >= state.board[0].length
  ) {
    return actions.OUT_OF_BOUNDS;
  }

  // apple may be undefined between renders
  // short circuit catches typeerrors
  const apple = state.apple || [null, null];

  if (newRow === apple[0] && newCol === apple[1]) {
    return actions.EAT_APPLE;
  }

  if (
    state.snake.some(
      ([currSnakeRow, currSnakeCol]) =>
        currSnakeRow === newRow && currSnakeCol === newCol
    )
  ) {
    return actions.EAT_SELF;
  }

  return actions.MOVE;
}

function chooseApple(state) {
  let newAppleRow = Math.floor(Math.random() * state.board.length);
  let newAppleCol = Math.floor(Math.random() * state.board[0].length);

  while (
    // eslint-disable-next-line no-loop-func
    state.snake.some(([row, col]) => newAppleRow === row && newAppleCol === col)
  ) {
    newAppleRow = Math.floor(Math.random() * state.board.length);
    newAppleCol = Math.floor(Math.random() * state.board[0].length);
  }

  return [newAppleRow, newAppleCol];
}

function getNewBoard(apple = initApple, snake = initSnake) {
  return new Array(20).fill(null).map((_, rowIdx) =>
    new Array(20).fill(0).map((_, colIdx) => {
      const [appleRow, appleCol] = apple;
      const isApple = appleRow === rowIdx && appleCol === colIdx;
      const isSnake = snake.some(
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
  apple: [...initApple], // clone apple
  snake: [...initSnake], // clone snake
  status: PREGAME,
  gameInterval: null,
  speed: 200,
  score: 0,
};

export function gameReducer(state, { type, payload }) {
  switch (type) {
    case CHANGE_DIRECTION:
      // prevent changing direction along same axis, ie left if currently moving right, down if currently moving up
      if (Math.abs(state.directionCode - payload) === 2) return state;
      return { ...state, directionCode: payload };

    case CHANGE_SPEED:
      return { ...state, speed: payload };

    case MOVE: {
      const [headRow, headCol] = state.snake[state.snake.length - 1];
      const [rowMod, colMod] = directions[state.directionCode];
      const newHead = [headRow + rowMod, headCol + colMod];

      const newSnake = [...state.snake.slice(1), newHead];
      const newBoard = getNewBoard(state.apple, newSnake);

      return { ...state, board: newBoard, snake: newSnake };
    }

    case EAT_APPLE: {
      const head = state.snake[state.snake.length - 1];
      const [rowMod, colMod] = directions[state.directionCode];
      const apple = [head[0] + rowMod, head[1] + colMod];

      const newApple = chooseApple(state);
      const newSnake = [...state.snake, apple];

      return {
        ...state,
        snake: newSnake,
        board: getNewBoard(newApple, newSnake),
        apple: newApple,
        score: state.score + 1000,
      };
    }

    case OUT_OF_BOUNDS:
      return { ...state, status: LOST };

    case EAT_SELF:
      return { ...state, status: LOST };

    case RESET_GAME:
      return initState;

    case START_GAME:
      return { ...state, status: PLAYING };

    default:
      return state;
  }
}
