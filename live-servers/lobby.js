const { v4: uuidv4 } = require("uuid");
const boards = require("./boards");
const { createGame } = require("./game");

const tickets = [];
const findOpenQueue = (game) => {
  // search for someone already waiting in the queue
  const openTicket = tickets.filter((ticket) => ticket.gameName === game)[0];
  return { openTicket };
};
const findIndex = (id) => {
  return tickets.findIndex((ticket) => ticket.lobbyId === id);
};
const createTicket = (player, gameName) => {
  const data = { lobbyId: uuidv4(), gameName, player };
  tickets.push(data);
  const idx = findIndex(data.lobbyId);
  return { ticket: tickets[idx] };
};
const startGame = (ticket, player) => {
  // create empty game board
  const empty = {
    lobbyId: ticket.lobbyId,
    gameName: ticket.gameName,
    board: boards[ticket.gameName].map((i) => {
      if (!i.isEmpty || i.content) {
        return { ...i, isEmpty: true, content: "" };
      }
      return i;
    }),
  };
  // populate player data
  const playerData = { player1: ticket.player, player2: player };
  const { game } = createGame(empty, playerData);
  // close the ticket
  const index = tickets.findIndex((t) => t.uid === ticket.uid);
  tickets.pop(index);
  return { game };
};
const cancelTicket = (ticket) => {
  const idx = tickets.findIndex((i) => i.lobbyId === ticket.lobbyId);
  tickets.pop(tickets[idx]);
  return { ticket: tickets[idx] };
};

module.exports = {
  findOpenQueue,
  createTicket,
  startGame,
  cancelTicket,
};
