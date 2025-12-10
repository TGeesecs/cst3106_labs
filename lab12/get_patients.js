const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Setup the database connection
const pool = new Pool({
    host: "127.0.0.1",
    port: "5432",
    user: "postgres",
    password: "xy2lbybs",
    database: "emergency_waitlist"
});

// Create the API endpoint
app.get('/patients', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM PATIENTS');
        res.json(result.rows);
        client.release();
    } catch (err) {
        res.status(500).send('Server error');
        console.error('Database error', err.stack);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});