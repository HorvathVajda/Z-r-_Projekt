const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost', // Az adatbázis szerver címe
  user: 'root',      // Az adatbázis felhasználónév
  password: '', // Az adatbázis jelszó
  database: 'bookmytime', // Az adatbázis neve
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
