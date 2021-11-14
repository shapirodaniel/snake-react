import React, { useReducer } from "react";
import { gameReducer, initState } from "./actionsAndReducer";

export const GameContext = React.createContext();

export default function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initState);

  const providerValue = {
    state,
    dispatch,
  };

  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  );
}
