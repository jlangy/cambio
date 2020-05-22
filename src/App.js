import React, { useEffect, useState, useRef } from 'react';
import io from "socket.io-client";
import './App.css';
import {connect} from 'react-redux';
import Menu from './components/Menu';
import { createGame, addPlayer, beginGame, changePhase, updateCards, changeTurn, selectDrawCard, addSlapTurn } from './actions/gameActions';
import Game from './components/Game'



function App({game, createGame, addPlayer, beginGame, changePhase, updateCards, changeTurn, selectDrawCard, addSlapTurn}) {
  const [savedSocket, setSavedSocket] = useState();
  const [slapCounter, setSlapCounter] = useState(false);
  const keypressListener = useRef(null);

  function getTopDrawCardIndex(){
    const numDrawCards = game.cards.filter(card => card.draw || card.draw === 0).length
    return game.cards.findIndex(card => card.draw === numDrawCards - 1)
  }
  
  function handleKeyPress(event){
    if(event.code === "Space"){
      savedSocket.emit('slap', {roomName: game.name, player: game.player})
    }
  }

  useEffect(() => {
    let socket;
    if(savedSocket){
      socket = savedSocket;
    } else {
      console.log('making a socket')
      socket = io.connect('localhost:3000');
      setSavedSocket(socket);
    }

    socket.off();
    console.log('useeffect ran')

    socket.on('game joined', ({roomName, playersJoined}) => {
      createGame({name: roomName, playersJoined, player: playersJoined})
    });

    socket.on('draw card taken', ({position}) => {
      console.log(position)
      const hand = document.querySelector(`[data-hand]=hand-${game.turn - 1}`)
    })

    socket.on('game created', ({roomName, player}) => {
      createGame({name: roomName, playersJoined: 1, player})
    });

    socket.on('update cards', ({cards}) => {
      updateCards({cards});
    })

    socket.on('change turn', () => {
      console.log('got change turn event in client')
      changeTurn()
    })

    socket.on('begin game', ({cards, players}) => {
      console.log('hi')
      beginGame({cards, players})
    })

    socket.on('slapping on', () => {
      setSlapCounter(true);
      selectDrawCard();
      document.addEventListener('keydown', handleKeyPress)
      keypressListener.current = handleKeyPress
      setTimeout(() => {
        document.removeEventListener('keydown', handleKeyPress)
        socket.emit('not slapping')
      }, 1000);
    })

    socket.on('no slap', () => {
      setSlapCounter(false)
      console.log('aint noone slapppin')
      changePhase({phase: 'drawCardSelected'})
      //change to appropriate game phase
    })
    //DO EVERYTHING IN REDUCER< MAKE LIFE EASY
    
    socket.on('player joined', () => {
      console.log('got event')
      addPlayer();
    });

    socket.on('change phase', ({phase}) => {
      changePhase({phase})
    })

    socket.on('slapped', ({player}) => {
      console.log(`${player} just slapped`)
      setSlapCounter(false);
      changePhase({phase: 'slap selection'})
      addSlapTurn({player})
      document.removeEventListener('keydown', keypressListener.current)
    });

  }, [game, savedSocket, handleKeyPress]);

  return (
    <div>
      <h2>Cambio</h2>
      {slapCounter && <h1 style={{position: 'absolute'}}>HI THIS IS TH SLAP COUNTER</h1>}
      <button onClick={() => beginGame({deck: {_stack: ['a1','a2']}, discards: ['a1','a2'], players: [{hand: ['c1','c2','c3','c4']}, {hand: ['a1','a2','a3','a4']}]})}>start game test</button>
      {!game.playing &&  <Menu socket={savedSocket}/>}
      {game.playing && <Game socket={savedSocket}/>}
    </div>
  );
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, {createGame, addPlayer, beginGame, changePhase, updateCards, changeTurn, selectDrawCard, addSlapTurn})(App);
