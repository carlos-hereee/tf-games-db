require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user-router.js");
const { findLobby, removePlayer, makeLobby } = require("./live-servers/lobby");
const { createGame } = require("./live-servers/game");
const { v4: uuidv4 } = require("uuid");
const {
  emitMessage,
  emitGameData,
  emitBroadcast,
} = require("./live-servers/socketEmit.js");

// CONNECT TO MONGOOSEDB
const uri = `mongodb+srv://${process.env.MONGOOSE_USERNAME}:${process.env.MONGOOSE_PASSWORD}@cluster0.9er2n.mongodb.net/take-five-db?retryWrites=true&w=majority`;

const port = process.env.PORT || 4937;
const server = express();
const httpServer = createServer(server);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONT_END_BASE_URL,
    methods: ["GET", "POST"],
  },
});
server.use(helmet());
server.use(cookieParser());
server.use(
  cors({
    credentials: true,
    origin: process.env.FRONT_END_BASE_URL,
  })
);
server.use(express.json());
server.use("/users/", userRouter);

// initialize socket for the server
io.on("connection", (socket) => {
  socket.on("leave", (player) => {
    const { lobby } = removePlayer(player);
    emitMessage(socket, player, `has left`);
    //   emitGameData(socket, game, lobby, opponent, player);
  });
  socket.on("join", async ({ player, gameName }) => {
    // search for open lobby
    const { lobby } = findLobby({ player, gameName });
    if (!lobby) {
      const lobbyId = uuidv4();

      const { lobby } = makeLobby({ player, gameName }, lobbyId);
      socket.join(lobby.lobbyId);
      emitMessage(socket, { ...player, lobbyId }, "joined!");
    }
    if (lobby) {
      socket.join(lobby.lobbyId);
      emitMessage(socket, player, "joined!");
    }

    // if (lobby && !alreadyExists) {
    //   console.log("\n\n", lobby, alreadyExists);
    //   console.log(lobby);
    //   const { updatedLobby, error } = await addPlayerToLobby(lobby, player);
    //   emitMessage(socket, player, "joined the room");
    //   // sanity check at least two players in the lobby
    //   if (updatedLobby.players.length > 1) {
    //     const opponent = lobby.players.filter(
    //       (i) => i.uid !== player.uid && i.isPlaying
    //     );
    //     // create a new game state to play in
    //     // const { newGame, error } = await createGame(lobby);
    //     emitBroadcast(socket, lobby, "starting match!");
    //     // start match
    //     // emitGameData(socket, newGame, updatedLobby, opponent, player);
    //   }
    // }
    // if (alreadyExists) {
    //   socket.join(lobby.lobbyId);
    //   emitMessage(socket, player, "joining lobby");
    //   emitBroadcast(socket, lobby, `${player.nickname} joined`);
    //   if (lobby.players.length > 1) {
    //     const opponent = lobby.players
    //       .filter((i) => i.uid !== player.uid && i.isPlaying)
    //       .pop(0);
    //     console.log("opponent", opponent);
    //     emitBroadcast(socket, lobby, "starting match!");
    //     // create a new game state to play in
    //     // const { newGame, error } = await createGame(lobby);
    //     // console.log(lobby.lobbyId);
    //     // start match
    //     // emitGameData(socket, newGame, updatedLobby, opponent, player);
    //   }
    // }
    // // if (error) {
    // //   // add user to a lobby and wait for other players to start matches
    // //   const { newLobby } = await createNewLobby({ player, gameName }, socket);
    // //   socket.join(newLobby.lobbyId);
    // //   socket.emit("message", {
    // //     id: uuidv4(),
    // //     user: player,
    // //     message: `${player?.nickname} joined the queue, ...searching for match`,
    // //   });
    // // }
  });
});
// tesing server
server.get("/", (req, res) => {
  res.status(200).json({ message: "api is running" });
});
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(port, () => {
      console.log(`\n *** Server listening on port ${port} *** \n`);
    });
    httpServer.listen(1200, () => console.log("1200"));
  })
  .catch((e) => console.log("e", e));
