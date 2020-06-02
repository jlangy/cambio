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
      dispatch({type: CABO, player: game.player})
      socket.emit('cabo', {roomName: game.name, player: game.player})
    }
  }

  useEffect(() => {
    if(editing){
      const input = document.getElementById('player-name-input');
      input.focus();
    }
  }, [editing])

  const {information, action} = (function gameMessage(){
    const playerName = game.players[game.turn - 1] && game.players[game.turn-1].player;
    const slapName = game.players[game.slapTurn - 1] && game.players[game.slapTurn-1].player;
    switch (game.gamePhase){
      case 'initialCardPick':
        return {information: `${playerName}: Pick a card from the discard pile or the draw pile`, action: `Choosing Draw/Discard Card`}
      case 'peeking':
        return {information: `Game ready. Select two of your cards to see before starting the game.`, action: `Select Own Card`}
      case 'drawCardSelected':
        return {information: `${playerName} selected a draw card. Either discard, or swap it out with one of your cards.`, action: `Draw Card Selected`}
      case 'discardCardSelected':
        return {information: `${playerName} selected the discard card. Swap it out with one of your cards.`, action: `Discard Card Selected`}
      case 'slap selection':
        return {information: `${slapName}: Pick a card that you think matches the draw card.`, action: `Matching Slap Card`}
      case 'slap replacement':
        return {information: `${slapName}: Pick a card from your hand to replace the removed card.`, action: `Replacing Slap Discard`}
      case 'peek':
        return {information: `${playerName}: Select one of your own cards to look at.`, action: `Select Own Card`}
      case 'spy':
        return {information: `${playerName}: Select a different players card to look at.`, action: `Select Others Card`}
      case 'swap':
        return {information: `${playerName}: Select two cards to swap their places.`, action: `Selecting Swap Card`}
      case 'spy and swap: peek':
        return {information: `${playerName}: Select one of your own cards to look at.`, action: `Select Own Card`}
      case 'spy and swap: spy':
        return {information: `${playerName}: Select a different players card to look at.`, action: `Select Others Card`}
      case 'spy and swap: swap':
        return {information: `${playerName}: Select two cards to swap their places.`, action: `Selecting Swap Card`}
      case 'inactive':
        return {information: 'waiting...', action: 'Waiting...'}
      case 'slapping':
        return {information: 'Slapping phase! Hit spacebar if you know a matching card in any players hand.', action: 'Slapping'}
      default:
        return {information: 'No info here', action: 'No action here'}
    }
  })();
 
  const handleClick = () => {
    if(editing){
      dispatch({type: CHANGE_NAME, name, player: game.player});
      socket.emit('change name', {name, player: game.player, roomName: game.name})
    }
    setEditing(prev => !prev);
  }

  return (
    <div className="info-panel-container">
      <div id="player-name">
        <input id="player-name-input" value={name} disabled={!editing} onChange={(e) => setName(e.target.value)} maxLength="12"/>
        <i className={`fas ${editing ? 'fa-check' : 'fa-edit'} edit-btn`} onClick={handleClick}></i>
      </div>

      <div className="panel-item">
        <div className="panel-title">Active Player: </div> 
        <p className="panel-content"> {game.gamePhase === 'peeking' ? 'All players' : game.players[game.turn - 1].player}</p>
      </div>

      <div className="panel-item">
        <p className='panel-title'>Current Action:</p>
        <p className="panel-content action-content"> {action}</p>
      </div>
      
      <div className="panel-item">
        <p className='panel-title'>Action Information:</p>
        <p className="panel-content gamephase-msg"> {information}</p>
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
        <div key={i} className="score-container">
          <p className='score-name'>{`${player}`}</p>
          <span className="dots"></span>
          <p className='score-value'>{`${score}`}</p>
        </div>  
        )}
      </div>

      <div id="cambio-btn-container">
        
        <div className='panel-item'>
        {!game.cabo ? <p className="panel-title">No one has knocked!</p> : <p className="panel-title">Player {game.cabo} knocked. {game.turnsRemaining === 1 ? "1 turn remainging." : `${game.turnsRemaining} turns remaining.`}</p>}
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
