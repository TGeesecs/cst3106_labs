// Import state and functions from the main game file
import {
    $rollButton, $diceElements, $rollCountDisplay,
    diceValues, keptDice, rollCount, gameIsOver,
    setDiceValues, setKeptDice,
    incrementRollCount, updatePotentialScores, updateDiceDisplay
} from './yatzyGame.js';

// --- Dice-Specific Logic ---

export function toggleKeep(index) {
    if (rollCount > 0 && !gameIsOver) {
        // Update the state
        setKeptDice(index, !keptDice[index]);
        // Update the UI
        $diceElements[index].toggleClass("kept");
    }
}

export function handleDiceRoll() {
    $rollButton.prop('disabled', true).text("Rolling...");

    let $diceToAnimate = $();
    $diceElements.forEach(($die, index) => {
        if (!keptDice[index]) {
            $diceToAnimate = $diceToAnimate.add($die);
        }
    });

    $diceToAnimate.first().data('isTrigger', true);

    $diceToAnimate
        .animate({ top: '-20px', opacity: 0.4 }, 150, 'swing')
        .animate({ left: '-8px', top: '-15px' }, 60)
        .animate({ left: '8px', top: '-20px' }, 60)
        .animate({ left: '0px', top: '-15px' }, 60)
        .animate({ top: '0px', opacity: 1.0 }, 150, 'swing',
            function () {
                if ($(this).data('isTrigger')) {
                    fetchRollsFromServer();
                    $(this).removeData('isTrigger');
                }
            }
        );
}

// --- Helper Function ---
// This is only used by handleDiceRoll
async function fetchRollsFromServer() {
    try {
        const response = await fetch('/roll-dice');
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const serverDiceValues = await response.json();

        // Create a copy of the current dice values
        const newDiceValues = [...diceValues];
        for (let i = 0; i < newDiceValues.length; i++) {
            if (!keptDice[i]) {
                newDiceValues[i] = serverDiceValues[i];
            }
        }
        // Update the global state
        setDiceValues(newDiceValues);

        // Update game state
        incrementRollCount();
        updateDiceDisplay();
        updatePotentialScores();

    } catch (error) {
        console.error("Failed to fetch dice rolls:", error);
        $rollCountDisplay.text("Error!");
        alert("Failed to connect to the server. Please check your connection and try again.");
    } finally {
        if (rollCount < 3) {
            $rollButton.prop('disabled', false);
        }
        $rollButton.text("Roll Dice");
    }
}