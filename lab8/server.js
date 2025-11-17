const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Helper function (moved from game.js)
// Simulates a single dice roll
function rollSingleDice() {
    return Math.floor(Math.random() * 6) + 1;
}

// Serve all your static files (HTML, CSS, JS) from a 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// This endpoint is responsible for "rolling the dice"
app.get('/roll-dice', (req, res) => {
    // Generate an array of 5 random dice values
    const newDiceValues = [];
    for (let i = 0; i < 5; i++) {
        newDiceValues.push(rollSingleDice());
    }
    
    // Send the array back to the client as JSON
    console.log('Server rolled dice:', newDiceValues);
    res.json(newDiceValues);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Yatzy server running on http://localhost:${PORT}`);
});
