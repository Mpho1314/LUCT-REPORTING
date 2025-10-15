// db/connection.js
const mysql = require('mysql2/promise'); // promise-based pool
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME, // match your Render env
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 25838,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }, // Required by Aiven
});

// Test connection on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Connected to MySQL database!');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
  }
})();

module.exports = pool;
