const jwt = require("jsonwebtoken");
const secretKey = "titkoskulcs";
const db = require("../config/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.login = async (req, res) => {
  const { email, jelszo } = req.body;

  try {
    const [users] = await db.query(
      `
      SELECT 'felhasznalo' AS tipus, felhasznalo_id AS id, nev, email, jelszo
      FROM felhasznalo
      WHERE email = ?
      UNION
      SELECT 'vallalkozo' AS tipus, vallalkozo_id AS id, nev, email, jelszo
      FROM vallalkozo
      WHERE email = ?
      `,
      [email, email]
    );

    // Ha nincs ilyen felhasználó
    if (users.length === 0) {
      return res.status(404).json({ message: "A felhasználó nem található." });
    }

    const user = users[0]; // Az első találat
    console.log(`Felhasználótípus: ${user.tipus}`); // Debugginghez

    // Ellenőrizzük, hogy van-e jelszó
    if (!user.jelszo) {
      return res.status(400).json({ message: "A felhasználóhoz nincs jelszó társítva." });
    }

    console.log('Beírt jelszó:', jelszo);
    console.log('Hash-elt jelszó:', user.jelszo);

    // Jelszó ellenőrzése
    const isMatch = await bcrypt.compare(jelszo, user.jelszo);

    if (!isMatch) {
      return res.status(401).json({ message: "Helytelen jelszó." });
    }

    // Token generálás
    const token = jwt.sign(
      { id: user.id, email: user.email, tipus: user.tipus }, // Az aliasolt 'id' mező
      secretKey,
      { expiresIn: "1h" }
    );

    // A token lejárati ideje is küldésre kerül
    const expirationTime = Date.now() + 3600 * 1000; // 1 óra

    // Válasz a típus alapján
    res.json({
      message: `Sikeres bejelentkezés ${user.tipus === 'felhasznalo' ? 'felhasználóként' : 'vállalkozóként'}.`,
      token,
      expirationTime, // Token lejárati idő
      tipus: user.tipus, // Felhasználási célokra
    });
  } catch (error) {
    console.error('Szerverhiba:', error);
    res.status(500).json({ message: "Szerverhiba történt. Kérjük próbálja újra később." });
  }
};




exports.registerUser = async (req, res) => {
  const { name, email, password, phone, tipus } = req.body;

  if (!name || !email || !password || !phone || !tipus) {
    return res.status(400).json({ error: 'Minden mezőt ki kell tölteni' });
  }

  if (!['felhasznalo', 'vallalkozo'].includes(tipus)) {
    return res.status(400).json({ error: 'Érvénytelen típus' });
  }

  const tableName = tipus === 'felhasznalo' ? 'felhasznalo' : 'vallalkozo';

  try {
    const [existingUsers] = await db.query(`SELECT * FROM ${tableName} WHERE email = ?`, [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: `Ez az e-mail cím már regisztrálva van ${tipus}-ként.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO ${tableName} (nev, email, jelszo, telefonszam) VALUES (?, ?, ?, ?)`;
    const [result] = await db.execute(query, [name, email, hashedPassword, phone]);

    res.status(201).json({ message: `Sikeres regisztráció ${tipus}-ként.`, userId: result.insertId });
  } catch (err) {
    console.error('Hiba a regisztráció során:', err);
    res.status(500).json({ error: 'Regisztrációs hiba.' });
  }
};
