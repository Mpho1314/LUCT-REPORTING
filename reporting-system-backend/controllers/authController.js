// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/connection'); // promise-based pool
require('dotenv').config();

// --------------------
// REGISTER
// --------------------
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --------------------
// LOGIN
// --------------------
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch user from database
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // adjust expiration as needed
    );

    res.status(200).json({
      id: user.id,
      username: user.username,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
