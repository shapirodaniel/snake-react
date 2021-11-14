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

function App() {
  const { state } = useContext(GameContext);

  return (
    <main
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container>
        <GameBoard />
      </Container>
    </main>
  );
}

export default App;
