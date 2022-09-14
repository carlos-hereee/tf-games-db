const { checkVictory } = require("./combination");
const { grid } = require("./grid");
const { config } = require("./gameConfig");
const { emitGameStartData } = require("./socketEmit");
const { startGameTimer } = require("../Socket/timer");
const { getRandomFoodPostion } = require("./games/snakegame");
const games = [];

const createGame = (board, players) => {
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
    return players.player1?.uid === id || players.player2.uid === id;
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
  // create empty game board
  const b = grid[ticket.gameName](ticket.options.size);
  const empty = {
    ...ticket,
    ...config[ticket.gameName],
    board: b,
  };
  // // populate player data
  let playerData = {
    player1: ticket.createdBy,
    player2: ticket.singlePlayer ? {} : player,
  };
  const { game } = createGame(empty, playerData);
  emitGameStartData(socket, game);
  // create a game timer
  startGameTimer(socket, game, 0);
};
const updateTicTacToe = (s, game, motion, player) => {
  const idx = getGameIndex(game.lobbyId);
  const cellIdx = games[idx].board.findIndex((c) => c.uid === motion.uid);
  // update board
  games[idx].board[cellIdx] = {
    ...games[idx].board[cellIdx],
    isEmpty: false,
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
const updateSnakeGame = (s, game, motion, player) => {
  const idx = getGameIndex(game.lobbyId);
  const board = games[idx];
  let food = getRandomFoodPostion();

  return { updatedGame: games[idx] };
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
  let newBoard = grid[games[idx].gameName].map((i) => {
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
const removeGame = (game) => {
  const idx = getGameIndex(game.lobbyId);
  if (games[idx]) {
    games.pop(games[idx]);
  }
};

module.exports = {
  createGame,
  findGame,
  updateTicTacToe,
  updateSnakeGame,
  checkVictory,
  swapTurns,
  resetGame,
  requestRematch,
  removeGame,
  startGame,
};
