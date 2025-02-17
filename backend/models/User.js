// user.js - A profil frissítése backend
const db = require('../db'); // Adatbázis kapcsolat
const bcrypt = require('bcrypt'); // Ha szükséges jelszóhasheléshez

// A bio frissítése a vállalkozó számára
const updateBio = (req, res) => {
  const { email, bio } = req.body;

  // Ellenőrizzük, hogy mindkét paraméter megvan
  if (!email || !bio) {
    return res.status(400).send({ message: 'Email és bio mezők szükségesek' });
  }

  // Bio frissítése SQL lekérdezés
  const query = 'UPDATE businesses SET bio = ? WHERE email = ?';
  db.query(query, [bio, email], (err, results) => {
    if (err) {
      console.error('Hiba történt a frissítés során:', err);
      return res.status(500).send({ message: 'Hiba történt a frissítés során' });
    }

    if (results.affectedRows > 0) {
      // Sikeres frissítés
      res.status(200).send({ message: 'Bio sikeresen frissítve' });
    } else {
      // Ha nincs találat, azaz nem létezik az email
      res.status(404).send({ message: 'Vállalkozó nem található' });
    }
  });
};

module.exports = { updateBio };
