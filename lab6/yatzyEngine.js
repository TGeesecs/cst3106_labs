export const Categories = {
  ONES: "Ones",
  TWOS: "Twos",
  THREES: "Threes",
  FOURS: "Fours",
  FIVES: "Fives",
  SIXES: "Sixes",
  THREE_KIND: "Three of a Kind",
  FOUR_KIND: "Four of a Kind",
  FULL_HOUSE: "Full House",
  SMALL_STRAIGHT: "Small Straight",
  LARGE_STRAIGHT: "Large Straight",
  CHANCE: "Chance",
  YATZY: "Yatzy",
};

export default class YatzyEngine {
  constructor() {
    // Score table: category -> number | null
    this.scoreTable = Object.fromEntries(
      Object.values(Categories).map((c) => [c, null])
    );
  }

  /**
   * Calculate the score for a given category and dice values.
   * For Lab 06 skeletons, the helpers are complete; extend/adjust per your ruleset.
   * @param {string} category
   * @param {number[]} diceValues - array of ints 1..6
   * @returns {number}
   */
  calculateScore(category, diceValues) {
    const vals = [...diceValues].sort((a, b) => a - b);

    const sum = (arr) => arr.reduce((a, b) => a + b, 0);
    const counts = countByFace(vals);

    switch (category) {
      // Upper section
      case Categories.ONES:   return (counts[1] || 0) * 1;
      case Categories.TWOS:   return (counts[2] || 0) * 2;
      case Categories.THREES: return (counts[3] || 0) * 3;
      case Categories.FOURS:  return (counts[4] || 0) * 4;
      case Categories.FIVES:  return (counts[5] || 0) * 5;
      case Categories.SIXES:  return (counts[6] || 0) * 6;

      // Lower section
      case Categories.CHANCE:
        return sum(vals);

      case Categories.THREE_KIND:
        return hasOfAKind(counts, 3) ? sum(vals) : 0;

      case Categories.FOUR_KIND:
        return hasOfAKind(counts, 4) ? sum(vals) : 0;

      case Categories.FULL_HOUSE:
        // Common rule: 3 of a kind + 2 of a kind
        return isFullHouse(counts) ? 25 : 0;

      case Categories.SMALL_STRAIGHT:
        // 4 in a row (e.g., 1-2-3-4, 2-3-4-5, 3-4-5-6)
        return isSmallStraight(vals) ? 30 : 0;

      case Categories.LARGE_STRAIGHT:
        // 5 in a row (1-2-3-4-5 or 2-3-4-5-6)
        return isLargeStraight(vals) ? 40 : 0;

      case Categories.YATZY:
        return hasOfAKind(counts, 5) ? 50 : 0;

      default:
        return 0;
    }
  }

  isValidSelection(category, diceValues) {
    if (!Object.values(Categories).includes(category)) return false;
    if (this.scoreTable[category] !== null) return false; // already used

    // Optional: stricter checks for some categories (example)
    if (category === Categories.FULL_HOUSE) {
      return isFullHouse(countByFace(diceValues));
    }
    return true;
  }

  /**
   * Record a score into the table (once).
   * @returns {boolean} true if recorded, false otherwise
   */
  setScore(category, diceValues) {
    if (!this.isValidSelection(category, diceValues)) return false;
    this.scoreTable[category] = this.calculateScore(category, diceValues);
    return true;
  }

  /** @returns {number} total score so far */
  getTotalScore() {
    return Object.values(this.scoreTable)
      .filter((v) => typeof v === "number")
      .reduce((a, b) => a + b, 0);
  }

  /** For UI/debug */
  getScoreTable() {
    return { ...this.scoreTable };
  }
}

/* ---------- helpers ---------- */

function countByFace(values) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const v of values) counts[v]++;
  return counts;
}

function hasOfAKind(counts, n) {
  return Object.values(counts).some((c) => c >= n);
}

function isFullHouse(counts) {
  const vals = Object.values(counts);
  return vals.includes(3) && vals.includes(2);
}

function isSmallStraight(sortedVals) {
  // Dedup
  const uniq = [...new Set(sortedVals)];
  const straights = [
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6],
  ];
  return straights.some((s) => s.every((x) => uniq.includes(x)));
}

function isLargeStraight(sortedVals) {
  const uniq = [...new Set(sortedVals)];
  const a = [1, 2, 3, 4, 5];
  const b = [2, 3, 4, 5, 6];
  return (
    uniq.length === 5 &&
    (a.every((x) => uniq.includes(x)) || b.every((x) => uniq.includes(x)))
  );
}
