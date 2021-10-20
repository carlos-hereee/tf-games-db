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
const joinLobby = async (lobbyId, player) => {
  const lobbyIndex = lobby.findIndex((room) => room.lobbyId === lobbyId);
  if (lobbyIndex !== -1) {
    const addition = lobby[lobbyIndex].players.push(player);
    return { addition };
  }
};
const removePlayer = async (player, lobbyId) => {
  const lobbyIndex = lobby.findIndex((room) => room.lobbyId === lobbyId);
  if (lobbyIndex !== -1) {
    const removed = lobby[lobbyIndex].players.pop(player);
    return { removed, game };
  }
};
module.exports = { findLobby, removePlayer, makeLobby, joinLobby };
