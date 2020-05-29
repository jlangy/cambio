import React from 'react';
import './player.css';
import {connect} from 'react-redux';

function Player({name, index, game}) {

  function getTop(){
    let position = (index - (game.player - 1));
    position += position < 0 ? 4 : 0; 
    switch (position){
      case 0:
        return '80%';
      case 1: 
        return `61%`;
      case 2:
        return `19%`;
      case 3:
        return `39%`;
      default:
        console.log('error in getTop switch statement');
    }
  }

  function getLeft(){
    let position = (index - (game.player - 1));
    position += position < 0 ? 4 : 0;
    switch (position){
      case 0:
        return '35%';
      case 1: 
        return `76%`;
      case 2:
        return `58%`;
      case 3:
        return `15%`;
      default:
        console.log('error in getTop switch statement');
    }
  }

  function getTransform(){
    let position = (index - (game.player - 1));
    position += position < 0 ? 4 : 0; 
    switch (position){
      case 0:
        return ''
      case 1: 
        return `rotate(-90deg)`;
      case 2:
        return `rotate(-180deg)`;
      case 3:
        return `rotate(-270deg)`;
    }
    return ''
  }

  return (
    <div className="player-name" style={{top: getTop(), left: getLeft(), transform: getTransform()}}>
      {name}
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps)(Player);
