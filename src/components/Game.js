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

  function gameMessage(){
    switch (game.gamePhase){
      case 'initialCardPick':
        return `Player ${game.turn}'s turn, pick a card from the discard pile or the draw pile`
      case 'peeking':
        return `Game ready. Select two of your cards to see before starting the game.`
      case 'drawCardSelected':
        return `Player ${game.turn} selected a draw card. Either discard, or swap it out with one of your cards.`
      case 'discardCardSelected':
        return `Player ${game.turn} selected the discard card. Swap it out with one of your cards.`
      case 'slap selection':
        return `Player ${game.slapTurn} slapped. Pick a card that matches the draw card.`
      case 'slap replacement':
        return `Player ${game.slapTurn} matched the card. Pick a card from your hand to replace it.`
      case 'peek':
        return `Discard power: Player ${game.turn} peeking at one of their own cards`
      case 'spy':
        return `Discard power: Player ${game.turn} spying on another players card`
      case 'swap':
        return `Discard power: Player ${game.turn} swapping two cards`
      case 'spy and swap: peek':
        return `Discard power: Player ${game.turn} peeking at one of their cards`
      case 'spy and swap: spy':
        return `Discard power: Player ${game.turn} spying on another players cards`
      case 'spy and swap: swap':
        return `Discard power: Player ${game.turn} swapping two cards`
      case 'inactive':
        return 'waiting on other player actions'
      default:
        return 'should probs have a message here'
    }
  }
  
  return (
    <div className="game-container">
      <h2 id="message">{gameMessage()}</h2>
      <h2>You are player {game.player}</h2>
      <button onClick={handleCabo} disabled={game.player !== game.turn}>CABO!!!!</button>
      {game.cards && game.cards.map((card,i) => <Card key={i} card={card} index={i} socket={socket}/>)}
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps)(Game);
