const wincon = require("./wincondition");
const checkScoreBoard = (baord, gameName, turn) => {
  const scoreBoard = wincon[gameName];
  baord.forEach((cell) => {
    if (!cell.isEmpty && cell.content === turn) {
      if (cell.positionX === 1) scoreBoard.x1 += 1;
      if (cell.positionX === 2) scoreBoard.x2 += 1;
      if (cell.positionX === 3) scoreBoard.x3 += 1;
      if (cell.positionY === 1) scoreBoard.y1 += 1;
      if (cell.positionY === 2) scoreBoard.y2 += 1;
      if (cell.positionY === 3) scoreBoard.y3 += 1;
      // top to bottom diagnol corners
      if (
        (cell.positionX === 1 && cell.positionY === 1) ||
        (cell.positionX === 2 && cell.positionY === 2) ||
        (cell.positionX === 3 && cell.positionY === 3)
      ) {
        scoreBoard.d_top_to_bottom += 1;
      }
      // bottom to top diagnol corners
      if (
        (cell.positionX === 1 && cell.positionY === 3) ||
        (cell.positionX === 2 && cell.positionY === 2) ||
        (cell.positionX === 3 && cell.positionY === 1)
      ) {
        scoreBoard.d_bottom_to_top += 1;
      }
    }
  });
  return { scoreBoard };
};
module.exports = { checkScoreBoard };
