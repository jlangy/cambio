const express = require('express');
// require('dotenv').config();
const socket = require('socket.io');
const path = require('path');
const port = process.env.PORT || 3000;
const Deck = require('card-deck');
// const cardsDeck = [
//   'c_11','c_11','c_11','c_11','c_5','c_6','c_7','c_8','c_9','c_10','c_11','c_12','c_13',
//   'd_11','d_11','d_11','d_5','d_6','d_7','d_8','d_9','d_10','d_11','d_12','d_13',
//   'h_11','h_11','h_11','h_11','h_5','h_6','h_7','h_8','h_9','h_10','h_11','h_12','h_13',
//   's_11','s_11','s_11','s_11','s_5','s_6','s_7','s_8','s_9','s_10','s_11','s_12','s_13',
//   'j_0','j_0'
// ]

// const cardsDeck = [
//   'c_13','c_13','c_13','c_13','c_13','c_13','c_13','c_13','c_13','c_13','c_13'
  // 'c_12','c_12','c_12','c_12','c_12','c_12','c_12','c_12','c_12','c_12','c_12','c_12','c_12',
  // 'c_12','c_12','c_12','c_12','c_12','c_12',
  // 'c_12','c_12','c_12','c_12','c_12','c_12','c_12','c_12','c_12','c_12','c_12','c_12','c_12',
  // 'c_12','c_12','c_12','c_12','c_12','c_12',
// ]
// const cardsDeck = [
//   'j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0',
//   'j_0','j_0','j_0','j_0','j_0','j_0',
//   'j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0',
//   'j_0','j_0','j_0','j_0','j_0','j_0',
//   'j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0',
//   'j_0','j_0','j_0','j_0','j_0','j_0',
//   'j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0','j_0',
//   'j_0','j_0','j_0','j_0','j_0','j_0',
// ]

const app = express();
const server = app.listen(port, () => console.log(`listening on port ${port}`));
const io = socket(server);

let rooms = {};

app.use(express.static(path.join(__dirname, 'build')));

function setUpDeck(totalPlayers){
  const cardsDeck = [
    'c_1','c_2','c_3','c_4','c_5','c_6','c_7','c_8','c_9','c_10','c_11','c_12','c_13',
    'd_1','d_2','d_3','d_4','d_5','d_6','d_7','d_8','d_9','d_10','d_11','d_12','d_13',
    'h_1','h_2','h_3','h_4','h_5','h_6','h_7','h_8','h_9','h_10','h_11','h_12','h_13',
    's_1','s_2','s_3','s_4','s_5','s_6','s_7','s_8','s_9','s_10','s_11','s_12','s_13',
    'j_0','j_0'
  ]
  let deck = new Deck(cardsDeck);
  deck.shuffle();
  let cards = [];
  for(let i = 0; i < totalPlayers; i++){
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
  return cards;
}

function startGame(gameName){
  const cards = setUpDeck(rooms[gameName].totalPlayers);
  io.in(gameName).emit('begin game', {cards});
}

io.on('connection', socket => {
  console.log('connection established')

  socket.on('take draw card', ({position, roomName}) => {
    socket.to(roomName).emit('draw card taken', {position});
  });

  socket.on('finished peeking', ({roomName}) => {
    rooms[roomName].finishedPeeking += 1;
    if(rooms[roomName].finishedPeeking === rooms[roomName].totalPlayers){
      io.in(roomName).emit('peeking over')
      rooms[roomName].finishedPeeking = 0;
    }
  });

  socket.on('leave', ({roomName}) => {
    socket.leave(roomName);
    delete rooms[roomName];
  })

  socket.on('log rooms', () => console.log(rooms))

  socket.on('disconnecting', () => {
    const roomName = Object.keys(io.sockets.adapter.sids[socket.id])[1];
    delete rooms[roomName];
    io.in(roomName).emit('player disconnection'); 
  })

  socket.on("change turn", ({roomName}) => {
    socket.to(roomName).emit('change turn')
  })

  socket.on('change name', (info) => {
    socket.to(info.roomName).emit('change name', info)
  })

  socket.on('end round', ({roomName, gameOver, caboSuccess, newPlayers, cabod}) => {
    socket.to(roomName).emit('end round', {newPlayers, caboSuccess, gameOver, cabod});
    if(!gameOver){
      setTimeout(() => {
        io.in(roomName).emit('new round', {cards: setUpDeck(rooms[roomName].totalPlayers)});
      }, 12000);
    }
  })

  socket.on("change phase", ({roomName, phase}) => {
    socket.to(roomName).emit('change phase', {phase})
  })

  socket.on('slapping on', ({roomName}) => {
    io.in(roomName).emit('slapping on')
    rooms[roomName].slapping = true;
  })

  socket.on('update cards', ({cards, roomName}) => {
    socket.to(roomName).emit('update cards', {cards});
  })

  socket.on('cabo turn end', ({roomName}) => {
    socket.to(roomName).emit('cabo turn end');
  })

  socket.on('remove highlight', ({roomName}) => {
    socket.to(roomName).emit('remove highlight')
  })

  socket.on('cabo', ({roomName, player}) => {
    socket.to(roomName).emit('cabo', {player});
  })

  socket.on('not slapping', () => {
    const roomName = Object.keys(io.sockets.adapter.sids[socket.id])[1];
    if(!rooms[roomName].slapping){
      return;
    }
    rooms[roomName].notSlapping = rooms[roomName].notSlapping ? rooms[roomName].notSlapping + 1 : 1;
    console.log(rooms)
    if(rooms[roomName].notSlapping === rooms[roomName].totalPlayers){
      io.to(roomName).emit('no slap');
      rooms[roomName].notSlapping = 0;
    } 
  })

  socket.on('slap', ({roomName, player}) => {
    if(rooms[roomName].slapping){
      rooms[roomName].slapping = false;
      io.to(roomName).emit('slapped', {player})
    }
  })

  socket.on('start game', ({roomName, totalPlayers}) => {
    totalPlayers = Number(totalPlayers)
    if(rooms[roomName]){
      socket.emit('room name taken')
    } else {
      rooms[roomName] = {totalPlayers, playersJoined: 1, finishedPeeking: 0}
      socket.join(roomName);
      socket.emit('game created', {roomName, player: 1, totalPlayers})
    }
  });

  socket.on('highlight', cardInfo => {
    socket.to(cardInfo.roomName).emit('highlight', cardInfo)
  });

  socket.on('join game', ({roomName}) => {
    const room = rooms[roomName];
    if(!room){
      socket.emit('room DNE')
    } else {
      room.playersJoined += 1;
      socket.join(roomName)
      socket.emit('game joined', {roomName, playersJoined: room.playersJoined, totalPlayers: room.totalPlayers})
      socket.to(roomName).emit('player joined')
      console.log(room)
      if(room.playersJoined === room.totalPlayers){
        console.log('here')
        startGame(roomName);
      }
    }
  })
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build/index.html'));
});