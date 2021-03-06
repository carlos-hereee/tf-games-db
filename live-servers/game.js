const { checkScoreBoard } = require("./combination");
const { boards } = require("./boards");
const games = [];
const testgame = [
  {
    lobbyId: "31e46eb2-a63e-40af-8232-e1b4d2a591dc",
    gameName: "tictactoe",
    board: [
      { positionX: 1, positionY: 1, isEmpty: true, content: "", uid: "11" },
      { positionX: 1, positionY: 2, isEmpty: true, content: "", uid: "12" },
      { positionX: 1, positionY: 3, isEmpty: true, content: "", uid: "13" },
      { positionX: 2, positionY: 1, isEmpty: true, content: "", uid: "21" },
      { positionX: 2, positionY: 2, isEmpty: true, content: "", uid: "22" },
      { positionX: 2, positionY: 3, isEmpty: true, content: "", uid: "23" },
      { positionX: 3, positionY: 1, isEmpty: true, content: "", uid: "31" },
      { positionX: 3, positionY: 2, isEmpty: true, content: "", uid: "32" },
      { positionX: 3, positionY: 3, isEmpty: true, content: "", uid: "33" },
    ],
    players: {
      player1: {
        nickname: "steep rail",
        uid: "31e46eb2-a63e-40af-8232-e1b4d2a591dc",
        rematch: false,
      },
      player2: {
        uid: "f9709bcd-067b-4067-8018-9c037123916d",
        nickname: "wooden harmony",
        rematch: false,
      },
    },
    turn: "player1",
    turnCount: 0,
    round: 1,
  },
];
const createGameInstance = (board, players, lobbyId) => {
  const game = {
    lobbyId,
    board,
    players,
    turn: "player1",
    turnCount: 0,
  };
  games.push(game);
  return { game };
};
const findGame = (id) => {
  // find player within the list of games
  const res = testgame.filter(({ players }) => {
    return players.player1.uid === id || players.player2.uid === id;
  })[0];
  if (res) {
    return { result: res };
  }
  return { result: false };
};
const getGameIndex = (lobbyId) => {
  return testgame.findIndex((game) => game.lobbyId === lobbyId);
};
const updateGameboard = ({ lobbyId }, cell, player) => {
  const idx = getGameIndex(lobbyId);
  const cellIdx = testgame[idx].board.findIndex((c) => c.uid === cell.uid);
  // update board
  testgame[idx].board[cellIdx] = {
    ...testgame[idx].board[cellIdx],
    isEmpty: false,
    content: player.uid,
  };
  const updatedGame = testgame[idx];
  console.log(lobbyId);
  // check for win/draw/continuation
  const { result } = checkVictory(updatedGame, player);
  // then swap turns
  // swapTurns(lobbyId)
  return { updatedGame, result };
};
const checkVictory = (game, player) => {
  if (game.turnCount + 1 > 8) return { result: "draw" };
  const { result } = checkScoreBoard(game.board, game.gameName, player);
  // console.log(result);
  return { result };
};
const swapTurns = (lobbyId) => {
  const idx = getGameIndex(lobbyId);
  // swap turns
  testgame[idx].turn === "player1"
    ? (testgame[idx].turn = "player2")
    : (testgame[idx].turn = "player1");
  // update the turn count
  testgame[idx].turnCount += 1;
  return testgame[idx];
};
const updateRequestedRematch = (player, game) => {
  const idx = getGameIndex(game.lobbyId);
  const isPlayer1 = testgame[idx].players.player1.uid === player.uid;
  const isPlayer2 = testgame[idx].players.player2.uid === player.uid;
  // if opponent has not left the game
  if (isPlayer1 && testgame[idx].players.player2.uid) {
    testgame[idx].players.player1.rematch = true;
    return { response: true };
  }
  if (isPlayer2 && testgame[idx].players.player1.uid) {
    testgame[idx].players.player2.rematch = true;
    return { response: true };
  }
  return { response: false };
};
const checkRematch = ({ lobbyId }) => {
  const idx = getGameIndex(lobbyId);
  // if both players request rematch
  const { player1, player2 } = testgame[idx].players;
  if (player2.rematch && player1.rematch) {
    return { success: true };
  }
  return { success: false };
};
const resetGame = ({ lobbyId }) => {
  const idx = getGameIndex(lobbyId);
  const { player1, player2 } = testgame[idx].players;
  // which swap players position so x is o and o is x
  testgame[idx].players.player1 = player2;
  testgame[idx].players.player2 = player1;
  // reset board
  testgame[idx].board = boards[testgame[idx].gameName];
  testgame[idx].turnCount = 0;
  testgame[idx].round += 1;
  testgame[idx].turn = "player1";
  testgame[idx].players.player1.rematch = false;
  testgame[idx].players.player2.rematch = false;
  return { reset: testgame[idx] };
};

module.exports = {
  createGameInstance,
  findGame,
  updateGameboard,
  checkVictory,
  swapTurns,
  updateRequestedRematch,
  checkRematch,
  resetGame,
};
