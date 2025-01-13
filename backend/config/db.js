const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // helyettesítsd a helyes jelszóval
  database: 'bookmytime'
});

db.connect((err) => {
  if (err) {
    console.error('Hiba a csatlakozás során:', err);
    return;
  }
  console.log('Sikeres MySQL kapcsolódás');
});

module.exports = db;
