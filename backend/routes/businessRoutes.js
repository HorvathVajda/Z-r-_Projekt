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

// Vállalkozás bio frissítése
router.post('/update-bio', async (req, res) => {
  const { email, bio } = req.body;

  if (!email || !bio) {
    return res.status(400).json({ message: 'Email és bio mezők szükségesek' });
  }

  const query = 'UPDATE vallalkozo SET bio = ? WHERE email = ?';
  db.query(query, [bio, email], (err, results) => {
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

// Vállalkozói profil lekérése email alapján
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

module.exports = router; // A router exportálása
