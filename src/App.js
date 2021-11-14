import React, { useContext } from "react";
import { GameContext } from "./context/GameContext";
import { GameBoard } from "./components/GameBoard";
import styled from "styled-components";

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  const { state } = useContext(GameContext);

  return (
    <Container>
      <GameBoard />
    </Container>
  );
}

export default App;
