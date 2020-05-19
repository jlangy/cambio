import React from 'react';
import { connect } from 'react-redux';
import Player from './Player';
import Deck from './Deck';
import './game.css'

function Game({game, socket}) {

  return (
    <div className="game-container">
      <Deck deck={game.deck} discards={game.discards} flippable={game.turn === game.player} socket={socket}/>
      {game.players.map((player,i) => <Player hand={player.hand} key={i} position={i} />)}
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, null)(Game);
