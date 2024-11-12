// server.js
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./authRoutes');
require('dotenv').config();
require('./passport'); // OAuth konfiguráció betöltése

const app = express();

app.use(cors());
app.use(express.json());
app.use(session({ secret: 'secretkey', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes); // Felhasználói útvonalak

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Szerver fut a ${PORT} porton.`);
});
