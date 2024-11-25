// config/server.js
const express = require('express');
const app = express();
const bookingRoutes = require('../routes/bookingRoutes');  // Importáljuk az útvonalakat

// Middleware
app.use(express.json());

// API végpontok
app.use('/api/bookings', bookingRoutes);  // Beállítjuk az új végpontot

// Alapértelmezett port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
