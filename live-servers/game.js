const { checkVictory } = require("./combination");
const boards = require("./boards");
const games = [];

const createGameInstance = (board, players) => {
  const game = {
    ...board,
    players,
    turn: "player1",
    turnCount: 0,
  };
  games.push(game);
  return { game };
};
const findGame = (id) => {
  // find player within the list of games
  const res = games.filter(({ players }) => {
    return players.player1.uid === id || players.player2.uid === id;
  })[0];
  if (res) {
    return { result: res };
  }
  return { result: false };
};
const getGameIndex = (lobbyId) => {
  return games.findIndex((game) => game.lobbyId === lobbyId);
};
const updateGameboard = ({ lobbyId }, cell, player) => {
  const idx = getGameIndex(lobbyId);
  const cellIdx = games[idx].board.findIndex((c) => c.uid === cell.uid);
  // update board
  games[idx].board[cellIdx] = {
    ...games[idx].board[cellIdx],
    isEmpty: false,
    content: player.uid,
  };
  // swap turns
  swapTurns(lobbyId);
  const { board, turnCount } = games[idx];
  // return backupdated board and scoreboard tally
  return {
    updatedGame: games[idx],
    result: checkVictory(board, player, turnCount),
  };
};
const swapTurns = (lobbyId) => {
  const idx = getGameIndex(lobbyId);
  // swap turns
  games[idx].turn === "player1"
    ? (games[idx].turn = "player2")
    : (games[idx].turn = "player1");
  // update the turn count
  games[idx].turnCount += 1;
  return games[idx];
};

const resetGame = ({ lobbyId }) => {
  const idx = getGameIndex(lobbyId);
  let newBoard = boards[games[idx].gameName].map((i) => {
    if (!i.isEmpty || i.content) {
      return { ...i, isEmpty: true, content: "" };
    }
    return i;
  });
  const { player1, player2 } = games[idx].players;
  // which swap players position so x is o and o is x
  games[idx].players.player1 = player2;
  games[idx].players.player2 = player1;
  // reset board
  games[idx].board = newBoard;
  games[idx].turnCount = 0;
  games[idx].round += 1;
  games[idx].turn = "player1";
  games[idx].players.player1.rematch = false;
  games[idx].players.player2.rematch = false;

  return { reset: games[idx] };
};
const requestRematch = (game, isPlayer1) => {
  const idx = getGameIndex(game.lobbyId);
  isPlayer1
    ? (games[idx].players.player1.rematch = !games[idx].players.player1.rematch)
    : (games[idx].players.player2.rematch =
        !games[idx].players.player2.rematch);

  return { players: games[idx].players };
};
const removePlayer = (player, game) => {
  const isPlayer1 = player.uid === game.players.player1.uid;
  const idx = getGameIndex(game.lobbyId);
  if (isPlayer1) {
    console.log("games[idx]", games[idx].players);
    games[idx].players.player1 = {};
  } else {
    games[idx].players.player2 = {};
  }
};

module.exports = {
  createGameInstance,
  findGame,
  updateGameboard,
  checkVictory,
  swapTurns,
  resetGame,
  requestRematch,
  removePlayer,
};
