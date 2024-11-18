<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/book', authMiddleware.authenticate, bookingController.bookAppointment);
=======
// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');  // Importáljuk a controller-t

// Új route a foglalások lekéréséhez
router.get('/', bookingController.getBookings);  // Használjuk a getBookings függvényt
>>>>>>> 763291d0d2170a632805daadaf3a738a4983eb33

module.exports = router;
