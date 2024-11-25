const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../config/db'); // Az adatbázis kapcsolat importálása

// Regisztráció
exports.register = async (req, res) => {
    const { nev, email, jelszo, jogosultsag } = req.body;

    const hashedPassword = await bcrypt.hash(jelszo, 10);

    db.query(
        'INSERT INTO felhasznalo (nev, email, jelszo, jogosultsag) VALUES (?, ?, ?, ?)',
        [nev, email, hashedPassword, jogosultsag],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Hiba történt a regisztráció során' });
            return res.status(201).json({ message: 'Sikeres regisztráció' });
        }
    );
};

// Bejelentkezés
exports.login = (req, res) => {
    const { email, jelszo } = req.body;

    db.query('SELECT * FROM felhasznalo WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Hiba történt a bejelentkezés során' });
        if (results.length === 0) return res.status(400).json({ message: 'Felhasználó nem található' });

        const user = results[0];
        const isMatch = await bcrypt.compare(jelszo, user.jelszo);
        if (!isMatch) return res.status(400).json({ message: 'Hibás jelszó' });

        const token = jwt.sign({ id: user.id, jogosultsag: user.jogosultsag }, 'titkoskulcs', { expiresIn: '1h' });
        res.json({ message: 'Bejelentkezve', token });
    });
};
