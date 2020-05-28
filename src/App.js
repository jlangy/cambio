import React, { useEffect, useState, useRef } from 'react';
import io from "socket.io-client";
import './App.css';
import {connect} from 'react-redux';
import Menu from './components/Menu';
import Game from './components/Game';
import InfoPanel from './components/InfoPanel';

import { RESET, TEST_GAME, CLEAR, CABO, NEW_GAME, ADD_PLAYER, BEGIN_GAME, CHANGE_PHASE, UPDATE_CARDS, CHANGE_TURN, SELECT_DRAW_CARD, ADD_SLAP_TURN, CABO_TURN_END, END_ROUND, CLEAR_HIGHLIGHT, NEW_ROUND, REMOVE_SELECTS, CHANGE_NAME } from './actions/types';



function App({game, dispatch}) {
  const [savedSocket, setSavedSocket] = useState();
  const [slapCounter, setSlapCounter] = useState(false);
  const [joinError, setJoinError] = useState(false);
  const keypressListener = useRef(null);
  const [disconnection, setDisconnection] = useState(false);

  // useEffect(() => {
  //   dispatch({type: TEST_GAME})
  // }, [])

  function getHandCardIndex(hand, position){
    return game.cards.findIndex(card => card.hand === hand && card.handPosition === position)
  }

  function highlightCard(hand, handPosition, success){
    const newCards = [...game.cards];
    const cardIndex = getHandCardIndex(hand, handPosition);
    newCards[cardIndex] = {...newCards[cardIndex], highlight: success};
    return newCards;
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
      // socket = io.connect(window.location.hostname)
      socket = io.connect('localhost:3000');
      setSavedSocket(socket);
    }

    socket.off();

    socket.on('game joined', ({roomName, playersJoined, totalPlayers}) => {
      dispatch({type: NEW_GAME, name: roomName, playersJoined, player: playersJoined, totalPlayers})
    });


    socket.on('highlight', ({hand, handPosition, success}) => {
      const newCards = highlightCard(hand, handPosition, success);
      dispatch({type: UPDATE_CARDS, cards: newCards})
    })

    socket.on('player disconnection', () => {
      setDisconnection(true);
      dispatch({type: RESET})
    })

    socket.on('cabo turn end', () => {
      dispatch({type: CABO_TURN_END})
    })

    socket.on('game created', ({roomName, player, totalPlayers}) => {
      dispatch({type: NEW_GAME, name: roomName, playersJoined: 1, player, totalPlayers})
    });

    socket.on('change name', (info) => {
      console.log(info)
      dispatch({type: CHANGE_NAME, name: info.name, player: info.player})
    })

    socket.on('remove highlight', () => {
      dispatch({type: REMOVE_SELECTS})
    })

    socket.on('update cards', ({cards}) => {
      dispatch({type: UPDATE_CARDS, cards});
    })

    socket.on('change turn', () => {
      console.log('got change turn event in client')
      dispatch({type: CHANGE_TURN})
      dispatch({type: CLEAR_HIGHLIGHT})
    });

    socket.on('peeking over', () => {
      dispatch({type: CHANGE_PHASE, phase: 'initialCardPick'})
    });

    socket.on('begin game', ({cards, players}) => {
      dispatch({type: BEGIN_GAME, cards, players})
    });

    socket.on('cabo', ({player}) => {
      console.log(player)
      dispatch({type: CABO, player})
    });

    socket.on('end round', () => {
      dispatch({type: END_ROUND})
    });

    socket.on('slapping on', () => {
      setSlapCounter(true);
      dispatch({type: SELECT_DRAW_CARD});
      document.addEventListener('keydown', handleKeyPress)
      keypressListener.current = handleKeyPress
      setTimeout(() => {
        document.removeEventListener('keydown', handleKeyPress)
        socket.emit('not slapping')
      }, 5000);
    });

    socket.on('no slap', () => {
      setSlapCounter(false)
      console.log('aint noone slapppin')
      dispatch({type: CHANGE_PHASE, phase: 'drawCardSelected'})
      //change to appropriate game phase
    })
    
    socket.on('player joined', () => {
      dispatch({type: ADD_PLAYER});
    });

    socket.on('room DNE', () => {
      setJoinError(true);
    })

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

    socket.on('new round', ({cards}) => {
      dispatch({type: CLEAR});
      setTimeout(() => {
        dispatch({type: NEW_ROUND, cards})
      }, 1000);
    })

  }, [game, savedSocket, handleKeyPress]);

  return (
    <div className='container'>
      {disconnection && <p className='disconnection-msg'>A player disconnected, game has been aborted.</p>}
      {!game.playing &&  <Menu socket={savedSocket} joinNameError={joinError}/>}
      {game.playing && 
        <div className='game-panel-container'>
          <InfoPanel socket={savedSocket} slapCounter={slapCounter}/>
          <Game socket={savedSocket}/>
        </div>
      }
    </div>
  );
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps)(App);
