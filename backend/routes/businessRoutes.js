const express = require("express");
const router = express.Router(); // Router létrehozása
const db = require("../config/db");
const jwt = require("jsonwebtoken");

const secretKey = "titkoskulcs";

// Middleware: JWT token ellenőrzése
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

router.get('/allBusiness', async (req, res) => {
  try {
    const authData = req.headers.authorization; // Token alapján vállalkozó ID megszerzése
    if (!authData) return res.status(401).json({ error: 'Nincs jogosultság' });

    const token = authData.split(' ')[1]; // "Bearer <token>" → a token kivétele
    const decoded = jwt.verify(token, 'sajatTitkosKulcs'); // JWT dekódolása
    const vallalkozo_id = decoded.id; // A tokenből kivesszük a bejelentkezett vállalkozó ID-ját

    const [results] = await db.execute(
      'SELECT * FROM vallalkozas WHERE vallalkozo_id = ?',
      [vallalkozo_id]
    );

    res.json(results);
  } catch (error) {
    console.error('Hiba a vállalkozások lekérdezésénél:', error);
    res.status(500).json({ error: 'Szerverhiba' });
  }
});


// Új vállalkozás hozzáadása
router.post("/add", verifyToken, async (req, res) => {
  const { vallalkozas_neve, iranyitoszam, varos, utca, hazszam, ajto, category } = req.body;

  if (!vallalkozas_neve || !iranyitoszam || !varos || !utca || !hazszam || !category) {
    return res.status(400).json({ error: "Minden kötelező mezőt ki kell tölteni!" });
  }

  const vallalkozo_id = req.user.id;
  const helyszin = `${iranyitoszam} ${varos} ${utca} ${hazszam}${ajto ? " " + ajto : ""}`;

  try {
    const sql = `INSERT INTO vallalkozas (vallalkozas_neve, helyszin, category, vallalkozo_id) VALUES (?, ?, ?, ?)`;
    await db.query(sql, [vallalkozas_neve, helyszin, category, vallalkozo_id]);

    res.status(201).json({ message: "Vállalkozás sikeresen hozzáadva!" });
  } catch (error) {
    console.error("Hiba történt az adatbázisba való beszúráskor:", error);
    res.status(500).json({ error: "Szerver hiba!" });
  }
});

router.post('/update-bio', async (req, res) => {
  const { vallalkozo_id, bio } = req.body;
  console.log("Request Body:", req.body);  // Add this line for debugging

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

// Vállalkozói profil lekérése ID alapján
router.get("/vallalkozo-profile", async (req, res) => {
  const { vallalkozo_id, email } = req.query;

  if (!vallalkozo_id && !email) {
    return res.status(400).json({ error: "Vállalkozó ID vagy e-mail megadása szükséges!" });
  }

  try {
    let query = "SELECT * FROM vallalkozo WHERE ";
    let queryParams = [];

    if (vallalkozo_id) {
      query += "vallalkozo_id = ?";
      queryParams.push(vallalkozo_id);
    } else if (email) {
      query += "email = ?";
      queryParams.push(email);
    }

    const [results] = await db.query(query, queryParams);

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

module.exports = router;
