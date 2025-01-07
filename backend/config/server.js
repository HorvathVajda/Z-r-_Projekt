const express = require("express");
const authRoutes = require("../routes/authRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise"); // MySQL kapcsolat importálása

dotenv.config();

const app = express();

// MongoDB kapcsolat beállítása
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Sikeres MongoDB kapcsolódás");
  })
  .catch((err) => {
    console.error("Hiba a MongoDB kapcsolódásakor:", err);
  });

// MySQL kapcsolat beállítása
const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'bookmytime'
    });
    console.log("Sikeres MySQL kapcsolódás");
    return connection;
  } catch (err) {
    console.error("Hiba a MySQL kapcsolódáskor:", err);
    process.exit(1); // Kilépés hiba esetén
  }
};

// Kapcsolat létrehozása
let dbConnection;
connectDB().then(connection => {
  dbConnection = connection;
});

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
app.get("/api/bookings", async (req, res) => {
  try {
    const [rows] = await dbConnection.execute("SELECT * FROM bookings");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Adatbázis hiba");
  }
});

// Példa: Foglalás hozzáadása
app.post("/api/bookings", async (req, res) => {
  const { user_id, service_id, appointment_time } = req.body;

  try {
    await dbConnection.execute(
      "INSERT INTO bookings (user_id, service_id, appointment_time) VALUES (?, ?, ?)",
      [user_id, service_id, appointment_time]
    );
    res.status(201).send("Foglalás sikeresen hozzáadva");
  } catch (err) {
    console.error(err);
    res.status(500).send("Adatbázis hiba");
  }
});

// Szerver indítása
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"; // Hálózati eléréshez
app.listen(PORT, HOST, () => {
  console.log(`Szerver fut a következő címen: http://${HOST}:${PORT}`);
});
