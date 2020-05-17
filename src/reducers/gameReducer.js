import { NEW_GAME, ADD_PLAYER } from '../actions/types';

const initialState = {};

export default function(state = initialState, action){
  switch(action.type){
    case NEW_GAME:
      const {name, playersJoined} = action.payload;
      return {name, totalPlayers: 2, playersJoined}
    case ADD_PLAYER:
      return {...state, playersJoined: state.playersJoined + 1}
    default:
      return state;
  }
}