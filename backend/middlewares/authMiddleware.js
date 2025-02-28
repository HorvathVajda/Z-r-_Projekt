const jwt = require('jsonwebtoken');
const SECRET_KEY = 'titkoskulcs';  // A titkos kulcs, amit a JWT-kódoláshoz használsz.

const authenticateToken = (req, res, next) => {

  next();
};

module.exports = authenticateToken;
