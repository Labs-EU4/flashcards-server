const express = require('express');

const { deleteUser, updateUserProfile } = require('./controller');
const {
  deleteAccountSchema,
  updateUserProfileSchema,
} = require('./userSchema');
const { validateUserPassword } = require('./middlewares');
const validate = require('../../utils/validate');

const userRouter = express.Router();

userRouter.delete(
  '/',
  validate(deleteAccountSchema),
  validateUserPassword,
  deleteUser
);

userRouter.put(
  '/updateprofile',
  validate(updateUserProfileSchema),
  updateUserProfile
);

module.exports = userRouter;
