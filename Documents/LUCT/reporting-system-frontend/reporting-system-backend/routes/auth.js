const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const db = require('../db/connection'); // ✅ correct path



router.post('/register', register);
router.post('/login', login);

module.exports = router;
