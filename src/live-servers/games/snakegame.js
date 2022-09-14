const snakegame = (s, game, motion, player) => {
  // find which
  const { board } = game;

  for (let i = 0; i < board.length; i++) {
    if (board[i].content) {
    }
  }

  // update snake on board'

  // const updatedBoard = board.map((b) => {
  //   if (b.content) {
  //     b.x += motion.x;
  //     b.y += motion.y;
  //   }

  //   return b;
  // });
  console.log("updatedBaord", updatedBoard);
  // for (let i = 0; i < board.newSegments; i++) {
  //   board.snakeBody.push({ ...board.snakeBody[board.snakeBody.length - 1] });
  // }
  // for (let i = board.snakeBody.length - 2; i >= 0; i--) {
  //   board.snakeBody[i + 1] = { ...board.snakeBody[i] };
  // }
  // board.snakeBody[0].x += motion.x;
  // board.snakeBody[0].y += motion.y;
  // expand snake
  // if (onSnake(food)) {
  //   expandSnake(game.EXPANSION_RATE);
  // }
  // games[idx].board = {
  //   isEmpty: false,
  //   content: "snake-body",
  // };

  // return backupdated board and scoreboard tally
  // checkVictory(s, board, player);
  // check death
};

const getRandomFoodPostion = () => {
  let newFoodPostion;
  while (newFoodPostion === null || onSnake(newFoodPostion)) {
    newFoodPostion = randomGridPosition();
  }
};
const onSnake = (position, { ignoreHead = false } = {}) => {
  return;
};
module.exports = { snakegame, getRandomFoodPostion };
