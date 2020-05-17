import { NEW_GAME, ADD_PLAYER, BEGIN_GAME } from './types';

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

export const beginGame = playerInfo => dispatch => {
  dispatch({
      type: BEGIN_GAME,
      payload: playerInfo
    });
}