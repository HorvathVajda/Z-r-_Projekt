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

router.post('/jelszo-valtoztatas/:id', async (req, res) => {
  const { jelszo, ujJelszo } = req.body;
  const felhasznaloId = req.params.id;

  if (!felhasznaloId || !jelszo || !ujJelszo) {
    return res.status(400).json({ error: 'Hiányzó adat(ok)' });
  }

  try {
    // 1. Lekérjük a felhasználó jelenlegi jelszavát
    const [rows] = await db.query(
      'SELECT jelszo FROM felhasznalo WHERE felhasznalo_id = ?',
      [felhasznaloId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Felhasználó nem található' });
    }

    const jelenlegiHasheltJelszo = rows[0].jelszo;

    // 2. Összehasonlítás
    const egyezik = await bcrypt.compare(jelszo, jelenlegiHasheltJelszo);
    if (!egyezik) {
      return res.status(401).json({ error: 'Hibás jelenlegi jelszó' });
    }

    // 3. Új jelszó hashelése
    const ujHasheltJelszo = await bcrypt.hash(ujJelszo, 10);

    // 4. Adatbázis frissítés
    const [updateResult] = await db.query(
      'UPDATE felhasznalo SET jelszo = ? WHERE felhasznalo_id = ?',
      [ujHasheltJelszo, felhasznaloId]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(500).json({ error: 'Nem sikerült a jelszó frissítése' });
    }

    res.json({ message: 'Jelszó sikeresen megváltoztatva' });
  } catch (err) {
    console.error('DB hiba:', err);
    res.status(500).json({ error: 'Szerver hiba' });
  }
});

module.exports = router;
