const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'mysql',
  database: process.env.DB_NAME || 'bookmytime',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0
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
