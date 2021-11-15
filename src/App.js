import React, { useContext, useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { getNextCell } from "./context/actionsAndReducer";
import { GameContext } from "./context/gameContext";
import SelectSpeed from "./SelectSpeed";

const Main = styled.main`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Board = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 400px;
  border: 1px solid black;
`;

const Row = styled.div`
  display: inline-flex;
  width: 100%;
  height: auto;
`;

const Column = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${({ isSnake, isApple }) =>
    isSnake ? "green" : isApple ? "red" : ""};
`;

const Controls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-around;
`;

const StartGameBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1em;
`;

const ResetGameBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1em;
`;

function App() {
  const gameInterval = useRef(null);
  const { state, dispatch, actions } = useContext(GameContext);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (
        !(
          e.keyCode === 37 ||
          e.keyCode === 38 ||
          e.keyCode === 39 ||
          e.keyCode === 40
        )
      ) {
        return;
      }

      dispatch({ type: actions.CHANGE_DIRECTION, payload: e.keyCode });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    clearTimeout(gameInterval.current);

    gameInterval.current = setTimeout(() => {
      let type;
      const nextCell = getNextCell(state);

      switch (nextCell) {
        case -1:
          type = actions.OUT_OF_BOUNDS;
          break;
        case 1:
          type = actions.EAT_SELF;
          break;
        case 2:
          type = actions.EAT_APPLE;
          break;
        default:
          type = actions.MOVE;
      }

      dispatch({ type });
    }, state.speed);
  });

  // immediately disable gameInterval to allow start press to handle it
  useEffect(() => {
    if (state.status === actions.PREGAME) {
      clearTimeout(gameInterval.current);
    }

    if (state.status === actions.LOST) {
      clearTimeout(gameInterval.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const [disabled, setDisabled] = useState({
    startGameBtn: false,
    resetGameBtn: true,
  });

  function toggleDisabled() {
    setDisabled({
      startGameBtn: !disabled.startGameBtn,
      resetGameBtn: !disabled.resetGameBtn,
    });
  }

  return (
    <Main>
      {state.status === actions.LOST && <div>You lose :(</div>}
      <Board>
        {state.board.map((row, rowIdx) => (
          <Row key={rowIdx}>
            {row.map((_, colIdx) => {
              /*           
                game square codes:
                0: empty
                1: snake
                2: apple
              */
              const isSnake = state.board[rowIdx][colIdx] === 1;
              const isApple = state.board[rowIdx][colIdx] === 2;

              return (
                <Column key={colIdx} isSnake={isSnake} isApple={isApple} />
              );
            })}
          </Row>
        ))}
      </Board>
      <Controls>
        <StartGameBtn
          disabled={disabled.startGameBtn}
          onClick={() => {
            dispatch({ type: actions.START_GAME });
            toggleDisabled();
          }}
        >
          Start Game
        </StartGameBtn>
        <ResetGameBtn
          disabled={disabled.resetGameBtn}
          onClick={(e) => {
            clearTimeout(gameInterval.current);
            dispatch({ type: actions.RESET_GAME });
            toggleDisabled();
          }}
        >
          Reset Game
        </ResetGameBtn>
        {state.status === actions.PREGAME && <SelectSpeed />}
      </Controls>
    </Main>
  );
}

export default App;
