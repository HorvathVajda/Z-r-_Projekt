const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Szolgáltatások lekérése
router.get("/szolgaltatasok", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT szolgaltatas.*, vallalkozas.vallalkozas_neve
      FROM szolgaltatas
      JOIN vallalkozas ON szolgaltatas.vallalkozas_id = vallalkozas.id
    `);
    res.json(rows);
  } catch (error) {
    console.error("Hiba a szolgáltatások lekérésekor:", error);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.get('/vallalkozasok', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM vallalkozas');

    res.json(results);
  } catch (err) {
    console.error("SQL hiba:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Kategóriák lekérése
router.get('/business-categories', async (req, res) => {
  try {
    // A db.query() már ígéret alapú, így nem kell a promise() hívás
    const [rows] = await db.query('SELECT DISTINCT category FROM vallalkozas');
    res.json(rows); // Send the result as JSON
  } catch (error) {
    console.error('Error fetching categories: ', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

module.exports = router;
