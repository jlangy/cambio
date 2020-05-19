import React from 'react';
import Card from './Card';
import {connect} from 'react-redux';
import './player.css';

function Player({hand, position, game}) {
  let top, bottom, right, left, transform, transformOrigin;
  switch (position){
    case 3:
      top = '0px';
      left = '25%';
      break;
    case 0:
      bottom = '0px';
      left = '25%';
      break;
    case 3:
      right = '0px'
      top = '75%'
      transform = 'rotate(90deg)'
      transformOrigin = 'right top'
      break;
    case 1:
      left = '0px'
      top = '75%'
      transform = 'rotate(-90deg)'
      transformOrigin = 'left top'
      break;
  }

  function handleClick(){
    console.log('handling click')
    if(game.gamePhase === "drawPileSelected" && game.turn === game.player && position === 0){
      console.log('selected card')
    }
  }

  const containerStyles = {top,bottom,left,right,transform, transformOrigin}
  return (
    <div className="hand-container" style={containerStyles}>
      {hand.map((card,i) => <Card back={card} key={i} onClick={handleClick}/>)}
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, null)(Player);
