const express = require("express");
const authRoutes = require("../routes/authRoutes");
const businessRoutes = require("../routes/businessRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db"); // db.js a config mappában

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


// Szerver indítása
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"; // Hálózati eléréshez
app.listen(PORT, HOST, () => {
  console.log(`Szerver fut a következő címen: http://${HOST}:${PORT}`);
});
