// Betöltjük a dotenv csomagot a környezeti változókhoz
require('dotenv').config(); // Ez beolvassa az .env fájlban lévő változókat

const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// Felhasználói adatok lekérése (token alapján)
router.get("/felhasznalo-profile", async (req, res) => {
  // Token kinyerése a fejlécből
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer token..."
  if (!token) {
    return res.status(401).json({ error: "Nincs token, hozzáférés megtagadva!" });
  }

  try {
    // Token dekódolása
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Titkos kulcs használata a .env-ből
    const email = decoded.email; // Email kinyerése a tokenből

    // Felhasználói adatok lekérdezése az adatbázisból
    const [results] = await db.query(
      "SELECT nev, email, telefonszam FROM felhasznalo WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "A felhasználó nem található!" });
    }

    const felhasznalo = results[0];
    res.json({
      name: felhasznalo.nev,
      email: felhasznalo.email,
      phone: felhasznalo.telefonszam || null,
    });
  } catch (err) {
    console.error("Token érvénytelen:", err);
    res.status(403).json({ error: "Érvénytelen token!" });
  }
});

// Felhasználó foglalásainak lekérése (token alapján)
router.get("/foglalasok", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Nincs token, hozzáférés megtagadva!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Titkos kulcs használata a .env-ből
    const felhasznalo_id = decoded.felhasznalo_id; // Tokenből nyert felhasználói ID

    const [rows] = await db.execute(
      "SELECT foglalas_id, DATE(foglalas_datum) AS datum, TIME(foglalas_datum) AS ora FROM foglalasok WHERE felhasznalo_id = ?",
      [felhasznalo_id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Hiba a foglalások lekérésekor:", error);
    res.status(500).json({ error: "Szerverhiba" });
  }
});

// Statisztikák lekérése (változatlan)
router.get("/statisztikak", async (req, res) => {
  try {
    const [osszesFoglalas] = await db.execute("SELECT COUNT(*) AS count FROM foglalasok");
    const [utolsoFoglalas] = await db.execute(
      "SELECT foglalas_datum FROM foglalasok ORDER BY foglalas_datum DESC LIMIT 1"
    );
    const [aktivitas] = await db.execute(
      `SELECT COUNT(*) AS count FROM foglalasok
       WHERE foglalas_datum >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
    );

    res.json({
      osszesFoglalas: osszesFoglalas[0].count || 0,
      utolsoFoglalas: utolsoFoglalas.length > 0 ? utolsoFoglalas[0].foglalas_datum : null,
      aktivitas: aktivitas[0].count || 0,
    });
  } catch (error) {
    console.error("Hiba a statisztikák lekérésekor:", error);
    res.status(500).json({ error: "Szerverhiba" });
  }
});

module.exports = router;
