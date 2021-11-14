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
`;

const Column = styled.span`
  & {
    height: 20px;
    width: 20px;
    background-color: transparent;
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
  const [snakeRow, snakeCol] = snake;
  return cellRow === snakeRow && cellCol === snakeCol;
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
