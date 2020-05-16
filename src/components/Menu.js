import React, { useState } from 'react';

function Menu({socket}) {
  const [gameName, setGameName] = useState('');
  const [joinGameName, setJoinGameName] = useState('');
  
  function startGame(){
    socket.emit('start game', {gameName})
  }

  function joinGame(){
    socket.emit('join game', {gameName: joinGameName})
  }

  return (
    <div className="menu-container">
      <input type="text" id="game-name" onChange={e => setGameName(e.target.value)}/>
      <button onClick={startGame}>Start game</button>
      <input type="text" id="game-name" onChange={e => setJoinGameName(e.target.value)}/>
      <button onClick={joinGame}>Join game</button>
    </div>
  )
}

export default Menu; 
