const express = require('express');
const mysql = require('mysql2');

const router = express.Router();

// MySQL adatbázis kapcsolat
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yourpassword',
  database: 'bookmytime'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Profil frissítése
router.post('/update-profile', (req, res) => {
  const { name, email, phone, password } = req.body;
  // Profilkép fájl már nem szükséges

  let query = 'UPDATE felhasznalo SET name = ?, email = ?, phone = ?';
  const params = [name, email, phone];

  if (password) {
    query += ', password = ?';
    params.push(password);
  }

  query += ' WHERE email = ?';
  params.push(email);

  db.query(query, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Hiba történt a profil frissítésekor.');
    }
    res.send('Profil sikeresen frissítve!');
  });
});

// Profil törlése
router.delete('/delete-profile', (req, res) => {
  const { email } = req.body;

  db.query('DELETE FROM felhasznalo WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Hiba történt a profil törlésekor.');
    }
    res.send('A profil törölve lett.');
  });
});

module.exports = router;
