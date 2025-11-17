import { SCORING_FUNCTIONS } from './yatzyEngine.js';

// --- Game State ---
export let diceValues = [1, 1, 1, 1, 1];
export let totalScore = 0;
export let rollCount = 0;
export let keptDice = [false, false, false, false, false];
export let roundsLeft = 13;
export let gameIsOver = false;
export let scoresLocked = {};

// --- Constants ---
export const CATEGORIES = [
    'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
    'threeOfAKind', 'fourOfAKind', 'fullHouse',
    'smallStraight', 'largeStraight', 'chance', 'yatzy'
];

// --- jQuery Selectors ---
export const $rollButton = $("#rollButton");
export const $endGameButton = $("#endGameButton");
export const $newGameButton = $("#newGameButton");
export const $diceElements = [
    $("#dice1"), $("#dice2"), $("#dice3"), $("#dice4"), $("#dice5")
];
export const $rollCountDisplay = $("#rollCount");
export const $totalScoreDisplay = $("#totalScore");
export const $instructionsButton = $("#instructionsButton");
export const $instructionsModal = $("#instructionsModal");
export const $closeModalButton = $("#closeModalButton");

// Dynamically built objects
export const scoreDisplays = {};
export const scoreSections = {};

// --- State "Setter" Functions ---
// These allow other modules to safely update the state
export function setDiceValues(newValues) {
    diceValues = newValues;
}
export function setKeptDice(index, value) {
    keptDice[index] = value;
}
export function resetKeptDice() {
    keptDice = [false, false, false, false, false];
}

// --- Core Game Logic Functions ---
export function initializeGame() {
    diceValues = [6, 6, 6, 6, 6];
    totalScore = 0;
    rollCount = 0;
    roundsLeft = 13;
    gameIsOver = false;
    resetKeptDice();

    for (const category of CATEGORIES) {
        scoresLocked[category] = false;
        scoreDisplays[category].text(0);
        scoreSections[category].removeClass("locked selectable");
    }

    updateDiceDisplay();
    $rollCountDisplay.text(rollCount);

    $rollButton.prop('disabled', false);
    $endGameButton.removeClass("hidden");
    $newGameButton.addClass("hidden");
    $totalScoreDisplay.text("Total: 0");
    $diceElements.forEach($die => $die.removeClass("kept"));
}

export function incrementRollCount() {
    if (rollCount < 3) {
        rollCount++;
        $rollCountDisplay.text(rollCount);
    }
    if (rollCount >= 3) {
        $rollButton.prop('disabled', true);
    }
}

export function updatePotentialScores() {
    for (const category of CATEGORIES) {
        if (!scoresLocked[category]) {
            const score = SCORING_FUNCTIONS[category](diceValues);
            scoreDisplays[category].text(score);
            scoreSections[category].addClass("selectable");
        }
    }
}

export function calculateTotalScore() {
    totalScore = 0;
    for (const category of CATEGORIES) {
        if (scoresLocked[category]) {
            totalScore += parseInt(scoreDisplays[category].text());
        }
    }
    $totalScoreDisplay.text("Total: " + totalScore);
}

export function selectScore(category) {
    if (rollCount === 0 || scoresLocked[category] || gameIsOver) return;

    scoresLocked[category] = true;
    roundsLeft--;

    scoreSections[category].addClass("locked").removeClass("selectable");

    calculateTotalScore();

    if (roundsLeft > 0) {
        resetTurn();
    } else {
        endGame();
    }
}

export function resetTurn() {
    rollCount = 0;
    $rollCountDisplay.text(rollCount);
    resetKeptDice();
    $rollButton.prop('disabled', false);

    for (const category of CATEGORIES) {
        if (!scoresLocked[category]) {
            scoreDisplays[category].text(0);
            scoreSections[category].removeClass("selectable");
        }
    }

    diceValues = [6, 6, 6, 6, 6];
    updateDiceDisplay();
}

export function endGame() {
    if (gameIsOver) return;
    gameIsOver = true;

    $rollButton.prop('disabled', true);
    $endGameButton.addClass("hidden");
    $newGameButton.removeClass("hidden");

    for (const category of CATEGORIES) {
        if (!scoresLocked[category]) {
            scoreSections[category].addClass("locked").removeClass("selectable");
        }
    }

    calculateTotalScore();
    alert(`Game Over! Your final score is: ${totalScore}`);
}
export function updateDiceDisplay() {
    $diceElements.forEach(($dieEl, index) => {
        const value = diceValues[index];
        $dieEl.removeClass("face-1 face-2 face-3 face-4 face-5 face-6");
        $dieEl.addClass(`face-${value}`);
        $dieEl.toggleClass('kept', keptDice[index]);
    });
}