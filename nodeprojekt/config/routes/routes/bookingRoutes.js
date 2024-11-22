const express = require('express');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/book', authMiddleware, bookingController.createBooking);
router.get('/my-bookings', authMiddleware, bookingController.getBookings);

module.exports = router;
