const validateToken = require('../../utils/validateToken');
const { EMAIL_SECRET } = require('../../config');
const model = require('./model');

// new addtions

exports.checkUserExists = async (req, res, next) => {
  const { email } = req.body;
  const userExists = await model.filter({ email });
  if (userExists) {
    res.status(400).json({ message: `User with this email already exists` });
  } else {
    next();
  }
};

exports.checkEmailExists = async (req, res, next) => {
  const { email } = req.body;
  const user = await model.findBy({ email });
  if (!user) {
    res.status(404).json({ message: 'User with this email does not exists' });
  } else {
    req.user = user;
    next();
  }
};

exports.validateResetToken = async (req, res, next) => {
  const { token } = req.params;
  const resetToken = await model.filterForToken({ token });
  if (!resetToken) {
    res.status(400).json({ message: 'Invalid token or previously used token' });
  } else {
    req.token = resetToken;
    next();
  }
};

exports.validateToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    const decodedToken = validateToken(token, EMAIL_SECRET);

    const userId = decodedToken.subject;
    const response = await model.confirmEmail(userId);

    if (response) {
      req.userId = decodedToken.subject;
      req.userEmail = response.email;
      next();
    } else {
      res.status(400).json({ message: `Email confirmation failed!` });
    }
  } catch (error) {
    res.status(400).json({ message: `Confirmation failed: ${error.message}!` });
  }
};
