const express = require('express');

const {
  deleteUser,
  getUserScore,
  getLeaderboard,
  updateUserProfile,
} = require('./controller');
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

userRouter.get('/:id/score', getUserScore);

userRouter.get('/leaderboard', getLeaderboard);

userRouter.put(
  '/updateprofile',
  validate(updateUserProfileSchema),
  updateUserProfile
);

module.exports = userRouter;
