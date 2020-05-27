import React from 'react';
import { connect } from 'react-redux';
import Card from './Card';
import './game.css'
import Player from './Player'

function Game({game, socket, dispatch}) {
  
  return (
    <div className="game-container">
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
