const db = require('../config/db');

exports.createBooking = (req, res) => {
  const { userId, serviceId, bookingDate, bookingTime } = req.body;

  db.query(
    'INSERT INTO bookings (user_id, service_id, date, time) VALUES (?, ?, ?, ?)',
    [userId, serviceId, bookingDate, bookingTime],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).send('Booking created successfully');
    }
  );
};

exports.getBookings = (req, res) => {
  db.query('SELECT * FROM bookings WHERE user_id = ?', [req.user.id], (err, bookings) => {
    if (err) return res.status(500).send(err);
    res.json(bookings);
  });
};
