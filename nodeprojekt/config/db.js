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
});

module.exports = db;
