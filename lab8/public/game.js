// --- Game State Management ---
let diceValues = [1, 1, 1, 1, 1];
let totalScore = 0;
let rollCount = 0;
let keptDice = [false, false, false, false, false];
let roundsLeft = 13;
let gameIsOver = false;

const CATEGORIES = [
    'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
    'threeOfAKind', 'fourOfAKind', 'fullHouse',
    'smallStraight', 'largeStraight', 'chance', 'yatzy'
];

// --- jQuery-fied Element Selectors ---
const $rollButton = $("#rollButton");
const $endGameButton = $("#endGameButton");
const $newGameButton = $("#newGameButton");
const $diceElements = [
    $("#dice1"), $("#dice2"), $("#dice3"), $("#dice4"), $("#dice5")
];
const $rollCountDisplay = $("#rollCount");
const $totalScoreDisplay = $("#totalScore");
const $instructionsButton = $("#instructionsButton");
const $instructionsModal = $("#instructionsModal");
const $closeModalButton = $("#closeModalButton");

// Dynamically built objects
let scoresLocked = {};
const scoreDisplays = {};
const scoreSections = {};


// --- Scoring Logic ---
function getDiceCounts(dice) {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    for (const value of dice) { counts[value]++; }
    return counts;
}
function sumAllDice(dice) {
    return dice.reduce((sum, val) => sum + val, 0);
}
function scoreUpperSection(dice, num) {
    return getDiceCounts(dice)[num] * num;
}
function scoreNOfAKind(dice, n) {
    const counts = getDiceCounts(dice);
    for (const value in counts) {
        if (counts[value] >= n) { return sumAllDice(dice); }
    }
    return 0;
}
function scoreFullHouse(dice) {
    const counts = getDiceCounts(dice);
    let hasThree = false;
    let hasTwo = false;
    for (const value in counts) {
        if (counts[value] === 3) hasThree = true;
        if (counts[value] === 2) hasTwo = true;
    }
    return (hasThree && hasTwo) ? 25 : 0;
}
function scoreSmallStraight(dice) {
    const uniqueDice = new Set(dice);
    if (uniqueDice.has(1) && uniqueDice.has(2) && uniqueDice.has(3) && uniqueDice.has(4)) return 30;
    if (uniqueDice.has(2) && uniqueDice.has(3) && uniqueDice.has(4) && uniqueDice.has(5)) return 30;
    if (uniqueDice.has(3) && uniqueDice.has(4) && uniqueDice.has(5) && uniqueDice.has(6)) return 30;
    return 0;
}
function scoreLargeStraight(dice) {
    const uniqueDice = new Set(dice);
    if (uniqueDice.has(1) && uniqueDice.has(2) && uniqueDice.has(3) && uniqueDice.has(4) && uniqueDice.has(5)) return 40;
    if (uniqueDice.has(2) && uniqueDice.has(3) && uniqueDice.has(4) && uniqueDice.has(5) && uniqueDice.has(6)) return 40;
    return 0;
}
function scoreChance(dice) { return sumAllDice(dice); }
function scoreYatzy(dice) {
    const counts = getDiceCounts(dice);
    for (const value in counts) {
        if (counts[value] === 5) return 50;
    }
    return 0;
}

const SCORING_FUNCTIONS = {
    ones: (dice) => scoreUpperSection(dice, 1),
    twos: (dice) => scoreUpperSection(dice, 2),
    threes: (dice) => scoreUpperSection(dice, 3),
    fours: (dice) => scoreUpperSection(dice, 4),
    fives: (dice) => scoreUpperSection(dice, 5),
    sixes: (dice) => scoreUpperSection(dice, 6),
    threeOfAKind: (dice) => scoreNOfAKind(dice, 3),
    fourOfAKind: (dice) => scoreNOfAKind(dice, 4),
    fullHouse: scoreFullHouse,
    smallStraight: scoreSmallStraight,
    largeStraight: scoreLargeStraight,
    chance: scoreChance,
    yatzy: scoreYatzy
};

// --- Game Logic (With jQuery) ---

function initializeGame() {
    diceValues = [6, 6, 6, 6, 6];
    totalScore = 0;
    rollCount = 0;
    roundsLeft = 13;
    gameIsOver = false;
    keptDice = [false, false, false, false, false];

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

function updateDiceDisplay() {
    $diceElements.forEach(($dieEl, index) => {
        const value = diceValues[index];
        $dieEl.removeClass("face-1 face-2 face-3 face-4 face-5 face-6");
        $dieEl.addClass(`face-${value}`);
        $dieEl.toggleClass('kept', keptDice[index]);
    });
}

function toggleKeep(index) {
    if (rollCount > 0 && !gameIsOver) {
        keptDice[index] = !keptDice[index];
        $diceElements[index].toggleClass("kept");
    }
}

/**
 * handleDiceRoll() with jQuery .animate()
 * This uses a chained animation and a callback to run the animation *before* fetching data. */
function handleDiceRoll() {

    // Disable button with jQuery
    $rollButton.prop('disabled', true).text("Rolling...");

    // 1. Collect all the dice that need to be animated
    let $diceToAnimate = $(); // Create an empty jQuery object
    $diceElements.forEach(($die, index) => {
        if (!keptDice[index]) {
            // .add() builds the collection of dice to animate
            $diceToAnimate = $diceToAnimate.add($die);
        }
    });

    // Mark the first die in the animation set.
    // This die will be responsible for triggering the fetch,
    // ensuring the fetch only happens ONCE.
    $diceToAnimate.first().data('isTrigger', true);

    // 2. Animate all unkept dice with a more pronounced "jump, shake, and land"
    $diceToAnimate
        // Jump up and fade out
        .animate({ top: '-20px', opacity: 0.4 }, 150, 'swing')
        // Shake in the air
        .animate({ left: '-8px', top: '-15px' }, 60)
        .animate({ left: '8px', top: '-20px' }, 60)
        .animate({ left: '0px', top: '-15px' }, 60)
        // Land and fade back in
        .animate({ top: '0px', opacity: 1.0 }, 150, 'swing',

            // This is the CALLBACK function
            // It runs after the last animation is complete, for each die.
            function () {
                // Check if this is the "trigger" die
                if ($(this).data('isTrigger')) {
                    // If yes, fetch the server data
                    fetchRollsFromServer();
                    // Clean up the data attribute
                    $(this).removeData('isTrigger');
                }
            }
        );
}

// This new function holds the server logic,
// to be called *after* the animation.
async function fetchRollsFromServer() {
    try {
        const response = await fetch('/roll-dice');
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const serverDiceValues = await response.json();

        // Merge server values with client's kept dice
        for (let i = 0; i < diceValues.length; i++) {
            if (!keptDice[i]) {
                diceValues[i] = serverDiceValues[i];
            }
        }

        // Update game state
        incrementRollCount();
        updateDiceDisplay();
        updatePotentialScores();

    } catch (error) {
        console.error("Failed to fetch dice rolls:", error);
        $rollCountDisplay.text("Error!");
        alert("Failed to connect to the server. Please check your connection and try again.");
    } finally {
        // Re-enable the button
        if (rollCount < 3) {
            $rollButton.prop('disabled', false);
        }
        $rollButton.text("Roll Dice");
    }
}


function incrementRollCount() {
    if (rollCount < 3) {
        rollCount++;
        $rollCountDisplay.text(rollCount);
    }
    if (rollCount >= 3) {
        $rollButton.prop('disabled', true);
    }
}

function updatePotentialScores() {
    for (const category of CATEGORIES) {
        if (!scoresLocked[category]) {
            const score = SCORING_FUNCTIONS[category](diceValues);
            scoreDisplays[category].text(score);
            scoreSections[category].addClass("selectable");
        }
    }
}

function calculateTotalScore() {
    totalScore = 0;
    for (const category of CATEGORIES) {
        if (scoresLocked[category]) {
            totalScore += parseInt(scoreDisplays[category].text());
        }
    }
    $totalScoreDisplay.text("Total: " + totalScore);
}

function selectScore(category) {
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

function resetTurn() {
    rollCount = 0;
    $rollCountDisplay.text(rollCount);
    keptDice = [false, false, false, false, false];
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

function endGame() {
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


// --- Event Listeners & Initialization (with jQuery) ---

// The code runs once the HTML document is loaded
$(document).ready(function () {

    // Dynamically build element objects and add listeners
    for (const category of CATEGORIES) {
        // Use jQuery to select the elements
        scoreDisplays[category] = $(`#${category}Score`);
        scoreSections[category] = $(`#${category}-section`);

        // Use jQuery's .on() to attach the click listener
        scoreSections[category].on("click", () => selectScore(category));
    }

    // Add other listeners using jQuery
    $rollButton.on("click", handleDiceRoll);
    $endGameButton.on("click", endGame);
    $newGameButton.on("click", initializeGame);

    // Modal listeners
    $instructionsButton.on("click", () => {
        $instructionsModal.removeClass("hidden");
    });
    $closeModalButton.on("click", () => {
        $instructionsModal.addClass("hidden");
    });
    $instructionsModal.on("click", (event) => {
        // Hide if user clicks on the dark overlay (the modal-overlay itself)
        if (event.target === $instructionsModal[0]) {
            $instructionsModal.addClass("hidden");
        }
    });

    // Dice listeners
    $diceElements.forEach(($die, index) => {
        $die.on("click", () => toggleKeep(index));
    });

    // Start the game
    initializeGame();
});