<<<<<<< HEAD
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
=======
const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

exports.roleMiddleware = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
>>>>>>> 763291d0d2170a632805daadaf3a738a4983eb33
};
