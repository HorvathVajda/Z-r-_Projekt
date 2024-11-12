// authMiddleware.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token szükséges.');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Érvénytelen token.');
    req.user = decoded;
    next();
  });
};

exports.isBusiness = (req, res, next) => {
  if (req.user.role !== 'business') return res.status(403).send('Hozzáférés megtagadva.');
  next();
};

exports.isCustomer = (req, res, next) => {
  if (req.user.role !== 'user') return res.status(403).send('Hozzáférés megtagadva.');
  next();
};
