const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Felhasználói adatok lekérése
router.get('/felhasznalo', async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'Felhasználói azonosító szükséges' });
    }
    try {
        const [rows] = await db.execute('SELECT nev, email, telefon, profilkep FROM felhasznalo WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Felhasználó nem található' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Hiba a felhasználói adatok lekérésekor:', error);
        res.status(500).json({ error: 'Szerverhiba' });
    }
});

// Felhasználó foglalásainak lekérése
router.get('/foglalasok', async (req, res) => {
    const { felhasznalo_id } = req.query;
    if (!felhasznalo_id) {
        return res.status(400).json({ error: 'Felhasználói azonosító szükséges' });
    }
    try {
        const [rows] = await db.execute(
            'SELECT foglalas_id, DATE(foglalas_datum) AS datum, TIME(foglalas_datum) AS ora FROM foglalasok WHERE felhasznalo_id = ?',
            [felhasznalo_id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Hiba a foglalások lekérésekor:', error);
        res.status(500).json({ error: 'Szerverhiba' });
    }
});


// Statisztikák lekérése
router.get('/statisztikak', async (req, res) => {
    try {
        // Összes foglalás
        const [osszesFoglalas] = await db.execute('SELECT COUNT(*) AS count FROM foglalasok');

        // Legutóbbi foglalás
        const [utolsoFoglalas] = await db.execute(
            'SELECT foglalas_datum FROM foglalasok ORDER BY foglalas_datum DESC LIMIT 1'
        );

        // Heti aktivitás (hány foglalás történt az utóbbi 7 napban)
        const [aktivitas] = await db.execute(
            `SELECT COUNT(*) AS count FROM foglalasok 
             WHERE foglalas_datum >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
        );

        res.json({
            osszesFoglalas: osszesFoglalas[0].count || 0,
            utolsoFoglalas: utolsoFoglalas.length > 0 ? utolsoFoglalas[0].foglalas_datum : null,
            aktivitas: aktivitas[0].count || 0
        });
    } catch (error) {
        console.error('Hiba a statisztikák lekérésekor:', error);
        res.status(500).json({ error: 'Szerverhiba' });
    }
});

module.exports = router;
