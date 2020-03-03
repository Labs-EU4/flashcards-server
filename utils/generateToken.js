const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/index');

const generateToken = (user, secret = SECRET) => {
  const payload = user.passwordNotSet
    ? { subject: user.id, name: user.full_name, email: user.email }
    : {
        subject: 'unfinished',
        name: user.full_name,
      };

  const options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, secret, options);
};

module.exports = generateToken;
