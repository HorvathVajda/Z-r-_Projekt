const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post('/teljesit', async (req, res) => {
  let { ido_id } = req.query; // A frontend által küldött ido_id paraméter

  if (!ido_id) {
    return res.status(400).json({ error: 'Időpont azonosító szükséges' });
  }

  ido_id = Number(ido_id);
  if (isNaN(ido_id)) {
    return res.status(400).json({ error: 'Érvénytelen időpont azonosító' });
  }

  try {
    console.log(`Időpont teljesítése, ido_id = ${ido_id}`);

    // 1. Töröljük az időpontot az idopontok táblából
    const [idopontTorlendo] = await db.execute(
      'DELETE FROM idopontok WHERE ido_id = ?',
      [ido_id]
    );

    if (idopontTorlendo.affectedRows === 0) {
      return res.status(404).json({ error: 'Nincs ilyen időpont' });
    }

    // 2. Töröljük a foglalásokat is, ahol az ido_id szerepel
    const [foglalasTorlendo] = await db.execute(
      'DELETE FROM foglalasok WHERE ido_id = ?',
      [ido_id]
    );

    if (foglalasTorlendo.affectedRows === 0) {
      return res.status(404).json({ error: 'Nincs foglalás a megadott időponthoz' });
    }

    res.status(200).json({ message: 'Időpont sikeresen teljesítve' });
  } catch (error) {
    console.error('Hiba történt:', error);
    res.status(500).json({ error: 'Hiba történt a törlés során' });
  }
});

module.exports = router;
