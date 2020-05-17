import { NEW_GAME, ADD_PLAYER, BEGIN_GAME } from '../actions/types';

const initialState = {};

export default function(state = initialState, action){
  switch(action.type){
    case NEW_GAME:
      const {name, playersJoined} = action.payload;
      return {name, totalPlayers: 2, playersJoined}
    case ADD_PLAYER:
      return {...state, playersJoined: state.playersJoined + 1};
    case BEGIN_GAME:
      const {players, deck} = action.payload;
      return {...state, playing: true, players, deck}
    default:
      return state;
  }
}