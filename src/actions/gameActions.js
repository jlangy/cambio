import { NEW_GAME, ADD_PLAYER } from './types';

export const createGame = game => dispatch => {
  dispatch({
      type: NEW_GAME,
      payload: game
    });
}

export const addPlayer = () => dispatch => {
  dispatch({
      type: ADD_PLAYER,
    });
}