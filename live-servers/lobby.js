const { v4: uuidv4 } = require("uuid");
const { boards } = require("./boards");
const { createGameInstance } = require("./game");

const tickets = [];
const findOpenQueue = (game) => {
  const openTicket = tickets.filter((ticket) => ticket.gameName === game)[0];
  return { openTicket };
};
const createQueueTicket = (player, gameName) => {
  try {
    const data = {
      uid: uuidv4(),
      gameName,
      lobbyId: player.uid,
      player: { nickname: player.nickname, uid: player.uid },
    };
    tickets.push(data);
    return { success: true };
  } catch {
    return { success: false };
  }
};

const updateTicketAndStartMatch = (ticket, opponent, lobbyId) => {
  // create empty game board
  const emptyGameBoard = {
    gameName: ticket.gameName,
    board: boards[ticket.gameName],
  };
  // populate player data
  const playerData = { player1: ticket.player, player2: opponent };
  const { game } = createGameInstance(emptyGameBoard, playerData, lobbyId);
  // close the ticket
  const index = tickets.findIndex((t) => t.uid === ticket.uid);
  tickets.pop(index);
  return { game };
};

module.exports = {
  findOpenQueue,
  createQueueTicket,
  updateTicketAndStartMatch,
};
