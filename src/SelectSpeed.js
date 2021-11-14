import React, { useContext } from "react";
import { GameContext } from "./context/gameContext";
import { actions } from "./context/actionsAndReducer";
import styled from "styled-components";

const selectOptions = [
  { name: "Easy", speed: 200 },
  { name: "Medium", speed: 100 },
  { name: "Hard", speed: 50 },
];

function getSpeed(name) {
  return selectOptions.find((obj) => obj.name === name).speed;
}

const Select = styled.select``;

export default function SelectSpeed() {
  const { dispatch } = useContext(GameContext);

  return (
    <Select
      onChange={(e) =>
        dispatch({
          type: actions.CHANGE_SPEED,
          payload: getSpeed(e.target.value),
        })
      }
      defaultValue={"Easy"}
    >
      {selectOptions.map(({ name }, idx) => (
        <option key={idx}>{name}</option>
      ))}
    </Select>
  );
}
