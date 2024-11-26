const express = require("express");
const { registerUser, login } = require("../controllers/authController");

const router = express.Router();

// Regisztrációs útvonal
router.post("/register", registerUser);

// Bejelentkezési útvonal
router.post("/login", login);

module.exports = router;
