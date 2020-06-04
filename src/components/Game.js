import React from 'react';
import { connect } from 'react-redux';
import Card from './Card';
import './game.css'
import Player from './Player';
import {RESET} from '../actions/types';

function Game({game, socket, dispatch}) {
  function menuClick(){
    dispatch({type: RESET})
    socket.emit('leave', {roomName: game.name})
  }
  return (
    <div className="game-container">
      {game.gameOver && 
        <div className="game-end-info">
          <div>GAMEOVER: {game.players.reduce((a,b) => a.score < b.score ? a : b).player} wins.</div>
          <button id="menu-btn" onClick={menuClick}>Menu</button>
        </div>
      }
      {game.roundOver && 
        <div className='round-end-info'>
          {game.cabod ? `Round Over: ${game.players[game.cabo - 1] && game.players[game.cabo -1 ].player} knocked ${game.caboSuccess ? 'Successfully' : 'Unsuccessfully'}` : 'Round Over'}
        </div>
      }
      <p className="title">Cambio</p>
      {game.players.map((player,i) => <Player name={player.player} key={i} index={i}/>)}
      {game.cards && game.cards.map((card,i) => <Card key={i} card={card} index={i} socket={socket}/>)}
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps)(Game);
