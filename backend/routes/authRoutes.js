const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { registerUser, login } = require("../controllers/authController");

dotenv.config();
const router = express.Router();


router.post("/register", registerUser);


router.post("/login", login);

module.exports = router;
