import React from "react";
import styled from "styled-components";

const Table = styled.table`
  & {
    table-layout: fixed;
    width: 100;
    border-collapse: collapse;
  }
  & tr,
  & thead,
  & tbody {
    width: 100%;
  }
  & th,
  & td {
    padding: 0.2em;
    text-align: left;
    min-width: 120px;
    border: 1px solid lightgrey;
  }
`;

export default function Leaderboard({ leaderboard }) {
  return (
    <>
      <div style={{ padding: "1em" }}>Leaderboard</div>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map(({ id, username, score, createdAt }) => (
            <tr key={id}>
              <td>{username}</td>
              <td>{score}</td>
              <td>{new Date(createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
