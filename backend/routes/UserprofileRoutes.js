// UserprofileRoutes.js

const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Adatbázis kapcsolat beállítása
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bookmytime'
});

// Profil frissítése
router.post('/update-profile', (req, res) => {
  const { name, email, phone, password, profileImage } = req.body;

  // SQL lekérdezés a felhasználói adatok frissítésére
  let updateQuery = 'UPDATE felhasznalo SET name = ?, phone = ? WHERE email = ?';
  let updateValues = [name, phone, email];

  if (profileImage) {
    updateQuery = 'UPDATE felhasznalo SET name = ?, phone = ?, profileImage = ? WHERE email = ?';
    updateValues.push(profileImage);
  }

  if (password) {
    updateQuery = 'UPDATE felhasznalo SET name = ?, phone = ?, profileImage = ?, password = ? WHERE email = ?';
    updateValues.push(password);
  }

  db.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Hiba történt a profil frissítésekor.' });
    }
    return res.status(200).json({ message: 'Profil sikeresen frissítve!' });
  });
});

// Profil törlése
router.delete('/delete-profile', (req, res) => {
  const { email } = req.body;

  // SQL lekérdezés a profil törlésére
  const deleteQuery = 'DELETE FROM felhasznalo WHERE email = ?';

  db.query(deleteQuery, [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Hiba történt a profil törlésekor.' });
    }
    return res.status(200).json({ message: 'Profil sikeresen törölve.' });
  });
});

module.exports = router;
