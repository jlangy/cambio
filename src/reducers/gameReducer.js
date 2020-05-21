import { NEW_GAME, ADD_PLAYER, BEGIN_GAME, CHANGE_PHASE, DISCARD_FROM_BOARD, UPDATE_CARDS, CHANGE_TURN } from '../actions/types';

const initialState = {};

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
    case CHANGE_TURN:
      const newTurn = state.turn === state.totalPlayers ? 1 : state.turn + 1;
      return {...state, gamePhase: "initialCardPick", turn: newTurn}
    default:
      return state;
  }
}