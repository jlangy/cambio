import React from 'react';
import { connect } from 'react-redux';
import Player from './Player';
import './game.css'

function Game({game}) {
  return (
    <div className="game-container">
      {game.players.map((player,i) => <Player hand={player.hand} key={i} position={i} />)}
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, null)(Game);
