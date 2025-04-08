const express = require("express");
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require("../config/db");

router.get('/profil/:id', async (req, res) => {
  const felhasznaloId = req.params.id;
  if (!felhasznaloId) {
    return res.status(400).json({ error: 'Hiányzó ID' });
  }
  try {
    const [results] = await db.query(
      'SELECT nev, email, telefonszam FROM felhasznalo WHERE felhasznalo_id = ?',
      [felhasznaloId]
    );
    if (!results.length) {
      return res.status(404).json({ error: 'Nincs ilyen felhasználó' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('DB hiba:', err);
    res.status(500).json({ error: 'Szerver hiba' });
  }
});

module.exports = router;
