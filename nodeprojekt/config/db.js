<<<<<<< HEAD
// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log('Kapcsolódva az adatbázishoz.');
=======
// config/db.js
const mysql = require('mysql2');

// Csatlakozás az adatbázishoz
const db = mysql.createConnection({
  host: 'localhost',   // Az adatbázis hosztja
  user: 'root',        // Az adatbázis felhasználója
  password: '',        // Az adatbázis jelszava
  database: 'bookmytime'  // Az adatbázis neve
});

// Csatlakozás ellenőrzése
db.connect((err) => {
  if (err) {
    console.error('Hiba az adatbázishoz való csatlakozáskor: ', err);
    return;
  }
  console.log('Sikeresen csatlakoztunk az adatbázishoz!');
>>>>>>> 763291d0d2170a632805daadaf3a738a4983eb33
});

module.exports = db;
