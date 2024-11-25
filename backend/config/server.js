// backend/config/server.js
const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('../routes/authRoutes'); // Az authRoutes importálása helyes

app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

app.use('/api', authRoutes);

app.listen(5000, () => {
  console.log('Backend szerver fut a http://localhost:5000/ porton');
});
