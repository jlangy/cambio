import { CLEAR, NEW_ROUND, TEST_GAME, REMOVE_SWAP_CARD, ADD_PEEKED, END_ROUND, CABO_TURN_END, NEW_GAME, ADD_PLAYER, BEGIN_GAME, CHANGE_PHASE, UPDATE_CARDS, CHANGE_TURN, SELECT_DRAW_CARD, ADD_SLAP_TURN, ADD_SLAP_SLOT, ADD_SWAP_CARD, CABO, CLEAR_HIGHLIGHT, CHANGE_NAME } from '../actions/types';

const initialState = {};

const MAX_SCORE = 100;

function getTopDrawCardIndex(state){
  const numDrawCards = state.cards.filter(card => card.draw || card.draw === 0).length
  return state.cards.findIndex(card => card.draw === numDrawCards - 1)
}

export default function(state = initialState, action){
  switch(action.type){
    case CLEAR:
      return {...state, cards: []}
    case CHANGE_NAME:
      {
        const {name, player} = action;
        const newPlayers = [...state.players];
        newPlayers[player - 1] = {...newPlayers[player - 1], player: name}
        return {...state, players: newPlayers}
      }
    case NEW_ROUND:
      {
        const {cards} = action;
        return {...state, cabo: false, turnsRemaining: null, roundOver: false, peeked: 0, cards, gamePhase: 'peeking', round: state.round + 1, turn: (state.round + 1) % (state.totalPlayers) || state.totalPlayers}
      }
    case TEST_GAME:
      return {
        name: 'test',
        gamePhase: 'peeking', 
        totalPlayers: 4,
        playersJoined: 4,
        player: 1,
        turn: 1,
        players: [
          {player: 1, score: 0},
          {player: 2, score: 0},
          {player: 3, score: 0},
          {player: 4, score: 0}
        ],
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
          {hand: 2, handPosition: 0, value: 'd_1'},
          {hand: 2, handPosition: 1, value: 'd_1'},
          {hand: 2, handPosition: 2, value: 'd_1'},
          {hand: 2, handPosition: 3, value: 'd_1'},
          {hand: 3, handPosition: 0, value: 'd_1'},
          {hand: 3, handPosition: 1, value: 'd_1'},
          {hand: 3, handPosition: 2, value: 'd_1'},
          {hand: 3, handPosition: 3, value: 'd_1'},
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
        const {cards} = action;
        const players = [];
        for(let i = 0; i < state.totalPlayers; i++){
          players.push({player: i+ 1, score: 0})
        }
        return {...state, playing: true, cards, turn: 1, players, gamePhase: 'peeking', peeked: 0, round: 1}
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
      const newPlayers = state.players.map((player,i) => {
        const playerScore = state.cards.filter(card => card.hand === i).reduce((total,card) => {
          let cardValue = Number(card.value.split('_')[1]);
          if(cardValue > 10){
            cardValue = 10;
          }
          return total + cardValue;
        }, 0);
        return {...player, score: player.score + playerScore}
      })
      if(newPlayers.some(player => player.score > MAX_SCORE)){
        return {...state, roundOver: true, gameOver: true, players: newPlayers}
      } else {
        return {...state, roundOver: true, players: newPlayers}
      }

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