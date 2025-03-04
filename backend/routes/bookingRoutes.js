const express = require("express");
const router = express.Router();
const db = require("../config/db");
const emailjs = require('emailjs-com');

// Szolgáltatások lekérdezése vállalkozás ID alapján (vagy az összes, ha nincs ID)
router.get("/szolgaltatasok/:vallalkozas_id?", async (req, res) => {
  const { vallalkozas_id } = req.params;

  try {
    let query = `
      SELECT szolgaltatas.*, vallalkozas.vallalkozas_neve
      FROM szolgaltatas
      JOIN vallalkozas ON szolgaltatas.vallalkozas_id = vallalkozas.id
    `;

    const queryParams = [];

    if (vallalkozas_id) {
      query += " WHERE szolgaltatas.vallalkozas_id = ?";
      queryParams.push(vallalkozas_id);
    }

    const [rows] = await db.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error("Hiba a szolgáltatások lekérésekor:", error);
    res.status(500).json({ error: "Szerver hiba" });
  }
});


// Vállalkozások listája lekérdezése
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
    const [rows] = await db.query('SELECT DISTINCT category FROM vallalkozas');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories: ', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Szabad időpontok lekérése
router.get("/szabad-idopontok/:szolgaltatas_id", async (req, res) => {
  const { szolgaltatas_id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT ido_id, szabad_ido, statusz
      FROM idopontok
      WHERE szolgaltatas_id = ? AND statusz = 'szabad'
    `, [szolgaltatas_id]);

    res.json(rows);
  } catch (error) {
    console.error("Hiba a szabad időpontok lekérésekor:", error);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

// Foglalás végpont
router.post('/foglalas', async (req, res) => {
  const { szolgaltatas_id, ido_id, felhasznalo_id, vallalkozas_id, foglalo_tipus, email } = req.body;

  console.log('Bejövő adatok:', { szolgaltatas_id, ido_id, felhasznalo_id, vallalkozas_id, foglalo_tipus, email });

  try {
    // Ellenőrizzük, hogy az időpont szabad-e
    const [results] = await db.query('SELECT * FROM idopontok WHERE ido_id = ? AND statusz = "szabad"', [ido_id]);

    console.log('Szabad időpont keresés eredménye:', results);

    if (results.length === 0) {
      console.log('Az időpont már nem elérhető:', ido_id);
      return res.status(400).json({ message: 'Az időpont már nem elérhető.' });
    }

    const foglalasData = {
      szolgaltatas_id,
      ido_id,
      felhasznalo_id: felhasznalo_id || null,
      vallalkozas_id: vallalkozas_id || null,
      statusz: 'foglalt',
      foglalas_datum: new Date(),
      foglalo_tipus,
    };

    console.log('Foglalás adat:', foglalasData);

    // Foglalás rögzítése
    await db.query('INSERT INTO foglalasok SET ?', foglalasData);
    console.log('Foglalás sikeresen rögzítve');

    // Időpont státusz frissítése
    await db.query('UPDATE idopontok SET statusz = "foglalt" WHERE ido_id = ?', [ido_id]);
    console.log('Időpont státusz frissítve:', ido_id);

    return res.status(201).json();

  } catch (err) {
    console.error('SQL hiba:', err);
    return res.status(500).json({
      message: 'Hiba történt a foglalás létrehozása során.',
      error: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;
