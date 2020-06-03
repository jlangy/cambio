import React, { useState } from "react";
import { connect } from "react-redux";
import "./menu.css";

function Menu({ game, socket, joinNameError, setDisconnection }) {
  const [gameName, setGameName] = useState("");
  const [joinGameName, setJoinGameName] = useState("");
  const [numPlayers, setNumPlayers] = useState(2);
  const [createError, setCreateError] = useState("");
  const [joinError, setJoinError] = useState("");

  function startGame() {
    setDisconnection(false);
    if (gameName.length > 3 && gameName.length <= 12) {
      setCreateError("");
      socket.emit("start game", {
        roomName: gameName,
        totalPlayers: numPlayers,
      });
    } else {
      setCreateError("Please use a name between 4 and 12 characters");
    }
  }

  function joinGame() {
    setDisconnection(false);
    if (joinGameName.length > 3 && joinGameName.length <= 12) {
      setJoinError("");
      socket.emit("join game", { roomName: joinGameName });
    } else {
      setJoinError("Please use a name between 4 and 12 characters");
    }
  }

  return (
    <>
      <div className="game-info">
        <h1 className="game-title">Cambio</h1>
        <p className="about-section">
          Welcome to Cambio, a card game for 2-4 players. If you know how to
          play, you can create or join a game using the menu below. Simply enter
          a name to create one and have your friends join the game using that
          name. If the game is new to you, see the rules section below.
        </p>
      </div>
      {game.name && (
        <p className="game-status">
          Game {game.name} created. Waiting for{" "}
          {game.totalPlayers - game.playersJoined} players to join.
        </p>
      )}
      <div className="menu-container">
        <div className="input-box">
          <h2>Create Game</h2>
          <div className="input-container">
            <input
              type="text"
              id="game-name"
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Name of game to create"
              maxLength="12"
            />
            {createError && <p className="error">{createError}</p>}
            <label htmlFor="number-players">
              Select Number of Players (2-4)
            </label>
            <input
              type="number"
              id="number-players"
              min="2"
              max="4"
              placehold="Number of Players"
              value={numPlayers}
              onChange={(e) => setNumPlayers(e.target.value)}
            />
            <button onClick={startGame} disabled={game.name}>
              Start game
            </button>
          </div>
        </div>
        <div className="input-box">
          <h2>Join Game</h2>
          <div className="input-container">
            <input
              type="text"
              id="game-name"
              onChange={(e) => setJoinGameName(e.target.value)}
              placeholder="Name of game to join"
              maxLength="12"
            />
            {joinError && <p className="error">{joinError}</p>}
            {joinNameError && <p className="error">Game name not found.</p>}
            <button onClick={joinGame} disabled={game.name}>
              Join game
            </button>
          </div>
        </div>
      </div>
      <div className="rules-container">
        <h2 className="rules-title">Rules</h2>
        <h3 className="rules-header">Overview:</h3>
        <p className="rules">
          Cambio is a game played by 2-4 players, where the goal is to have the
          lowest score when the game ends. The game is played over rounds where
          each player is dealt 4 face-down cards. Throughout each round players
          will try to trade cards to reduce their score. At then end of each
          round, the players scores are added to their total, and if any players
          score exceeds fifty, the game ends and the player with the lowest
          score wins.
        </p>
        <h3 className="rules-header">Gameplay:</h3>
        <p className="rules">
          To begin a round, each player is allowed to look at two of their own
          cards, the other two remain unknown. During a round, play proceeds in
          clockwise order. The current player can select a card from either the
          face-down draw pile in the center of the game, or the face-up discard
          pile, by clicking on the pile. If selecting from the discard pile, the
          player must swap the discard card with any one of their own cards,
          discarding the card from their hand face-up onto the discard pile.
        </p>
        <p className="rules">
          If selecting from the draw pile, then all players will have an
          opportunity to 'slap' the table by pressing spacebar once the card is
          turned face-up. A player should only slap if they think a card in any
          players hand matches the turned-up card. After slapping, they must
          select the card that they think matches. If they are correct, the
          matching card will be discarded. If the matching card was from the
          slapping players hand, play proceeds as normal. If the matching card
          was in a different players hand, the slapping player can move one of
          their own hand cards to replace it. Either way, if the player matches
          the card successfully they will have 1 fewer cards in their hand. If
          the slapping player incorrectly matches the card, they will receive a
          face-down penalty card from the draw pile, and play will continue as
          normal.
        </p>
        <p className="rules">
          After the slapping phase is over (slapping ends either after 5 seconds
          have elapsed with no one slapping, or any attempt has been made to
          slap), the active player can either discard the turned up card, or
          swap it with one of their own cards, discarding the card from their
          hand. If they swap it with a hand card, their turn is complete and the
          next player can begin their turn. If it is discarded, and the card is
          a joker, ace, 2 through 6, or red king, their turn also ends. If they
          discard a 7 through queen, or black king, they get an extra bonus.
          Discarding a 7 or 8 allows the player to look at one of their own
          cards. Discarding a 9 or 10 allows them to look at one of any other
          players cards. Discarding a Jack or Queen allows them to swap any two
          cards on the board, and finally discarding a black King allows the
          player to look at one of their own cards, one of any other players
          cards, and then swap any two cards on the board. Following the bonus,
          the players turn is complete.
        </p>
        <h3 className="rules-header">Ending the game:</h3>
        <p className="rules">
          Throughout play, any player can "knock" the table at the start of
          their turn by pressing the knock button in the information panel. This
          will give each player one final turn, after which the round will
          conclude and the hands scored. Hands are scored as
          follows: cards 2 through 10 are worth their face value, aces are worth
          1, jokers are worth 0, and all face cards except red kings are worth
          10. The red kings are each worth -1 points. If the knocking player has
          the lowest hand value (including ties), they will receive a -10 point
          bonus. However, if any other player has a lower score, the knocking
          player will recieve a 10 point penalty. The hand scores will be added
          to the players totals, and if no one has more than 50 points, a new
          round will be dealt. If during play, a player manages to discard
          their hand down to 0 cards through slapping correctly, they will
          automatically knock that turn, ending the round.
        </p>
        <p className="rules">
          At any point through the game, players can refer to the information
          panel for instructions on the current round, active player, and action
          to be taken.
        </p>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  game: state.game,
});

export default connect(mapStateToProps)(Menu);
