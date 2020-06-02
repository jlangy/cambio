import React from 'react';
import {connect} from 'react-redux';
import './card.css';
import { CABO, REMOVE_SELECTS, REMOVE_SWAP_CARD, ADD_PEEKED, END_ROUND, CABO_TURN_END, CHANGE_PHASE, UPDATE_CARDS, CHANGE_TURN, ADD_SLAP_SLOT, ADD_SWAP_CARD, UPDATE_SCORES } from '../actions/types';

//dimensions in percent
const CARD_HEIGHT = 11.2;
const CARD_WIDTH = 7.4;
const BOARD_MARGIN = 2;
const CARD_MARGIN = 1;

const cardToImg = {
  'c_1' : 'AC.png',
  'c_2' : '2C.png',
  'c_3' : '3C.png',
  'c_4' : '4C.png',
  'c_5' : '5C.png',
  'c_6' : '6C.png',
  'c_7' : '7C.png',
  'c_8' : '8C.png',
  'c_9' : '9C.png',
  'c_10' : '10C.png',
  'c_11' : 'JC.png',
  'c_12' : 'QC.png',
  'c_13' : 'KC.png',
  'd_1' : 'ace_D.png',
  'd_2' : '2D.png',
  'd_3' : '3D.png',
  'd_4' : '4D.png',
  'd_5' : '5D.png',
  'd_6' : '6D.png',
  'd_7' : '7D.png',
  'd_8' : '8D.png',
  'd_9' : '9D.png',
  'd_10' : '10D.png',
  'd_11' : 'JD.png',
  'd_12' : 'QD.png',
  'd_13' : 'KD.png',
  'h_1' : 'AH.png',
  'h_2' : '2H.png',
  'h_3' : '3H.png',
  'h_4' : '4H.png',
  'h_5' : '5H.png',
  'h_6' : '6H.png',
  'h_7' : '7H.png',
  'h_8' : '8H.png',
  'h_9' : '9H.png',
  'h_10' : '10H.png',
  'h_11' : 'JH.png',
  'h_12' : 'QH.png',
  'h_13' : 'KH.png',
  's_1' : 'AS.png',
  's_2' : '2S.png',
  's_3' : '3S.png',
  's_4' : '4S.png',
  's_5' : '5S.png',
  's_6' : '6S.png',
  's_7' : '7S.png',
  's_8' : '8S.png',
  's_9' : '9S.png',
  's_10' : '10S.png',
  's_11' : 'JS.png',
  's_12' : 'QS.png',
  's_13' : 'KS.png',
  'j_0' : 'joker.jpg'
}

function Card({game, card, socket, dispatch}) {
  function getTop(){
    //In a players hand
    if(card.hand || card.hand === 0){
      let position = (card.hand - (game.player - 1)) % 4;
      position += position < 0 ? 4 : 0; 
      switch (position){
        case 0:
          return `${100 - CARD_HEIGHT - BOARD_MARGIN}%`;
        case 1: 
          //extra subtracted card width adjusts for rotation direction
          return `${(50 - (CARD_WIDTH + CARD_MARGIN) * 2 - CARD_WIDTH ) + card.handPosition * (CARD_WIDTH + CARD_MARGIN)}%`;
        case 2:
          return `${BOARD_MARGIN}%`;
        case 3:
          return `${(50 - (CARD_WIDTH + CARD_MARGIN) * 2 ) + card.handPosition * (CARD_WIDTH + CARD_MARGIN)}%`;
        default:
          console.log('error in getTop switch statement', card.hand + 1);
      }
    } else if(card.discard || card.discard === 0 || card.draw || card.draw === 0){
      return '35%';
    } else {
      console.log('error in get top, card has no placement', card)
    }
  }

  function getLeft(){
    if(card.hand || card.hand === 0){
      let position = (card.hand - (game.player - 1));
      position += position < 0 ? 4 : 0; 
      switch (position){
        case 0:
          return `${(50 - (CARD_WIDTH + CARD_MARGIN) * 2 ) + card.handPosition * (CARD_WIDTH + CARD_MARGIN)}%`;
        case 1: 
          return `${100 - CARD_HEIGHT - BOARD_MARGIN}%`;
        case 2:
          return `${(50 - (CARD_WIDTH + CARD_MARGIN) * 2 ) + card.handPosition * (CARD_WIDTH + CARD_MARGIN)}%`;
        case 3:
          return `${CARD_HEIGHT + BOARD_MARGIN}%`;
        default:
          console.log('error in getTop switch statement');
      }
    } else if (card.discard || card.discard === 0){
      return '40%';
    } else if(card.draw || card.draw === 0){
      return "50%";
    } else {
      console.log('error in getLeft, card has no placement')
    }
  }

  function getRotation(){
    if(card.hand || card.hand === 0){
      let position = (card.hand - (game.player - 1));
      position += position < 0 ? 4 : 0; 
      switch (position){
        case 0:
          return ``;
        case 1: 
          return 'rotate(90deg)';
        case 2:
          return ``;
        case 3:
          return `rotate(-90deg)`;
        default:
          console.log('error in getTop switch statement');
      }
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
    return card.discard ? card.discard + 2 : '2';
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

  function swapHandCards(hand1, handPosition1, hand2, handPosition2){
    const newCards = [...game.cards];
    const swapCardIndex = getHandCardIndex(hand1, handPosition1);
    const currentCardIndex = getHandCardIndex(hand2, handPosition2);
    newCards[swapCardIndex] = {...newCards[swapCardIndex], hand: hand2, handPosition: handPosition2}
    newCards[currentCardIndex] = {...newCards[currentCardIndex], hand: hand1, handPosition: handPosition1}
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

  function getHandValues(){
    const handValues = game.players.map((player,i) => {
      const handValue = game.cards.filter(card => card.hand === i).reduce((total,card) => {
        let cardValue = Number(card.value.split('_')[1]);
        if(cardValue > 10){
          //red kings worth -1, all other face cards worth 10
          cardValue = (card.value === "h_13" || card.value === "d_13") ? -1 : 10;
        }
        return total + cardValue;
      }, 0);
      return handValue;
    });
    return handValues;
  }

  function checkRoundEnd(){
    if(game.cabo){
      if(game.turnsRemaining === 1){
        let caboSuccess = true;
        let gameOver = false;
        const handValues = getHandValues();

        if(handValues.some(score => score < handValues[game.cabo - 1])){
          handValues[game.cabo - 1] += 10;
          caboSuccess = false;
        }

        const newPlayers = game.players.map((player,i) => ({...player, score: player.score + handValues[i]}))
        if(newPlayers.some(player => player.score > 50)){
          gameOver = true;
        }

        dispatch({type: END_ROUND, caboSuccess, gameOver, newPlayers});
        socket.emit('end round', {roomName: game.name, gameOver, newPlayers, caboSuccess})
      } else {
        dispatch({type: CABO_TURN_END});
        socket.emit('cabo turn end', {roomName: game.name});
      }
    }
  }

  const activePlayersHand = card.hand + 1 === game.player;
  
  const activeSlappersHand = card.hand + 1 === game.slapTurn;

  function getNextHandSlot(hand, cards){
    const handCards = cards.filter(card => card.hand === hand);
    let topIndex = 0;
    handCards.forEach(card => {
      topIndex = card.handPosition > topIndex ? card.handPosition + 1 : topIndex;
    });
    return topIndex;
  }

  function changeTurn(newCards){
    if(newCards){
      updateCards(newCards, true);
    }
    setTimeout(() => {
      socket.emit("change turn", {roomName: game.name});
      dispatch({type: CHANGE_TURN});
      checkRoundEnd();
    }, 1000);
  }

  function highlightCard(hand, handPosition, success){
    const newCards = [...game.cards];
    const cardIndex = getHandCardIndex(hand, handPosition);
    newCards[cardIndex] = {...newCards[cardIndex], highlight: success};
    return newCards;
  }

  function flipCard(hand, handPosition){
    const newCards = [...game.cards]
    const cardIndex = getHandCardIndex(hand, handPosition)
    newCards[cardIndex] = {...newCards[cardIndex], flipped: !newCards[cardIndex].flipped}
    dispatch({type: UPDATE_CARDS, cards: newCards});
  }

  function updateCards(cards, emit){
    dispatch({type: UPDATE_CARDS, cards});
    emit && socket.emit('update cards', {cards, roomName: game.name});
  }

  function updatePhase(phase, emit){
    dispatch({type: CHANGE_PHASE, phase})
    emit && socket.emit('change phase', {roomName: game.name, phase})
  }

  function viewCardAction(endTurn = true){
    updatePhase('inactive', true);
    socket.emit('highlight', {hand: card.hand, handPosition: card.handPosition, success: true, roomName: game.name});
    flipCard(card.hand, card.handPosition);
    setTimeout(() => {
      //game state stale from pre-flip, just re-use it to flip back
      updateCards(game.cards);
      socket.emit('remove highlight', {roomName: game.name})
      if(endTurn){
        changeTurn();
      }
    }, 2000);
  }

  function swapCardAction(){
    if(!game.swapCard){
      socket.emit('highlight', {hand: card.hand, handPosition: card.handPosition, success: true, roomName: game.name});
      const newCards = highlightCard(card.hand, card.handPosition, true);
      dispatch({type: UPDATE_CARDS, cards: newCards})
      return dispatch({type: ADD_SWAP_CARD, hand: card.hand, handPosition: card.handPosition})
    } 
    //Ignore click if same as first card
    if(game.swapCard.hand === card.hand && game.swapCard.handPosition === card.handPosition){
      return;
    }
    const newCards = swapHandCards(card.hand, card.handPosition, game.swapCard.hand, game.swapCard.handPosition);
    updateCards(newCards, true);
    dispatch({type: REMOVE_SWAP_CARD});
    dispatch({type: REMOVE_SELECTS});
    changeTurn();
  }

  function handleHandCardClick(){
    console.log(game.gamePhase)
    switch (game.gamePhase){

      case 'peeking':
        if(game.peeked === 1 && game.peekedCard.handPosition === card.handPosition){
          return;
        }
        if(!activePlayersHand){
          return console.log('can only peek at own hand')
        }
        flipCard(card.hand, card.handPosition);
        dispatch({type: ADD_PEEKED, peeked: {hand: card.hand, handPosition: card.handPosition}});
        //If peeking second card, set phase to inactive and flip cards back after 2s
        if(game.peeked === 1){
          updatePhase('inactive');
          setTimeout(() => {
            //Using stale state to advantage here
            flipCard(game.peekedCard.hand, game.peekedCard.handPosition);
            socket.emit('finished peeking', {roomName: game.name})
          }, 2000);
        }
        break;
      
      case 'drawCardSelected':
        if(card.hand + 1 === game.player)
        {
          let newCards = moveDrawCardToHand(card.hand, card.handPosition, game.cards);
          newCards = moveHandCardToDiscard(card.hand, card.handPosition, newCards);
          changeTurn(newCards);
        }
        break;

      case 'discardCardSelected':
        if(card.hand + 1 === game.player)
        {
          let newCards = moveDiscardCardToHand(card.hand, card.handPosition, game.cards);
          newCards = moveHandCardToDiscard(card.hand, card.handPosition, newCards);
          changeTurn(newCards);
        }
        break;

      case 'slap selection':
        {
          if(game.slapTurn !== game.player){
            return console.log('not the slappers turn');
          }
          //Compare selected card with slapped card
          const cardNumber = card.value.split('_')[1];
          const drawNumber = game.cards[getTopDrawCardIndex()].value.split('_')[1];
          if(cardNumber === drawNumber){
            const newCards = moveHandCardToDiscard(card.hand, card.handPosition, game.cards);
            updateCards(newCards, true);
            if(game.cards.filter(gameCard => gameCard.hand === game.player - 1).length === 1){
              dispatch({type: CABO, player: game.player});
              socket.emit('cabo', {roomName: game.name, player: game.player})
            }
            //If another players card selected, save the slot location and change phase for player to replace it
            if(card.hand + 1 !== game.slapTurn){
              updatePhase('slap replacement', true);
              dispatch({type: ADD_SLAP_SLOT, hand: card.hand, handPosition: card.handPosition});
            } else {
              updatePhase('drawCardSelected', true);
            }
          } else {
            //Player Guessed incorrectly. Gets an extra draw card as penaltys
            const handPosition = getNextHandSlot(game.slapTurn - 1, game.cards);
            const newCards = moveSecondDrawCardToHand(game.slapTurn - 1, handPosition, game.cards);
            updateCards(newCards, true);
            updatePhase('drawCardSelected', true);
          }
        }
        break;

      case 'slap replacement':
        {
          if(!activeSlappersHand){
            return console.log('not your turn to replace slap card');
          }
          let newCards = moveHandCardToHand(card.hand, card.handPosition, game.slapSlot.hand, game.slapSlot.handPosition, game.cards);
          updatePhase('drawCardSelected', true);
          updateCards(newCards, true);
        }
        break;
      
      case 'peek':
        if(activePlayersHand){
          viewCardAction();
        }
        break;

      case 'spy':
        if(!activePlayersHand){
          viewCardAction();
        }
        break;

      case 'swap':
        swapCardAction();
        break;

      case 'spy and swap: peek':
        if(activePlayersHand){
          viewCardAction(false);
          setTimeout(() => {
            updatePhase('spy and swap: spy', true)
          }, 2100);
        }
        break;

      case 'spy and swap: spy':
        if(!activePlayersHand){
          viewCardAction(false)
          setTimeout(() => {
            updatePhase('spy and swap: swap', true)
          }, 2100);
        }
        break;

      case 'spy and swap: swap':
        swapCardAction();
        break;

      default:
        console.log('default');
    }
  }

  function handleDrawCardClick(){
    if(game.gamePhase === "initialCardPick"){
      socket.emit('slapping on', {roomName: game.name});
    }
  }

  function evaluateAction(card){
    const cardNumber = card.value.split('_')[1];
    if(cardNumber === "7" || cardNumber === "8"){
      if(game.cards.filter(gameCard => gameCard.hand === game.player - 1).length === 0){
        changeTurn();
      }
      updatePhase('peek', true)
      //PEEK
    } else if(cardNumber === "9" || cardNumber === "10"){
      updatePhase('spy', true)
      //SPY
    } else if(cardNumber === "11" || cardNumber === "12"){
      updatePhase('swap', true)
      //SWAP
    } else if(card.value === "s_13" || card.value === "c_13"){
      if(game.cards.filter(gameCard => gameCard.hand === game.player - 1).length === 0){
        changeTurn();
      }
      updatePhase('spy and swap: peek', true)
      //SPY AND SWAP
    } else {
      changeTurn();
    }
  }

  function handleDiscardClick(){

    if(game.gamePhase === 'drawCardSelected'){
      const newDiscard = {...game.cards[getTopDrawCardIndex()], draw: false, discard: game.cards[getTopDiscardCardIndex()].discard + 1, selected: false}
      const newCards = [...game.cards];
      newCards[getTopDrawCardIndex()] = newDiscard;
      dispatch({type: UPDATE_CARDS, cards: newCards});
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
      if(game.slapTurn === game.player && (game.gamePhase === "slap selection" || game.gamePhase === "slap replacement") && (card.hand || card.hand === 0)){
        return handleHandCardClick()
      } else if(game.gamePhase === 'peeking' && (card.hand || card.hand === 0)){
        return handleHandCardClick();
      }
      return;
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
    <div className={`card-container ${getFlipped() ? 'flipped' : ''} ${card.selected ? 'selected' : ''}`} style={{left: getLeft(), top: getTop(), transform: getRotation(), zIndex: getZIndex()}} onClick={handleClick}>
      <div className={`front ${card.flipped ? 'peek' : ''} ${card.highlight ? 'highlight' : ''}`} style={{backgroundImage: `url(/img/${cardToImg[card.value]})`}}></div>
      <div className={`back ${card.flipped ? 'peek' : ''} ${card.highlight ? 'highlight' : ''}`} style={{backgroundImage: 'url(/img/red_back.png)'}}></div>
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps)(Card);
