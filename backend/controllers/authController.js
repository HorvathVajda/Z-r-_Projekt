const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY; // Környezeti változóból olvasott kulcs
const db = require("../config/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.login = async (req, res) => {
  const { email, jelszo } = req.body;

  try {
    // Felhasználó keresése
    const [user] = await db.query("SELECT * FROM felhasznalo WHERE email = ?", [email]);

    // Ellenőrizd, hogy létezik-e a felhasználó és van jelszó
    if (!user || !user.jelszo) {
      return res.status(404).json({ message: "A felhasználó nem található vagy nincs jelszó." });
    }

    // Naplózd ki a beírt jelszót és a tárolt hash-elt jelszót
    console.log('Beírt jelszó:', jelszo);
    console.log('Hash-elt jelszó:', user.jelszo);

    // Jelszó ellenőrzése
    const isMatch = await bcrypt.compare(jelszo, user.jelszo);

    if (!isMatch) {
      return res.status(401).json({ message: "Helytelen jelszó." });
    }

    // Token generálása
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: "1h" });

    // Token visszaküldése
    res.json({ token });
  } catch (error) {
    console.error('Szerverhiba:', error);
    res.status(500).json({ message: "Szerverhiba." });
  }
};

// Regisztrációs funkció
exports.registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Alapvető validáció
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ error: 'Minden mezőt ki kell tölteni' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Érvénytelen email cím' });
  }

  try {
    // Ellenőrizzük, hogy létezik-e már az e-mail cím
    const [existingUser] = await db.query("SELECT * FROM felhasznalo WHERE email = ?", [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Ez az e-mail cím már regisztrálva van' });
    }

    // Jelszó hashelése bcrypt-tel
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Adatbázis lekérdezés
    const query = 'INSERT INTO felhasznalo (nev, email, jelszo, telefonszam) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, email, hashedPassword, phone]);

    // Sikeres regisztráció válasz
    res.status(201).json({ message: 'Sikeres regisztráció', userId: result.insertId });
  } catch (err) {
    console.error('Hiba a regisztráció során:', err);
    res.status(500).json({ error: 'Regisztrációs hiba' });
  }
};
