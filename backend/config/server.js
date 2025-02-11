const express = require("express");
const authRoutes = require("../routes/authRoutes");
const businessRoutes = require("../routes/businessRoutes");
const cors = require("cors");
dotenv = require("dotenv");
const db = require("./db"); // db.js a config mappában
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();

// Hibakezelő middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Valami hiba történt!");
});

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

// Példa: Foglalások listázása
app.get("/api/bookings", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM foglalasok");
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Adatbázis hiba");
  }
});

// Példa: Foglalás hozzáadása
app.post("/api/bookings", async (req, res) => {
  const { user_id, service_id, appointment_time } = req.body;
  try {
    await db.query(
      "INSERT INTO foglalasok (user_id, service_id, appointment_time) VALUES (?, ?, ?)",
      [user_id, service_id, appointment_time]
    );
    res.status(201).send("Foglalás sikeresen hozzáadva");
  } catch (err) {
    console.error(err);
    res.status(500).send("Adatbázis hiba");
  }
});

// Kapcsolatfelvételi űrlap kezelése és e-mail küldése
app.post("/api/contact", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Minden mezőt ki kell tölteni!" });
  }

  try {
    const [userResult] = await db.query(
      "SELECT email FROM felhasznalo WHERE email = ? UNION SELECT email FROM vallalkozo WHERE email = ?",
      [email, email]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ error: "Az e-mail cím nem található az adatbázisban!" });
    }

    // Nodemailer beállítás
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Pl.: "your-email@gmail.com"
        pass: process.env.EMAIL_PASS  // Alkalmazásjelszó szükséges
      }
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Admin e-mail cím
      subject: "Kapcsolatfelvételi üzenet",
      text: `Feladó: ${email}\nÜzenet: ${message}` // Itt javítottuk a szintaxist
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email küldési hiba:", error);
        return res.status(500).json({ error: "Nem sikerült elküldeni az e-mailt!" });
      }
      console.log("Email elküldve:", info.response);
      res.status(200).json({ message: "Üzeneted sikeresen elküldtük az adminnak!" });
    });
  } catch (err) {
    console.error("Adatbázis hiba:", err);
    res.status(500).json({ error: "Adatbázis hiba történt!" });
  }
});

// Szerver indítása
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"; // Hálózati eléréshez
app.listen(PORT, HOST, () => {
  console.log(`Szerver fut a következő címen: http://${HOST}:${PORT}`); // Itt is javítottuk a szintaxist
});
