import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import './App.css';
import {connect} from 'react-redux';
import Menu from './components/Menu';
import { createGame } from './actions/gameActions'


function App({game, createGame}) {
  const [socket, setSocket] = useState();
  useEffect(() => {
    const socket = io.connect('localhost:3000');
    setSocket(socket)

    socket.on('game joined', ({gameName}) => {
      window.game = {name: gameName}
      console.log('joiii')
    });

    socket.on('game created', ({gameName}) => {
      createGame({name: gameName, playersJoined: 1})
    });

    socket.on('begin game', () => {
      console.log('begin the game111111')
    })

  }, []);
  return (
    <div>
      <h2>Cambio</h2>
      <Menu socket={socket}/>
    </div>
  );
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, {createGame})(App);
