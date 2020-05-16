import { NEW_GAME } from '../actions/types';

const initialState = {};

export default function(state = initialState, action){
  switch(action.type){
    case NEW_GAME:
      const {name, playersJoined} = action.payload;
      return {name, totalPlayers: 2, playersJoined}
    default:
      return state;
  }
}