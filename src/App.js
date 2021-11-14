import React, { useContext } from "react";
import styled from "styled-components";
import { GameContext } from "./context/gameContext";

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
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 400px;
`;

const Row = styled.div`
  width: 400px;
  height: auto;
`;

const Column = styled.div`
  display: inline-flex;
  width: 20px;
  height: 20px;
  border: 1px solid lightgrey;
  background-color: ${({ isSnake, isApple }) =>
    isSnake ? "green" : isApple ? "red" : ""};
`;

const StartGameBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1em;
`;

function App() {
  const { state } = useContext(GameContext);

  /* 
  
    game square codes
    
    0: empty
    1: snake
    2: apple
  
  */

  return (
    <Main>
      <Board>
        {state.board.map((row, rowIdx) => (
          <Row key={rowIdx}>
            {row.map((col, colIdx) => {
              const isSnake = state.board[rowIdx][colIdx] === 1;
              const isApple = state.board[rowIdx][colIdx] === 2;

              return (
                <Column key={colIdx} isSnake={isSnake} isApple={isApple} />
              );
            })}
          </Row>
        ))}
      </Board>
      <StartGameBtn>Start Game</StartGameBtn>
    </Main>
  );
}

export default App;
