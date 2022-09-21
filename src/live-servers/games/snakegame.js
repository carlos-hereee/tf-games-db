const {
  randomGridPosition,
  outsideGrid,
  updateGrid,
  findCellIdx,
} = require("../grid");

const snakegame = (s, game, motion, _) => {
  let { board, snakeBody, options, food } = game;

  if (game.gameOver) return;
  checkSegments(board, snakeBody, options, motion);
  checkDeath(game, snakeBody, options);
  checkFood(board, snakeBody, options, food);
  updateBoard(board, snakeBody, food);
};
const updateBoard = (board, snakeBody, food) => {
  for (let i = 0; i < board.length; i++) {
    const snakeMatch = snakeBody.some((s) => checkCellsMatch(board[i], s));
    const foodMatch = food.some((f) => checkCellsMatch(board[i], f));
    // if the board cell match snakebody cell
    if (snakeMatch) {
      const idx = snakeBody.findIndex((s) => checkCellsMatch(board[i], s));
      updateGrid(board, snakeBody[idx], "snake");
    }
    // if food cell match board cell
    if (foodMatch) {
      const idx = food.findIndex((f) => checkCellsMatch(board[i], f));
      updateGrid(board, food[idx], "food");
    }
    // erase everything else on board
    if (!snakeMatch && !foodMatch) {
      updateGrid(board, board[i], "");
    }
  }
};
const checkCellsMatch = (cell1, cell2) => {
  return cell1.x === cell2.x && cell1.y === cell2.y;
};
const checkSegments = (_, snakeBody, options, motion) => {
  // add segment
  if (options.newSegment) {
    for (i = 0; i < options.newSegment; i++) {
      snakeBody.push([{ ...snakeBody[snakeBody.length - 1] }]);
    }
    options.newSegment = 0;
  }
  // move body
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    console.log("snakeBody -length 2", i);
    snakeBody[i + 1] = { ...snakeBody[i] };
  }
  // const head = { x: snakeBody[0].x + motion.x, y: snakeBody[0].y + motion.y };
  // const idx = findCellIdx(board, head);
  // snakeBody[0] = board[idx];
  snakeBody[0].x += motion.x;
  snakeBody[0].y += motion.y;
};
const checkFood = (board, snakeBody, options, food) => {
  // update food
  for (let i = 0; i < food.length; i++) {
    if (onSnake(snakeBody, food[i])) {
      food.pop(i);
      options.newSegment += options.expansionRate;
      const coords = getRandomFoodPostion(board, snakeBody, options.size);
      food.push(coords);
    }
  }
};
const checkDeath = (game, snakeBody, options) => {
  if (outsideGrid(snakeBody[0], options.size) || isCrash(snakeBody)) {
    game.gameOver = true;
    game.gameResult = "defeat";
  }
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

const isCrash = (sb) => onSnake(sb, sb[0], { ignoreHead: true });
module.exports = { snakegame, getRandomFoodPostion };
