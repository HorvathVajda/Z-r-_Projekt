// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('./authController');
const passport = require('passport');

// Regisztráció és bejelentkezés útvonalak
router.post('/register', authController.register);
router.post('/login', authController.login);

// Google bejelentkezés
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/'); // Sikeres bejelentkezés
});

module.exports = router;
