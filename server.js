require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const { socketManager } = require("./src/Socket/index.js");
const { createServer } = require("http");
const { clientUrl, port, uri } = require("./config.env.js");
const helmet = require("helmet");
const userRouter = require("./src/routes/user-router.js");

// set up
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: clientUrl, methods: ["GET", "POST"] },
});
app.use(helmet());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: clientUrl }));
app.use(express.json());
app.use("/users/", userRouter);

// initialize socket for the server
io.on("connection", (socket) => socketManager(socket));

// tesing server
app.get("/", (req, res) => {
  res.status(200).json({ message: "api is running" });
});
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(port, () => {
      if (process.env.NODE_ENV === "development") {
        console.log(`\n *** Server listening on port ${port} *** \n`);
      }
    });
  })
  .catch((e) => {
    if (process.env.NODE_ENV === "development") console.log("e", e);
  });
