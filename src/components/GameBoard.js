import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import styled from "styled-components";

/* 

  id system for game board

  game row: <div id="row-0" />
  game col: <span id="cell-4:4" />

*/

const Row = styled.div`
  width: 100%;
  height: 100%;
`;

const Column = styled.div`
  & {
    height: 20px;
    width: 20px;
    background-color: transparent;
    border: 1px solid lightgrey;
  }
  &.apple {
    background-color: red;
  }
  &.snake {
    background-color: green;
  }
`;

function isApple(cell, apple) {
  const [cellRow, cellCol] = cell;
  const [appleRow, appleCol] = apple;
  return cellRow === appleRow && cellCol === appleCol;
}

function isSnake(cell, snake) {
  const [cellRow, cellCol] = cell;

  let result = false;

  snake.forEach(([snakeRow, snakeCol]) => {
    if (cellRow === snakeRow && cellCol === snakeCol) {
      result = true;
    }
  });

  return result;
}

export function GameBoard() {
  const { state } = useContext(GameContext);

  return state.board.map((row, rowIdx) => (
    <Row key={rowIdx} id={`row-${rowIdx}`}>
      {row.map((_, colIdx) => {
        const apple = isApple([rowIdx, colIdx], state.apple);
        const snake = isSnake([rowIdx, colIdx], state.snake);

        const classSelector = apple ? "apple" : snake ? "snake" : "";

        return (
          <Column
            key={colIdx}
            className={classSelector}
            id={`cell-${rowIdx}:${colIdx}`}
          />
        );
      })}
    </Row>
  ));
}
