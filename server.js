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
  findOpenLobby,
  createNewLobby,
  addPlayerToLobby,
} = require("./live-servers/lobby");
const { v4: uuidv4 } = require("uuid");

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
  socket.on("leave", () => {
    console.log("\n\nuser left");
  });
  socket.on("join", async ({ player, gameName }) => {
    // search for open lobby
    const { lobby, error } = await findOpenLobby({ player, gameName }, socket);
    // none found
    if (error) {
      // add user to a lobby and wait for other players to start matches
      const { newLobby } = await createNewLobby({ player, gameName }, socket);
      socket.join(newLobby.lobbyId);
      socket.emit("message", {
        id: uuidv4(),
        user: player,
        message: `${player?.nickname} joined the queue, ...searching for match`,
      });
    }
    if (lobby) {
      // add user to the lobby
      const { updatedLobby, error } = await addPlayerToLobby(lobby, player);
      socket.join(lobby.lobbyId);
      // sanity check at least two players in the lobby
      if (lobby.players.length > 1) {
        // find oponent
        const opponent = lobby.players.filter((i) => i.uid !== player.uid);
        // create a game to listen to
        const gameInstance = await createGame();
        // start match
        socket.emit("message", {
          id: uuidv4(),
          user: player,
          message: `${player?.nickname} joined the room, starting match!`,
        });
        socket.emit("matchStart", {
          // game:
          lobby: updatedLobby,
          opponent: opponent,
        });
      }
    }
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
