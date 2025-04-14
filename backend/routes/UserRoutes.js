const express = require("express");
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require("../config/db");

router.get('/profil/:id', async (req, res) => {
  const felhasznaloId = req.params.id;
  if (!felhasznaloId) {
    return res.status(400).json({ error: 'Hiányzó ID' });
  }
  try {
    const [results] = await db.query(
      'SELECT nev, email, telefonszam FROM felhasznalo WHERE felhasznalo_id = ?',
      [felhasznaloId]
    );
    if (!results.length) {
      return res.status(404).json({ error: 'Nincs ilyen felhasználó' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('DB hiba:', err);
    res.status(500).json({ error: 'Szerver hiba' });
  }
});

router.post('/profil/:id', async (req, res) => {
  const felhasznaloId = Number(req.params.id);
  const { nev, email, telefonszam } = req.body;

  if (!felhasznaloId || !nev || !email || !telefonszam) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező' });
  }

  try {
    const [result] = await db.execute(
      `UPDATE felhasznalo SET nev = ?, email = ?, telefonszam = ? WHERE felhasznalo_id = ?`,
      [nev, email, telefonszam, felhasznaloId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Felhasználó nem található' });
    }

    res.status(200).json({ message: 'Sikeres frissítés' });
  } catch (error) {
    console.error('Adatfrissítési hiba:', error);
    res.status(500).json({ error: 'Szerverhiba történt az adatok frissítésekor' });
  }
});

router.delete('/felhasznalo', async (req, res) => {
  const { felhasznalo_id, foglalo_tipus } = req.body;  // Foglaló típust is át kell venni a request body-ból

  try {
    console.log(`Kapcsolódó foglalásokat keresek a felhasználóhoz (ID: ${felhasznalo_id}) és a foglaló típushoz: ${foglalo_tipus}`);

    // Ellenőrizzük, van-e kapcsolódó foglalás
    const [result] = await db.execute(
      'SELECT COUNT(*) AS count FROM foglalasok WHERE felhasznalo_id = ? AND foglalo_tipus = ?',
      [felhasznalo_id, foglalo_tipus]
    );

    const count = result[0].count;  // Az adatbázisban talált rekordok száma
    console.log(`Talált foglalások száma: ${count}`);

    if (count > 0) {
      // Ha van kapcsolódó foglalás, nem engedjük törölni
      console.log('Hiba: Van kapcsolódó foglalás.');
      return res.status(400).json({ error: 'Nem törölhető a profil, mert van kapcsolódó foglalás.' });
    } else {
      // Ha nincs foglalás, töröljük a felhasználót
      console.log('Nincs kapcsolódó foglalás, törlés történik.');
      await db.execute('DELETE FROM felhasznalo WHERE felhasznalo_id = ?', [felhasznalo_id]);
      return res.status(200).json({ message: 'Profil sikeresen törölve!' });
    }
  } catch (error) {
    console.error('Hiba a profil törlésekor:', error);
    res.status(500).json({ error: 'Szerverhiba történt a profil törlésekor.' });
  }
});

router.post('/jelszo-valtoztatas/:id', async (req, res) => {
  const { jelszo, ujJelszo } = req.body;
  const felhasznaloId = req.params.id;

  if (!felhasznaloId || !jelszo || !ujJelszo) {
    return res.status(400).json({ error: 'Hiányzó adat(ok)' });
  }

  try {
    // 1. Lekérjük a felhasználó jelenlegi jelszavát
    const [rows] = await db.query(
      'SELECT jelszo FROM felhasznalo WHERE felhasznalo_id = ?',
      [felhasznaloId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Felhasználó nem található' });
    }

    const jelenlegiHasheltJelszo = rows[0].jelszo;

    // 2. Összehasonlítás
    const egyezik = await bcrypt.compare(jelszo, jelenlegiHasheltJelszo);
    if (!egyezik) {
      return res.status(401).json({ error: 'Hibás jelenlegi jelszó' });
    }

    // 3. Új jelszó hashelése
    const ujHasheltJelszo = await bcrypt.hash(ujJelszo, 10);

    // 4. Adatbázis frissítés
    const [updateResult] = await db.query(
      'UPDATE felhasznalo SET jelszo = ? WHERE felhasznalo_id = ?',
      [ujHasheltJelszo, felhasznaloId]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(500).json({ error: 'Nem sikerült a jelszó frissítése' });
    }

    res.json({ message: 'Jelszó sikeresen megváltoztatva' });
  } catch (err) {
    console.error('DB hiba:', err);
    res.status(500).json({ error: 'Szerver hiba' });
  }
});

router.get('/bookings', async (req, res) => {
  const felhasznalo_id = Number(req.query.felhasznalo_id);
  const tipus = req.query.tipus;

  if (!felhasznalo_id || !tipus || (tipus !== 'felhasznalo' && tipus !== 'vallalkozo')) {
    return res.status(400).json({ error: 'Érvényes azonosító és típus szükséges (felhasznalo vagy vallalkozo)' });
  }

  try {
    const [rows] = await db.execute(
      `SELECT
         f.foglalas_id,
         DATE_FORMAT(i.szabad_ido, '%Y-%m-%d %H:%i') AS datum,
         s.szolgaltatas_neve AS szolgaltatas
       FROM foglalasok f
       INNER JOIN idopontok i ON f.ido_id = i.ido_id
       INNER JOIN szolgaltatas s ON f.szolgaltatas_id = s.szolgaltatas_id
       WHERE f.felhasznalo_id = ? AND f.foglalo_tipus = ?`,
      [felhasznalo_id, tipus]
    );

    res.json(rows);
  } catch (error) {
    console.error('Hiba a foglalások lekérésekor:', error);
    res.status(500).json({ error: 'Szerverhiba' });
  }
});

// Foglalás lemondása
router.delete('/:id', async (req, res) => {
  const foglalasId = req.params.id;

  try {
    // 1. Állítsuk vissza az időpont státuszát szabadra
    await db.execute(
      `UPDATE idopontok
       SET statusz = 'szabad'
       WHERE ido_id = (SELECT ido_id FROM foglalasok WHERE foglalas_id = ?)`,
      [foglalasId]
    );

    // 2. Töröljük a foglalást
    await db.execute(
      `DELETE FROM foglalasok WHERE foglalas_id = ?`,
      [foglalasId]
    );

    res.json({ message: 'Foglalás sikeresen törölve.' });
  } catch (error) {
    console.error('Hiba a foglalás törlésekor:', error);
    res.status(500).json({ error: 'Szerverhiba történt a törlés során.' });
  }
});


module.exports = router;
