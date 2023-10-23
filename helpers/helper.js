const moment = require("moment");

const roomUsers = []; // Common for every room

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
}

// ! newUser requirement =>{unique id, name, channel(room)}
function newUser(id, username, room) {
  const user = { id, username, room };
  roomUsers.push(user);
  return user;
}
// Finding indiviual user based on room name
function getIndidvualRoomUsers(room) {
  return roomUsers.filter((user) => user.room == room);
}

//Leave room
function exitRoom(id) {
  const index = roomUsers.findIndex((user) => user.id === id);
  if (index != -1) {
    // if index is not exisitent
    return roomUsers.splice(index, 1)[0]; // return the removed user
  }
}

function getActiveUser(id) {
  return roomUsers.find((user) => user.id === id);
}

module.exports = {
  newUser,
  getActiveUser,
  exitRoom,
  getIndidvualRoomUsers,
  formatMessage,
};
