// models/Booking.js
const mongoose = require('mongoose');

// Foglalás modell definíciója
const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  service_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Service' },
  appointment_time: { type: Date, required: true }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
