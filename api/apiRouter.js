const appRouter = require('express').Router();

const authRouter = require('../resources/auth/router');
const flashcardsRouter = require('../resources/flashcards/router');
const deckRouter = require('../resources/decks/router');
const userRouter = require('../resources/users/router');
const feedbackRouter = require('../resources/user_feedback/router');
const sessionRouter = require('../resources/sessions/router');
const { authorized } = require('../resources/global/middlewares');

appRouter.use('/auth', authRouter);
appRouter.use('/decks', authorized, deckRouter);
appRouter.use('/cards', authorized, flashcardsRouter);
appRouter.use('/users', authorized, userRouter);
appRouter.use('/feedback', authorized, feedbackRouter);
appRouter.use('/sessions', authorized, sessionRouter);

module.exports = appRouter;
