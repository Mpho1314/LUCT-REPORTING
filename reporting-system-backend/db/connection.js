const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 25838,
  ssl: {
    rejectUnauthorized: false, // ✅ Required by Aiven
  },
});

connection.getConnection((err, conn) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL database!');
    conn.release();
  }
});

module.exports = connection;
