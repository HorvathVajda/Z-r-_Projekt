const express = require("express");
const router = express.Router();
const db = require("../config/db");

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
    const { szolgaltatas_id, ido_id, felhasznalo_id } = req.body;
    const foglalasDatum = new Date();
    const statusz = 'foglalt';

    // Ellenőrizd, hogy mindhárom mező rendelkezésre áll
    if (!szolgaltatas_id || !ido_id || !felhasznalo_id) {
      return res.status(400).json({ error: 'Hiányzó kötelező mezők' });
    }

    // Ellenőrizd, hogy a szolgáltatás létezik
    const checkSzolgaltatasQuery = `
      SELECT * FROM szolgaltatas WHERE szolgaltatas_id = ? AND vallalkozas_id = ?
    `;
    const checkIdoQuery = `
      SELECT * FROM idopontok WHERE ido_id = ? AND statusz = 'szabad'
    `;

    // Először ellenőrizd, hogy a szolgáltatás és az időpont érvényes-e
    db.query(checkSzolgaltatasQuery, [szolgaltatas_id, felhasznalo_id], (err, szolgaltatasResult) => {
      if (err) {
        console.error('Hiba a szolgáltatás ellenőrzésekor:', err);
        return res.status(500).json({ error: 'Hiba a szolgáltatás ellenőrzésekor' });
      }

      if (szolgaltatasResult.length === 0) {
        return res.status(400).json({ error: 'Szolgáltatás nem található vagy nem érvényes' });
      }

      db.query(checkIdoQuery, [ido_id], (idoErr, idoResult) => {
        if (idoErr) {
          console.error('Hiba az időpont ellenőrzésekor:', idoErr);
          return res.status(500).json({ error: 'Hiba az időpont ellenőrzésekor' });
        }

        if (idoResult.length === 0) {
          return res.status(400).json({ error: 'Az időpont nem található vagy már foglalt' });
        }

        // Ha minden rendben, rögzítsük a foglalást
        const query = `
          INSERT INTO foglalasok (szolgaltatas_id, ido_id, felhasznalo_id, statusz, foglalas_datum)
          VALUES (?, ?, ?, ?, ?)
        `;

        db.query(query, [szolgaltatas_id, ido_id, felhasznalo_id, statusz, foglalasDatum], (err, result) => {
          if (err) {
            console.error('Hiba a foglalás során:', err);
            return res.status(500).json({ error: 'Hiba a foglalás során' });
          }

          // Frissítsük az időpont státuszt 'foglalt'-ra
          const updateQuery = `
            UPDATE idopontok
            SET statusz = 'foglalt'
            WHERE ido_id = ?
          `;

          db.query(updateQuery, [ido_id], (updateErr) => {
            if (updateErr) {
              console.error('Hiba az időpont frissítésekor:', updateErr);
              return res.status(500).json({ error: 'Hiba az időpont frissítésekor' });
            }

            res.status(200).json({ message: 'A foglalás sikeresen megtörtént' });
          });
        });
      });
    });
  });


module.exports = router;
