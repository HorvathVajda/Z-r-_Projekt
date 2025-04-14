const jwt = require('jsonwebtoken');
const SECRET_KEY = 'titkoskulcs';
const authenticateToken = (req, res, next) => {
  next();
};

module.exports = authenticateToken;
