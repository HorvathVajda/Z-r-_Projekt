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

//Profil
router.get("/vallalkozo-profile", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Email megadása szükséges!" });
  }

  try {
    const [results] = await db.query(
      "SELECT * FROM vallalkozo WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "A vállalkozó nem található!" });
    }

    const vallalkozo = results[0];
    res.json({
      name: vallalkozo.nev,
      bio: vallalkozo.bio,
      email: vallalkozo.email,
      phone: vallalkozo.telefonszam
    });
  } catch (err) {
    console.error("Adatbázis hiba:", err);
    res.status(500).json({ error: "Adatbázis hiba történt!" });
  }
});

// routes/businessRoutes.js
router.post('/update-bio', (req, res) => {
  const { email, bio } = req.body;

  if (!email || !bio) {
    return res.status(400).json({ message: 'Email and bio are required.' });
  }

  // Update the user's bio in the database
  const query = 'UPDATE vallalkozo SET bio = ? WHERE email = ?';

  db.execute(query, [bio, email], (err, result) => {
    if (err) {
      console.error('Error updating bio:', err);
      return res.status(500).json({ message: 'Error occurred while updating the bio.' });
    }

    // Check if the row was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return the updated bio (or other user data if needed)
    res.status(200).json({ message: 'Bio updated successfully', bio: bio });
  });
});

router.post('/update-user', (req, res) => {
  const { email, nev, telefonszam } = req.body;

  // Ellenőrizzük, hogy az email cím nem lett módosítva
  if (!email) {
    return res.status(400).json({ error: 'Email cím nem adható meg!' });
  }

  // SQL lekérdezés a felhasználói adatok frissítésére
  const query = 'UPDATE vallalkozo SET nev = ?, telefonszam = ? WHERE email = ?';
  db.query(query, [nev, telefonszam, email], (err, result) => {
    if (err) {
      console.error('Hiba történt az adat frissítése közben:', err);
      return res.status(500).json({ error: 'Szerverhiba történt.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Felhasználó nem található.' });
    }

    // Sikeres frissítés
    res.status(200).json({ message: 'Személyes adatok frissítve.', affectedRows: result.affectedRows });
  });
});

router.get('/bookings', async (req, res) => {
  const { felhasznalo_id } = req.query;
  if (!felhasznalo_id) {
      return res.status(400).json({ error: 'Felhasználói azonosító szükséges' });
  }
  try {
      const [rows] = await db.execute(
          'SELECT foglalas_id, DATE(foglalas_datum) AS datum, TIME(foglalas_datum) AS ora FROM foglalasok WHERE felhasznalo_id = ?',
          [felhasznalo_id]
      );
      res.json(rows);
  } catch (error) {
      console.error('Hiba a foglalások lekérésekor:', error);
      res.status(500).json({ error: 'Szerverhiba' });
  }
});

router.get('/idopontok', (req, res) => {
  const vallalkozoId = req.query.vallalkozo_id;
  console.log("A lekérdezett vallalkozo_id:", vallalkozoId);

  if (!vallalkozoId) {
    return res.status(400).json({ message: 'Hiányzik a vallalkozo_id.' });
  }

  const queryVallalkozas = `
    SELECT id FROM vallalkozas WHERE vallalkozo_id = ?;
  `;
  console.log('Vallalkozas lekérdezés:', queryVallalkozas);

  // Első lekérdezés: A vallalkozas_id-k lekérése a vallalkozo_id alapján
db.query('SELECT id FROM vallalkozas WHERE vallalkozo_id = ?', [vallalkozoId], (err, vallalkozasResults) => {
  if (err) {
    console.error('Hiba történt a vallalkozas_id lekérése során:', err);
    return res.status(500).json({ message: 'Hiba történt a vallalkozas_id lekérése során' });
  }

  console.log('Vallalkozas id-k:', vallalkozasResults); // Kiírás a lekérdezés eredményéről

  if (vallalkozasResults.length === 0) {
    console.log('Nincs ilyen vállalkozás.');
    return res.status(404).json({ message: 'Nincs ilyen vállalkozás.' });
  }

  // Az első lekérdezés eredményét elmentjük
  const vallalkozasIds = vallalkozasResults.map(item => item.id);
  console.log('Vallalkozas id-k azonosítók:', vallalkozasIds); // Kiírás a kapott vallalkozas_id-król

  // Második lekérdezés: Foglalások lekérése a kapott vallalkozas_id-k alapján
  const foglalasQuery = `
    SELECT * FROM foglalasok WHERE vallalkozas_id IN (?);
  `;

  // Az első lekérdezés után elindítjuk a másodikat
  db.query(foglalasQuery, [vallalkozasIds], (err, foglalasResults) => {
    if (err) {
      console.error('Hiba történt a foglalasok lekérése során:', err);
      return res.status(500).json({ message: 'Hiba történt a foglalasok lekérése során' });
    }

    console.log('Foglalasok:', foglalasResults); // Kiírás a foglalások eredményéről

    if (foglalasResults.length > 0) {
      return res.json({ foglalasok: foglalasResults });
    } else {
      console.log('Nincs foglalás ezen a vállalkozáson.');
      return res.json({ message: 'Nincs foglalás ezen a vállalkozáson.' });
    }
  });
});

});


module.exports = router;
