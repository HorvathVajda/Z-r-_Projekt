const express = require("express");
const authRoutes = require("../routes/authRoutes");
const businessRoutes = require("../routes/businessRoutes");
const bookingRoutes = require("../routes/bookingRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();

// Új kategóriák hozzáadása
app.post("/api/categories", async (req, res) => {
  const { name } = req.body;
  try {
    await db.query("INSERT INTO categories (name) VALUES (?)", [name]);
    res.status(201).json({ message: "Kategória hozzáadva" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nem sikerült hozzáadni a kategóriát." });
  }
});

// Kategóriák listázása a vallalkozas tábla categories oszlopából
app.get("/api/categories", async (req, res) => {
  try {
    // Lekérjük az egyedi kategóriákat a vallalkozas táblából
    const [results] = await db.query("SELECT DISTINCT categories FROM vallalkozas");
    
    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Nincs elérhető kategória.' });
    }
    
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Adatbázis hiba");
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Valami hiba történt!");
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/foglalas", bookingRoutes);

app.get("/", (req, res) => {
  res.send("BookMyTime backend működik!");
});

app.get("/api/bookings", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM foglalasok");
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Adatbázis hiba");
  }
});

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

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "Kapcsolatfelvételi üzenet",
      text: `Feladó: ${email}\nÜzenet: ${message}`
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

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Szerver fut a következő címen: http://${HOST}:${PORT}`);
});
