import React, { useState } from 'react';
import {connect} from 'react-redux';
import './card.css';
import { changePhase, updateCards, changeTurn } from '../actions/gameActions'

function Card({game, card, changePhase, index, socket, updateCards, changeTurn}) {

  function getTop(){
    //In a players hand
    if(card.hand || card.hand === 0){
      switch (card.hand){
        case 0:
          return '85%';
        case 1: 
          return `${25 + card.handPosition * 10}%`;
        case 2:
          return `0%`;
        case 3:
          return `${25 + card.handPosition * 10}%`;
        default:
          console.log('error in getTop switch statement');
      }
    } else if(card.discard || card.discard == 0 || card.draw || card.draw == 0){
      return '50%';
    } else {
      console.log('error in get top, card has no placement', card)
    }
  }

  function getLeft(){
    if(card.hand || card.hand === 0){
      switch (card.hand){
        case 0:
          return `${25 + card.handPosition * 10}%`;
        case 1: 
          return `40px`;
        case 2:
          return `${25 + card.handPosition * 10}%`;
        case 3:
          return '100%';
        default:
          console.log('error in getTop switch statement');
      }
    } else if (card.discard || card.discard === 0){
      return '25%';
    } else if(card.draw || card.draw === 0){
      return "50%";
    } else {
      console.log('error in getLeft, card has no placement')
    }
  }

  function getRotation(){
    if(card.hand === 1){
      return 'rotate(90deg)';
    }
    if(card.hand === 2){
      return 'rotate(-90deg)';
    }
  }

  function getFlipped(){
    if(card.discard || card.discard === 0){
      return false;
    } if(card.selected && game.gamePhase === 'drawCardSelected'){
      return false
    } else {
      return true;
    }
  }

  function getZIndex(){
    const topDiscardIndex = game.cards[getTopDiscardCardIndex()] && game.cards[getTopDiscardCardIndex()].discard;
    return card.discard === topDiscardIndex ? '1' : ''
  }

  function getTopDrawCardIndex(){
    const numDrawCards = game.cards.filter(card => card.draw || card.draw === 0).length
    return game.cards.findIndex(card => card.draw === numDrawCards - 1)
  }

  function getTopDiscardCardIndex(){
    const numDiscardCards = game.cards.filter(card => card.discard || card.discard === 0).length
    return game.cards.findIndex(card => card.discard === numDiscardCards - 1)
  }

  function getHandCardIndex(hand, position){
    return game.cards.findIndex(card => card.hand === hand && card.handPosition === position)
  }

  function moveDrawCardToHand(hand, handPosition, cards){
    const newCards = [...cards];
    const drawCardIndex = getTopDrawCardIndex();
    const newHandCard = {...game.cards[drawCardIndex], hand, handPosition, selected: false, draw: false}
    newCards[drawCardIndex] = newHandCard;
    return newCards
  }

  function moveHandCardToDiscard(hand, handPosition, cards){
    const handCardIndex = getHandCardIndex(hand, handPosition);
    const newCards = [...cards];
    //don't increment discard index if swapping out a discard
    const newDiscardIndex = (game.gamePhase === "discardCardSelected" ? game.cards[getTopDiscardCardIndex()].discard: game.cards[getTopDiscardCardIndex()].discard + 1)
    const newDiscard = {...game.cards[handCardIndex], hand: false, handPosition: null, discard: newDiscardIndex}
    newCards[handCardIndex] = newDiscard;
    return newCards
  }

  function moveDiscardCardToHand(hand, handPosition, cards){
    const newCards = [...cards];
    const discardCardIndex = getTopDiscardCardIndex();
    const newHandCard = {...game.cards[discardCardIndex], hand, handPosition, selected: false, discard: false}
    newCards[discardCardIndex] = newHandCard;
    return newCards;
  }

  function endTurn(newCards){
    updateCards({cards: newCards})
    socket.emit("update cards", {cards: newCards, roomName: game.name});
    socket.emit("change turn", {roomName: game.name})
    changeTurn();
  }

  function handleHandCardClick(){
    //If own hand after selecting draw card
    if (game.gamePhase === 'drawCardSelected' && card.hand + 1 === game.player){
      let newCards = moveDrawCardToHand(card.hand, card.handPosition, game.cards);
      newCards = moveHandCardToDiscard(card.hand, card.handPosition, newCards);
      endTurn(newCards);
    } else if(game.gamePhase === 'discardCardSelected' && card.hand + 1 === game.player){
      let newCards = moveDiscardCardToHand(card.hand, card.handPosition, game.cards);
      newCards = moveHandCardToDiscard(card.hand, card.handPosition, newCards);
      endTurn(newCards)
    }
  }

  function handleDrawCardClick(){
    if(game.gamePhase === "initialCardPick"){
      const newCards = [...game.cards];
      const drawCardIndex = getTopDrawCardIndex();
      newCards[drawCardIndex] = {...newCards[drawCardIndex], selected: true}
      updateCards({cards: newCards});
      changePhase({phase: 'drawCardSelected'});
    }
  }

  function handleDiscardClick(){
    if(game.gamePhase === 'drawCardSelected'){
      const newDiscard = {...game.cards[getTopDrawCardIndex()], draw: false, discard: game.cards[getTopDiscardCardIndex()].discard + 1}
      const newCards = [...game.cards];
      newCards[getTopDrawCardIndex()] = newDiscard;
      //TODO: ADD SPECIAL POWERS HERE AND SLAPPING HERE
      endTurn(newCards);
    } else if(game.gamePhase === 'initialCardPick'){
      const newCards = [...game.cards];
      const discardCardIndex = getTopDiscardCardIndex();
      newCards[discardCardIndex] = {...newCards[discardCardIndex], selected: true}
      updateCards({cards: newCards});
      changePhase({phase: 'discardCardSelected'});
    }
  }

  function handleClick(){
    if(game.player !== game.turn){
      return console.log('not yo turn bud')
    }
    //Clicking on draw pile
    if(card.draw || card.draw === 0){
      handleDrawCardClick();
    }

    //If clicking on a hand
    if(card.hand || card.hand === 0){
      handleHandCardClick();
    }
    //Clicking on discard
    if(card.discard || card.discard === 0){
      handleDiscardClick();
    }
  }

  return (
    // <div className={`card-container ${flipped ? 'flipped' : ''} ${(index === game.deck._stack.length-1 && game.actions === "flipDrawCard") ? 'card-flip' : ''}`} onClick={onClick} data-position={position}>
    <div className={`card-container ${getFlipped() ? 'flipped' : ''}`} style={{left: getLeft(), top: getTop(), transform: getRotation(), zIndex: getZIndex()}} onClick={handleClick}>
      <div className="front">{card.value}</div>
      <div className="back"></div>
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, {changePhase, updateCards, changeTurn})(Card);
