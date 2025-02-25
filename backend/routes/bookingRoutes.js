const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticate = require('../middlewares/authMiddleware');

// Middleware az autentikációhoz
router.use(authenticate);  // Ez biztosítja, hogy a 'req.authData' mindig elérhető lesz

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

// Foglalás létrehozása
router.post('/foglalas', (req, res) => {
  const { szolgaltatas_id, ido_id } = req.body;
  const felhasznalo_id = req.body.felhasznalo_id || req.authData.id; // Felhasználói ID
  const tipus = req.authData.tipus;  // Felhasználói típus ('vallalkozó' vagy 'felhasznalo')
  const foglalasDatum = new Date();
  const statusz = 'foglalt';

  // Ellenőrizze a szükséges adatokat
  if (!szolgaltatas_id || !ido_id || !felhasznalo_id) {
    return res.status(400).json({ error: 'Hiányzó kötelező mezők' });
  }

  // 1. Szolgáltatás ellenőrzése
  const checkSzolgaltatasQuery = `
    SELECT * FROM szolgaltatas WHERE szolgaltatas_id = ? AND vallalkozas_id = ?`;
  const vallalkozas_id = tipus === 'felhasznalo' ? felhasznalo_id : req.body.vallalkozas_id;  // Ha 'felhasznalo', akkor a felhasználó id-ját, ha 'vallalkozó', akkor a vállalkozás id-ját használjuk

  db.query(checkSzolgaltatasQuery, [szolgaltatas_id, vallalkozas_id], (err, szolgaltatasResult) => {
    if (err) {
      console.error('Hiba a szolgáltatás ellenőrzésekor:', err);
      return res.status(500).json({ error: 'Hiba a szolgáltatás ellenőrzésekor' });
    }
    if (szolgaltatasResult.length === 0) {
      return res.status(400).json({ error: 'Szolgáltatás nem található vagy nem érvényes' });
    }

    // 2. Időpont ellenőrzése
    const checkIdoQuery = `
      SELECT * FROM idopontok WHERE ido_id = ? AND statusz = 'szabad'`;
    db.query(checkIdoQuery, [ido_id], (idoErr, idoResult) => {
      if (idoErr) {
        console.error('Hiba az időpont ellenőrzésekor:', idoErr);
        return res.status(500).json({ error: 'Hiba az időpont ellenőrzésekor' });
      }
      if (idoResult.length === 0) {
        return res.status(400).json({ error: 'Az időpont nem található vagy már foglalt' });
      }

      // 3. Foglalás mentése
      const query = `
        INSERT INTO foglalasok (szolgaltatas_id, ido_id, felhasznalo_id, statusz, foglalas_datum)
        VALUES (?, ?, ?, ?, ?)`;
      db.query(query, [szolgaltatas_id, ido_id, felhasznalo_id, statusz, foglalasDatum], (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Hiba a foglalás során:', insertErr);
          return res.status(500).json({ error: 'Hiba a foglalás során' });
        }

        res.status(200).json({ message: 'Foglalás sikeresen létrejött!' });
      });
    });
  });
});

module.exports = router;
