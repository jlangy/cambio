import React from 'react';
import { connect } from 'react-redux';
import Player from './Player';
import Card from './Card';
import './game.css'

function Game({game, socket}) {

  return (
    <div className="game-container">
      {game.cards && game.cards.map((card,i) => <Card key={i} card={card} index={i} socket={socket}/>)}
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, null)(Game);
