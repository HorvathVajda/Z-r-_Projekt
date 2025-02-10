const express = require("express");
const dotenv = require("dotenv");
const { registerUser, login, registerBusiness } = require("../controllers/authController");

dotenv.config();
const router = express.Router();

// Felhasználói regisztráció
router.post("/register", registerUser);

// Vállalkozói regisztráció (cég neve nélkül)
router.post("/register-vallalkozo", registerBusiness);

// Bejelentkezés
router.post("/login", login);

module.exports = router;
