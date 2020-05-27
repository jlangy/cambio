import React from 'react';
import './player.css';
import {connect} from 'react-redux';

function Player({name, index, game}) {

  function getTop(){
    switch (index){
      case game.player - 1 % game.totalPlayers:
        return '80%';
      case (game.player - 1 + 1) % game.totalPlayers: 
        return `39%`;
      case (game.player - 1 + 2) % game.totalPlayers:
        return `19%`;
      case (game.player - 1 + 3) % game.totalPlayers:
        return `61%`;
      default:
        console.log('error in getTop switch statement');
    }
  }

  function getLeft(){
    switch (index){
      case game.player - 1 % game.totalPlayers:
        return '35%';
      case (game.player - 1 + 1) % game.totalPlayers: 
        return `15%`;
      case (game.player - 1 + 2) % game.totalPlayers:
        return `58%`;
      case (game.player - 1 + 3) % game.totalPlayers:
        return `76%`;
      default:
        console.log('error in getTop switch statement');
    }
  }

  function getTransform(){
    switch (index){
      case game.player - 1 % game.totalPlayers:
        return ''
      case (game.player - 1 + 1) % game.totalPlayers: 
        return `rotate(90deg)`;
      case (game.player - 1 + 2) % game.totalPlayers:
        return `rotate(180deg)`;
      case (game.player - 1 + 3) % game.totalPlayers:
        return `rotate(270deg)`;
    }
    return ''
  }

  return (
    <div className="player-name" style={{top: getTop(), left: getLeft(), transform: getTransform()}}>
      Player: {name}
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps)(Player);
