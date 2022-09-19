import React, { useState } from "react";
import styled from "styled-components";
import { FaBomb } from "react-icons/fa";
import { GiFlyingFlag } from "react-icons/gi";

const Item = styled.li`
  list-style: none;
  outline: 1px solid #121212;

  display: flex;
  align-items: center;
  justify-content: center;

  max-width: 35px;
  aspect-ratio: 1 / 1;

  background-color: ${(props) => (props.isOpened ? "inherit" : "#999999")};

  &:hover {
    cursor: ${(props) => (props.isOpened ? "auto" : "pointer")};
    filter: ${(props) => (props.isOpened ? "none" : "brightness(85%)")};
  }
`;

const numberToColor = [
  "white",
  "#5496b3",
  "#54b380",
  "#b35454",
  "#b890e8",
  "#e8c390",
];

const MineNumber = styled.div`
  font-weight: ${(props) => (props.number > 0 ? "bold" : "normal")};
  color: ${(props) => (props.number ? numberToColor[props.number] : "white")};
`;

const InnerItem = styled.div``;
export default function Cell(props) {
  const { item, onClick } = props;

  const { hasBomb, neighborBombCount, isOpened, isFlagged } = item;
  return (
    <Item {...{ isOpened, onClick }}>
      <InnerItem>
        {isOpened ? (
          hasBomb ? (
            <FaBomb size={20} />
          ) : (
            <MineNumber number={neighborBombCount}>
              {neighborBombCount}
            </MineNumber>
          )
        ) : isFlagged ? (
          <GiFlyingFlag size={20} style={{ color: "red" }} />
        ) : (
          ""
        )}
      </InnerItem>
    </Item>
  );
}
