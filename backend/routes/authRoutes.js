const express = require("express");
const dotenv = require("dotenv");
const { registerUser, login, registerBusiness } = require("../controllers/authController");  // Az importot módosítjuk

dotenv.config();
const router = express.Router();

// Felhasználói regisztráció
router.post("/register", registerUser);

// Vállalkozói regisztráció
router.post("/register-vallalkozo", registerBusiness); // A registerVallalkozo-t registerBusiness-re változtatjuk

// Bejelentkezés
router.post("/login", login);

module.exports = router;
