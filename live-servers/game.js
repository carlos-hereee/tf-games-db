const games = [];
const testgame = [
  {
    lobbyId: "31e46eb2-a63e-40af-8232-e1b4d2a591dc",
    board: {
      gameName: "tictactoe",
      board: [
        { positionX: 1, positionY: 1, isEmpty: true, content: "" },
        { positionX: 1, positionY: 2, isEmpty: true, content: "" },
        { positionX: 1, positionY: 3, isEmpty: true, content: "" },
        { positionX: 2, positionY: 1, isEmpty: true, content: "" },
        { positionX: 2, positionY: 2, isEmpty: true, content: "" },
        { positionX: 2, positionY: 3, isEmpty: true, content: "" },
        { positionX: 3, positionY: 1, isEmpty: true, content: "" },
        { positionX: 3, positionY: 2, isEmpty: true, content: "" },
        { positionX: 3, positionY: 3, isEmpty: true, content: "" },
      ],
    },
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
module.exports = { createGameInstance, findGame };
