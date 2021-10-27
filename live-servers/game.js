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
      },
      player2: {
        uid: "f9709bcd-067b-4067-8018-9c037123916d",
        nickname: "wooden harmony",
      },
    },
    turn: "player1",
    turnCount: 0,
    round: 0,
  },
];
const createGameInstance = (board, players, lobbyId) => {
  const game = {
    lobbyId,
    board,
    players,
    turn: "player1",
    turnCount: 0,
    status: "",
  };
  games.push(game);
  return { game };
};
const findGame = (id) => {
  // for testing purpose
  const res = testgame.filter(({ players }) => {
    return players.player1.uid || players.player2.uid === id;
  })[0];
  // const res = games.filter(({ players }) => {
  //   players.player1.uid === id || players.player2.uid === id;
  // })[0];
  if (res) {
    return { result: res };
  }
  return { result: false };
};
const getGameIndex = (lobbyId) => {
  return testgame.findIndex((game) => game.lobbyId === lobbyId);
};
const updateGameboard = (game, cell) => {
  const { board, gameName, turn, lobbyId, turnCount } = game;
  try {
    // TODO: switch to game array
    const gtIdx = getGameIndex(lobbyId);
    const cellIdx = testgame[gtIdx].board.findIndex((r) => r.uid === cell.uid);
    testgame[gtIdx].board[cellIdx] = {
      ...testgame[gtIdx].board[cellIdx],
      isEmpty: false,
      content: turn,
    };
    // check for win/draw/continuation
    const { result } = checkVictory({ board, gameName, turn, turnCount });
    // then swap turns
    swapTurns({ lobbyId });
    return { updatedGame: testgame[gtIdx], result };
  } catch {
    return { error: "there was an error updating game" };
  }
};
const checkVictory = ({ board, gameName, turn, turnCount }) => {
  if (turnCount > 8) return { result: "draw" };
  const { scoreBoard } = checkScoreBoard(board, gameName, turn);
  if (Object.values(scoreBoard).filter((item) => item === 3)[0]) {
    return { result: turn };
  }
  return { result: "continue" };
};
const swapTurns = ({ lobbyId }) => {
  const idx = getGameIndex(lobbyId);
  // swap turns
  testgame[idx].turn === "player1"
    ? (testgame[idx].turn = "player2")
    : (testgame[idx].turn = "player1");
  // update the turn count
  testgame[idx].turnCount += 1;
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
    const player1 = testgame[idx].players.player1;
    const player2 = testgame[idx].players.player2;
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

    return { success: true, resetGame: testgame[idx] };
  }
  return { success: false };
};
module.exports = {
  createGameInstance,
  findGame,
  updateGameboard,
  checkVictory,
  swapTurns,
  updateRequestedRematch,
  checkRematch,
};
