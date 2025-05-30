const express = require("express");
const authRoutes = require("../routes/authRoutes");
const businessRoutes = require("../routes/businessRoutes");
const bookingRoutes = require("../routes/bookingRoutes");
const cors = require('cors');
const dotenv = require("dotenv");
const db = require("./db");
const nodemailer = require("nodemailer");
const UserRoutes = require("../routes/UserRoutes");

dotenv.config();

const app = express();

app.use(express.json());



app.use(cors());

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use('/api/businesses', businessRoutes);
app.use("/api/foglalasok", bookingRoutes);
app.use('/api/felhasznalo', UserRoutes);

app.get("/", (req, res) => {
  res.send("BookMyTime backend működik!");
});


// Hibakezelő middleware
app.use((err, req, res, next) => {
  console.error("Globális hiba:", err);
  res.status(500).send("Belső rendszerhiba történt.");
});

// Szerver indítása
app.listen(5000, 'localhost', () => {
  console.log('Server running on http://localhost:5000');
});
