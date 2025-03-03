const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Vállalkozás ID alapján szolgáltatásokat lekérdező végpont
router.get("/szolgaltatasok/:vallalkozas_id", async (req, res) => {
  const { vallalkozas_id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT szolgaltatas.*, vallalkozas.vallalkozas_neve
      FROM szolgaltatas
      JOIN vallalkozas ON szolgaltatas.vallalkozas_id = vallalkozas.id
      WHERE szolgaltatas.vallalkozas_id = ?
    `, [vallalkozas_id]);

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

// Foglalás létrehozása
// Foglalás létrehozása
router.post('/foglalas', async (req, res) => {
  const { szolgaltatas_id, ido_id, felhasznalo_id, vallalkozas_id, foglalo_tipus } = req.body;

  console.log('Bejövő adatok:', { szolgaltatas_id, ido_id, felhasznalo_id, vallalkozas_id, foglalo_tipus });

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
      felhasznalo_id: felhasznalo_id || null,  // Ha van felhasználó, akkor legyen beállítva
      vallalkozas_id: vallalkozas_id || null,  // Ha van vállalkozás, akkor legyen beállítva
      statusz: 'foglalt',
      foglalas_datum: new Date(),
      foglalo_tipus,
    };

    console.log('Foglalás adat:', foglalasData); // Debug log

    // Foglalás rögzítése
    await db.query('INSERT INTO foglalasok SET ?', foglalasData);
    console.log('Foglalás sikeresen rögzítve');

    // Időpont státusz frissítése
    await db.query('UPDATE idopontok SET statusz = "foglalt" WHERE ido_id = ?', [ido_id]);
    console.log('Időpont státusz frissítve:', ido_id);

    return res.status(201).json({ message: 'Foglalás sikeresen létrehozva.' });
  } catch (err) {
    console.error('SQL hiba:', err);
    return res.status(500).json({
      message: 'Hiba történt a foglalás létrehozása során.',
      error: err.message,
      stack: err.stack,  // A részletes hibakövetés megjelenítése
    });
  }
});


module.exports = router;
