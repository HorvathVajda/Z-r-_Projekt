// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');  // Importáljuk a controller-t

// Új route a foglalások lekéréséhez
router.get('/', bookingController.getBookings);  // Használjuk a getBookings függvényt

module.exports = router;
