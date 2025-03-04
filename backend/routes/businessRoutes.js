const express = require("express");
const router = express.Router(); // Router létrehozása
const db = require("../config/db");
const jwt = require("jsonwebtoken");
//const businessController = require("../controllers/businessController");

const secretKey = "titkoskulcs";

router.get('/vallalkozo_vallalkozasai', (req, res) => {
  const { email } = req.query; // Az emailt a frontend küldi el query paraméterként

  if (!email) {
      return res.status(400).json({ error: 'Hiányzó email paraméter' });
  }

  // Első lépés: a 'vallalkozo' táblából kinyerni a 'vallalkozo_id'-t
  const sqlVallalkozo = 'SELECT vallalkozo_id FROM vallalkozo WHERE email = ?';
  db.query(sqlVallalkozo, [email], (err, results) => {
      if (err) {
          console.error('Lekérdezési hiba a vallalkozo táblából:', err);
          return res.status(500).json({ error: 'Adatbázis hiba' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'Nem található felhasználó ezzel az email címmel' });
      }

      const vallalkozo_id = results[0].vallalkozo_id;

      // Második lépés: lekérdezni a 'vallalkozas' táblát a 'vallalkozo_id' alapján
      const sqlVallalkozas = 'SELECT * FROM vallalkozas WHERE vallalkozo_id = ?';
      db.query(sqlVallalkozas, [vallalkozo_id], (err, businessResults) => {
          if (err) {
              console.error('Lekérdezési hiba a vallalkozas táblából:', err);
              return res.status(500).json({ error: 'Adatbázis hiba' });
          }

          res.json(businessResults); // Válaszban visszaküldjük a vállalkozásokat
      });
  });
});



// Új vállalkozás hozzáadása, már nincs token ellenőrzés
/*router.post("/add", async (req, res) => {
  const { vallalkozas_neve, iranyitoszam, varos, utca, hazszam, ajto, category } = req.body;

  if (!vallalkozas_neve || !iranyitoszam || !varos || !utca || !hazszam || !category) {
    return res.status(400).json({ error: "Minden kötelező mezőt ki kell tölteni!" });
  }

  const helyszin = `${iranyitoszam} ${varos} ${utca} ${hazszam}${ajto ? " " + ajto : ""}`;

  try {
    const sql = `INSERT INTO vallalkozas (vallalkozas_neve, helyszin, category) VALUES (?, ?, ?)`;
    await db.query(sql, [vallalkozas_neve, helyszin, category]);

    res.status(201).json({ message: "Vállalkozás sikeresen hozzáadva!" });
  } catch (error) {
    console.error("Hiba történt az adatbázisba való beszúráskor:", error);
    res.status(500).json({ error: "Szerver hiba!" });
  }
});

router.post('/update-bio', async (req, res) => {
  const { vallalkozo_id, bio } = req.body;

  if (!vallalkozo_id || !bio) {
    return res.status(400).json({ message: 'Vállalkozó ID és bio mezők szükségesek' });
  }

  const query = 'UPDATE vallalkozo SET bio = ? WHERE vallalkozo_id = ?';
  db.query(query, [bio, vallalkozo_id], (err, results) => {
    if (err) {
      console.error('Hiba történt a frissítés során:', err);
      return res.status(500).json({ message: 'Hiba történt a frissítés során' });
    }

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'Bio sikeresen frissítve' });
    } else {
      res.status(404).json({ message: 'Vállalkozó nem található' });
    }
  });
});

// A vállalkozások lekérdezése a felhasználó e-mailje alapján
router.get('/vallalkozo_vallalkozasai', async (req, res) => {
  try {
    const userEmail = req.headers['email'];  // Az email headerből történő lekérés

    if (!userEmail) {
      return res.status(400).json({ error: 'Nincs bejelentkezett felhasználó.' });
    }

    // A helyes táblát és mezőt használjuk: vallalkozo.email
    const [results] = await db.execute(
      'SELECT * FROM vallalkozas WHERE vallalkozo_id IN (SELECT vallalkozo_id FROM vallalkozo WHERE email = ?)',
      [userEmail]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'Nincs ilyen vállalkozás a felhasználóhoz.' });
    }

    res.json(results);
  } catch (error) {
    console.error('Hiba a vállalkozások lekérdezésénél:', error);
    res.status(500).json({ error: 'Szerverhiba' });
  }
});



// Foglalások lekérdezése
router.get('/foglalasok/:userId', async (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT foglalas_id, szolgaltatas_neve, idopontok, statusz
    FROM foglalasok
    WHERE felhasznalo_id = ? OR vallalkozas_id IN (
      SELECT id FROM vallalkozas WHERE vallalkozo_id = ?
    )
  `;

  try {
    const [results] = await db.query(query, [userId, userId]);
    res.status(200).json(results);
  } catch (err) {
    console.error("Hiba történt a foglalások lekérdezésekor:", err);
    res.status(500).json({ message: "Hiba történt a foglalások lekérdezésekor" });
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

// Foglalás létrehozása
router.post('/foglalas', async (req, res) => {
  const { felhasznalo_id, vallalkozas_id, szolgaltatas_neve, idopont, szabad_ido, nev, statusz } = req.body;

  if (!felhasznalo_id || !vallalkozas_id || !szolgaltatas_neve || !idopont || !szabad_ido || !nev || !statusz) {
    return res.status(400).json({ error: "Minden mezőt ki kell tölteni!" });
  }

  // Ellenőrizd, hogy az időpont szabad-e
  const checkAvailabilityQuery = 'SELECT * FROM foglalasok WHERE vallalkozas_id = ? AND szabad_ido = ? AND statusz = "foglalt"';
  db.query(checkAvailabilityQuery, [vallalkozas_id, szabad_ido], (err, results) => {
    if (err) {
      console.error('Hiba történt az időpont ellenőrzésekor:', err);
      return res.status(500).json({ error: 'Szerver hiba történt.' });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: 'A kiválasztott időpont már foglalt!' });
    }

    const query = `
      INSERT INTO foglalasok (szabad_ido, idopontok, nev, felhasznalo_id, szolgaltatas_neve, statusz, vallalkozas_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [szabad_ido, idopont, nev, felhasznalo_id, szolgaltatas_neve, statusz, vallalkozas_id], (err, result) => {
      if (err) {
        console.error("Hiba történt a foglalás mentésekor:", err);
        return res.status(500).json({ error: "Szerver hiba történt!" });
      }

      res.status(201).json({ message: "Foglalás sikeresen létrehozva!" });
    });
  });
});

// Elérhető időpontok lekérése
router.get('/ido/:vallalkozas_id/:szolgaltatas_id', async (req, res) => {
  const { vallalkozas_id, szolgaltatas_id } = req.params;

  if (!vallalkozas_id || !szolgaltatas_id) {
    return res.status(400).json({ error: "Kérlek, add meg a vállalkozás és a szolgáltatás ID-ját!" });
  }

  // Itt lekérheted az időpontokat a megfelelő táblákból (például a foglalások táblából)
  try {
    const query = `
      SELECT * FROM idopontok
      WHERE vallalkozas_id = ? AND szolgaltatas_id = ? AND szabad_ido > NOW()
    `;
    const [results] = await db.query(query, [vallalkozas_id, szolgaltatas_id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Nincs elérhető időpont." });
    }

    res.json(results);
  } catch (err) {
    console.error("Hiba történt az időpontok lekérésekor:", err);
    res.status(500).json({ error: "Szerver hiba!" });
  }
});

router.post('/update-user', async (req, res) => {
  const { email, nev, telefonszam } = req.body;

  if (!email || !nev || !telefonszam) {
      return res.status(400).json({ message: 'Minden mező kitöltése kötelező!' });
  }

  try {
      const sql = 'UPDATE vallalkozo SET nev = ?, telefonszam = ? WHERE email = ?';
      const values = [nev, telefonszam, email];

      db.query(sql, values, (err, result) => {
          if (err) {
              console.error('Hiba a frissítés során:', err);
              return res.status(500).json({ message: 'Hiba történt a frissítés során.' });
          }
          if (result.affectedRows === 0) {
              return res.status(404).json({ message: 'Felhasználó nem található.' });
          }
          res.json({ message: 'Sikeres frissítés!' });
      });
  } catch (error) {
      console.error('Szerverhiba:', error);
      res.status(500).json({ message: 'Szerverhiba történt.' });
  }
});


// Vállalkozások végpontjai
router.get('/api/businesses', businessController.getBusinesses);
router.post('/api/businesses', businessController.addBusiness);
router.put('/api/businesses/:id', businessController.updateBusiness);
router.delete('/api/businesses/:id', businessController.deleteBusiness);

// Kategóriák lekérése
router.get('/api/businesses/categories', businessController.getCategories);


// Kategóriák lekérése
router.get('/business-categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT category FROM vallalkozas');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories: ', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});*/

module.exports = router;
