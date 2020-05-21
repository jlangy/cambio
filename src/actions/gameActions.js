import { NEW_GAME, ADD_PLAYER, BEGIN_GAME, CHANGE_PHASE, DISCARD_FROM_BOARD, UPDATE_CARDS } from './types';

//Game phases:
//_initialCardPick
//discardSwap
//drawCardSwap

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

export const changePhase = phaseInfo => dispatch => {
  dispatch({
      type: CHANGE_PHASE,
      payload: phaseInfo
    });
}

export const discardFromBoard = phaseInfo => dispatch => {
  dispatch({
      type: DISCARD_FROM_BOARD,
      payload: phaseInfo
    });
}

export const updateCards = phaseInfo => dispatch => {
  dispatch({
      type: UPDATE_CARDS,
      payload: phaseInfo
    });
}