const { v4: uuidv4 } = require("uuid");

const createGrid = ({ length, width }) => {
  let board = [];
  for (let x = 1; x < length + 1; x++) {
    for (let y = 1; y < width + 1; y++) {
      board.push({ x, y, hasContent: false, content: "", uid: uuidv4() });
    }
  }
  return board;
};
const randomGridPosition = (grid, size) => {
  let coords = {
    x: Math.floor(Math.random() * size.width) + 1,
    y: Math.floor(Math.random() * size.length) + 1,
  };
  return grid[findGridIndexWithCoords(grid, coords)];
};
const outsideGrid = (position, gridSize) => {
  return (
    position.x < 1 ||
    position.x > gridSize.x ||
    position.y < 1 ||
    position.y > gridSize.y
  );
};
const findGridIndexWithCoords = (grid, cell) => {
  return grid.findIndex((g) => g.x === cell.x && g.y === cell.y);
};
const updateGrid = (grid, cell, content) => {
  const idx = findGridIndexWithCoords(grid, cell);
  grid[idx].content = content;
  grid[idx].hasContent = content ? true : false;
  return grid;
};

const grid = {
  tictactoe: (init) => createGrid(init),
  snakeGame: (init) => {
    // initialize
    let grid = createGrid(init);
    const snakeBody = [randomGridPosition(grid, init)];
    const food = [randomGridPosition(grid, init)];
    updateGrid(grid, food[0], "food");
    updateGrid(grid, snakeBody[0], "snake");
    return { board: grid, snakeBody, food };
  },
};

module.exports = { grid, randomGridPosition, outsideGrid, updateGrid };
