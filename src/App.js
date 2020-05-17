import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import './App.css';
import {connect} from 'react-redux';
import Menu from './components/Menu';
import { createGame, addPlayer } from './actions/gameActions';
import Card from './components/Card'


function App({game, createGame, addPlayer}) {
  const [socket, setSocket] = useState();
  const [flipped, flip] = useState(false);
  useEffect(() => {
    const socket = io.connect('localhost:3000');
    setSocket(socket)

    socket.on('game joined', ({gameName, playersJoined}) => {
      createGame({name: gameName, playersJoined})
    });

    socket.on('game created', ({gameName}) => {
      createGame({name: gameName, playersJoined: 1})
    });

    socket.on('begin game', () => {
      console.log('begin the game111111')
    })
    
    socket.on('player joined', () => {
      console.log('got event')
      addPlayer();
    })

  }, []);

  return (
    <div>
      <h1>{game.playersJoined == 2 ? 'all in' : ''}</h1>
      <h2>Cambio</h2>
      <Card />
      <Menu socket={socket}/>
    </div>
  );
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, {createGame, addPlayer})(App);
