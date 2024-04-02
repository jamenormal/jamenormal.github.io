const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3000;
const payingSocket = io.of("/paying");
const loaningSocket = io.of("/loaning");
const createRoomSocket = io.of("/createRoom");
let room = 1;
var payingPageRoomData = [
  { userName: "mini", minPrice: "2", maxPrice: "3" },
  { userName: "heart", minPrice: "4", maxPrice: "5" },
];

var loaningPageRoomData = [
  { userName: "iron", minPrice: "6", maxPrice: "7" },
  { userName: "man", minPrice: "8", maxPrice: "9" },
];

var loaningUser = [
  {
    name: "a",
    content:
      "dolor sit amet consectetur adipisicing elit. Excepturi quidem cupiditate tenetur, reprehenderit commodi aspernatur minus dolorum rem voluptate iusto perferendis cum officia maiores impedit autem quod itaque! Maxime, quasi",
    total: " 500 THB",
  },
  {
    name: "a",
    content:
      "dolor sit amet consectetur adipisicing elit. Excepturi quidem cupiditate tenetur, reprehenderit commodi aspernatur minus dolorum rem voluptate iusto perferendis cum officia maiores impedit autem quod itaque! Maxime, quasi",
    total: " 500 THB",
  },
];

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/paying", (req, res) => {
  res.render("paying");
});

app.get("/loaning", (req, res) => {
  res.render("loaning", { loaningUser: loaningUser });
});

app.get("/loaningCreateRoom", (req, res) => {
  res.render("loaningCreateRoom");
});

app.get("/payingCreateRoom", (req, res) => {
  res.render("payingCreateRoom");
});

app.get("/chat1", (req, res) => {
  res.sendFile(join(__dirname, "chatRoom.html"));
});

app.get("/chat2", (req, res) => {
  res.sendFile(join(__dirname, "chatRoom.html"));
});

payingSocket.on("connection", (socket) => {
  console.log("a user connected in paying page");
  socket.emit("readUsersData", payingPageRoomData);
  socket.on("sendUsersData", (data) => {
    payingPageRoomData.push(data);
    payingSocket.emit("update", payingPageRoomData);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected in paying page");
  });
});

loaningSocket.on("connection", (socket) => {
  console.log("a user connected in paying page");
  socket.emit("readUsersData", loaningPageRoomData);
  socket.on("disconnect", () => {
    console.log("user disconnected in paying page");
  });
});

io.on("connection", (socket) => {
  console.log("a user connected");
  io.sockets.emit("welcome", "some user has been in the room");
  room++;
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.emit("welcome", "some user has been in the room");
  });
});

server.listen(port, () => {
  console.log("server running at http://localhost:3000");
});
