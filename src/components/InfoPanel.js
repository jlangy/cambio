import React from 'react';
import './infoPanel.css';
import { connect } from 'react-redux';
import { CABO } from '../actions/types';
import ProgressBar from './ProgressBar';


function InfoPanel({game, dispatch, socket, slapCounter}) {
  
  function handleCabo(){
    if(game.turn === game.player && game.gamePhase === "initialCardPick" && !game.cabo){
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
      case 'slapping':
        return 'Slapping phase! Hit spacebar if you know a matching card in any players hand.'
      default:
        return 'should probs have a message here'
    }
  }
  
  function gamePhaseMessage(){
    switch (game.gamePhase){
      case 'initialCardPick':
        return `Choosing Draw/Discard Card`
      case 'peeking':
        return `Select Own Card`
      case 'drawCardSelected':
        return `Draw Card Selected`
      case 'discardCardSelected':
        return `Discard Card Selected`
      case 'slap selection':
        return `Matching Slap Card`
      case 'slap replacement':
        return `Replacing Slap Discard`
      case 'peek':
        return `Select Own Card`
      case 'spy':
        return `Select Others Card`
      case 'swap':
        return `Selecting Swap Card`
      case 'spy and swap: peek':
        return `Select Own Card`
      case 'spy and swap: spy':
        return `Select Others Card`
      case 'spy and swap: swap':
        return `Selecting Swap Card`
      case 'inactive':
        return 'Waiting...'
      case 'slapping':
        return 'Slapping'
      default:
        return 'should probs have a message here'
    }
  }

  return (
    <div className="info-panel-container">
      <div id='player-name'>Player: {game.player}</div>
      <div className="message-container">
        <div className="panel-section-title">Player {game.turn}'s turn</div>
        <div id="slap-container" className={game.gamePhase === 'slapping' ? 'slapping-bar-highlight' : ''}>
          <em>Slapping</em>:
          <div className="bar-container">
            {slapCounter && <ProgressBar /> } 
          </div>
        </div>
        <p id="phase-message">{gamePhaseMessage()}</p>
        <p id="message">{gameMessage()}</p>
      </div>  
      <div>
        <h3 className='panel-section-title'>Scores</h3> 
        {game.players.map(({player, score}, i) => <p key={i} className='score-item'>{`Player ${player}: ${score}`}</p>)}
      </div>
      <div id="cambio-btn-container">
        <button id="cambio-btn" onClick={handleCabo} disabled={game.player !== game.turn || game.gamePhase !== 'initialCardPick' || game.cabo}>CAMBIO!</button>
      </div>

    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps)(InfoPanel);
