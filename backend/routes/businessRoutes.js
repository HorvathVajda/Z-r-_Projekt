const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get('/vallalkozasok', async (req, res) => {
  // A query paraméterekből kiolvassuk a vallalkozo_id-t
  const { vallalkozo_id } = req.query;

  if (!vallalkozo_id) {
    return res.status(400).json({ error: 'Hiányzó vállalkozó ID' });
  }

  const sql = 'SELECT * FROM vallalkozas WHERE vallalkozo_id = ?';  // A vállalkozások szűrése a vallalkozo_id alapján

  try {
    const [results] = await db.query(sql, [vallalkozo_id]);  // Az adatbázis lekérdezés Promise-ot használ
    res.json(results);  // Válasz az adott vállalkozóhoz tartozó vállalkozásokkal
  } catch (err) {
    console.error('Adatbázis hiba:', err);
    res.status(500).json({ error: 'Adatbázis hiba' });
  }
});

router.post('/vallalkozasokHozzaadasa', (req, res) => {
  const { vallalkozas_neve, helyszin, nyitva_tartas, category, vallalkozo_id } = req.body;

  // Ellenőrizni kell, hogy minden szükséges adatot küldtek-e
  if (!vallalkozas_neve || !helyszin || !nyitva_tartas || !category || !vallalkozo_id) {
    return res.status(400).json({ error: 'Hiányzó szükséges adat' });
  }

  const sql = 'INSERT INTO vallalkozas (vallalkozas_neve, helyszin, nyitva_tartas, category, vallalkozo_id) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [vallalkozas_neve, helyszin, nyitva_tartas, category, vallalkozo_id], (err, result) => {
    if (err) {
      console.error('Adatbázis hiba:', err);
      return res.status(500).json({ error: 'Adatbázis hiba' });
    }

    // A válaszként visszaküldött adatokat az új vállalkozásról
    res.status(201).json({
      id: result.insertId,
      vallalkozas_neve,
      helyszin,
      nyitva_tartas,
      category,
      vallalkozo_id
    });
  });
});

router.get('/vallalkozasok/:id/details', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Hiányzó vállalkozás ID' });
  }

  const sql = 'SELECT * FROM vallalkozas WHERE id = ?';

  try {
    const [results] = await db.query(sql, [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Vállalkozás nem található' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('Adatbázis hiba:', err);
    res.status(500).json({ error: 'Adatbázis hiba' });
  }
});

router.post('/vallalkozasok/:id/szolgaltatasok', async (req, res) => {
  const { id } = req.params;
  const { szolgaltatas_neve, idotartam, ar } = req.body;

  if (!szolgaltatas_neve || !idotartam || !ar) {
    return res.status(400).json({ error: 'Hiányzó szükséges adat' });
  }

  const sql = 'INSERT INTO szolgaltatas (szolgaltatas_neve, idotartam, ar, vallalkozas_id) VALUES (?, ?, ?, ?)';

  try {
    const [result] = await db.query(sql, [szolgaltatas_neve, idotartam, ar, id]);
    res.status(201).json({
      id: result.insertId,
      szolgaltatas_neve,
      idotartam,
      ar,
      vallalkozas_id: id
    });
  } catch (err) {
    console.error('Adatbázis hiba:', err);
    res.status(500).json({ error: 'Adatbázis hiba' });
  }
});

router.get('/vallalkozasok/:id/szolgaltatasok', async (req, res) => {
  const { id } = req.params;

  const sql = 'SELECT * FROM szolgaltatas WHERE vallalkozas_id = ?';

  try {
    const [services] = await db.query(sql, [id]);
    res.json(services);
  } catch (err) {
    console.error('Adatbázis hiba:', err);
    res.status(500).json({ error: 'Adatbázis hiba' });
  }
});

router.post('/delete/:id', (req, res) => {
  const { id } = req.params;  // Az ID most már az URL-ből van

  const query = 'DELETE FROM vallalkozas WHERE id = ?';

  db.execute(query, [id], (err, result) => {
    if (err) {
      console.error('Hiba a törlés során: ', err);
      return res.status(500).json({ error: 'Hiba történt a törlés során' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Nem található ilyen üzlet' });
    }
    return res.status(200).json({ message: 'Üzlet sikeresen törölve' });
  });
});

const moment = require('moment-timezone');

router.post('/:id/add-idopont', (req, res) => {
  const { id } = req.params;
  const { szabad_ido, szolgaltatas_id } = req.body;

  if (!szabad_ido || !szolgaltatas_id) {
    return res.status(400).json({ error: 'Minden mezőt ki kell tölteni!' });
  }

  // Konvertáljuk a beérkező időpontot magyar időzónára (figyelembe vesszük a nyári időszámítást is)
  const magyarIdo = moment.tz(szabad_ido, 'Europe/Budapest').format('YYYY-MM-DD HH:mm:ss');

  console.log('Konvertált magyar idő:', magyarIdo); // Segít a hibák feltárásában

  const query = 'INSERT INTO idopontok (szabad_ido, statusz, szolgaltatas_id) VALUES (?, ?, ?)';

  db.execute(query, [magyarIdo, 'szabad', szolgaltatas_id])
    .then(([results]) => {
      res.status(200).json({ message: 'Időpont sikeresen hozzáadva!', idopont_id: results.insertId });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Hiba történt az időpont hozzáadása közben.', details: err });
    });
});


module.exports = router;
