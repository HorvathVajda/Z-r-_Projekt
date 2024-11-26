const mysql = require("mysql2");

const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // Használj megfelelő felhasználónevet
  password: '', // Add meg az adatbázis jelszót
  database: 'bookmytime', // Az adatbázis neve
});

module.exports = db.promise(); // Promise-alapú API használata
