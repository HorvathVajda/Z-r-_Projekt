const db = require('../db');
const bcrypt = require('bcrypt');

const updateBio = (req, res) => {
  const { email, bio } = req.body;

  if (!email || !bio) {
    return res.status(400).send({ message: 'Email és bio mezők szükségesek' });
  }

  const query = 'UPDATE businesses SET bio = ? WHERE email = ?';
  db.query(query, [bio, email], (err, results) => {
    if (err) {
      console.error('Hiba történt a frissítés során:', err);
      return res.status(500).send({ message: 'Hiba történt a frissítés során' });
    }

    if (results.affectedRows > 0) {
      res.status(200).send({ message: 'Bio sikeresen frissítve' });
    } else {
      res.status(404).send({ message: 'Vállalkozó nem található' });
    }
  });
};

module.exports = { updateBio };
