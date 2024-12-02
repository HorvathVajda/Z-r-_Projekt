const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost', // vagy az adatbázis IP-címe
  user: 'root',      // MySQL felhasználónév
  password: '', // MySQL jelszó
  database: 'bookmytime', // Az adatbázis neve
  port: 3306
});

module.exports = db;
