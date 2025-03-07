const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mysql' || '',
  database: 'bookmytime',
});

db.getConnection()
  .then(connection => {
    console.log("Kapcsolat az adatbázishoz sikeresen létrejött!");
    connection.release();
  })
  .catch(err => {
    console.error("Adatbázis kapcsolódási hiba:", err);
    process.exit(1);
  });

module.exports = db;
