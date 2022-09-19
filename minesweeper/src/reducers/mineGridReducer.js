const range = [...Array(100).keys()];

const indexToCoords = (index, rows, cols) => {
  const i = Math.floor(index / rows);
  const j = index % cols;

  return [i, j];
};

const coordsToIndex = (coords, rows) => {
  const row_contribution = coords[0] * 10;
  const col_contribution = coords[1];

  return row_contribution + col_contribution;
};

export const getNeighborIndices = (index, rows, cols) => {
  const [x, y] = indexToCoords(index, rows, cols);

  const neighbors = [];

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const rx = x + i;
      const ry = y + j;

      if (rx === x && ry == y) {
        continue;
      }

      if (rx >= 0 && ry >= 0 && rx < cols && ry < rows) {
        neighbors.push(coordsToIndex([rx, ry], rows));
      }
    }
  }
  return neighbors;
};

function getNewBoard(totalBombs) {
  let state = range.map((index) => ({
    index,
    neighbors: getNeighborIndices(index, 10, 10),
    hasBomb: false,
    neighborBombCount: 0,
    isOpened: false,
    isFlagged: false,
    open(callback = () => {}) {
      this.isOpened = true;
      callback();
    },
    flag(callback = () => {}) {
      this.isFlagged = !this.isFlagged;
      callback(this.isFlagged);
    },
  }));

  // Randomize placement of totalBombs number of bombs on board
  let bombList = new Set();
  while (bombList.size < 10) {
    bombList.add(Math.floor(Math.random() * 100));
  }
  bombList.forEach((index) => {
    state[index] = { ...state[index], hasBomb: true };
  });

  // Count the neighboring bombs for each slot
  for (const item of state) {
    let count = 0;
    for (const neighbor of item.neighbors) {
      if (state[neighbor].hasBomb) {
        count += 1;
      }
    }
    item.neighborBombCount = count;
  }
  return state;
}

function handleReveal(state, cell, recursionList = new Set()) {
  const { index, neighbors, neighborBombCount, isFlagged } = cell;
  const { items } = state;
  if (isFlagged) {
    return;
  }
  let newCell = items[index];

  newCell.open();

  if (neighborBombCount !== 0 || recursionList.has(index)) {
    return;
  }

  recursionList.add(index); // Evil SET recursion

  neighbors.forEach((neighbor) => {
    handleReveal(state, items[neighbor], recursionList);
  });
}

export const initialState = {
  items: getNewBoard(10),
  openedCells: 0,
  flags: 0,
  active: true,
};

export function mineGridReducer(state, action) {
  let newState = { ...state, items: [...state.items] };
  switch (action.type) {
    case "RESET":
      return {
        items: getNewBoard(10),
        openedCells: 0,
        flags: 0,
        active: true,
      };

    case "REVEAL":
      const { hasBomb, isOpened, isFlagged } = action.item;
      if (isOpened || isFlagged) {
        return newState;
      }

      handleReveal(newState, action.item);

      if (newState.flags === 10 && newState.openedCells === 90) {
        newState.active = false;
      }
      if (hasBomb) {
        for (const cell of newState.items) {
          cell.open();
          newState.active = false;
        }
        return newState;
      }

      let count = 0;
      for (const cell of newState.items) {
        if (cell.isOpened) {
          count += 1;
        }
      }
      newState.openedCells = count;
      return newState;

    case "FLAG":
      if (action.item.isOpened) {
        return newState;
      }
      let cell = newState.items[action.item.index];

      cell.flag((increment) => {
        newState.flags += increment ? 1 : -1;
      });

      if (newState.flags === 10 && newState.openedCells === 90) {
        newState.active = false;
      }
      return newState;
  }
}
