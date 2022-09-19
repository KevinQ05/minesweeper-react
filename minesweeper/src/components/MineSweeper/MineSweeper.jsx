import React, { useReducer } from "react";
import styled from "styled-components";
import Cell from "./Cell";
import { mineGridReducer, initialState } from "../../reducers/mineGridReducer";

const Container = styled.div`
  background-color: #525252;
  border-radius: 0.5rem;
  padding: 0.5rem;

  display: flex;
  flex-direction: column;
`;

const Grid = styled.section`
  background-color: #525252;
  width: 350px;
  height: 350px;

  display: grid;
  grid-template-columns: repeat(10, 35px);
`;

const Button = styled.button`
  margin-top: 1rem;
`;

const Header = styled.div`
  display: flex;
  height: 2rem;

  padding: 0.25rem 0.25rem;
  justify-content: space-between;
`;

const GameMessage = styled(Header)`
  justify-content: center;
`;

export default function MineSweeper() {
  const [state, dispatch] = useReducer(mineGridReducer, initialState);

  const mineField = state.items.map((item, index) => (
    <Cell
      key={index}
      {...{ item }}
      onClick={(e) =>
        dispatch({ type: `${e.ctrlKey ? "FLAG" : "REVEAL"}`, item })
      }
    />
  ));

  return (
    <Container>
      <Header>
        <span>Banderas: {`${state.flags}`}</span>
        <span>Casillas Restantes: {`${90 - state.openedCells}`}</span>
      </Header>
      <Grid>{mineField}</Grid>
      <Button onClick={() => dispatch({ type: "RESET" })}>Reset</Button>
      {!state.active ? (
        <GameMessage>
          {state.openedCells !== 90 ? "CACARRETEADO" : "Juego Terminado"}
        </GameMessage>
      ) : null}
    </Container>
  );
}
