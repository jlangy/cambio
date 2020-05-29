import React from 'react';
import './player.css';
import {connect} from 'react-redux';

const CARD_HEIGHT = 11.2;
const CARD_WIDTH = 7.4;
const BOARD_MARGIN = 2;
const CARD_MARGIN = 1;
const WRITING_HEIGHT = 4;

function Player({name, index, game}) {

  function getTop(){
    let position = (index - (game.player - 1));
    position += position < 0 ? 4 : 0; 
    switch (position){
      case 0:
        return `${100 - (2*BOARD_MARGIN + CARD_HEIGHT) - WRITING_HEIGHT}%`;
      case 1: 
        return `${(50 + (CARD_WIDTH + CARD_MARGIN) * 2 )}%`;
      case 2:
        return `${(2*BOARD_MARGIN + CARD_HEIGHT) - WRITING_HEIGHT}%`;
      case 3:
        return `${(50 - (CARD_WIDTH + CARD_MARGIN) * 2 )}%`;
      default:
        console.log('error in getTop switch statement');
    }
  }

  function getLeft(){
    let position = (index - (game.player - 1));
    position += position < 0 ? 4 : 0;
    switch (position){
      case 0:
        return `${(50 - (CARD_WIDTH + CARD_MARGIN) * 2 )}%`;
      case 1: 
        return `${100 - 2*BOARD_MARGIN - CARD_HEIGHT}%`;
      case 2:
        return `${(50 + (CARD_WIDTH + CARD_MARGIN) * 2 )}%`;
      case 3:
        return `${2*BOARD_MARGIN + CARD_HEIGHT}%`;
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
