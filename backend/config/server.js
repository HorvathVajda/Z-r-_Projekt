const express = require("express");
const authRoutes = require("../routes/authRoutes");
const businessRoutes = require("../routes/businessRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db"); // db.js a config mappában
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();

// CORS beállítások
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // A frontend URL-je
    credentials: true // Engedélyezi a sütik használatát
  })
);

// JSON adatok kezelése
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API útvonalak
app.use("/api/auth", authRoutes);         // Autentikációs útvonalak
app.use("/api/businesses", businessRoutes);

// Teszt endpoint
app.get("/", (req, res) => {
  res.send("BookMyTime backend működik!");
});

// Kapcsolatfelvételi űrlap kezelése és e-mail küldése
app.post("/api/contact", async (req, res) => {
  const { email, message } = req.body;

  // Ha hiányzik az e-mail vagy üzenet, válaszolj hibaüzenettel
  if (!email || !message) {
    return res.status(400).json({ error: "Minden mezőt ki kell tölteni!" });
  }

  try {
    // Ellenőrizzük, hogy létezik-e a felhasználó vagy a vállalkozó az e-mail címével az adatbázisban
    const [userResult] = await db.query(
      "SELECT email FROM felhasznalo WHERE email = ? UNION SELECT email FROM vallalkozo WHERE email = ?",
      [email, email]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ error: "Az e-mail cím nem található az adatbázisban!" });
    }

    // Nodemailer beállítás
    let transporter = nodemailer.createTransport({
      service: "gmail", // Gmail szolgáltatás
      auth: {
        user: process.env.EMAIL_USER, // Gmail fiók
        pass: process.env.EMAIL_PASS  // Alkalmazásjelszó
      },
      tls: {
        rejectUnauthorized: true // Biztonságos SSL/TLS kapcsolat
      },
      debug: true  // Debug mód, hogy több információt kapjunk, ha hiba történik
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Admin e-mail cím
      subject: "Kapcsolatfelvételi üzenet",
      text: `Feladó: ${email}\nÜzenet: ${message}`
    };

    // E-mail küldése
    await transporter.sendMail(mailOptions);

    // Ha sikerült, válaszolj a felhasználónak
    console.log("Email elküldve!");
    res.status(200).json({ message: "Üzeneted sikeresen elküldtük az adminnak!" });

  } catch (err) {
    console.error("Hiba történt:", err);
    // Bármilyen hiba esetén küldjük vissza a megfelelő választ
    res.status(500).json({ error: "Adatbázis vagy e-mail küldési hiba történt. Kérjük próbáld újra!" });
  }
});

// Szerver indítása
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"; // Hálózati eléréshez
app.listen(PORT, HOST, () => {
  console.log(`Szerver fut a következő címen: http://${HOST}:${PORT}`);
});
