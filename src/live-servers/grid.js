const { v4: uuidv4 } = require("uuid");

const createGrid = ({ length, width }) => {
  let board = [];
  for (let x = 1; x < length + 1; x++) {
    for (let y = 1; y < width + 1; y++) {
      board.push({ x, y, isEmpty: true, content: "", uid: uuidv4() });
    }
  }
  return board;
};

const randomGridPosition = ({ length, width, height }) => {
  return {
    x: Math.floor(Math.random() * width) + 1,
    y: Math.floor(Math.random() * length) + 1,
    z: Math.floor(Math.random() * height || 0) + 1,
  };
};
const outsideGrid = (position, gridSize) => {
  return (
    position.x < 1 ||
    position.x > gridSize.x ||
    position.y < 1 ||
    position.y > gridSize.y
  );
};

const grid = {
  tictactoe: (init) => createGrid(init),
  snakeGame: (init) => createGrid(init),
};

module.exports = { grid, randomGridPosition, outsideGrid };
