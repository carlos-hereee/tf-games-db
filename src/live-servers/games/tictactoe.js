const tictactoe = (s, game, motion, player) => {
  const idx = getGameIndex(game.lobbyId);
  const cellIdx = games[idx].board.findIndex((c) => c.uid === motion.uid);
  // update board
  games[idx].board[cellIdx] = {
    ...games[idx].board[cellIdx],
    hasContent: false,
    content: player.uid,
  };
  // swap turns
  swapTurns(game.lobby);
  const { board, turnCount } = games[idx];
  // return backupdated board and scoreboard tally
  checkVictory(s, board, player, turnCount);
  return {
    updatedGame: games[idx],
  };
};

module.exports = { tictactoe };
