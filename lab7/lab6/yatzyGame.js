import Dice from "./dice.js";
import YatzyEngine, { Categories } from "./yatzyEngine.js";

export default class YatzyGame {
  /**
   * @param {object} options
   * @param {number} options.players - number of players
   * @param {number} options.dice - dice per roll (default 5)
   * @param {number} options.maxRolls - rolls per turn (default 3)
   */
  constructor({ players = 1, dice = 5, maxRolls = 3 } = {}) {
    this.players = Math.max(1, players);
    this.currentPlayerIndex = 0;

    this.maxRolls = maxRolls;
    this.rollsLeft = maxRolls;

    this.dice = new Dice(dice);

    // One engine (score table) per player
    this.engines = Array.from({ length: this.players }, () => new YatzyEngine());

    this.round = 1; // increment when all players have taken a turn (optional)
  }

  /** Reset all game state */
  startNewGame() {
    this.currentPlayerIndex = 0;
    this.rollsLeft = this.maxRolls;
    this.dice = new Dice(this.dice.numDice);
    this.engines = Array.from({ length: this.players }, () => new YatzyEngine());
    this.round = 1;
  }

  /** Roll dice for the current player (if rolls remain). */
  rollDice() {
    if (this.rollsLeft <= 0) return this.dice.getValues();
    const values = this.dice.roll();
    this.rollsLeft -= 1;
    return values;
  }

  /** Toggle hold for a die during current player's turn. */
  holdDie(index) {
    this.dice.toggleHold(index);
  }

  /**
   * Attempt to score a category for the current player.
   * If valid, records score and ends the turn.
   */
  selectCategory(category) {
    const engine = this.engines[this.currentPlayerIndex];
    const values = this.dice.getValues();

    if (!engine.isValidSelection(category, values)) {
      return { ok: false, reason: "Invalid category or already scored." };
    }

    engine.setScore(category, values);
    this.endTurn();
    return { ok: true, score: engine.getScoreTable()[category] };
  }

  /** End turn: advance player, reset dice holds/rolls, and maybe advance round. */
  endTurn() {
    // prepare for next player
    this.dice.resetHolds();
    this.rollsLeft = this.maxRolls;

    // move to next player
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players;

    // optional: when we wrap to player 0, advance round
    if (this.currentPlayerIndex === 0) {
      this.round += 1;
    }
  }

  /** @returns {boolean} true if all categories are filled for all players */
  isGameOver() {
    return this.engines.every((e) =>
      Object.values(e.getScoreTable()).every((v) => v !== null)
    );
  }

  /** Compute winner (highest total). */
  endGame() {
    const totals = this.engines.map((e) => e.getTotalScore());
    const max = Math.max(...totals);
    const winners = totals
      .map((t, i) => ({ i, t }))
      .filter((x) => x.t === max)
      .map((x) => x.i);

    return { totals, winners };
  }

  /** Convenience getters for UI */
  get currentPlayer() {
    return this.currentPlayerIndex + 1;
  }

  get currentScoreTable() {
    return this.engines[this.currentPlayerIndex].getScoreTable();
  }

  get categories() {
    return { ...Categories };
  }
}
