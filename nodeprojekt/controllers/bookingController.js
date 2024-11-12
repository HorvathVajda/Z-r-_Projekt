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
