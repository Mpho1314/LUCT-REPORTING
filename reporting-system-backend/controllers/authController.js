const db = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, hashedPassword, role],
    (err, result) => {
      if(err) return res.status(500).json({error: err});
      res.status(201).json({message: "User registered successfully"});
    }
  );
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ error: "User not found" });

      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(401).json({ error: "Invalid password" });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // ✅ Include id, username, role, and token in response
      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
        token: token
      });
    }
  );
};

