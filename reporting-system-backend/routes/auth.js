const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const db = require('../db/connection'); // ✅ correct path
const API_URL = process.env.REACT_APP_API_URL;


router.post('/register', register);
router.post('/login', login);

module.exports = router;
