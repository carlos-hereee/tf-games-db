require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const userRouter = require("./routes/user-router.js");
const mongoose = require("mongoose");

// CONNECT TO MONGOOSEDB
const uri = `mongodb+srv://${process.env.MONGOOSE_USERNAME}:${process.env.MONGOOSE_PASSWORD}@cluster0.9er2n.mongodb.net/take-five-db?retryWrites=true&w=majority`;

const port = process.env.PORT || 4937;
const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use("/users/", userRouter);
//tesing server
server.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "success", code: 200, message: "api is running" });
});
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    server.listen(port, () => {
      console.log(`\n *** Server listening on port ${port} *** \n`);
    })
  )
  .catch((e) => console.log("e", e));
