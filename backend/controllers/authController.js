const jwt = require("jsonwebtoken");
const secretKey = "titkoskulcs";
const db = require("../config/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.login = async (req, res) => {
  const { email, jelszo } = req.body;

  try {
    // Felhasználó keresése
    const [users] = await db.query("SELECT * FROM felhasznalo WHERE email = ?", [email]);

    // Ellenőrizzük, hogy van-e találat
    if (users.length === 0) {
      return res.status(404).json({ message: "A felhasználó nem található." });
    }

    const user = users[0];

    // Ellenőrizzük, hogy van-e jelszó
    if (!user.jelszo) {
      return res.status(400).json({ message: "A felhasználóhoz nincs jelszó társítva." });
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
    // Ellenőrizzük, hogy létezik-e már az e-mail cím
const [existingUsers] = await db.query("SELECT * FROM felhasznalo WHERE email = ?", [email]);

// Ha az eredmény tömb nem üres, akkor az e-mail már létezik
if (existingUsers.length > 0) {
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
