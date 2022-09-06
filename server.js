require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user-router.js");
const {
  findOpenQueue,
  createTicket,
  cancelTicket,
} = require("./live-servers/lobby");
const {
  findGame,
  updateGameboard,
  startGame,
  requestRematch,
  resetGame,
  removeGame,
} = require("./live-servers/game");
const {
  emitMessage,
  emitGameData,
  emitGameResults,
  emitRematchMessage,
  emitResetGame,
  emitTicketData,
  emitMessageLeft,
} = require("./live-servers/socketEmit.js");

// env
const port = process.env.PORT;
const uri = process.env.MONGOOSE_URI;
const clientURL = process.env.CLIENT_BASE_URL;
// set up
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: clientURL, methods: ["GET", "POST"] },
});
app.use(helmet());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: clientURL }));
app.use(express.json());
app.use("/users/", userRouter);

// initialize socket for the server
// TODO: MOVE TO AN EMPTY DIRECTORY
io.on("connection", (socket) => {
  console.log("A user connected");
  const playerId = socket.handshake.query.id;
  if (playerId) {
    socket.join(playerId);
    console.log(`connection made on socket id : ${playerId}`);
  }
  // check if player is already in a game
  const { game } = findGame(playerId);
  if (game.lobbyId) {
    // send player to game
    socket.join(game.lobbyId);
    emitGameData(socket, game);
  }

  socket.on("cancel-ticket", ({ ticket, player }) => {
    cancelTicket(ticket);
    emitTicketData(socket, {});
    emitMessage(socket, player, "canceled the search");
  });
  socket.on("new-game", ({ player, gameName }) => {
    // search for an open queue
    const { openTicket } = findOpenQueue(player, gameName);
    if (!openTicket) {
      // add player to queue
      const { ticket } = createTicket(player, gameName);
      if (ticket.lobbyId) {
        socket.join(ticket.lobbyId);
        emitTicketData(socket, ticket);
        emitMessage(socket, player, "joined the queue");
      } else emitMessage(socket, player, "servers are down, try agian later");
    }
    if (openTicket) {
      socket.join(openTicket.lobbyId);
      // notify both players
      const msg = "Opponent found, starting match!";
      emitMessage(socket, player, msg, openTicket.lobbyId);
      // send both players the game data
      const { game } = startGame(openTicket, player);
      emitGameData(socket, game);
      // delete ticket
      cancelTicket(openTicket);
    }
  });

  socket.on("player-leave", ({ player, game }) => {
    // reset game results
    emitGameResults(socket, game.lobbyId, "");
    socket.leave(game.lobbyId);
    // delete game
    removeGame(game);
    emitMessageLeft(socket, game, player);
  });

  socket.on("place-mark", ({ game, cell, player }) => {
    // updated the game board
    const { updatedGame, result } = updateGameboard(game, cell, player);
    emitGameData(socket, updatedGame);
    // check for win
    if (result === "win" || result === "draw") {
      emitGameResults(socket, game.lobbyId, result);
    }
  });
  socket.on("request-rematch", ({ game, isPlayer1 }) => {
    const { players } = requestRematch(game, isPlayer1);
    if (players.player2.rematch && players.player1.rematch) {
      const { reset } = resetGame(game);
      // send reset game to both player
      emitResetGame(socket, reset);
    } else {
      emitRematchMessage(socket, game, players, isPlayer1);
    }
  });
});
// tesing server
app.get("/", (req, res) => {
  res.status(200).json({ message: "api is running" });
});

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(port, () => {
      console.log(`\n *** Server listening on port ${port} *** \n`);
    });
  })
  .catch((e) => console.log("e", e));
