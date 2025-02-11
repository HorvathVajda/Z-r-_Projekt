const express = require("express");
const router = express.Router();
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

// GET: Vállalkozások lekérése
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM vallalkozas");
    res.json(rows);
  } catch (error) {
    console.error("Hiba történt az adatok lekérésekor:", error);
    res.status(500).json({ error: "Hiba történt az adatok lekérésekor" });
  }
});

// POST: Új vállalkozás hozzáadása
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { vallalkozas_neve, iranyitoszam, varos, utca, hazszam, ajto, category } = req.body;
    if (!vallalkozas_neve || !iranyitoszam || !varos || !utca || !hazszam || !category) {
      return res.status(400).json({ error: "Minden kötelező mezőt ki kell tölteni!" });
    }

    const vallalkozo_id = req.user.id;
    const helyszin = `${iranyitoszam} ${varos} ${utca} ${hazszam}${ajto ? " " + ajto : ""}`;

    const sql = `INSERT INTO vallalkozas (vallalkozas_neve, helyszin, category, vallalkozo_id) VALUES (?, ?, ?, ?)`;
    await db.query(sql, [vallalkozas_neve, helyszin, category, vallalkozo_id]);

    res.status(201).json({ message: "Vállalkozás sikeresen hozzáadva!" });
  } catch (error) {
    console.error("Hiba történt az adatbázisba való beszúráskor:", error);
    res.status(500).json({ error: "Szerver hiba!" });
  }
});

// DELETE: Vállalkozás törlése
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const businessId = req.params.id;
    const vallalkozo_id = req.user.id;

    const sql = `DELETE FROM vallalkozas WHERE id = ? AND vallalkozo_id = ?`;
    const result = await db.query(sql, [businessId, vallalkozo_id]);

    if (result[0].affectedRows === 0) {
      return res.status(403).json({ error: "Nincs jogosultságod a törléshez!" });
    }

    res.json({ message: "Vállalkozás sikeresen törölve!" });
  } catch (error) {
    console.error("Hiba történt a törlés során:", error);
    res.status(500).json({ error: "Szerver hiba!" });
  }
});

module.exports = router;
