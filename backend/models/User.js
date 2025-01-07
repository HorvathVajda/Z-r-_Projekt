const mongoose = require('mongoose');

// Felhasználó modell
const userSchema = new mongoose.Schema({
  nev: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  jogosultsag: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
