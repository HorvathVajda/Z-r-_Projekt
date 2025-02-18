const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Jelszó hashelés
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Hiba történt a jelszó hashelésekor');
  }
};

// Jelszó ellenőrzése
const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Hiba történt a jelszó ellenőrzésekor');
  }
};

// JWT token generálása
const generateToken = (userId) => {
  const payload = {
    userId,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// JWT token dekódolása
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Hiba történt a token érvényesítésekor');
  }
};

// Dátum formázása (példa)
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('hu-HU', options);
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  formatDate
};
