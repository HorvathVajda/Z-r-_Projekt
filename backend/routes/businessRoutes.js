const express = require("express");
const router = express.Router();
const db = require("../config/db");

let globalAr = null; // Globális változó az ár tárolására

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

router.put('/vallalkozasok/:id/modositas', async (req, res) => {
  const { id } = req.params;
  const { helyszin, nyitva_tartas, category } = req.body;

  // Ellenőrizni kell, hogy minden szükséges adatot küldtek-e
  if (!helyszin || !nyitva_tartas || !category) {
    return res.status(400).json({ error: 'Hiányzó szükséges adat' });
  }

  // Frissítés SQL lekérdezés
  const sql = `
    UPDATE vallalkozas
    SET helyszin = ?, nyitva_tartas = ?, category = ?
    WHERE id = ?
  `;

  try {
    const [result] = await db.query(sql, [helyszin, nyitva_tartas, category, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nem található a megadott vállalkozás' });
    }

    // Válaszként visszaküldjük a frissített adatokat
    const updatedBusiness = {
      id,
      helyszin,
      nyitva_tartas,
      category
    };

    res.status(200).json(updatedBusiness);
  } catch (err) {
    console.error('Adatbázis hiba:', err);
    res.status(500).json({ error: 'Hiba történt az adatbázis művelet közben' });
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

  db.execute(query, [magyarIdo, 'szabad', szolgaltatas_id])  // Itt a szolgaltatas_id kerül be az adatbázisba
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
  const felhasznalo_id = Number(req.query.felhasznalo_id);
  const tipus = req.query.tipus;

  if (!felhasznalo_id || !tipus || (tipus !== 'felhasznalo' && tipus !== 'vallalkozo')) {
    return res.status(400).json({ error: 'Érvényes azonosító és típus szükséges (felhasznalo vagy vallalkozo)' });
  }

  try {
    const [rows] = await db.execute(
      `SELECT
         f.foglalas_id,
         DATE_FORMAT(i.szabad_ido, '%Y-%m-%d %H:%i') AS datum,
         s.szolgaltatas_neve AS szolgaltatas
       FROM foglalasok f
       INNER JOIN idopontok i ON f.ido_id = i.ido_id
       INNER JOIN szolgaltatas s ON f.szolgaltatas_id = s.szolgaltatas_id
       WHERE f.felhasznalo_id = ? AND f.foglalo_tipus = ?`,
      [felhasznalo_id, tipus]
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

router.get('/adatok', async (req, res) => {
  let { ido_id, vallalkozo_id } = req.query;

  if (!ido_id || !vallalkozo_id) {
    return res.status(400).json({ error: 'Időpont azonosító és vállalkozó azonosító szükséges' });
  }

  try {
    // Szolgáltatás ID lekérése az időponthoz
    const [szolgaltatasRows] = await db.execute(
      'SELECT szolgaltatas_id FROM idopontok WHERE ido_id = ?',
      [ido_id]
    );

    if (szolgaltatasRows.length === 0) {
      return res.status(404).json({ error: 'Nincs ilyen szolgáltatás az adott időponthoz' });
    }

    const szolgaltatas_id = szolgaltatasRows[0].szolgaltatas_id;

    // Szolgáltatás ára lekérése
    const [arRows] = await db.execute(
      'SELECT ar FROM szolgaltatas WHERE szolgaltatas_id = ?',
      [szolgaltatas_id]
    );

    if (arRows.length === 0) {
      return res.status(404).json({ error: 'Nincs ilyen ár a szolgáltatáshoz' });
    }

    // Az árat globális változóba mentjük
    globalAr = arRows[0].ar;

    res.status(200).json({ message: 'Adatok sikeresen lekérve', ar: globalAr });
  } catch (error) {
    console.error('Hiba történt az adatok lekérésekor:', error);
    res.status(500).json({ error: 'Hiba történt az adatok lekérésekor' });
  }
});

router.post('/teljesit', async (req, res) => {
  let { ido_id, vallalkozo_id } = req.query;

  if (!ido_id || !vallalkozo_id) {
    return res.status(400).json({ error: 'Időpont azonosító szükséges' });
  }

  ido_id = Number(ido_id);
  if (isNaN(ido_id)) {
    return res.status(400).json({ error: 'Érvénytelen időpont azonosító' });
  }

  try {
    // Először ellenőrizzük, hogy van-e lekért ár
    if (globalAr === null) {
      return res.status(400).json({ error: 'Nincs elérhető ár' });
    }

    console.log(`Időpont teljesítése, ido_id = ${ido_id}, vallalkozo_id = ${vallalkozo_id}, ár = ${globalAr}`);

    // 1. Töröljük az időpontot
    const [idopontTorlendo] = await db.execute(
      'DELETE FROM idopontok WHERE ido_id = ?',
      [ido_id]
    );

    if (idopontTorlendo.affectedRows === 0) {
      return res.status(404).json({ error: 'Nincs ilyen időpont' });
    }

    // 2. Töröljük a foglalásokat is
    const [foglalasTorlendo] = await db.execute(
      'DELETE FROM foglalasok WHERE ido_id = ?',
      [ido_id]
    );

    // 3. Statisztika frissítése
    const [teljesitett] = await db.execute(
      'UPDATE statisztika SET teljesitett_munkak = teljesitett_munkak + 1 WHERE vallalkozo_id = ?',
      [vallalkozo_id]
    );

    // 4. Bevétel hozzáadása a statisztikához
    const [bevetel] = await db.execute(
      'UPDATE statisztika SET bevetel = bevetel + ? WHERE vallalkozo_id = ?',
      [globalAr, vallalkozo_id]
    );

    res.status(200).json({ message: 'Időpont sikeresen teljesítve' });
  } catch (error) {
    console.error('Hiba történt:', error);
    res.status(500).json({ error: 'Hiba történt a törlés során' });
  }
});

router.get('/statisztika', async (req, res) => {
  let { vallalkozo_id } = req.query;

  if (!vallalkozo_id) {
    return res.status(400).json({ error: 'Vállalkozó azonosító szükséges' });
  }

  try {
    // Bevétel lekérdezése
    const [bevetelRows] = await db.execute('SELECT bevetel FROM statisztika WHERE vallalkozo_id = ?', [vallalkozo_id]);
    const [teljesitettMunkakRows] = await db.execute('SELECT teljesitett_munkak FROM statisztika WHERE vallalkozo_id = ?', [vallalkozo_id]);
    const [foglalasokRows] = await db.execute('SELECT foglalasok FROM statisztika WHERE vallalkozo_id = ?', [vallalkozo_id]);

    // Ellenőrizzük, hogy van-e találat a lekérdezésekre
    if (bevetelRows.length === 0 || teljesitettMunkakRows.length === 0 || foglalasokRows.length === 0) {
      return res.status(404).json({ error: 'Nincs statisztika az adott vállalkozóhoz' });
    }

    // Kiolvassuk az adatokat
    const bevetel = bevetelRows[0].bevetel;
    const teljesitettMunkak = teljesitettMunkakRows[0].teljesitett_munkak;
    const foglalasok = foglalasokRows[0].foglalasok;

    // Válasz küldése
    res.status(200).json({
      bevetel,
      teljesitett_munkak: teljesitettMunkak,
      foglalasok
    });
  } catch (error) {
    console.error('Hiba történt a statisztika lekérdezésekor:', error);
    res.status(500).json({ error: 'Hiba történt a statisztika lekérdezésekor' });
  }
});


module.exports = router;
