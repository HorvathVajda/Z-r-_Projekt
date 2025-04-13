const express = require("express");
const router = express.Router();
const db = require("../config/db");
const emailjs = require('emailjs-com');

// Szolgáltatások lekérdezése vállalkozás ID vagy kategória alapján
router.get("/szolgaltatasok", async (req, res) => {
  const { vallalkozas_id, category } = req.query;

  try {
    let query = `
      SELECT szolgaltatas.*, vallalkozas.vallalkozas_neve
      FROM szolgaltatas
      JOIN vallalkozas ON szolgaltatas.vallalkozas_id = vallalkozas.id
    `;
    const queryParams = [];

    if (vallalkozas_id && category) {
      // Ha mindkét paraméter meg van adva, mindkettőt figyelembe vesszük
      query += " WHERE szolgaltatas.vallalkozas_id = ? AND vallalkozas.category = ?";
      queryParams.push(vallalkozas_id, category);
    } else if (vallalkozas_id) {
      // Ha csak a vallalkozas_id van
      query += " WHERE szolgaltatas.vallalkozas_id = ?";
      queryParams.push(vallalkozas_id);
    } else if (category) {
      // Ha csak a category van
      query += " WHERE vallalkozas.category = ?";
      queryParams.push(category);
    }

    const [rows] = await db.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error("Hiba a szolgáltatások lekérésekor:", error);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.get('/vallalkozasok', async (req, res) => {
  const { category } = req.query;
  console.log("Keresett kategória:", category); // Debug üzenet

  try {
    let query = 'SELECT * FROM vallalkozas';
    const queryParams = [];

    if (category) {
      query += ' WHERE category = ?';
      queryParams.push(category);
    }

    const [results] = await db.query(query, queryParams);
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
      SELECT
        ido_id,
        DATE_FORMAT(szabad_ido, '%Y-%m-%d %H:%i') AS szabad_ido,
        statusz
      FROM idopontok
      WHERE szolgaltatas_id = ? AND statusz = 'szabad'
    `, [szolgaltatas_id]);

    res.json(rows); // <- most már a string megy vissza, nem Date objektum
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
    // Ha vállalkozó próbál foglalni, ellenőrizzük, hogy a saját vállalkozásához-e
    if (foglalo_tipus === 'vallalkozo') {
      const [vallalkozasok] = await db.query(
        'SELECT id FROM vallalkozas WHERE vallalkozo_id = ?',
        [felhasznalo_id]
      );

      const sajatVallalkozasok = vallalkozasok.map(v => v.id);

      if (sajatVallalkozasok.includes(vallalkozas_id)) {
        console.log('Nem foglalhat saját vállalkozásához!');
        return res.status(400).json({ message: 'Nem foglalhat a saját vállalkozásához!' });
      }
    }

    // Ellenőrizzük, hogy az időpont szabad-e
    const [results] = await db.query(
      'SELECT * FROM idopontok WHERE ido_id = ? AND statusz = "szabad"',
      [ido_id]
    );

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

    await db.query('INSERT INTO foglalasok SET ?', foglalasData);
    console.log('Foglalás sikeresen rögzítve');

    await db.query('UPDATE idopontok SET statusz = "foglalt" WHERE ido_id = ?', [ido_id]);
    console.log('Időpont státusz frissítve:', ido_id);

    // Frissítsük a statisztikát
    const [rows] = await db.query(
      'SELECT vallalkozo_id FROM vallalkozas WHERE id = ?',
      [vallalkozas_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nem található vállalkozó ezzel az ID-vel' });
    }

    const foglaltVallalkozoId = rows[0].vallalkozo_id;
    await db.query(
      'UPDATE statisztika SET foglalasok = foglalasok + 1 WHERE vallalkozo_id = ?',
      [foglaltVallalkozoId]
    );

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


// Szolgáltatások lekérdezése kategória alapján
router.get("/szolgaltatasok/:category", async (req, res) => {
  const { category } = req.params;

  try {
    let query = `
      SELECT szolgaltatas.*, vallalkozas.vallalkozas_neve
      FROM szolgaltatas
      JOIN vallalkozas ON szolgaltatas.vallalkozas_id = vallalkozas.id
      WHERE vallalkozas.category = ?
    `;

    // Paraméterek a queryhez
    const queryParams = [category];

    // Lekérdezés végrehajtása
    const [rows] = await db.query(query, queryParams);

    // Eredmény visszaadása
    res.json(rows);
  } catch (error) {
    console.error("Hiba a szolgáltatások lekérésekor:", error);
    res.status(500).json({ error: "Szerver hiba" });
  }
});
module.exports = router;
