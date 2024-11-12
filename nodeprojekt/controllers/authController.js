// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role], (err) => {
    if (err) return res.status(500).send('Hiba történt.');
    res.status(201).send('Felhasználó regisztrálva.');
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, users) => {
    if (err || users.length === 0) return res.status(401).send('Hibás bejelentkezési adatok.');

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Hibás bejelentkezési adatok.');

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  });
};
