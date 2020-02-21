const jwt = require('jsonwebtoken');
const { SECRET } = require('../../config');

exports.authorized = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ error: err.message });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({
      error: 'Unauthenticated - please provide a valid token',
    });
  }
};

exports.checkId = (req, res, next) => {
  const { id } = req.params;

  if (!Number.isNaN(Number(id))) {
    next();
  } else {
    res.status(400).json({ message: 'Invalid ID' });
  }
};
