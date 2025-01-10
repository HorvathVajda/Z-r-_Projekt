
const db = require('../config/db');  

const getBookings = (req, res) => {
  const query = 'SELECT * FROM foglalasok';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Hiba a foglalások lekérésekor: ', err);
      return res.status(500).json({ error: 'Adatbázis hiba' });
    }
    res.json(results);  
  });
};

module.exports = { getBookings };
