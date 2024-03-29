const { startGame } = require("../live-servers/game");
const { createTicket, findOpenQueue } = require("../live-servers/lobby");
const { emitMessage, emitTicketData } = require("../live-servers/socketEmit");
const { startLobbyTimer } = require("./timer");

const newgame = (socket, { player, name, options }) => {
  // search for an open queue
  const { openTicket } = findOpenQueue(player, name);
  startLobbyTimer(socket, player);
  if (!openTicket) {
    // add player to queue
    const { ticket } = createTicket(player, name, options);
    if (ticket.lobbyId) {
      socket.join(ticket.lobbyId);
      // if game is single player
      if (ticket.singlePlayer) {
        startGame(socket, ticket, player);
      } else {
        emitTicketData(socket, ticket);
        emitMessage(socket, player, "joined the queue");
      }
    }
  }
  if (openTicket) {
    socket.join(openTicket.lobbyId);
    // notify both players
    emitTicketData(socket, openTicket);
    const msg = "Opponent found, starting match!";
    emitMessage(socket, player, msg, openTicket.lobbyId);
    startGame(socket, openTicket, player);
  }
};

module.exports = { newgame };
