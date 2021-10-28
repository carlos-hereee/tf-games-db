const wincon = require("./wincondition");
const checkScoreBoard = (baord, gameName, player) => {
  /**
   *  TODO: FIXBUG - SOME COMBINATIONS THAT ARE NOT WINNNG RETURN
   *  A WINNING RESUTL
   */
  let scoreBoard = wincon[gameName];
  // update the scoreboard
  baord.forEach((cell) => {
    if (!cell.isEmpty && cell.content === player.uid) {
      // for each row
      if (cell.positionX === 1) scoreBoard.positionX1 += 1;
      if (cell.positionX === 2) scoreBoard.positionX2 += 1;
      if (cell.positionX === 3) scoreBoard.positionX3 += 1;
      if (cell.positionY === 1) scoreBoard.positionY1 += 1;
      if (cell.positionY === 2) scoreBoard.positionY2 += 1;
      if (cell.positionY === 3) scoreBoard.positionY3 += 1;
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
  if (Object.values(scoreBoard).filter((item) => item === 3)[0]) {
    console.log(scoreBoard);
    return { result: player.uid };
  }
  return { result: "continue" };
};
module.exports = { checkScoreBoard };
