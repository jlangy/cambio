import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import './App.css';
import {connect} from 'react-redux';
import Menu from './components/Menu';
import { createGame, addPlayer, beginGame, changePhase } from './actions/gameActions';
import Game from './components/Game'


function App({game, createGame, addPlayer, beginGame, changePhase}) {
  const [socket, setSocket] = useState();
  
  useEffect(() => {
    const socket = io.connect('localhost:3000');
    setSocket(socket)

    socket.on('game joined', ({gameName, playersJoined}) => {
      console.log('players joined', playersJoined)
      createGame({name: gameName, playersJoined, player: playersJoined})
    });

    socket.on('game created', ({gameName, player}) => {
      createGame({name: gameName, playersJoined: 1, player})
    });

    socket.on('begin game', ({deck, players}) => {
      beginGame({deck, players})
    })
    
    socket.on('player joined', () => {
      console.log('got event')
      addPlayer();
    });

    socket.on('flip draw card', () => {
      changePhase({phase: "drawPileSelected", actions: 'flipDrawCard'});
      
    })

  }, []);

  return (
    <div>
      <h2>Cambio</h2>
      <button onClick={() => beginGame({deck: {_stack: ['a1','a2']}, players: [{hand: ['c1','c2','c3','c4']}, {hand: ['a1','a2','a3','a4']},{hand: ['c1','c2','c3','c4']}, {hand: ['a1','a2','a3','a4']}]})}>start game test</button>
      {!game.playing &&  <Menu socket={socket}/>}
      {game.playing && <Game socket={socket}/>}
    </div>
  );
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, {createGame, addPlayer, beginGame, changePhase})(App);
