import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import './App.css';
import {connect} from 'react-redux';
import Menu from './components/Menu';
import { createGame, addPlayer, beginGame } from './actions/gameActions';
import Game from './components/Game'


function App({game, createGame, addPlayer, beginGame}) {
  const [socket, setSocket] = useState();
  
  useEffect(() => {
    const socket = io.connect('localhost:3000');
    setSocket(socket)

    socket.on('game joined', ({gameName, playersJoined}) => {
      createGame({name: gameName, playersJoined})
    });

    socket.on('game created', ({gameName}) => {
      createGame({name: gameName, playersJoined: 1})
    });

    socket.on('begin game', ({deck, players}) => {
      beginGame({deck, players})
    })
    
    socket.on('player joined', () => {
      console.log('got event')
      addPlayer();
    })

  }, []);

  return (
    <div>
      <h2>Cambio</h2>
      <button onClick={() => beginGame({deck: ['a1','a2'], players: [{hand: ['c1','c2','c3','c4']}, {hand: ['a1','a2','a3','a4']},{hand: ['c1','c2','c3','c4']}, {hand: ['a1','a2','a3','a4']}]})}>start game test</button>
      {!game.playing &&  <Menu socket={socket}/>}
      {game.playing && <Game/>}
    </div>
  );
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, {createGame, addPlayer, beginGame})(App);
