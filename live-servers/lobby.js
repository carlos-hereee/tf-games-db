const { v4: uuidv4 } = require("uuid");

const lobby = [];
const game = [];
const findLobby = ({ gameName }) => {
  const openLobby = lobby.find(
    (room) => room.gameName === gameName && room.gameStarted === false
  );
  return { lobby: openLobby };
};
const makeLobby = ({ player, gameName }, lobbyId) => {
  const data = {
    gameName,
    lobbyId,
    opponentFound: false,
    players: [{ ...player }],
  };
  lobby.push(data);
  const newLobby = lobby.filter((room) => room.lobbyId === lobbyId)[0];
  return { lobby: newLobby };
};
const removePlayer = async (player) => {
  console.log(player);
  const lobbyIndex = lobby.findIndex((room) => console.log(room.lobbyId));
  // const playerIndex = lobby[lobbyIndex].players?.findIndex(
  //   (user) => user.uid === player.uid
  // );
  // const byebye = lobby[lobbyIndex].players.pop(playerIndex);
  console.log(lobbyIndex);
  // if (index !== -1)
};
module.exports = { findLobby, removePlayer, makeLobby };
