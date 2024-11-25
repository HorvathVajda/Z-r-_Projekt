const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');

// Regisztráció végpont
router.post('/register', registerUser);

module.exports = router;
