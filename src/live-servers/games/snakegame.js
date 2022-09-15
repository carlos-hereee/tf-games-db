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
      food.push(getRandomFoodPostion(snakeBody));
    }
  }
  // check death
  if (outsideGrid(snakeBody[0], options.gridSize) || isCrash(snakeBody)) {
    gameOver = true;
    game.gameResults = "Defeat";
  }
  // update board
  for (let i = 0; i < board.length; i++) {
    if (!board[i].isEmpty) {
      // if not included in snake body
      if (!snakeBody.includes({ x: board[i].x, y: board[i].y })) {
        board[i] = updateGrid(board, board[i], "");
      }
    }
  }
  return { g: game };
};

const getRandomFoodPostion = (snakeBody) => {
  let newFoodPostion;
  while (newFoodPostion === null || onSnake(snakeBody, newFoodPostion)) {
    newFoodPostion = randomGridPosition();
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
