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

router.get('/idopontok', async (req, res) => {
  let { vallalkozo_id } = req.query; // A frontend által küldött paraméter
  if (!vallalkozo_id) {
    return res.status(400).json({ error: 'Vállalkozói azonosító szükséges' });
  }

  // A vallalkozo_id értékének konvertálása számmá
  vallalkozo_id = Number(vallalkozo_id);
  if (isNaN(vallalkozo_id)) {
    return res.status(400).json({ error: 'Érvénytelen vállalkozói azonosító' });
  }

  try {
    console.log(`Lekérdezés a vállalkozás id-k alapján, ahol a vallalkozo_id = ${vallalkozo_id}`);

    // 1. Lekérjük a vállalkozás id-ket a vallalkozas táblából, ahol a vallalkozo_id megegyezik
    const [vallalkozasRows] = await db.execute(
      'SELECT id FROM vallalkozas WHERE vallalkozo_id = ?',
      [vallalkozo_id]
    );

    if (vallalkozasRows.length === 0) {
      return res.status(404).json({ error: 'Nincs ilyen vállalkozás.' });
    }

    const vallalkozasIds = vallalkozasRows.map(row => row.id);
    console.log(`Vállalkozás id-k: ${vallalkozasIds.join(', ')}`);

    // 2. Lekérjük a szolgáltatásokat a szolgáltatás táblából, ahol a vallalkozas_id szerepel
    const [szolgaltatasRows] = await db.execute(
      'SELECT szolgaltatas_id, szolgaltatas_neve FROM szolgaltatas WHERE vallalkozas_id IN (' + vallalkozasIds.map(() => '?').join(',') + ')',
      vallalkozasIds
    );

    console.log(`Szolgáltatásokat találtunk: ${szolgaltatasRows.length > 0 ? 'Igen' : 'Nem'}`);

    if (szolgaltatasRows.length === 0) {
      return res.status(404).json({ error: 'Nincs szolgáltatás a megadott vállalkozás(ok)hoz.' });
    }

    const szolgaltatasIds = szolgaltatasRows.map(row => row.szolgaltatas_id);
    console.log(`Szolgáltatás id-k: ${szolgaltatasIds.join(', ')}`);

    const placeholders = szolgaltatasIds.map(() => '?').join(', ');

    // 3. Lekérjük az idopontok táblából azokat az adatokat, ahol a szolgaltatas_id megegyezik és a statusz = 'foglalt'
    const [idopontokRows] = await db.execute(
      `SELECT ido_id, szabad_ido FROM idopontok WHERE szolgaltatas_id IN (${placeholders}) AND statusz = 'foglalt'`,
      szolgaltatasIds
    );

    console.log('Foglalt időpontok:', idopontokRows);

    // A foglalt időpontok átalakítása helyi időzónára
    idopontokRows.forEach((item) => {
      item.szabad_ido = new Date(item.szabad_ido).toLocaleString(); // Helyi időre alakítja
    });

    // 4. Lekérjük a foglalasok táblából a felhasznalo_id-t és a foglalo_tipus-t ahol az ido_id = a lekérdezett ido_id-vel
    const ido_id = idopontokRows.length > 0 ? idopontokRows[0].ido_id : null; // Az első időpont ido_id-ja

    let foglaloAdatai = null; // Inicializáljuk null-ra, hogy ne okozzon hibát, ha nem találunk foglalót

    if (ido_id) {
      const [foglalasokRows] = await db.execute(
        'SELECT felhasznalo_id, foglalo_tipus FROM foglalasok WHERE ido_id = ?',
        [ido_id] // Most már átadjuk az ido_id-t
      );

      if (foglalasokRows.length > 0) {
        const tipus = foglalasokRows[0].foglalo_tipus; // Hozzáférés az első foglalás típusához

        if (tipus == "vallalkozo") {
          // Ha a foglaló vállalkozó, akkor a vállalkozó nevét kérjük le
          [foglaloAdatai] = await db.execute(
            'SELECT nev FROM vallalkozo WHERE vallalkozo_id = ?',
            [foglalasokRows[0].felhasznalo_id] // Feltételezem, hogy a felhasznalo_id-val azonosítható a vallalkozo
          );
        } else {
          // Ha a foglaló felhasználó, akkor a felhasználó nevét kérjük le
          [foglaloAdatai] = await db.execute(
            'SELECT nev FROM felhasznalo WHERE felhasznalo_id = ?',
            [foglalasokRows[0].felhasznalo_id] // Felhasználó ID-ja
          );
        }

        console.log('Foglalt időpont adatai:', foglaloAdatai);
      } else {
        console.log('Nincs foglalás az adott időpontra.');
      }
    } else {
      console.log('Nincs foglalt időpont a megadott szolgáltatáshoz.');
    }

    res.status(200).json({
      idopontok: idopontokRows.map(row => ({
        ido_id: row.ido_id,  // Ha szükséges, hozzáadjuk az ido_id-t a válaszhoz
        datum: row.szabad_ido
      })),
      nev: foglaloAdatai ? foglaloAdatai[0]?.nev : null // Ha van foglaló adat, akkor a nevét visszaadjuk
    });


  } catch (error) {
    console.error('Hiba történt:', error);
    res.status(500).json({ error: 'Hiba történt a lekérdezés során.' });
  }
});

router.post('/teljesit', async (req, res) => {
  let { ido_id, vallalkozo_id } = req.body;

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

    // 3. Statisztika frissítése
    const [teljesitett] = await db.execute(
      'UPDATE statisztika SET teljesitett_munkak = teljesitett_munkak + 1 WHERE vallalkozo_id = ?',
      [vallalkozo_id]
    );

    if(teljesitett.affectedRows === 0){
      return res.status(404).json({ error: 'Hiba történt a statisztikai adatok frissítésekor' });
    }

    // 4. Időpont státuszának frissítése (például teljesítve)
    const [statusUpdate] = await db.execute(
      'UPDATE idopontok SET statusz = "teljesitett" WHERE ido_id = ?',
      [ido_id]
    );

    if (statusUpdate.affectedRows === 0) {
      return res.status(404).json({ error: 'Időpont státusza nem frissíthető' });
    }

    res.status(200).json({ message: 'Időpont sikeresen teljesítve' });
  } catch (error) {
    console.error('Hiba történt:', error);
    res.status(500).json({ error: 'Hiba történt a törlés során' });
  }
});


module.exports = router;
