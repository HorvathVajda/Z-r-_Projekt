const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get('/idopontok', async (req, res) => {
  let { vallalkozo_id } = req.query; // A frontend által küldött paraméter
  if (!vallalkozo_id) {
    return res.status(400).json({ error: 'Vállalkozói azonosító szükséges' });
  }

  // A vallalkozo_id értékének konvertálása számmá
  vallalkozo_id = Number(vallalkozo_id);
  if (isNaN(vallalkozo_id)) {
    return res.status(400).json({ error: 'Érvénytelen vállalkozói azonosító' });
  }

  try {
    console.log(`Lekérdezés a vállalkozás id-k alapján, ahol a vallalkozo_id = ${vallalkozo_id}`);

    // 1. Lekérjük a vállalkozás id-ket a vallalkozas táblából, ahol a vallalkozo_id megegyezik
    const [vallalkozasRows] = await db.execute(
      'SELECT id FROM vallalkozas WHERE vallalkozo_id = ?',
      [vallalkozo_id]
    );

    if (vallalkozasRows.length === 0) {
      return res.status(404).json({ error: 'Nincs ilyen vállalkozás.' });
    }

    const vallalkozasIds = vallalkozasRows.map(row => row.id);
    console.log(`Vállalkozás id-k: ${vallalkozasIds.join(', ')}`);

    // 2. Lekérjük a szolgáltatásokat a szolgáltatás táblából, ahol a vallalkozas_id szerepel
    const [szolgaltatasRows] = await db.execute(
      'SELECT szolgaltatas_id, szolgaltatas_neve FROM szolgaltatas WHERE vallalkozas_id IN (' + vallalkozasIds.map(() => '?').join(',') + ')',
      vallalkozasIds
    );

    console.log(`Szolgáltatásokat találtunk: ${szolgaltatasRows.length > 0 ? 'Igen' : 'Nem'}`);

    if (szolgaltatasRows.length === 0) {
      return res.status(404).json({ error: 'Nincs szolgáltatás a megadott vállalkozás(ok)hoz.' });
    }

    const szolgaltatasIds = szolgaltatasRows.map(row => row.szolgaltatas_id);
    console.log(`Szolgáltatás id-k: ${szolgaltatasIds.join(', ')}`);

    // 3. Lekérjük az idopontok táblából azokat az adatokat, ahol a szolgaltatas_id megegyezik és a statusz = 'foglalt'
    const [idopontokRows] = await db.execute(
      'SELECT ido_id, szabad_ido FROM idopontok WHERE szolgaltatas_id = 10 AND statusz = "foglalt"'
    );

    console.log('Foglalt időpontok (szolgáltatás 10):', idopontokRows);

    // A foglalt időpontok átalakítása helyi időzónára
    idopontokRows.forEach((item) => {
      item.szabad_ido = new Date(item.szabad_ido).toLocaleString(); // Helyi időre alakítja
    });

    // 4. Lekérjük a foglalasok táblából a felhasznalo_id-t és a foglalo_tipus-t ahol az ido_id = a lekérdezett ido_id-vel
    const ido_id = idopontokRows.length > 0 ? idopontokRows[0].ido_id : null; // Az első időpont ido_id-ja

    let foglaloAdatai = null; // Inicializáljuk null-ra, hogy ne okozzon hibát, ha nem találunk foglalót

    if (ido_id) {
      const [foglalasokRows] = await db.execute(
        'SELECT felhasznalo_id, foglalo_tipus FROM foglalasok WHERE ido_id = ?',
        [ido_id] // Most már átadjuk az ido_id-t
      );

      if (foglalasokRows.length > 0) {
        const tipus = foglalasokRows[0].foglalo_tipus; // Hozzáférés az első foglalás típusához

        if (tipus == "vallalkozo") {
          // Ha a foglaló vállalkozó, akkor a vállalkozó nevét kérjük le
          [foglaloAdatai] = await db.execute(
            'SELECT nev FROM vallalkozo WHERE vallalkozo_id = ?',
            [foglalasokRows[0].felhasznalo_id] // Feltételezem, hogy a felhasznalo_id-val azonosítható a vallalkozo
          );
        } else {
          // Ha a foglaló felhasználó, akkor a felhasználó nevét kérjük le
          [foglaloAdatai] = await db.execute(
            'SELECT nev FROM felhasznalo WHERE felhasznalo_id = ?',
            [foglalasokRows[0].felhasznalo_id] // Felhasználó ID-ja
          );
        }

        console.log('Foglalt időpont adatai:', foglaloAdatai);
      } else {
        console.log('Nincs foglalás az adott időpontra.');
      }
    } else {
      console.log('Nincs foglalt időpont a megadott szolgáltatáshoz.');
    }

    res.status(200).json({
      idopontok: idopontokRows.map(row => row.szabad_ido), // A szabad időpontokat visszaadjuk
      nev: foglaloAdatai ? foglaloAdatai[0]?.nev : null // Ha van foglaló adat, akkor a nevét visszaadjuk
    });

  } catch (error) {
    console.error('Hiba történt:', error);
    res.status(500).json({ error: 'Hiba történt a lekérdezés során.' });
  }
});

module.exports = router;
