import React, {useState} from 'react';
import Card from './Card';
import {connect} from 'react-redux';
import { changePhase, discardFromBoard } from '../actions/gameActions'
import './player.css';

function Player({hand, position, game, changePhase, discardFromBoard}) {
  const [flipped, setFlipped] = useState();

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

  //pass in nothing to return to all cards face down
  function flipCard(position = null){
    setFlipped(prev => ({position}))
  }

  function moveCard(elToMove, elToMoveTo){
    const moveToBoundingRect = elToMoveTo.getBoundingClientRect();
    const toMoveBoundingRect = elToMove.getBoundingClientRect();
    const deltaTop = toMoveBoundingRect.top - moveToBoundingRect.top;
    const deltaLeft = toMoveBoundingRect.left - moveToBoundingRect.left;
    elToMove.style.top = (Number(getComputedStyle(elToMove)['top'].slice(0,-2)) - deltaTop) + 'px'
    elToMove.style.left = (Number(getComputedStyle(elToMove)['left'].slice(0,-2)) - deltaLeft) + 'px'
  }

  function returnCardWithoutTransition(card, isBoardCard = true){
    card.style.transition = "none"
    if(isBoardCard){
      //remove transition on parent container, and on the backside for flipping
      card.parentElement.style.transition = "none"
      card.parentElement.querySelector('.back').style.transition = "none"
      card.parentElement.style.top = '0px'
      card.parentElement.style.left = '0px'
      //turn transition back on next tick
      setTimeout(() => {
        card.parentElement.style.transition = ''
        card.parentElement.querySelector('.back').style.transition = ''
      }, 0);
    } else {
      card.style.top = '0px'
      card.style.left = '0px'
      setTimeout(() => {
        card.style.transition = ''
      }, 0);
    }
  }

  function handleClick(event){
    if(game.gamePhase === "drawPileSelected" && game.turn === game.player && position === 0){
      const clickedCard = event.target.parentElement;
      let drawCard = document.getElementsByClassName('card-flip');
      drawCard.length > 1 ? console.error('Something has gone wrong, more than 1 card with .card-flip class') : drawCard = drawCard[0];

      //Move clicked card to discard pile
      moveCard(clickedCard, document.getElementById('discards-container'))

      //Move card from draw pile to selected slot
      moveCard(drawCard, clickedCard)

      //flip cards and update state
      flipCard(event.target.parentElement.getAttribute('data-position'));
      changePhase({phase: 'turn end'});
      const target = event.target;

      setTimeout(() => {
        returnCardWithoutTransition(drawCard, false);
        returnCardWithoutTransition(target);
        flipCard();
        discardFromBoard({position: target.parentElement.getAttribute('data-position')})
      }, 2000);
    }
  }

  const containerStyles = {top,bottom,left,right,transform, transformOrigin}
  return (
    <div className="hand-container" style={containerStyles}>
      {hand.map((card,i) => <Card back={card} key={i} onClick={handleClick} position={i} flipped={flipped && flipped.position == i}/>)}
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, {changePhase, discardFromBoard})(Player);
