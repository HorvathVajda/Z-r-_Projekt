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

router.get('/vallalkozasok', (req, res) => {
  const category = req.query.category || ''; // Get category from query parameter
  let query = 'SELECT * FROM vallalkozas'; // Default query (all businesses)

  if (category) {
    query += ` WHERE category = ?`; // Filter by category if provided
  }

  db.query(query, [category], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error fetching businesses', error: err });
    } else {
      console.log('Fetched businesses:', result); // Győződj meg róla, hogy a válasz helyes
      res.json(result); // Return businesses as JSON
    }
  });
});

// Kategóriák lekérése
router.get('/business-categories', async (req, res) => {
  try {
    // Use async/await for querying the database
    const [rows] = await db.query('SELECT DISTINCT category FROM vallalkozas');
    res.json(rows); // Send the result as JSON
  } catch (error) {
    console.error('Error fetching categories: ', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Szabad időpontok lekérése
router.get("/szabad-idopontok/:szolgaltatasId", async (req, res) => {
  try {
    const { szolgaltatasId } = req.params;
    const [rows] = await db.query(
      `SELECT ido_id, szabad_ido, statusz FROM idopontok WHERE szolgaltatas_id = ? AND statusz = 'szabad'`,
      [szolgaltatasId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Hiba a szabad időpontok lekérésekor:", error);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.post('/foglalas', (req, res) => {
  const { szolgaltatas_id, ido_id } = req.body;
  const felhasznalo_id = req.body.felhasznalo_id; // Felhasználói ID
  const tipus = req.body.tipus;  // Felhasználói típus ('vallalkozó' vagy 'felhasznalo')
  const foglalasDatum = new Date();
  const statusz = 'foglalt';

  // Ellenőrizze a szükséges adatokat
  if (!szolgaltatas_id || !ido_id || !felhasznalo_id) {
    return res.status(400).json({ error: 'Hiányzó kötelező mezők' });
  }

  // A vallalkozas_id meghatározása a tipustól függően
  let vallalkozas_id;
  if (tipus === 'felhasznalo') {
    // Felhasználóként foglalva, válassza ki a szolgáltatás vállalkozását
    const checkSzolgaltatasQuery = `
      SELECT vallalkozas_id FROM szolgaltatas WHERE szolgaltatas_id = ?`
    db.query(checkSzolgaltatasQuery, [szolgaltatas_id], (err, result) => {
      if (err) {
        console.error('Hiba a szolgáltatás ellenőrzésekor:', err);
        return res.status(500).json({ error: 'Szerver hiba a szolgáltatás ellenőrzésekor' });
      }
      if (result.length === 0) {
        return res.status(400).json({ error: 'Szolgáltatás nem található' });
      }
      vallalkozas_id = result[0].vallalkozas_id;

      // Időpont ellenőrzése
      const checkIdoQuery = `
        SELECT ido_id, statusz FROM idopontok WHERE ido_id = ? AND statusz = 'szabad' AND vallalkozas_id = ?`
      db.query(checkIdoQuery, [ido_id, vallalkozas_id], (idoErr, idoResult) => {
        if (idoErr) {
          console.error('Hiba az időpont ellenőrzésekor:', idoErr);
          return res.status(500).json({ error: 'Szerver hiba az időpont ellenőrzésekor' });
        }
        if (idoResult.length === 0) {
          return res.status(400).json({ error: 'Az időpont már foglalt vagy nem található' });
        }

        // Foglalás mentése
        const insertQuery = `
          INSERT INTO foglalasok (szolgaltatas_id, ido_id, felhasznalo_id, statusz, foglalas_datum, vallalkozas_id)
          VALUES (?, ?, ?, ?, ?, ?)`
        db.query(insertQuery, [szolgaltatas_id, ido_id, felhasznalo_id, statusz, foglalasDatum, vallalkozas_id], (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Hiba a foglalás során:', insertErr);
            return res.status(500).json({ error: 'Hiba a foglalás során' });
          }

          res.status(200).json({ message: 'Foglalás sikeresen létrejött!' });
        });
      });
    });
  } else if (tipus === 'vallalkozó') {
    // Vállalkozóként foglalva, csak saját szolgáltatásait és időpontjait érheti el
    const checkSzolgaltatasQuery = `
      SELECT szolgaltatas_id FROM szolgaltatas WHERE szolgaltatas_id = ? AND vallalkozas_id = ?`
    db.query(checkSzolgaltatasQuery, [szolgaltatas_id, req.body.vallalkozas_id], (err, szolgaltatasResult) => {
      if (err) {
        console.error('Hiba a szolgáltatás ellenőrzésekor:', err);
        return res.status(500).json({ error: 'Szerver hiba a szolgáltatás ellenőrzésekor' });
      }
      if (szolgaltatasResult.length === 0) {
        return res.status(400).json({ error: 'Szolgáltatás nem található vagy nem érvényes' });
      }

      // Időpont ellenőrzése
      const checkIdoQuery = `
        SELECT ido_id, statusz FROM idopontok WHERE ido_id = ? AND statusz = 'szabad' AND vallalkozas_id = ?`
      db.query(checkIdoQuery, [ido_id, req.body.vallalkozas_id], (idoErr, idoResult) => {
        if (idoErr) {
          console.error('Hiba az időpont ellenőrzésekor:', idoErr);
          return res.status(500).json({ error: 'Szerver hiba az időpont ellenőrzésekor' });
        }
        if (idoResult.length === 0) {
          return res.status(400).json({ error: 'Az időpont már foglalt vagy nem található' });
        }

        // Foglalás mentése
        const insertQuery = `
          INSERT INTO foglalasok (szolgaltatas_id, ido_id, felhasznalo_id, statusz, foglalas_datum, vallalkozas_id)
          VALUES (?, ?, ?, ?, ?, ?)`
        db.query(insertQuery, [szolgaltatas_id, ido_id, felhasznalo_id, statusz, foglalasDatum, req.body.vallalkozas_id], (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Hiba a foglalás során:', insertErr);
            return res.status(500).json({ error: 'Hiba a foglalás során' });
          }

          res.status(200).json({ message: 'Foglalás sikeresen létrejött!' });
        });
      });
    });
  } else {
    return res.status(400).json({ error: 'Érvénytelen felhasználói típus' });
  }
});

module.exports = router;
