const jwt = require('jsonwebtoken');
const SECRET_KEY = 'titkoskulcs';  // A titkos kulcs, amit a JWT-kódoláshoz használsz.

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // "Bearer token"

  if (!token) {
    return res.status(403).json({ error: 'Nincs token.' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Érvénytelen token.' });
    }

    req.authData = decoded;  // A dekódolt token hozzáadása a req objektumhoz.
    next();  // A kérés továbbmegy, mintha autentikált felhasználó lenne
  });
};

module.exports = authenticateToken;
