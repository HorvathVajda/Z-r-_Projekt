const express = require("express");
const router = express.Router();
const db = require("../config/db"); 

router.get("/szolgaltatasok", async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT szolgaltatas.*, vallalkozas.vallalkozas_neve
        FROM szolgaltatas
        JOIN vallalkozas ON szolgaltatas.vallalkozas_id = vallalkozas.id
      `);
      res.json(rows);
    } catch (error) {
      console.error("Hiba a szolgáltatások lekérésekor:", error);
      res.status(500).json({ error: "Szerver hiba" });
    }
  });
  

  router.get("/szabad-idopontok/:szolgaltatasId", async (req, res) => {
    try {
      const { szolgaltatasId } = req.params;
      const [rows] = await db.query(
        `SELECT ido_id, szabad_ido, statusz FROM idopontok WHERE szolgaltatas_id = ? AND statusz = 'szabad'`,
        [szolgaltatasId]
      );
      res.json(rows);
    } catch (error) {
      console.error("Hiba a szabad időpontok lekérésekor:", error);
      res.status(500).json({ error: "Szerver hiba" });
    }
  });

module.exports = router;
