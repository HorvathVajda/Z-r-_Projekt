const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken"); // JWT csomag importálása
const secretKey = "your_secret_key"; // A titkos kulcsod (ugyanaz, amit a token generálásnál használsz)

// Új vállalkozás hozzáadása
router.post("/add", async (req, res) => {
  try {
    const { vallalkozas_neve, iranyitoszam, varos, utca, hazszam, ajto, category } = req.body;

    if (!vallalkozas_neve || !iranyitoszam || !varos || !utca || !hazszam || !category) {
      return res.status(400).json({ error: "Minden kötelező mezőt ki kell tölteni!" });
    }

    // A token kinyerése az Authorization fejlécből
    const token = req.headers.authorization?.split(' ')[1]; // 'Bearer <token>'

    if (!token) {
      return res.status(403).json({ error: "Nincs hitelesítő token." });
    }

    // Token dekódolása
    const decodedToken = jwt.verify(token, secretKey);

    // A vallalkozo_id a dekódolt tokenből
    const vallalkozo_id = decodedToken.id;

    // Helyszín összeállítása
    const helyszin = `${iranyitoszam} ${varos} ${utca} ${hazszam}${ajto ? " " + ajto : ""}`;

    const sql = `
      INSERT INTO vallalkozas (vallalkozas_neve, helyszin, category, vallalkozo_id)
      VALUES (?, ?, ?, ?)
    `;

    // A vallalkozo_id beillesztése az adatbázisba
    await db.query(sql, [vallalkozas_neve, helyszin, category, vallalkozo_id]);

    res.status(201).json({ message: "Vállalkozás sikeresen hozzáadva!" });
  } catch (error) {
    console.error("Hiba történt az adatbázisba való beszúráskor:", error);
    res.status(500).json({ error: "Szerver hiba!" });
  }
});

module.exports = router;
