const express = require("express");
const router = express.Router();
const db = require("../config/db");
const emailjs = require('emailjs-com');

// Vállalkozás ID alapján szolgáltatásokat lekérdező végpont
router.get("/szolgaltatasok/:vallalkozas_id", async (req, res) => {
  const { vallalkozas_id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT szolgaltatas.*, vallalkozas.vallalkozas_neve
      FROM szolgaltatas
      JOIN vallalkozas ON szolgaltatas.vallalkozas_id = vallalkozas.id
      WHERE szolgaltatas.vallalkozas_id = ?
    `, [vallalkozas_id]);

    res.json(rows);
  } catch (error) {
    console.error("Hiba a szolgáltatások lekérésekor:", error);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

// Vállalkozások listája lekérdezése
router.get('/vallalkozasok', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM vallalkozas');
    res.json(results);
  } catch (err) {
    console.error("SQL hiba:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Kategóriák lekérése
router.get('/business-categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT category FROM vallalkozas');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories: ', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Szabad időpontok lekérése
router.get("/szabad-idopontok/:szolgaltatas_id", async (req, res) => {
  const { szolgaltatas_id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT ido_id, szabad_ido, statusz
      FROM idopontok
      WHERE szolgaltatas_id = ? AND statusz = 'szabad'
    `, [szolgaltatas_id]);

    res.json(rows);
  } catch (error) {
    console.error("Hiba a szabad időpontok lekérésekor:", error);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

// Foglalás végpont
router.post('/foglalas', async (req, res) => {
  const { szolgaltatas_id, ido_id, felhasznalo_id, vallalkozas_id, foglalo_tipus, email } = req.body;

  console.log('Bejövő adatok:', { szolgaltatas_id, ido_id, felhasznalo_id, vallalkozas_id, foglalo_tipus, email });

  try {
    // Ellenőrizzük, hogy az időpont szabad-e
    const [results] = await db.query('SELECT * FROM idopontok WHERE ido_id = ? AND statusz = "szabad"', [ido_id]);

    console.log('Szabad időpont keresés eredménye:', results);

    if (results.length === 0) {
      console.log('Az időpont már nem elérhető:', ido_id);
      return res.status(400).json({ message: 'Az időpont már nem elérhető.' });
    }

    const foglalasData = {
      szolgaltatas_id,
      ido_id,
      felhasznalo_id: felhasznalo_id || null,
      vallalkozas_id: vallalkozas_id || null,
      statusz: 'foglalt',
      foglalas_datum: new Date(),
      foglalo_tipus,
    };

    console.log('Foglalás adat:', foglalasData);

    // Foglalás rögzítése
    await db.query('INSERT INTO foglalasok SET ?', foglalasData);
    console.log('Foglalás sikeresen rögzítve');

    // Időpont státusz frissítése
    await db.query('UPDATE idopontok SET statusz = "foglalt" WHERE ido_id = ?', [ido_id]);
    console.log('Időpont státusz frissítve:', ido_id);

    // **Email küldés az EmailJS REST API-val**
    const templateParams = {
      to_email: email,  // A frontend által küldött email cím
      subject: 'Új foglalás érkezett!',
      message: `Új foglalás érkezett a következő adatokkal:
        - Szolgáltatás ID: ${szolgaltatas_id}
        - Időpont: ${results[0].szabad_ido}
        - Foglaló típusa: ${foglalo_tipus}`
    };



    try {
      const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            service_id: 'service_et6yxeo',  // Az EmailJS által megadott saját service ID
            template_id: 'template_4aq3f4g', // Az EmailJS által megadott saját template ID
            user_id: 'An_2K3rlynQaF-gOD',    // Az EmailJS által megadott saját user ID
            template_params: templateParams,  // A dinamikus paraméterek
        })
    });


      if (!emailResponse.ok) {
        throw new Error(`Hiba az email küldés során! Status: ${emailResponse.status}`);
      }

      console.log('Email sikeresen elküldve.');
    } catch (error) {
      console.error('Hiba történt az email küldésekor:', error.message);
      console.log(error.stack);  // Részletes hiba információ
    }


    return res.status(201).json({ message: 'Foglalás sikeresen létrehozva és email elküldve.' });

  } catch (err) {
    console.error('SQL hiba:', err);
    return res.status(500).json({
      message: 'Hiba történt a foglalás létrehozása során.',
      error: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;
