import React, { useContext, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { getNextAction } from "./context/actionsAndReducer";
import { GameContext } from "./context/gameContext";
import SelectSpeed from "./SelectSpeed";
import Leaderboard from "./Leaderboard";

const Main = styled.main`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GameMessage = styled.div`
  margin: 1em;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
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
  width: 10px;
  height: 10px;
  background-color: ${({ isSnake, isApple }) =>
    isSnake ? "green" : isApple ? "red" : ""};
`;

const Controls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-around;
  padding: 1em 0;
`;

const StartGameBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ResetGameBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  const gameInterval = useRef(null);
  const { state, dispatch, actions } = useContext(GameContext);

  function keydownListener(e) {
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
  }

  useEffect(() => {
    document.addEventListener("keydown", keydownListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    clearTimeout(gameInterval.current);

    if (state.status !== actions.LOST && state.status !== actions.PREGAME) {
      gameInterval.current = setTimeout(() => {
        dispatch({ type: getNextAction(state) });
      }, state.speed);
    }
  });

  // immediately disable gameInterval to allow start press to handle it
  useEffect(() => {
    if (state.status === (actions.PREGAME || actions.LOST)) {
      clearTimeout(gameInterval.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function getMessage(state) {
    switch (state.status) {
      case actions.PLAYING:
        return `Current Score: ${state.score}`;
      case actions.LOST:
        return (
          <>
            <span>You Lose :(</span>
            <span>Score: {state.score}</span>
          </>
        );
      default:
        return "Snek";
    }
  }

  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const updateLeaderboard = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/leaderboard`);
        const { leaderboard } = await response.json();
        setLeaderboard(leaderboard);
      } catch (err) {
        console.error(err);
      }
    };
    updateLeaderboard();
  }, [state.status]);

  useEffect(() => {
    const postScore = async () => {
      await fetch(`http://localhost:8080/api/newscore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username || "anonymous",
          score: state.score,
        }),
      });
    };

    if (state.status === actions.LOST && state.score > 0) {
      postScore();
    }
  }, [state.status]);

  const [username, setUsername] = useState("");
  const updateUsername = (e) => setUsername(e.target.value);

  return (
    <Main>
      <GameMessage>{getMessage(state)}</GameMessage>
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
        {state.status === actions.PREGAME && (
          <>
            <StartGameBtn
              onClick={() => {
                dispatch({ type: actions.START_GAME });
              }}
            >
              Start Game
            </StartGameBtn>
            <input
              name="username"
              value={username}
              onChange={updateUsername}
              placeholder="Enter your username"
            />
          </>
        )}
        {state.status !== actions.PREGAME && (
          <ResetGameBtn
            onClick={() => {
              clearTimeout(gameInterval.current);
              dispatch({ type: actions.RESET_GAME });
            }}
          >
            Reset Game
          </ResetGameBtn>
        )}
        {state.status === actions.PREGAME && <SelectSpeed />}
      </Controls>
      <Leaderboard leaderboard={leaderboard} />
    </Main>
  );
}

export default App;
