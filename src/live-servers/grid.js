const { v4: uuidv4 } = require("uuid");

const createGrid = ({ length, width }) => {
  let grid = [];
  for (let x = 1; x < length + 1; x++) {
    for (let y = 1; y < width + 1; y++) {
      grid.push({ x, y, hasContent: false, content: "", uid: uuidv4() });
    }
  }
  return grid;
};
const randomGridPosition = (size) => {
  return {
    x: Math.floor(Math.random() * size.width) + 1,
    y: Math.floor(Math.random() * size.length) + 1,
  };
};
const outsideGrid = (position, gridSize) => {
  if (!position) return true;
  return (
    position.x < 1 ||
    position.x > gridSize.length ||
    position.y < 1 ||
    position.y > gridSize.width
  );
};
const findCellIdx = (grid, cell) => {
  return grid.findIndex((g) => g.x === cell.x && g.y === cell.y);
};
const updateGrid = (grid, cell, content) => {
  const idx = findCellIdx(grid, cell);
  if (idx !== -1) {
    grid[idx].content = content;
    grid[idx].hasContent = content ? true : false;
  }
};

const grid = {
  tictactoe: (init) => {
    const grid = createGrid(init);
    return { grid: grid };
  },
  snakeGame: (init) => {
    // initialize
    let grid = createGrid(init);
    const snakeBody = [randomGridPosition(init)];
    const food = [randomGridPosition(init)];
    updateGrid(grid, food[0], "food");
    updateGrid(grid, snakeBody[0], "snake");
    return { grid: grid, snakeBody, food };
  },
};

module.exports = {
  grid,
  randomGridPosition,
  outsideGrid,
  updateGrid,
  findCellIdx,
};
