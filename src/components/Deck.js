import React from 'react';
import Card from './Card';
import {connect} from 'react-redux';
import './deck.css';
import { changePhase } from '../actions/gameActions'

function Deck({game, changePhase, socket}) {

  const flippable = () => (game.turn === game.player) && (game.gamePhase === "initialCardPick")

  function handleDrawPileClick(){
    if((game.turn === game.player) && game.gamePhase === "initialCardPick"){
      socket.emit('draw pile selected', {roomName: game.name})
    }
  }

  function handleDiscardPileClick(){}

  return (
    <div>
      <div className="deck-container" onClick={handleDiscardPileClick}>
        {game.discards && game.discards._stack.map((card,i) => <Card key={i} back={card} />)}
      </div>
      <div className='deck-container' onClick={handleDrawPileClick}>
        {game.deck && game.deck._stack.map((card,i) => <Card key={i} back={card} index={i}/> )}
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, { changePhase })(Deck);
