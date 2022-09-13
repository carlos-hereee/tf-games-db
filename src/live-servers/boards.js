const { v4: uuidv4 } = require("uuid");

const createBoard = (length, width, content) => {
  let board = [];
  for (let x = 1; x < length + 1; x++) {
    for (let y = 1; y < width + 1; y++) {
      if (x === Math.floor(length / 2) && y === Math.floor(width / 2)) {
        board.push({
          x,
          y,
          isEmpty: false,
          content: content,
          uid: uuidv4(),
        });
      } else {
        board.push({
          x,
          y,
          isEmpty: true,
          content: "",
          uid: uuidv4(),
        });
      }
    }
  }
  return board;
};

const boards = {
  tictactoe: createBoard(3, 3, ""),
  snakeGame: createBoard(6, 6, "snake-head"),
};

module.exports = { boards };
