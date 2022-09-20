const { checkVictory } = require("../combination");
const { swapTurns } = require("../game");

const tictactoe = (s, game, motion, player) => {
  const cellIdx = game.board.findIndex((c) => c.uid === motion.uid);
  // update board
  game.board[cellIdx] = {
    ...game.board[cellIdx],
    hasContent: true,
    content: player.uid,
  };
  // return back updated board and scoreboard tally
  const { result } = checkVictory(game.board, player, game.turnCount);
  if (result === "draw" || result === "victory") {
    game.gameOver = true;
    game.gameResult = result;
  } else {
    // swap turns
    swapTurns(game);
  }
  return { g: game };
};

module.exports = { tictactoe };
