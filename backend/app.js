// backend/app.js

const express = require('express');
const cors = require('cors');
const { pool } = require('./db'); // Import pool from db.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.send('OK'));

// Import and use portfolio routes
const portfolioRoutes = require('./routes/portfolio');
app.use('/portfolio', portfolioRoutes);

// Import auth middleware
const { verifyToken } = require('./auth');

// Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'Missing fields' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [email, hash]
    );
    res.status(201).json({ msg: 'User created', id: rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'User exists or error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!rows[0] || !(await bcrypt.compare(password, rows[0].password_hash))) {
      return res.status(401).json({ msg: 'Invalid creds' });
    }
    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Example protected route
app.get('/protected', verifyToken, (req, res) => {
  res.json({ msg: `Hello user ${req.user.id}` });
});

app.listen(5000, () => console.log('Server on 5000'));