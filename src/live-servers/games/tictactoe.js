const { checkVictory } = require("../combination");
const { swapTurns } = require("../game");

const tictactoe = (s, game, inputDirection, player) => {
  const cellIdx = game.grid.findIndex((c) => c.uid === inputDirection.uid);
  // update grid
  game.grid[cellIdx] = {
    ...game.grid[cellIdx],
    hasContent: true,
    content: player.uid,
  };
  // return back updated grid and scoreboard tally
  const { result } = checkVictory(game.grid, player, game.turnCount);
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
