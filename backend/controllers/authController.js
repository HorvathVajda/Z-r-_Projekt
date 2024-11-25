const db = require('../config/db'); // Az adatbázis kapcsolat
const bcrypt = require('bcrypt');
const saltRounds = 10; // Sózás a bcrypthez

// Regisztrációs funkció
const registerUser = async (req, res) => {
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

module.exports = { registerUser };
