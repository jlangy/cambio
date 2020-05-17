import React from 'react';
import Card from './Card'
import './player.css';

function Player({hand, position}) {
  let top, bottom, right, left, transform, transformOrigin;
  switch (position){
    case 0:
      top = '0px';
      left = '25%';
      break;
    case 1:
      bottom = '0px';
      left = '25%';
      break;
    case 2:
      right = '0px'
      top = '75%'
      transform = 'rotate(90deg)'
      transformOrigin = 'right top'
      break;
    case 3:
      left = '0px'
      top = '75%'
      transform = 'rotate(-90deg)'
      transformOrigin = 'left top'
      break;
  }

  const containerStyles = {top,bottom,left,right,transform, transformOrigin}
  return (
    <div className="hand-container" style={containerStyles}>
      {hand.map((card,i) => <Card back={card} key={i} />)}
    </div>
  )
}

export default Player;
