const bcrypt = require('bcrypt');

async function hashPasswords() {
  const users = [
    { username: "mpho", password: "123" },
    { username: "boiketlo", password: "123" },
    { username: "kopano", password: "123" },
    { username: "masentle", password: "123" },
    { username: "lecturer1", password: "123" },
    { username: "lecturer2", password: "123" },
    { username: "prl1", password: "123" },
    { username: "pl1", password: "123" },
    { username: "student2", password: "123" }
  ];

  for (let user of users) {
    const hashed = await bcrypt.hash(user.password, 10);
    console.log(`UPDATE users SET password='${hashed}' WHERE username='${user.username}';`);
  }
}

hashPasswords();
