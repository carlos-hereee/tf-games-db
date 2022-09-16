const {
  randomGridPosition,
  outsideGrid,
  updateGrid,
  findCellIdx,
} = require("../grid");

const snakegame = (s, game, motion, _) => {
  let { board, snakeBody, options, food } = game;

  if (game.gameOver) return { g: game };
  const currentTime = Date.now();
  const sinceLastTime = (currentTime - game.lastTimeRender) / 1000;
  if (sinceLastTime < 1 / options.snakeSpeed) return { g: game };
  game.lastTimeRender = currentTime;

  for (i = 0; i < options.newSegment; i++) {
    snakeBody.push([{ ...snakeBody[snakeBody.length - 1] }]);
  }
  options.newSegment = 0;
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }
  const head = { x: snakeBody[0].x + motion.x, y: snakeBody[0].y + motion.y };
  const headIdx = findCellIdx(board, head);
  snakeBody[0] = board[headIdx];

  options.lastInputDirection.push(motion);
  if (options.lastInputDirection.length > 5) {
    options.lastInputDirection.pop(0);
  }
  // check death
  if (outsideGrid(snakeBody[0], options.size) || isCrash(snakeBody)) {
    game.gameOver = true;
    game.gameResults = "Defeat!";
    return { g: game };
  }
  // update food
  for (let i = 0; i < food.length; i++) {
    if (onSnake(snakeBody, food[i])) {
      food.pop(i);
      options.newSegment += options.expansionRate;
      const coords = getRandomFoodPostion(board, snakeBody, options.size);
      food.push(coords);
      board = updateGrid(board, coords, "food");
    }
  }

  // // update board
  for (let i = 0; i < board.length; i++) {
    // draw snake body on board
    if (snakeBody.some((s) => s.uid === board[i].uid)) {
      const idx = snakeBody.findIndex((s) => s.uid === board[i].uid);
      board = updateGrid(board, snakeBody[idx], "snake");
      // draw food on board
    } else if (food.some((f) => f.uid === board[i].uid)) {
      const idx = food.findIndex((s) => s.uid === board[i].uid);
      board = updateGrid(board, food[idx], "food");
      // erase everything else on board
    } else if (board[i].content) {
      updateGrid(board, board[i], "");
    }
  }

  return { g: game };
};

const getRandomFoodPostion = (grid, snakeBody, size) => {
  let newFoodPosition;
  while (!newFoodPosition || onSnake(snakeBody, newFoodPosition)) {
    newFoodPosition = randomGridPosition(grid, size);
  }
  return newFoodPosition;
};
const onSnake = (snakeBody, position, { ignoreHead = false } = {}) => {
  if (!snakeBody.length) return false;
  return snakeBody.some((s, idx) => {
    if (ignoreHead && idx === 0) return false;
    return s?.x === position?.x && s?.y === position?.y;
  });
};
const isCrash = (snakeBody) => {
  return onSnake(snakeBody, snakeBody[0], { ignoreHead: true });
};
module.exports = { snakegame, getRandomFoodPostion };
