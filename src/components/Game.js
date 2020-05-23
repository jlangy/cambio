import React from 'react';
import { connect } from 'react-redux';
import Player from './Player';
import Card from './Card';
import './game.css'
import { CABO } from '../actions/types'

function Game({game, socket, dispatch}) {
  
  function handleCabo(){
    if(game.turn === game.player && game.gamePhase === "initialCardPick"){
      dispatch({type: CABO})
      socket.emit('cabo', {roomName: game.name})
    }
  }
  
  return (
    <div className="game-container">
      <button onClick={handleCabo} disabled={game.player !== game.turn}>CABO!!!!</button>
      {game.cards && game.cards.map((card,i) => <Card key={i} card={card} index={i} socket={socket}/>)}
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps)(Game);
