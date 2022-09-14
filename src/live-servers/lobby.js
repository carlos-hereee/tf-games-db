const { v4: uuidv4 } = require("uuid");

const tickets = [];
const singlePlayer = ["snakeGame"];
const twoPlayer = ["tictactoe"];

const findOpenQueue = (player, gameName) => {
  // search for someone already waiting in the queue
  const openTicket = tickets.filter(
    (ticket) =>
      ticket.gameName === gameName && ticket.createdBy.uid !== player.uid
  )[0];
  return { openTicket };
};
const findTicketWithPlayerId = (playerId) => {
  const ticket = tickets.filter(
    (ticket) => ticket.createdBy.uid === playerId
  )[0];
  return { ticket };
};
const findIndex = (id) => {
  return tickets.findIndex((ticket) => ticket.lobbyId === id);
};

const createTicket = (player, gameName, options) => {
  const data = {
    lobbyId: uuidv4(),
    gameName,
    options,
    createdBy: player,
    singlePlayer: singlePlayer.includes(gameName) ? true : false,
  };
  tickets.push(data);
  const idx = findIndex(data.lobbyId);
  return { ticket: tickets[idx] };
};

const cancelTicket = (ticket) => {
  const idx = tickets.findIndex((i) => i.lobbyId === ticket?.lobbyId);
  tickets.pop(tickets[idx]);
};

module.exports = {
  findOpenQueue,
  createTicket,
  cancelTicket,
  findTicketWithPlayerId,
};
