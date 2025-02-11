// routes/business.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Middleware: JWT token ellenőrzése
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  // Az Authorization header általában "Bearer <token>" formátumú
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET || "titkoskulcs", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    // A decoded objektum tartalmazza a felhasználó adatait (például id, email, stb.)
    req.user = decoded;
    next();
  });
}

// Új vállalkozás felvitelének végpontja
router.post("/add", verifyToken, async (req, res) => {
  const {
    vallalkozas_neve,
    iranyitoszam,
    varos,
    utca,
    hazszam,
    ajto,       // opcionális
    category    // Vállalkozás típusa
  } = req.body;

  // Ellenőrizzük, hogy a kötelező mezők meg vannak-e adva
  if (
    !vallalkozas_neve ||
    !iranyitoszam ||
    !varos ||
    !utca ||
    !hazszam ||
    !category
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const helyszin = `${iranyitoszam} ${varos} ${utca} ${hazszam}${ajto ? " " + ajto : ""}`;

  const nyitva_tartas = "";
  const szabad_ido = "";
  const idopontok = "";

  const vallalkozo_id = req.user.id;

  try {
    const sql = `
      INSERT INTO vallalkozas
        (vallalkozas_neve, helyszin, nyitva_tartas, szabad_ido, idopontok, vallalkozo_id, category)
      VALUES
        (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      vallalkozas_neve,
      helyszin,
      nyitva_tartas,
      szabad_ido,
      idopontok,
      vallalkozo_id,
      category
    ];

    const [result] = await db.query(sql, values);
    res.status(200).json({
      message: "Business added successfully",
      businessId: result.insertId
    });
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM vallalkozas");
    res.json(rows);
  } catch (error) {
    console.error("Hiba történt az adatok lekérésekor:", error);
    res.status(500).json({ error: "Hiba történt az adatok lekérésekor" });
  }
});

module.exports = router;
