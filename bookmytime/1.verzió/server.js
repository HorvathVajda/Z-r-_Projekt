const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

// CORS engedélyezése
app.use(cors({
  credentials: true,  // Sütik kezelése
  origin: 'http://localhost:3000' // Frontend URL-je
}));

// MySQL kapcsolat
const connect = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bookmytime'
});

// Kapcsolat létrehozása
connect.connect((error) => {
  if (error) {
    console.log("Hiba a csatlakozás során:", error);
  } else {
    console.log("Sikeres csatlakozás a MySQL adatbázishoz");
  }
});

// Middleware a body-parser számára
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session beállítások
app.use(session({
  secret: 'a very secret key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // HTTP esetén false, HTTPS esetén true
    httpOnly: true, // megakadályozza a JavaScript hozzáférést
    maxAge: 3600000 // 1 óra
  }
}));

// Statikus fájlok kiszolgálása
app.use(express.static(path.join(__dirname)));

// Regisztrációs oldal
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'registration.html'));
});

// Regisztrációs adatkezelés
app.post('/register', async (req, res) => {
  const { nev, email, telefonszam, jelszo, userType } = req.body;

  // Jelszó hash-elés bcrypt-tel
  const hashedPassword = await bcrypt.hash(jelszo, 10);

  // Ellenőrizzük, hogy a felhasználó típusa
  let sql;
  if (userType === 'felhasználó') {
    sql = "INSERT INTO felhasznalo (nev, email, telefonszam, jelszo) VALUES (?, ?, ?, ?)";
  } else if (userType === 'vállalkozó') {
    sql = "INSERT INTO vallalkozo (nev, email, telefonszam, jelszo) VALUES (?, ?, ?, ?)";
  } else {
    return res.status(400).json({ message: 'Érvénytelen felhasználó típus' });
  }

  // Adatok beszúrása az adatbázisba
  connect.query(sql, [nev, email, telefonszam, hashedPassword], (error, results) => {
    if (error) {
      console.log("Hiba az adatok beszúrása során:", error);
      return res.status(500).json({ message: 'Hiba az adatok mentésekor' });
    }
    res.json({ message: 'Sikeres regisztráció!' });
  });
});

// Bejelentkezési adatkezelés
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Először ellenőrizzük, hogy az email szerepel-e bármelyik táblában
  let sql = "SELECT * FROM felhasznalo WHERE email = ?";
  connect.query(sql, [email], async (error, results) => {
    if (error) {
      console.log("Hiba a bejelentkezés során:", error);
      return res.status(500).json({ message: 'Hiba a bejelentkezés során' });
    }

    if (results.length > 0) {
      const user = results[0];
      // Jelszó összehasonlítás bcrypt-tel
      const match = await bcrypt.compare(password, user.jelszo);
      if (match) {
        // Bejelentkezett felhasználó session tárolása
        req.session.userId = user.felhasznalo_id;
        res.cookie('userType', 'felhasználó', { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: false });

        return res.json({ message: 'Bejelentkezés sikeres', userType: 'felhasználó' });
      }
    }

    // Ha nem található a felhasznalo táblában, nézze meg a vallalkozo táblát
    sql = "SELECT * FROM vallalkozo WHERE email = ?";
    connect.query(sql, [email], async (error, results) => {
      if (error) {
        console.log("Hiba a bejelentkezés során:", error);
        return res.status(500).json({ message: 'Hiba a bejelentkezés során' });
      }

      if (results.length > 0) {
        const user = results[0];
        // Jelszó összehasonlítás bcrypt-tel
        const match = await bcrypt.compare(password, user.jelszo);
        if (match) {
          // Bejelentkezett vállalkozó session tárolása
          req.session.userId = user.felhasznalo_id;
          res.cookie('userType', 'vállalkozó', { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: false });

          return res.json({ message: 'Bejelentkezés sikeres', userType: 'vállalkozó' });
        }
      }

      // Ha egyik táblában sem található a felhasználó
      return res.status(401).json({ message: 'Érvénytelen bejelentkezési adatok' });
    });
  });
});



// Szerver indítása
app.listen(port, () => {
  console.log(`Szerver fut a http://localhost:${port} címen`);
});