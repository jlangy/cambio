const express = require('express');
// require('dotenv').config();
const socket = require('socket.io');
const path = require('path');
const port = process.env.PORT || 3000;

const app = express();
const server = app.listen(port, () => console.log(`listening on port ${port}`));
const io = socket(server);

const rooms = {};

io.on('connection', socket => {
  console.log('connection established')

  socket.on('start game', ({gameName}) => {
    if(rooms[gameName]){
      socket.emit('room name taken')
    } else {
      rooms[gameName] = {totalPlayers: 2, playersJoined: 1}
      socket.join(gameName);
      socket.emit('game created', {gameName})
    }
  })

  socket.on('join game', ({gameName}) => {
    const room = rooms[gameName];
    if(!room){
      socket.emit('room DNE')
    } else {
      room.playersJoined += 1;
      socket.join(gameName)
      socket.emit('game joined', {gameName, playersJoined: room.playersJoined})
      socket.to(gameName).emit('player joined')
      if(room.playersJoined === room.totalPlayers){
        io.in(gameName).emit('begin game')
      }
    }
  })
});