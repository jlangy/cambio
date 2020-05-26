import { TEST_GAME, REMOVE_SWAP_CARD, ADD_PEEKED, END_ROUND, CABO_TURN_END, NEW_GAME, ADD_PLAYER, BEGIN_GAME, CHANGE_PHASE, UPDATE_CARDS, CHANGE_TURN, SELECT_DRAW_CARD, ADD_SLAP_TURN, ADD_SLAP_SLOT, ADD_SWAP_CARD, CABO, HIGHLIGHT, CLEAR_HIGHLIGHT } from '../actions/types';

const initialState = {};

function getTopDrawCardIndex(state){
  const numDrawCards = state.cards.filter(card => card.draw || card.draw === 0).length
  return state.cards.findIndex(card => card.draw === numDrawCards - 1)
}

export default function(state = initialState, action){
  switch(action.type){
    case TEST_GAME:
      return {
        name: 'test',
        gamePhase: 'peeking', 
        totalPlayers: 2,
        playersJoined: 2,
        player: 1,
        turn: 1,
        playing: true,
        cards: [
          {hand: 0, handPosition: 0, value: 'd_1'},
          {hand: 0, handPosition: 1, value: 'd_1'},
          {hand: 0, handPosition: 2, value: 'd_1'},
          {hand: 0, handPosition: 3, value: 'd_1'},
          {hand: 1, handPosition: 0, value: 'd_1'},
          {hand: 1, handPosition: 1, value: 'd_1'},
          {hand: 1, handPosition: 2, value: 'd_1'},
          {hand: 1, handPosition: 3, value: 'd_1'},
          {discard: 0, value: 'd_1'},
          {draw: 0, value: 'd_1'},
          {draw: 2, value: 'd_1'},
          {draw: 3, value: 'd_1'},
          {draw: 4, value: 'd_1'},
          {draw: 5, value: 'd_1'},
          {draw: 6, value: 'd_1'},
          {draw: 7, value: 'd_1'},
          {draw: 8, value: 'd_1'},
        ]
      }
    case NEW_GAME:
      const {name, playersJoined, player} = action;
      return {name, totalPlayers: 2, playersJoined, player}
    case ADD_PLAYER:
      return {...state, playersJoined: state.playersJoined + 1};
    case BEGIN_GAME:
      {
        const {players, cards} = action;
        return {...state, playing: true, cards, players, turn: 1, gamePhase: 'peeking', peeked: 0}
      }
    case CHANGE_PHASE:
      {
        const { phase } = action;
        return {...state, gamePhase: phase}
      }
    case UPDATE_CARDS:
      {
        const {cards} = action;
        return {...state, cards}
      }
    case ADD_SLAP_SLOT:
      {
        const {hand, handPosition} = action;
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
        const {player} = action;
        return {...state, slapTurn: player}
      }
    case ADD_SWAP_CARD:
        return {...state, swapCard: action}
    case CABO:
      return {...state, cabo: state.turn, turnsRemaining: state.totalPlayers}
    case CABO_TURN_END:
      return {...state, turnsRemaining: state.turnsRemaining - 1}
    case END_ROUND:
      return {...state, roundOver: true}
    case ADD_PEEKED: 
      {
        const {hand, handPosition} = action.peeked;
        return {...state, peeked: state.peeked + 1, peekedCard: {hand, handPosition}}
      }
    case REMOVE_SWAP_CARD:
      return {...state, swapCard: null}
    case CLEAR_HIGHLIGHT:
      {
        const newCards = state.cards.map(card => ({...card, highlight: null}))
        return {...state, cards: newCards}
      }
    default:
      return state;
  }
}