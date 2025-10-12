const bcrypt = require('bcrypt');
const db = require('./db/connection'); // adjust if your connection path is different

async function hashPasswords() {
  const [rows] = await db.promise().query('SELECT id, username, password FROM users');
  
  for (const user of rows) {
    // Skip if already hashed (bcrypt hashes always start with $2b$)
    if (user.password.startsWith('$2b$')) continue;

    const hashed = await bcrypt.hash(user.password, 10);
    await db.promise().query('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id]);
    console.log(`✅ Hashed password for user: ${user.username}`);
  }

  console.log('🎉 All passwords updated successfully!');
  process.exit(0);
}

hashPasswords().catch(err => console.error(err));
