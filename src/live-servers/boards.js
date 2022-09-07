const { v4: uuidv4 } = require("uuid");

const createBoard = (length, width) => {
  let board = [];
  for (let x = 1; x < length + 1; x++) {
    for (let y = 1; y < width + 1; y++) {
      board.push({
        x,
        y,
        isEmpty: true,
        content: "",
        uid: uuidv4(),
      });
    }
  }
  return board;
};

const boards = {
  tictactoe: createBoard(3, 3),
  snakeGame: createBoard(5, 5),
};

module.exports = { boards };
