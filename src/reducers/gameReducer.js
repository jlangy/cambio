import { NEW_GAME, ADD_PLAYER, BEGIN_GAME, CHANGE_PHASE } from '../actions/types';

const initialState = {};

export default function(state = initialState, action){
  switch(action.type){
    case NEW_GAME:
      const {name, playersJoined, player} = action.payload;
      return {name, totalPlayers: 2, playersJoined, player}
    case ADD_PLAYER:
      return {...state, playersJoined: state.playersJoined + 1};
    case BEGIN_GAME:
      const {players, deck} = action.payload;
      return {...state, playing: true, players, deck, turn: 1, gamePhase: 'initialCardPick'}
    case CHANGE_PHASE:
      const { phase, actions } = action.payload;
      return {...state, gamePhase: phase, actions}
    default:
      return state;
  }
}