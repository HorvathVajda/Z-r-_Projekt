const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config(); // Betölti a .env fájlt

// MySQL kapcsolat beállítása
const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'bookmytime'
    });
    console.log('Sikeres kapcsolat a MySQL adatbázissal');
    return connection;
  } catch (err) {
    console.error('Hiba a MySQL kapcsolódáskor:', err);
    process.exit(1); // Kilépés hiba esetén
  }
};

// Kapcsolat létrehozása
connectDB().then(connection => {
  module.exports = connection;
});
