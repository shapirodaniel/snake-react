import React, { useContext } from "react";
import { GameContext } from "./context/GameContext";
import { GameBoard } from "./components/GameBoard";
import styled from "styled-components";

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 400px;
`;

const StartGameBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1em;
`;

function App() {
  const { startGame } = useContext(GameContext);

  return (
    <main
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container>
        <GameBoard />
      </Container>
      <StartGameBtn
        onClick={() => {
          console.log("clicked");
          startGame();
        }}
      >
        Start Game
      </StartGameBtn>
    </main>
  );
}

export default App;
