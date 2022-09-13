const { startGame } = require("../live-servers/game");
const { createTicket, findOpenQueue } = require("../live-servers/lobby");
const { emitMessage, emitTicketData } = require("../live-servers/socketEmit");
const { startLobbyTimer } = require("./timer");

const newgame = (socket, player, gameName) => {
  // search for an open queue
  const { openTicket } = findOpenQueue(player, gameName);
  startLobbyTimer(socket, player, 0);
  if (!openTicket) {
    // add player to queue
    const { ticket } = createTicket(player, gameName);
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
    startGame(openTicket, player);
  }
};

module.exports = { newgame };
