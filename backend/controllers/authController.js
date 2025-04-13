const jwt = require("jsonwebtoken");
const secretKey = "titkoskulcs";
const db = require("../config/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.login = async (req, res) => {
  const { email, jelszo } = req.body;

  if (!email || !jelszo) {
    return res.status(400).json({ message: "Minden mezőt ki kell tölteni!" });
  }

  try {
    const [users] = await db.query(
      `
      SELECT 'felhasznalo' AS tipus, felhasznalo_id AS id, nev, email, jelszo
      FROM felhasznalo
      WHERE email = ?
      UNION
      SELECT 'vallalkozo' AS tipus, vallalkozo_id AS id, nev, email, jelszo
      FROM vallalkozo
      WHERE email = ?`,
      [email, email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "A felhasználó nem található." });
    }

    const user = users[0];

    if (!user.jelszo) {
      return res.status(400).json({ message: "A felhasználóhoz nincs jelszó társítva." });
    }

    const isMatch = await bcrypt.compare(jelszo, user.jelszo);

    if (!isMatch) {
      return res.status(401).json({ message: "Helytelen jelszó." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, tipus: user.tipus },
      "titkoskulcs",
      { expiresIn: "1h" }
    );

    const expirationTime = Date.now() + 3600 * 1000;

    res.json({
      message: `Sikeres bejelentkezés ${user.tipus === 'felhasznalo' ? 'felhasználóként' : 'vállalkozóként'}.`,
      token,
      expirationTime,
      tipus: user.tipus,
      id: user.id,
    });;
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

exports.registerBusiness = async (req, res) => {
  const { name, email, password, phone, adoszam } = req.body;

  if (!name || !email || !password || !phone || !adoszam) {
    return res.status(400).json({ error: 'Minden mezőt ki kell tölteni' });
  }

  try {
    // Ellenőrizzük, hogy az e-mail már létezik-e
    const [existingUsers] = await db.query(`SELECT * FROM vallalkozo WHERE email = ?`, [email]);


    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Ez az e-mail cím már regisztrálva van vállalkozóként." });
    }

    // Jelszó titkosítása
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Új vállalkozó beszúrása
    const query = `INSERT INTO vallalkozo (nev, email, jelszo, telefonszam, adoszam) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.execute(query, [name, email, hashedPassword, phone, adoszam]);

    const businessId = result.insertId;

    // Statisztikai rekord létrehozása az új vállalkozóhoz
    const statQuery = `INSERT INTO statisztika (vallalkozo_id, teljesitett_munkak, bevetel, foglalasok) VALUES (?, 0, 0, 0)`;
    await db.execute(statQuery, [businessId]);

    res.status(201).json({ message: "Sikeres vállalkozói regisztráció.", businessId });
  } catch (err) {
    console.error('Hiba a vállalkozói regisztráció során:', err);
    res.status(500).json({ error: 'Regisztrációs hiba.' });
  }
};



