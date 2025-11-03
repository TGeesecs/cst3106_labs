export default class Dice {
  /**
   * @param {number} numDice - how many dice to manage (default 5 for Yatzy)
   */
  constructor(numDice = 5) {
    this.numDice = numDice;
    this.values = Array.from({ length: numDice }, () => 1);
    this.held = Array.from({ length: numDice }, () => false);
  }

  /**
   * Roll all non-held dice and return the updated values.
   * @returns {number[]} dice values (1..6)
   */
  roll() {
    for (let i = 0; i < this.numDice; i++) {
      if (!this.held[i]) {
        this.values[i] = 1 + Math.floor(Math.random() * 6);
      }
    }
    return [...this.values];
  }

  /**
   * Toggle hold state for a die index.
   * @param {number} index - 0-based die index
   */
  toggleHold(index) {
    if (index < 0 || index >= this.numDice) return;
    this.held[index] = !this.held[index];
  }

  /** Clear all holds. */
  resetHolds() {
    this.held.fill(false);
  }

  /** @returns {number[]} a copy of current values */
  getValues() {
    return [...this.values];
  }

  /** @returns {boolean[]} a copy of held flags */
  getHeld() {
    return [...this.held];
  }

  /** Utility for UI/debug */
  toJSON() {
    return { values: this.getValues(), held: this.getHeld() };
  }
}
