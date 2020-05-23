import React, { useState } from 'react';
import {connect} from 'react-redux';
import './card.css';
import { END_ROUND, CABO_TURN_END, CHANGE_PHASE, UPDATE_CARDS, CHANGE_TURN, ADD_SLAP_SLOT, ADD_SWAP_CARD } from '../actions/types';


function Card({game, card, socket, dispatch}) {

  function getTop(){
    //In a players hand
    if(card.hand || card.hand === 0){
      switch (card.hand){
        case game.player - 1 % game.totalPlayers:
          return '85%';
        case (game.player - 1 + 1) % game.totalPlayers: 
          return `${25 + card.handPosition * 10}%`;
        case (game.player - 1 + 2) % game.totalPlayers:
          return `0%`;
        case (game.player - 1 + 3) % game.totalPlayers:
          return `${25 + card.handPosition * 10}%`;
        default:
          console.log('error in getTop switch statement', card.hand + 1);
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
        case game.player - 1 % game.totalPlayers:
          return `${25 + card.handPosition * 10}%`;
        case (game.player - 1 + 1) % game.totalPlayers: 
          return `40px`;
        case (game.player - 1 + 2) % game.totalPlayers:
          return `${25 + card.handPosition * 10}%`;
        case (game.player - 1 + 3) % game.totalPlayers:
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
    if(card.hand === false || card.hand === undefined){
      return ''
    }
    if((card.hand === (game.player - 1) % game.totalPlayers )){
      return '';
    }
    if((card.hand === (game.player) % game.totalPlayers)){
      return 'rotate(90deg)';
    }
    if((card.hand === (game.player + 1) % game.totalPlayers)){
      return '';
    }
    if((card.hand === (game.player + 2) % game.totalPlayers)){
      return 'rotate(-90deg)';
    }
  }

  function getFlipped(){
    if(game.roundOver && !(game.draw || game.draw === 0)){
      return false;
    }
    if(card.discard || card.discard === 0){
      return false;
    } 
    else if(card.selected && (game.gamePhase === 'drawCardSelected' || game.gamePhase === 'slapping' || game.gamePhase === 'slap selection'|| game.gamePhase === 'slap replacement')){
      return false
    }
    else if(card.flipped){
      return false;
    } 
    else {
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

  function getSecondTopDrawCardIndex(){
    const numDrawCards = game.cards.filter(card => card.draw || card.draw === 0).length
    return game.cards.findIndex(card => card.draw === numDrawCards - 2)
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

  function moveSecondDrawCardToHand(hand, handPosition, cards){
    const newCards = [...cards];
    const secondDrawCardIndex = getSecondTopDrawCardIndex();
    const newDrawCardIndex = getTopDrawCardIndex();
    const newHandCard = {...game.cards[secondDrawCardIndex], hand, handPosition, selected: false, draw: false}
    newCards[secondDrawCardIndex] = newHandCard;
    newCards[newDrawCardIndex] = {...newCards[newDrawCardIndex], draw: newCards[newDrawCardIndex].draw - 1}
    return newCards
  }

  function moveHandCardToHand(movingCardHand, movingCardHandPosition, moveToHand, moveToHandPosition, cards){
    const newCards = [...cards];
    const newHandCardIndex = getHandCardIndex(movingCardHand, movingCardHandPosition);
    const newHandCard = {...cards[newHandCardIndex], hand: moveToHand, handPosition: moveToHandPosition}
    newCards[newHandCardIndex] = newHandCard;
    return newCards;
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

  function checkRoundEnd(){
    if(game.cabo){
      if(game.turnsRemaining === 1){
        dispatch({type: END_ROUND});
        socket.emit('end round', {roomName: game.name})
      } else {
        dispatch({type: CABO_TURN_END})
        socket.emit('cabo turn end', {roomName: game.name})
      }
    }
  }

  function endTurn(newCards){
    dispatch({type: UPDATE_CARDS, type: UPDATE_CARDS, cards: newCards})
    socket.emit("update cards", {cards: newCards, roomName: game.name});
    socket.emit("change turn", {roomName: game.name})
    checkRoundEnd();
    dispatch({type: CHANGE_TURN});
  }

  function getTotalCardsInHand(hand, cards){
    return cards.filter(card => card.hand === hand).length
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
    } else if(game.gamePhase === "slap selection" && game.slapTurn === game.player){
      
      const cardNumber = card.value.split('_')[1];
      const drawNumber = game.cards[getTopDrawCardIndex()].value.split('_')[1];

      if(cardNumber === drawNumber){
        const newCards = moveHandCardToDiscard(card.hand, card.handPosition, game.cards);
        dispatch({type: UPDATE_CARDS, cards: newCards})
        
        if(card.hand + 1 !== game.slapTurn){
          dispatch({type: CHANGE_PHASE, phase: 'slap replacement'});
          dispatch({type: ADD_SLAP_SLOT, hand: card.hand, handPosition: card.handPosition});
        } else {
          dispatch({type: CHANGE_PHASE, phase: 'drawCardSelected'})
          socket.emit('change phase', {roomName: game.room, phase: 'drawCardSelected'})
        }
      } else {
        //bad guess
        const handPosition = getTotalCardsInHand(game.slapTurn - 1, game.cards);
        const newCards = moveSecondDrawCardToHand(game.slapTurn - 1, handPosition, game.cards);
        dispatch({type: UPDATE_CARDS, cards: newCards});
        socket.emit('update cards', {cards: newCards, roomName: game.name});
        dispatch({type: CHANGE_PHASE, phase: 'drawCardSelected'})
        socket.emit('change phase', {roomName: game.name, phase: 'drawCardSelected'})
      }
    }
    else if(game.gamePhase === 'slap replacement' && card.hand + 1 === game.slapTurn){
      const newCards = moveHandCardToHand(card.hand, card.handPosition, game.slapSlot.hand, game.slapSlot.handPosition, game.cards);
      dispatch({type: UPDATE_CARDS, cards: newCards});
      dispatch({type: CHANGE_PHASE, phase: 'drawCardSelected'});
      socket.emit('change phase', {roomName: game.name, phase: 'drawCardSelected'})
      socket.emit('update cards', {cards: newCards, roomName: game.name})
    }
    else if(game.gamePhase === 'peek' && card.hand + 1 === game.player){
      const newCards = [...game.cards]
      const cardIndex = getHandCardIndex(card.hand, card.handPosition)
      newCards[cardIndex] = {...newCards[cardIndex], flipped: true}
      dispatch({type: UPDATE_CARDS, cards: newCards});
      setTimeout(() => {
        newCards[cardIndex] = {...newCards[cardIndex], flipped: false}
        dispatch({type: UPDATE_CARDS, cards: newCards});
        socket.emit("change turn", {roomName: game.name})
        checkRoundEnd();
        dispatch({type: CHANGE_TURN});
      }, 2000);
    } else if(game.gamePhase === 'spy' && card.hand + 1 !== game.player){
      dispatch({type: CHANGE_PHASE, phase: 'inactive'})
      const newCards = [...game.cards]
      const cardIndex = getHandCardIndex(card.hand, card.handPosition)
      newCards[cardIndex] = {...newCards[cardIndex], flipped: true}
      dispatch({type: UPDATE_CARDS, cards: newCards});
      setTimeout(() => {
        newCards[cardIndex] = {...newCards[cardIndex], flipped: false}
        dispatch({type: UPDATE_CARDS, cards: newCards});
        socket.emit("change turn", {roomName: game.name});
        checkRoundEnd();
        dispatch({type: CHANGE_TURN});
      }, 2000);
    } else if (game.gamePhase === 'swap'){
      if(!game.swapCard){
        dispatch({type: ADD_SWAP_CARD, hand: card.hand, handPosition: card.handPosition})
      } else {
        if(game.swapCard.hand === card.hand && game.swapCard.handPosition === card.handPosition){
          return;
        }
        const newCards = [...game.cards];
        const swapCardIndex = getHandCardIndex(game.swapCard.hand, game.swapCard.handPosition);
        const currentCardIndex = getHandCardIndex(card.hand, card.handPosition);
        newCards[swapCardIndex] = {...newCards[swapCardIndex], hand: card.hand, handPosition: card.handPosition}
        newCards[currentCardIndex] = {...newCards[currentCardIndex], hand:game.swapCard.hand, handPosition: game.swapCard.handPosition}
        dispatch({type: UPDATE_CARDS, cards: newCards});
        socket.emit('update cards', {cards: newCards, roomName: game.name})
        socket.emit("change turn", {roomName: game.name})
        checkRoundEnd();
        dispatch({type: CHANGE_TURN});
      }
    } else if(game.gamePhase === "spy and swap: peek" && card.hand + 1 === game.player){
      const newCards = [...game.cards]
      const cardIndex = getHandCardIndex(card.hand, card.handPosition)
      newCards[cardIndex] = {...newCards[cardIndex], flipped: true}
      dispatch({type: UPDATE_CARDS, cards: newCards});
      setTimeout(() => {
        newCards[cardIndex] = {...newCards[cardIndex], flipped: false}
        dispatch({type: UPDATE_CARDS, cards: newCards});
        dispatch({type: CHANGE_PHASE, phase: "spy and swap: spy"});
      }, 2000);
    } else if(game.gamePhase === "spy and swap: spy" && card.hand + 1 !== game.player){
      dispatch({type: CHANGE_PHASE, phase: 'inactive'})
      const newCards = [...game.cards]
      const cardIndex = getHandCardIndex(card.hand, card.handPosition)
      newCards[cardIndex] = {...newCards[cardIndex], flipped: true}
      dispatch({type: UPDATE_CARDS, cards: newCards});
      setTimeout(() => {
        newCards[cardIndex] = {...newCards[cardIndex], flipped: false}
        dispatch({type: UPDATE_CARDS, cards: newCards});
        dispatch({type: CHANGE_PHASE, phase: "spy and swap: swap"});
      }, 2000);
    } else if(game.gamePhase === "spy and swap: swap"){
      if(!game.swapCard){
        dispatch({type: ADD_SWAP_CARD, hand: card.hand, handPosition: card.handPosition})
      } else {
        if(game.swapCard.hand === card.hand && game.swapCard.handPosition === card.handPosition){
          return;
        }
        const newCards = [...game.cards];
        const swapCardIndex = getHandCardIndex(game.swapCard.hand, game.swapCard.handPosition);
        const currentCardIndex = getHandCardIndex(card.hand, card.handPosition);
        newCards[swapCardIndex] = {...newCards[swapCardIndex], hand: card.hand, handPosition: card.handPosition}
        newCards[currentCardIndex] = {...newCards[currentCardIndex], hand:game.swapCard.hand, handPosition: game.swapCard.handPosition}
        dispatch({type: UPDATE_CARDS, cards: newCards});
        socket.emit('update cards', {cards: newCards, roomName: game.name})
        socket.emit("change turn", {roomName: game.name})
        checkRoundEnd();
        dispatch({type: CHANGE_TURN});
      }
    }
  }

  function handleDrawCardClick(){
    if(game.gamePhase === "initialCardPick"){
      socket.emit('slapping on', {roomName: game.name});
    }
  }

  function evaluateAction(card){
    const cardNumber = card.value.split('_')[1];
    if(cardNumber === "7" || cardNumber == "8"){
      dispatch({type: CHANGE_PHASE, phase: 'peek'})
      //PEEK
    } else if(cardNumber === "9" || cardNumber == "10"){
      dispatch({type: CHANGE_PHASE, phase: 'spy'})
      //SPY
    } else if(cardNumber === "11" || cardNumber == "12"){
      dispatch({type: CHANGE_PHASE, phase: 'swap'})
      //SWAP
    } else if(card.value === "s_13" || card.value === "c_13"){
      dispatch({type: CHANGE_PHASE, phase: 'spy and swap: peek'})
      //SPY AND SWAP
    } else {
      socket.emit("change turn", {roomName: game.name})
      checkRoundEnd();
      dispatch({type: CHANGE_TURN});
    }
  }

  function handleDiscardClick(){

    if(game.gamePhase === 'drawCardSelected'){
      const newDiscard = {...game.cards[getTopDrawCardIndex()], draw: false, discard: game.cards[getTopDiscardCardIndex()].discard + 1, selected: false}
      const newCards = [...game.cards];
      newCards[getTopDrawCardIndex()] = newDiscard;
      dispatch({type: UPDATE_CARDS, cards: newCards})
      socket.emit("update cards", {cards: newCards, roomName: game.name});
      evaluateAction(newDiscard);

    } else if(game.gamePhase === 'initialCardPick'){
      const newCards = [...game.cards];
      const discardCardIndex = getTopDiscardCardIndex();
      newCards[discardCardIndex] = {...newCards[discardCardIndex], selected: true}
      dispatch({type: UPDATE_CARDS, cards: newCards});
      dispatch({type: CHANGE_PHASE, phase: 'discardCardSelected'});
    }
  }

  function handleClick(){
    if(game.player !== game.turn){
      //Check if during slapping phase, i.e only out of turn play allowed
      if(game.slapTurn === game.player && game.gamePhase === "slap selection" && (card.hand || card.hand === 0)){
        return handleHandCardClick()
      } else {
        return console.log('not yo turn bud')
      }
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
    <div className={`card-container ${getFlipped() ? 'flipped' : ''} ${card.selected ? 'selected' : ''}`} style={{left: getLeft(), top: getTop(), transform: getRotation(), zIndex: getZIndex()}} onClick={handleClick}>
      <div className="front">{card.value}</div>
      <div className="back"></div>
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps)(Card);
