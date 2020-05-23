import React, { useEffect, useState, useRef } from 'react';
import io from "socket.io-client";
import './App.css';
import {connect} from 'react-redux';
import Menu from './components/Menu';
import Game from './components/Game'
import { CABO, NEW_GAME, ADD_PLAYER, BEGIN_GAME, CHANGE_PHASE, UPDATE_CARDS, CHANGE_TURN, SELECT_DRAW_CARD, ADD_SLAP_TURN, CABO_TURN_END, END_ROUND } from './actions/types';



function App({game, dispatch}) {
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
      socket = io.connect(window.location.hostname)
      // socket = io.connect('localhost:3000');
      setSavedSocket(socket);
    }

    socket.off();
    console.log('useeffect ran')

    socket.on('game joined', ({roomName, playersJoined}) => {
      dispatch({type: NEW_GAME, name: roomName, playersJoined, player: playersJoined})
    });

    socket.on('cabo turn end', () => {
      dispatch({type: CABO_TURN_END})
    })

    socket.on('draw card taken', ({position}) => {
      console.log(position)
      const hand = document.querySelector(`[data-hand]=hand-${game.turn - 1}`)
    })

    socket.on('game created', ({roomName, player}) => {
      dispatch({type: NEW_GAME, name: roomName, playersJoined: 1, player})
    });

    socket.on('update cards', ({cards}) => {
      dispatch({type: UPDATE_CARDS, cards});
    })

    socket.on('change turn', () => {
      console.log('got change turn event in client')
      dispatch({type: CHANGE_TURN})
    })

    socket.on('peeking over', () => {
      dispatch({type: CHANGE_PHASE, phase: 'initialCardPick'})
    })

    socket.on('begin game', ({cards, players}) => {
      dispatch({type: BEGIN_GAME, cards, players})
    })

    socket.on('cabo', () => {
      dispatch({type: CABO})
    })

    socket.on('end round', () => {
      dispatch({type: END_ROUND})
    })

    socket.on('slapping on', () => {
      setSlapCounter(true);
      dispatch({type: SELECT_DRAW_CARD});
      document.addEventListener('keydown', handleKeyPress)
      keypressListener.current = handleKeyPress
      setTimeout(() => {
        document.removeEventListener('keydown', handleKeyPress)
        socket.emit('not slapping')
      }, 3000);
    })

    socket.on('no slap', () => {
      setSlapCounter(false)
      console.log('aint noone slapppin')
      dispatch({type: CHANGE_PHASE, phase: 'drawCardSelected'})
      //change to appropriate game phase
    })
    //DO EVERYTHING IN REDUCER< MAKE LIFE EASY
    
    socket.on('player joined', () => {
      console.log('got event')
      dispatch({type: ADD_PLAYER});
    });

    socket.on('change phase', ({phase}) => {
      dispatch({type: CHANGE_PHASE, phase})
    })

    socket.on('slapped', ({player}) => {
      console.log(`${player} just slapped`)
      setSlapCounter(false);
      dispatch({type: CHANGE_PHASE, phase: 'slap selection'})
      dispatch({type: ADD_SLAP_TURN, player})
      document.removeEventListener('keydown', keypressListener.current)
    });

  }, [game, savedSocket, handleKeyPress]);

  return (
    <div>
      <h2>Cambio</h2>
      {slapCounter && <h1 style={{position: 'absolute'}}>HI THIS IS TH SLAP COUNTER</h1>}
      <button onClick={() => dispatch({type: BEGIN_GAME, deck: {_stack: ['a1','a2']}, discards: ['a1','a2'], players: [{hand: ['c1','c2','c3','c4']}, {hand: ['a1','a2','a3','a4']}]})}>start game test</button>
      {!game.playing &&  <Menu socket={savedSocket}/>}
      {game.playing && <Game socket={savedSocket}/>}
    </div>
  );
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps)(App);
