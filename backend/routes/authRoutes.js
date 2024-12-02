const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { registerUser, login } = require("../controllers/authController");

dotenv.config();
const router = express.Router();

// Regisztrációs útvonal
router.post("/register", registerUser);

// Bejelentkezési útvonal
router.post("/login", login);

module.exports = router;
