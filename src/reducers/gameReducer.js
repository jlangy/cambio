import { NEW_GAME, ADD_PLAYER, BEGIN_GAME, CHANGE_PHASE, DISCARD_FROM_BOARD, UPDATE_CARDS, CHANGE_TURN, SELECT_DRAW_CARD, ADD_SLAP_TURN, ADD_SLAP_SLOT } from '../actions/types';

const initialState = {};

function getTopDrawCardIndex(state){
  const numDrawCards = state.cards.filter(card => card.draw || card.draw === 0).length
  return state.cards.findIndex(card => card.draw === numDrawCards - 1)
}

export default function(state = initialState, action){
  switch(action.type){
    case NEW_GAME:
      const {name, playersJoined, player} = action.payload;
      return {name, totalPlayers: 2, playersJoined, player}
    case ADD_PLAYER:
      return {...state, playersJoined: state.playersJoined + 1};
    case BEGIN_GAME:
      {
        const {players, cards} = action.payload;
        return {...state, playing: true, cards, players, turn: 1, gamePhase: 'initialCardPick'}
      }
    case CHANGE_PHASE:
      {
        const { phase } = action.payload;
        return {...state, gamePhase: phase}
      }
    case UPDATE_CARDS:
      {
        const {cards} = action.payload;
        return {...state, cards}
      }
    case ADD_SLAP_SLOT:
      {
        const {hand, handPosition} = action.payload;
        return {...state, slapSlot: {hand, handPosition}}
      }
    case CHANGE_TURN:
      const newTurn = state.turn === state.totalPlayers ? 1 : state.turn + 1;
      return {...state, gamePhase: "initialCardPick", turn: newTurn}
    case SELECT_DRAW_CARD:
      const newCards = [...state.cards];
      const drawCardIndex = getTopDrawCardIndex(state);
      newCards[drawCardIndex] = {...newCards[drawCardIndex], selected: true,}
      return {...state, cards: newCards, gamePhase: 'slapping'}
    case ADD_SLAP_TURN:
      {
        const {player} = action.payload;
        return {...state, slapTurn: player}
      }
    default:
      return state;
  }
}