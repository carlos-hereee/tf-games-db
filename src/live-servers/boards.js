const { v4: uuidv4 } = require("uuid");

const createBoard = (length, width) => {
  let board = [];
  for (let x = 0; x < length; x++) {
    for (let y = 0; y < width; y++) {
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
