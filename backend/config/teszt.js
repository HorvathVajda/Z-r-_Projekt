const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 3000;

// Adatbázis kapcsolat létrehozása
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bookmytime'
});

// Kapcsolódás
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// API végpont létrehozása a kategóriák lekérdezésére
app.get('/api/foglalasok/business-categories', (req, res) => {
  const sql = 'SELECT DISTINCT category FROM vallalkozas';
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.log('Kategóriák:', results);  // Kiíratja a kategóriákat a terminálba
    res.json(results);  // Válasz visszaadása a frontendnek
  });
});

// API végpont létrehozása a vállalkozások lekérdezésére
app.get('/api/foglalasok/vallalkozasok', (req, res) => {
  const sql = 'SELECT * FROM vallalkozas';
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.log('Vállalkozások:', results);  // Kiíratja a vállalkozásokat a terminálba
    res.json(results);  // Válasz visszaadása a frontendnek
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
