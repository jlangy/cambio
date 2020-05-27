import React, {useState, useEffect} from 'react';
import './infoPanel.css';
import { connect } from 'react-redux';
import { CABO, CHANGE_NAME } from '../actions/types';
import ProgressBar from './ProgressBar';


function InfoPanel({game, dispatch, socket, slapCounter}) {
  
  const [editing, setEditing] = useState();
  const [name, setName] = useState(`Player ${game.player}`);

  function handleCabo(){
    if(game.turn === game.player && game.gamePhase === "initialCardPick" && !game.cabo){
      dispatch({type: CABO})
      socket.emit('cabo', {roomName: game.name})
    }
  }

  useEffect(() => {
    if(editing){
      const input = document.getElementById('player-name-input');
      input.focus();
    }
  }, [editing])

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

  const handleClick = () => {
    // console.log(document.getElementById('player-name-input'))
    // document.getElementById('player-name-input').focus();
    if(editing){
      console.log(game.player, name)
      dispatch({type: CHANGE_NAME, name, player: game.player});
    }
    setEditing(prev => !prev);
  }

  return (
    <div className="info-panel-container">
      <div id="player-name">
        <input id="player-name-input" value={name} disabled={!editing} onChange={(e) => setName(e.target.value)}focus={editing}/>
        <i className={`fas ${editing ? 'fa-check' : 'fa-edit'} edit-btn`} onClick={handleClick}></i>
      </div>

      <div className="panel-item">
        <div className="panel-title">Active Player: </div> 
        <p className="panel-content"> {game.turn}</p>
      </div>

      <div className="panel-item">
        <p className='panel-title'>Current Action:</p>
        <p className="panel-content action-content"> {gamePhaseMessage()}</p>
      </div>
      
      <div className="panel-item">
        <p className='panel-title'>Action Information:</p>
        <p className="panel-content gamephase-msg"> {gameMessage()}</p>
      </div>
      
      <div className='panel-item'>
        <em className="panel-title">Slapping Timer</em>:
        <div className={`bar-container ${slapCounter ? 'bar-container-highlight' : ''}`}>
          {slapCounter && <ProgressBar /> } 
        </div>
      </div>

      <div className='panel-item'>
        <em className="panel-title">Game Round:</em>
        <p className='panel-content'>{game.round}</p>
      </div>

      <div className="panel-item">
        <h3 className='panel-title'>Scores:</h3> 
        {game.players.map(({player, score}, i) => 
        <div className="score-container">
          <p key={i} className='score-name'>{`${player}`}</p>
          <span className="dots"></span>
          <p key={i} className='score-value'>{`${score}`}</p>
        </div>  
        )}
      </div>

      <div id="cambio-btn-container">
        
        <div className='panel-item'>
        {!game.cabo ? <p className="panel-title">No one has knocked!</p> : <p className="panel-title">Player {game.player} knocked. {game.turnsRemaining === 1 ? "1 turn remainging." : `${game.turnsRemaining} turns remaining.`}</p>}
        </div>
        
        <button id="cambio-btn" onClick={handleCabo} disabled={game.player !== game.turn || game.gamePhase !== 'initialCardPick' || game.cabo}>Knock!</button>
        {/* <button id="cambio-btn" onClick={handleCabo} disabled={true}>Knock!</button> */}
      </div>

    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps)(InfoPanel);
