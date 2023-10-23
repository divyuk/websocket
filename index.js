const express = require("express");
const socketio = require("socket.io");
const http = require("http"); // Since socket are based on http
const path = require("path");
const app = express();
const cors = require("cors");
app.use(cors());

const server = http.createServer(app); // creating http server
const {
  newUser,
  getIndidvualRoomUsers,
  formatMessage,
} = require("./helpers/helper");

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
}); // Creating a socket on this server

app.use(express.static(path.join(__dirname, "public"))); // To render static files(html,css,js)

// Gloabal function for websocket| Listining for the events
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = newUser(socket.id, username, room); // Every new connection will have socketID
    // Make the user join the room/channel
    socket.join(user.room);

    // Send a generic message to the new User
    socket.emit(
      "message",
      formatMessage("Server", "Messages are limited to this room")
    );
    console.log("Message sent to frontend:");

    // To emit message to everyone there are 2 things
    //? 1. Broadcast 2. io.to
    // Broadcast will send to everyone except yourself(the sender)
    // io.to -> everyone + yourself

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("Server", `${user.username} has joined the room`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getIndidvualRoomUsers(user.room),
    });
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log("Server Started");
});
