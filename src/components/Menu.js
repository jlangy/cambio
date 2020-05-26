import React, { useState } from 'react';
import './menu.css';

function Menu({socket}) {
  const [gameName, setGameName] = useState('');
  const [joinGameName, setJoinGameName] = useState('');
  
  function startGame(){
    socket.emit('start game', {roomName: gameName})
  }

  function joinGame(){
    socket.emit('join game', {roomName: joinGameName})
  }

  return (
    <div className="menu-container">
      <div className="input-row">
        <input type="text" id="game-name" onChange={e => setGameName(e.target.value)} placeholder="Name of game to create"/>
        <button onClick={startGame}>Start game</button>
      </div>
      <div className="input-row">
        <input type="text" id="game-name" onChange={e => setJoinGameName(e.target.value)} placeholder="Name of game to join"/>
        <button onClick={joinGame}>Join game</button>
      </div>
    </div>
  )
}

export default Menu; 
