// controllers/bookingController.js
const db = require('../config/db');  // Importáljuk a db kapcsolatot

const getBookings = (req, res) => {
  const query = 'SELECT * FROM foglalasok';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Hiba a foglalások lekérésekor: ', err);
      return res.status(500).json({ error: 'Adatbázis hiba' });
    }
    res.json(results);  // Visszaadjuk a foglalásokat JSON formátumban
  });
};

module.exports = { getBookings };
