const { v4: uuidv4 } = require("uuid");
const boards = {
  tictactoe: [
    {
      uid: uuidv4(),
      positionX: 1,
      positionY: 1,
      isEmpty: true,
      content: "",
    },
    {
      uid: uuidv4(),
      positionX: 1,
      positionY: 2,
      isEmpty: true,
      content: "",
    },
    {
      uid: uuidv4(),
      positionX: 1,
      positionY: 3,
      isEmpty: true,
      content: "",
    },
    {
      positionX: 2,
      uid: uuidv4(),
      positionY: 1,
      isEmpty: true,
      content: "",
    },
    {
      uid: uuidv4(),
      positionX: 2,
      positionY: 2,
      isEmpty: true,
      content: "",
    },
    {
      uid: uuidv4(),
      positionX: 2,
      positionY: 3,
      isEmpty: true,
      content: "",
    },
    {
      positionX: 3,
      positionY: 1,
      uid: uuidv4(),
      isEmpty: true,
      content: "",
    },
    {
      uid: uuidv4(),
      positionX: 3,
      positionY: 2,
      isEmpty: true,
      content: "",
    },
    {
      uid: uuidv4(),
      positionX: 3,
      positionY: 3,
      isEmpty: true,
      content: "",
    },
  ],
};

module.exports = { boards };
