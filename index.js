const express = require('express');
// require('dotenv').config();
const socket = require('socket.io');
const port = process.env.PORT || 3000;
const Deck = require('card-deck');
const cardsDeck = [
  'c1','c2','c3','c4','c5','c6','c7','c8','c9','c10','c11','c12','c13',
  'd1','d2','d3','d4','d5','d6','d7','d8','d9','d10','d11','d12','d13',
  'h1','h2','h3','h4','h5','h6','h7','h8','h9','h10','h11','h12','h13',
  's1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','s12','s13',
  'j','j'
]

const app = express();
const server = app.listen(port, () => console.log(`listening on port ${port}`));
const io = socket(server);

const rooms = {};

function startGame(gameName){
  let room = rooms[gameName]
  let deck = new Deck(cardsDeck);
  deck.shuffle();
  let cards = [];
  room.players = [];
  for(let i = 0; i < room.totalPlayers; i++){
    const hand = deck.draw(4);
    hand.forEach((card,j) => {
      cards.push({hand: i, handPosition: j, value: card})
    });
  }
  deck._stack.forEach((card,i) => {
    if(i === 0){
      cards.push({discard: 0, value: card})
    } else {
      cards.push({draw: i - 1, value: card})
    }
  })
  io.in(gameName).emit('begin game', {cards, players: room.players});
}

io.on('connection', socket => {
  console.log('connection established')

  socket.on('take draw card', ({position, roomName}) => {
    socket.to(roomName).emit('draw card taken', {position});
  });

  socket.on('update cards', ({cards, roomName}) => {
    socket.to(roomName).emit('update cards', {cards});
  })

  socket.on('start game', ({gameName}) => {
    if(rooms[gameName]){
      socket.emit('room name taken')
    } else {
      rooms[gameName] = {totalPlayers: 2, playersJoined: 1}
      socket.join(gameName);
      socket.emit('game created', {gameName, player: 1})
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
        startGame(gameName);
      }
    }
  })
});