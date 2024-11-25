const jwt = require('jsonwebtoken');

// Middleware a JWT token ellenőrzésére
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Az Authorization header-ből

  if (!token) return res.status(401).json({ message: 'Nincs token' });

  jwt.verify(token, 'titkoskulcs', (err, user) => {
    if (err) return res.status(403).json({ message: 'Érvénytelen token' });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
