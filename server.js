const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3000;
/* const payingSocket = io.of("/paying"); */
const loaningSocket = io.of("/loaning");
const createRoomSocket = io.of("/createRoom");
let room = "a";
var payingPageRoomData = [];
var payingRoomQuery = [];

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

app.get("/success", (req, res) => {
  res.render("success");
});

app.get("/chat", (req, res) => {
  res.render("chatRoom");
});

/* payingSocket.on("connection", (socket) => {
  console.log("a user connected in paying page");
  socket.emit("readUsersData", payingPageRoomData);
  socket.on("sendUsersData", (data) => {
    payingPageRoomData.push(data);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected in paying page");
    payingSocket.emit("update", payingPageRoomData);
    console.log("package is sending");
  });
}); */

loaningSocket.on("connection", (socket) => {
  console.log("a user connected in paying page");
  socket.emit("readUsersData", loaningPageRoomData);
  socket.on("disconnect", () => {
    console.log("user disconnected in paying page");
  });
});

io.on("connection", (socket) => {
  console.log('connect');
  /* socket.on('join',(data)=>{
    socket.join(data);
    console.log(data)
  }); */
  socket.emit("readPayingUsersData", payingPageRoomData);
  socket.on("sendPayingUsersData", (data) => {
    data.room = room;
    payingPageRoomData.push(data);
    payingRoomQuery.push(data);
    console.log(payingRoomQuery);
    room+="a";
    io.emit('update',payingPageRoomData);
  });
  /* socket.emit("welcome",'kuay'); */
  socket.on('joinPayingChat',()=>{
    socket.join(payingRoomQuery[0].room);
    io.to(payingRoomQuery[0].room).emit("welcome",payingRoomQuery[0].room);
    payingRoomQuery.shift();
  });
  socket.on('chat message', (msg) => {
    console.log(msg);
    io.to(msg.room).emit('chat message', msg.message);
  });
  socket.on('disconnect',()=>{
  });
});

server.listen(port, () => {
  console.log("server running at http://localhost:3000");
});
