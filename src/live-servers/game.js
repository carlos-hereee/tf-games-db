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
    round: 1,
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
const resetGame = (game) => {
  let newBoard = grid[game.gameName](game.options.size);
  const { player1, player2 } = game;
  // which swap players position so x is o and o is x
  game.player1 = player2;
  game.player2 = player1;
  // reset board
  game.board = newBoard.board;
  game.turnCount = 0;
  game.round += 1;
  game.turn = "player1";
  game.player1.rematch = false;
  game.player2.rematch = false;
  game.gameOver = false;
  game.gameResult = "";

  return { reset: game };
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
  removeGame,
  startGame,
  getGameIndex,
};
