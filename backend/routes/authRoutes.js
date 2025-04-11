const express = require("express");
const dotenv = require("dotenv");
const { registerUser, login, registerBusiness } = require("../controllers/authController");



dotenv.config();
const router = express.Router();

router.post("/register", registerUser);

router.post("/register-vallalkozo", registerBusiness);

router.post("/login", login);

module.exports = router;
