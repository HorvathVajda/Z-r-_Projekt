<<<<<<< HEAD
const connection = require('../config/db');

// Időpont foglalás
exports.bookAppointment = (req, res) => {
  const { userId, serviceId, appointmentTime } = req.body;

  // Időpont foglalás beszúrása az adatbázisba
  const query = 'INSERT INTO appointments (user_id, service_id, appointment_time) VALUES (?, ?, ?)';
  connection.query(query, [userId, serviceId, appointmentTime], (err, result) => {
    if (err) return res.status(500).send('Hiba történt a foglalás során');
    res.status(200).send('Sikeres foglalás');
  });
};
=======
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
>>>>>>> 763291d0d2170a632805daadaf3a738a4983eb33
