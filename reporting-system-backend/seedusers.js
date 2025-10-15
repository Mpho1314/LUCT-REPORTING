const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const connection = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      ssl: { rejectUnauthorized: false }
    });

    const users = [
      { email: 'student1@example.com', password: 'Student@123', full_name: 'Student One', role: 'student' },
      { email: 'lecturer1@example.com', password: 'Lecturer@123', full_name: 'Lecturer One', role: 'lecturer' },
      { email: 'prl1@example.com', password: 'PRL@123', full_name: 'PRL One', role: 'prl' },
      { email: 'pl1@example.com', password: 'PL@123', full_name: 'PL One', role: 'pl' }
    ];

    for (let user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await connection.query(
        'INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)',
        [user.email, hashedPassword, user.full_name, user.role]
      );
      console.log(`✅ Added user: ${user.email}`);
    }

    console.log('All users added successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding users:', err);
    process.exit(1);
  }
})();
