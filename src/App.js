import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import './App.css';
import {connect} from 'react-redux';
import Menu from './components/Menu';
import { createGame, addPlayer, beginGame, changePhase, updateCards } from './actions/gameActions';
import Game from './components/Game'

function App({game, createGame, addPlayer, beginGame, changePhase, updateCards}) {
  const [socket, setSocket] = useState();
  
  useEffect(() => {
    const socket = io.connect('localhost:3000');
    setSocket(socket)

    socket.on('game joined', ({gameName, playersJoined}) => {
      createGame({name: gameName, playersJoined, player: playersJoined})
    });

    socket.on('draw card taken', ({position}) => {
      console.log(position)
      const hand = document.querySelector(`[data-hand]=hand-${game.turn - 1}`)
    })

    socket.on('game created', ({gameName, player}) => {
      createGame({name: gameName, playersJoined: 1, player})
    });

    socket.on('update cards', ({cards}) => {
      updateCards({cards});
    })

    socket.on('begin game', ({cards, players}) => {
      beginGame({cards, players})
    })
    
    socket.on('player joined', () => {
      console.log('got event')
      addPlayer();
    });

  }, []);

  return (
    <div>
      <h2>Cambio</h2>
      <button onClick={() => beginGame({deck: {_stack: ['a1','a2']}, discards: ['a1','a2'], players: [{hand: ['c1','c2','c3','c4']}, {hand: ['a1','a2','a3','a4']}]})}>start game test</button>
      {!game.playing &&  <Menu socket={socket}/>}
      {game.playing && <Game socket={socket}/>}
    </div>
  );
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, {createGame, addPlayer, beginGame, changePhase, updateCards})(App);
