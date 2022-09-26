const { randomGridPosition, outsideGrid, updateGrid } = require("../grid");

const snakegame = (s, game, inputDirection, _) => {
  let { grid, snakeBody, options, food } = game;

  if (game.gameOver) return;
  checkSegments(snakeBody, options, inputDirection);
  checkFood(snakeBody, options, food, game);
  checkDeath(game, snakeBody, options);
  updateBoard(grid, snakeBody, food);
};
const updateBoard = (grid, snakeBody, food) => {
  for (let i = 0; i < grid.length; i++) {
    const snakeMatch = snakeBody.some((s) => checkCellsMatch(grid[i], s));
    const foodMatch = food.some((f) => checkCellsMatch(grid[i], f));
    // if the grid cell match snakebody cell
    if (snakeMatch) {
      const idx = snakeBody.findIndex((s) => checkCellsMatch(grid[i], s));
      updateGrid(grid, snakeBody[idx], "snake");
    }
    // if food cell match grid cell
    if (foodMatch) {
      const idx = food.findIndex((f) => checkCellsMatch(grid[i], f));
      updateGrid(grid, food[idx], "food");
    }
    // erase everything else on grid
    if (!snakeMatch && !foodMatch) {
      updateGrid(grid, grid[i], "");
    }
  }
};
const checkCellsMatch = (cell1, cell2) => {
  return cell1.x === cell2.x && cell1.y === cell2.y;
};
const checkSegments = (snakeBody, options, inputDirection) => {
  // add segment
  if (options.newSegment) {
    for (i = 0; i < options.newSegment; i++) {
      snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
    }
    options.newSegment = 0;
  }
  // move body
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }
  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;
  options.lastInputDirection = inputDirection;
};
const checkFood = (snakeBody, options, food, game) => {
  for (let i = 0; i < food.length; i++) {
    const isOnSnake = checkCellsMatch(snakeBody[0], food[i]);
    if (isOnSnake) {
      options.newSegment += options.expansionRate;
      food[i] = getRandomFoodPosition(snakeBody, options.size);
    }
  }
};
const checkDeath = (game, snakeBody, options) => {
  if (outsideGrid(snakeBody[0], options.size) || isCrash(snakeBody)) {
    game.gameOver = true;
    game.gameResult = "defeat";
  }
};
const getRandomFoodPosition = (snakeBody, size) => {
  let newFoodPosition = null;
  while (newFoodPosition === null || onSnake(snakeBody, newFoodPosition)) {
    newFoodPosition = randomGridPosition(size);
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
module.exports = { snakegame, getRandomFoodPosition };
