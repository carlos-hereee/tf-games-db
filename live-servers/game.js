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
    status: "",
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
const updateGameboard = ({ board, turn, lobbyId }, cell) => {
  try {
    // TODO: switch to game array
    const gtIdx = testgame.findIndex((game) => game.lobbyId === lobbyId);
    const cellIdx = testgame[gtIdx].board.findIndex((r) => r.uid === cell.uid);
    console.log(testgame[gtIdx].board[cellIdx]);
    testgame[gtIdx].board[cellIdx] = {
      ...testgame[gtIdx].board[cellIdx],
      isEmpty: false,
      content: turn,
    };
    return { updatedGame: testgame[gtIdx] };
  } catch {
    return { error: "there was an error updating game" };
  }
};
const checkVictory = (gameToCheck) => {
  console.log(gameToCheck);
};
module.exports = {
  createGameInstance,
  findGame,
  updateGameboard,
  checkVictory,
};
