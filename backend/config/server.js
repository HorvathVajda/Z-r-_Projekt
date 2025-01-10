const express = require("express");
const authRoutes = require("../routes/authRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db"); // Adatbázis kapcsolat importálása

dotenv.config();

const app = express();

// Hibakezelő middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Valami hiba történt!");
});

// CORS beállítások
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // A frontend URL-je, ha nincs beállítva, alapértelmezett érték
  credentials: true // Engedélyezi a sütik használatát
}));

// JSON adatok kezelése
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API útvonalak
app.use("/api/auth", authRoutes); // Autentikációs útvonalak

// Teszt endpoint
app.get("/", (req, res) => {
  res.send("BookMyTime backend működik!");
});

// Példa: Foglalások listázása
app.get("/api/bookings", (req, res) => {
  db.query("SELECT * FROM foglalasok", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Adatbázis hiba");
    } else {
      res.json(results);
    }
  });
});

// Példa: Foglalás hozzáadása
app.post("/api/bookings", (req, res) => {
  const { user_id, service_id, appointment_time } = req.body;
  db.query(
    "INSERT INTO foglalasok (user_id, service_id, appointment_time) VALUES (?, ?, ?)",
    [user_id, service_id, appointment_time],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Adatbázis hiba");
      } else {
        res.status(201).send("Foglalás sikeresen hozzáadva");
      }
    }
  );
});

// Szerver indítása
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"; // Hálózati eléréshez
app.listen(PORT, HOST, () => {
  console.log(`Szerver fut a következő címen: http://${HOST}:${PORT}`);
});

//