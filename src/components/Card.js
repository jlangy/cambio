import React, { useState } from 'react';
import {connect} from 'react-redux';
import './card.css';

function Card({game, front, back, flippable, index, onClick, flipped, position}) {

  return (
    <div className={`card-container ${flipped ? 'flipped' : ''} ${(index === game.deck._stack.length-1 && game.actions === "flipDrawCard") ? 'card-flip' : ''}`} onClick={onClick} data-position={position}>
      <div className="front">{front}</div>
      <div className="back">{back}</div>
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, null)(Card);
