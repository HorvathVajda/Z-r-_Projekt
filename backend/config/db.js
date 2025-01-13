const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config(); // Betölti a .env fájlt

// Adatbázis kapcsolat létrehozása környezeti változókból
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'bookmytime',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true, // Kapcsolat várakozás engedélyezése
  connectionLimit: 2,      // Maximum kapcsolatok száma
  queueLimit: 0             // Végtelen várakozás, ha elérte a kapcsolatlimitet
});

// Kapcsolat tesztelése
db.getConnection()
  .then(connection => {
    console.log("Kapcsolat az adatbázishoz sikeresen létrejött!");
    connection.release(); // Kapcsolat visszaadása a pool-ba
  })
  .catch(err => {
    console.error("Adatbázis kapcsolódási hiba:", err);
    process.exit(1); // A folyamat leállítása hiba esetén
  });

module.exports = db;
