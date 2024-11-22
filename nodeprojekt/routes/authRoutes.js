const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

<<<<<<< HEAD
=======
// Példa útvonalak
>>>>>>> 763291d0d2170a632805daadaf3a738a4983eb33
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
