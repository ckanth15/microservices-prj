// server.js
// A simple Node.js Express API for a To-Do list.

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Use CORS to allow the frontend to access this API.
app.use(cors());
app.use(express.json());

// Initialize a connection pool to the PostgreSQL database.
// The host name 'db' is the service name from our docker-compose.yml file.
const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'mydatabase',
  password: 'password',
  port: 5432,
});

// A function to initialize the database table.
const initializeDb = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE
      );
    `);
    console.log('Database table "tasks" initialized successfully.');
    client.release();
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

// Immediately initialize the database table.
initializeDb();

// GET endpoint to fetch all tasks.
app.get('/tasks', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM tasks ORDER BY id');
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching tasks');
  }
});

// POST endpoint to add a new task.
app.post('/tasks', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send('Task name is required.');
    }
    const client = await pool.connect();
    const result = await client.query('INSERT INTO tasks(name) VALUES($1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding new task');
  }
});

// Start the server.
app.listen(port, () => {
  console.log(`Backend API listening at http://localhost:${port}`);
});

