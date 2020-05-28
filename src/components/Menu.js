import React, { useState } from 'react';
import { connect } from 'react-redux';
import './menu.css';

function Menu({game, socket, joinNameError, createNameError}) {
  const [gameName, setGameName] = useState('');
  const [joinGameName, setJoinGameName] = useState('');
  const [numPlayers, setNumPlayers] = useState(2);
  const [createError, setCreateError] = useState('');
  const [joinError, setJoinError] = useState('');
  
  function startGame(){
    if(gameName.length > 3 && gameName.length <= 12){
      setCreateError('');
      socket.emit('start game', {roomName: gameName, totalPlayers: numPlayers})
    } else {
      setCreateError('Please use a name between 4 and 12 characters')
    }
  }

  function joinGame(){
    if(joinGameName.length > 3 && joinGameName.length <=12){
      setJoinError('');
      socket.emit('join game', {roomName: joinGameName})
    } else {
      setJoinError('Please use a name between 4 and 12 characters')
    }
  }

  return (
    <>
    <div className="game-info">
      <h1 className='game-title'>Cambio</h1>
      <p className="about-section">Welcome to Cambio, a card game for 2-4 players. If you know how to play, you can create 
      or join a game using the menu below. Simply enter a name to create one and have your friends join the game using that name. 
      If you don't know how to play, see our rules page.</p>
    </div>
    {game.name && 
      <p className="game-status">
        Game {game.name} created. Waiting for {game.totalPlayers - game.playersJoined} players to join.
      </p>
    }
    <div className="menu-container">
      <div className="input-box">
        <h2>Create Game</h2>
        <div className='input-container'>
          <input type="text" id="game-name" onChange={e => setGameName(e.target.value)} placeholder="Name of game to create" maxLength="12"/>
          {createError && <p className='error'>{createError}</p>}
          <label htmlFor="number-players">Select Number of Players (2-4)</label>
          <input type="number" id="number-players" min="2" max="4" placehold="Number of Players" value={numPlayers} onChange={e => setNumPlayers(e.target.value)}/>
          <button onClick={startGame} disabled={game.name}>Start game</button>
        </div>
      </div>
      <div className="input-box">
        <h2>Join Game</h2>
        <div className='input-container'>
          <input type="text" id="game-name" onChange={e => setJoinGameName(e.target.value)} placeholder="Name of game to join" maxLength="12"/>
          {joinError && <p className='error'>{joinError}</p>}
          {joinNameError && <p className='error'>Game name not found.</p>}
          <button onClick={joinGame} disabled={game.name}>Join game</button>
        </div>
      </div>
    </div>
    </>
  )
}

const mapStateToProps = state => ({
  game: state.game
});

export default connect(mapStateToProps)(Menu); 
