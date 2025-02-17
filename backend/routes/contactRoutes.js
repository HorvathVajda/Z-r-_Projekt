const express = require('express');
const router = express.Router();
const path = require('path');
const sendMail = require(path.join(__dirname, "../utils/sendMail"));

router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Minden mezőt ki kell tölteni!" });
    }

    const success = await sendMail(name, email, message);

    if (success) {
        res.status(200).json({ message: "Üzenet sikeresen elküldve!" });
    } else {
        res.status(500).json({ error: "Hiba történt az üzenet küldése közben." });
    }
});

module.exports = router;
