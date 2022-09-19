const { checkVictory } = require("./combination");
const { grid } = require("./grid");
const { emitGameStartData } = require("./socketEmit");
const { startGameTimer } = require("../Socket/timer");
const games = [];

const findGame = (id) => {
  // find player within the list of games
  const res = games.filter(({ player1, player2 }) => {
    return player1?.uid === id || player2.uid === id;
  })[0];
  if (res) {
    return { game: res };
  }
  return { game: false };
};
const getGameIndex = (lobbyId) => {
  return games.findIndex((game) => game.lobbyId === lobbyId);
};
const startGame = (socket, ticket, player) => {
  // create initial game grid
  const b = grid[ticket.gameName](ticket.options.size);
  const initialGame = {
    ...ticket,
    ...b,
    player1: ticket.createdBy,
    player2: ticket.singlePlayer ? {} : player,
    turn: "player1",
    turnCount: 0,
    gameOver: false,
  };
  games.push(initialGame);
  emitGameStartData(socket, initialGame);
  // create a game timer
  startGameTimer(socket, initialGame);
};
const swapTurns = (game) => {
  // swap turns
  game.turn === "player1" ? (game.turn = "player2") : (game.turn = "player1");
  // update the turn count
  game.turnCount += 1;
  return game;
};
const resetGame = ({ lobbyId }) => {
  const idx = getGameIndex(lobbyId);
  let newBoard = grid[games[idx].gameName].map((i) => {
    if (!i.hasContent || i.content) {
      return { ...i, hasContent: true, content: "" };
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
const removeGame = (game) => {
  const idx = getGameIndex(game.lobbyId);
  if (games[idx]) {
    games.pop(games[idx]);
  }
};

module.exports = {
  findGame,
  checkVictory,
  swapTurns,
  resetGame,
  requestRematch,
  removeGame,
  startGame,
  getGameIndex,
};
