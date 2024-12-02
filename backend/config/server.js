const express = require("express");
const authRoutes = require("../routes/authRoutes");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Környezeti változók betöltése

const app = express();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Valami hiba történt!');
});

// Middleware-k
app.use(cors()); // CORS engedélyezése
app.use(express.json()); // Express 4.16+ már tartalmazza a JSON feldolgozást

// Útvonalak
app.use("/api/auth", authRoutes); // Az autentikációs útvonal

// Szerver indítása
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Szerver fut a ${PORT} porton`));
