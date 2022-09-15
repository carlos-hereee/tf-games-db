const { randomGridPosition, outsideGrid, updateGrid } = require("../grid");

const snakegame = (s, game, motion, _) => {
  let { board, snakeBody, options, food, gameOver } = game;
  // update snakebody
  for (i = 0; i < options.newSegment; i++) {
    snakeBody.push([{ ...snakeBody[snakeBody.length - 1] }]);
  }
  options.newSegment = 0;
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
    console.log("snake buring the math", snakeBody);
  }
  snakeBody[0].x += motion.x;
  snakeBody[0].y += motion.y;
  options.lastInputDirection.push(motion);
  if (options.lastInputDirection.length > 5) {
    options.lastInputDirection.pop(0);
  }
  // update food
  for (let i = 0; i < food.length; i++) {
    const f = food[i];
    if (onSnake(snakeBody, f)) {
      food.pop(i);
      options.newSegment += options.expansionRate;
      food.push(getRandomFoodPostion(board, snakeBody, options.size));
    }
  }
  // check death
  if (outsideGrid(snakeBody[0], options.gridSize) || isCrash(snakeBody)) {
    gameOver = true;
    game.gameResults = "Defeat";
  }
  // update board

  for (let i = 0; i < snakeBody.length; i++) {
    board = updateGrid(board, snakeBody[i], "snake");

    // if (board[i].content === "snake") {
    //   // if not included in snake body
    //   if (!snakeBody.some((s) => s.uid === board[i].uid)) {
    //     console.log("board[i]", board[i]);
    //     board = updateGrid(board, board[i], "");
    //   }
    // }
    // if (snakeBody.some((s) => s.uid === board[i].uid)) {
    //   console.log("board[i]", board[i]);
    // }
  }
  return { g: game };
};

const getRandomFoodPostion = (grid, snakeBody, size) => {
  let newFoodPostion;
  while (newFoodPostion === null || onSnake(snakeBody, newFoodPostion)) {
    newFoodPostion = randomGridPosition(grid, size);
  }
};
const onSnake = (snakeBody, position, { ignoreHead = false } = {}) => {
  return snakeBody.some((s, idx) => {
    if (ignoreHead && idx === 0) return false;
    return s.x === position?.x && s.y === position?.y;
  });
};
const isCrash = (snakeBody) => {
  return onSnake(snakeBody, snakeBody[0], { ignoreHead: true });
};
module.exports = { snakegame, getRandomFoodPostion };
