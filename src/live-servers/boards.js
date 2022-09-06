const { v4: uuidv4 } = require("uuid");
const boards = {
  tictactoe: [
    {
      uid: uuidv4(),
      x: 1,
      y: 1,
      isEmpty: true,
      content: "",
    },
    {
      uid: uuidv4(),
      x: 1,
      y: 2,
      isEmpty: true,
      content: "",
    },
    {
      uid: uuidv4(),
      x: 1,
      y: 3,
      isEmpty: true,
      content: "",
    },
    {
      x: 2,
      uid: uuidv4(),
      y: 1,
      isEmpty: true,
      content: "",
    },
    {
      uid: uuidv4(),
      x: 2,
      y: 2,
      isEmpty: true,
      content: "",
    },
    {
      uid: uuidv4(),
      x: 2,
      y: 3,
      isEmpty: true,
      content: "",
    },
    {
      x: 3,
      y: 1,
      uid: uuidv4(),
      isEmpty: true,
      content: "",
    },
    {
      uid: uuidv4(),
      x: 3,
      y: 2,
      isEmpty: true,
      content: "",
    },
    {
      uid: uuidv4(),
      x: 3,
      y: 3,
      isEmpty: true,
      content: "",
    },
  ],
};

module.exports = { boards };
