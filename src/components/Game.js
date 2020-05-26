import React from 'react';
import { connect } from 'react-redux';
import Card from './Card';
import './game.css'
import { CABO } from '../actions/types'

function Game({game, socket, dispatch}) {
  
  return (
    <div className="game-container">
      <p className="title">Cambio</p>
      {game.cards && game.cards.map((card,i) => <Card key={i} card={card} index={i} socket={socket}/>)}
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps)(Game);
