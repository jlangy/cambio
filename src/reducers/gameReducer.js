import { NEW_GAME, ADD_PLAYER, BEGIN_GAME, CHANGE_PHASE, DISCARD_FROM_BOARD } from '../actions/types';

const initialState = {};

export default function(state = initialState, action){
  switch(action.type){
    case NEW_GAME:
      const {name, playersJoined, player} = action.payload;
      return {name, totalPlayers: 2, playersJoined, player}
    case ADD_PLAYER:
      return {...state, playersJoined: state.playersJoined + 1};
    case BEGIN_GAME:
      const {players, deck, discards} = action.payload;
      return {...state, playing: true, discards, players, deck, turn: 1, gamePhase: 'initialCardPick'}
    case CHANGE_PHASE:
      const { phase, actions } = action.payload;
      return {...state, gamePhase: phase, actions}
    case DISCARD_FROM_BOARD:
      const { position } = action.payload;
      const newDiscards = [...state.discards, state.players[state.turn - 1].hand[position]];
      const newDrawPile = {_stack: [...state.deck._stack.slice(0, -1)]};
      const newHand = [...state.players[state.turn - 1].hand]
      console.log(newHand)
      newHand[Number(position)] = state.deck._stack[state.deck._stack.length - 1];
      console.log(newHand)
      const newPlayers = [...state.players];
      newPlayers[state.turn - 1] = {...newPlayers[state.turn - 1], hand: newHand}
      return {...state, discards: newDiscards, deck: newDrawPile, players: newPlayers}
    default:
      return state;
  }
}