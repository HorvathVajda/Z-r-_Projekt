// routes/categories.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');  // A megfelelő adatbázis model

// API végpont a kategóriák lekérésére
router.get('/categories', async (req, res) => {
  try {
    const categories = await db.query('SELECT * FROM categories');  // Feltételezve, hogy van 'categories' táblád
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Nem sikerült lekérni a kategóriákat.' });
  }
});

module.exports = router;
