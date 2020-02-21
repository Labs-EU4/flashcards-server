const express = require('express');

const { userFeedback } = require('./controller');

const { authorized } = require('../global/middlewares');
const validate = require('../../utils/validate');
const { userFeedbackSchema } = require('./feedbackSchema');

const userRouter = express.Router();

userRouter.post('/', validate(userFeedbackSchema), authorized, userFeedback);

module.exports = userRouter;
