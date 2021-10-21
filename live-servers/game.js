const { v4: uuidv4 } = require("uuid");

const games = [];
const createGameInstance = (board, players) => {
  const game = {
    uid: uuidv4(),
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
  const res = games.filter(({ players }) => {
    players.player1.uid === id || players.player2.uid === id;
  })[0];
  console.log(res);
  if (res) {
    return { result: res };
  }
  return { result: false };
};
module.exports = { createGameInstance, findGame };
