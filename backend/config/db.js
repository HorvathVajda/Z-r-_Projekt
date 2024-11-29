const mysql = require('mysql2'); // importáld a mysql2 csomagot

const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // a saját adatbázis felhasználóneved
  password: '', // a saját adatbázis jelszavad
  database: 'bookmytime', // az adatbázis neve
});

module.exports = db.promise(); // A db objektumot a promise módba konvertáljuk
