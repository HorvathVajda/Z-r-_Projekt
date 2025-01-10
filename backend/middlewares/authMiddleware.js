const jwt = require('jsonwebtoken');


const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; 

  if (!token) return res.status(401).json({ message: 'Nincs token' });

  jwt.verify(token, 'titkoskulcs', (err, user) => {
    if (err) return res.status(403).json({ message: 'Érvénytelen token' });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;

//