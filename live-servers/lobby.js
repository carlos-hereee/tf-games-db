const { v4: uuidv4 } = require("uuid");

const tickets = [];
const findOpenQueue = (player, gameName) => {
  // search for someone already waiting in the queue
  const openTicket = tickets.filter(
    (ticket) => ticket.gameName === gameName && ticket.createdBy !== player
  )[0];
  return { openTicket };
};
const findIndex = (id) => {
  return tickets.findIndex((ticket) => ticket.lobbyId === id);
};
const createTicket = (player, gameName) => {
  const data = { lobbyId: uuidv4(), gameName, createdBy: player };
  tickets.push(data);
  const idx = findIndex(data.lobbyId);
  return { ticket: tickets[idx] };
};

const cancelTicket = (ticket) => {
  const idx = tickets.findIndex((i) => i.lobbyId === ticket.lobbyId);
  tickets.pop(tickets[idx]);
};

module.exports = {
  findOpenQueue,
  createTicket,
  cancelTicket,
};
