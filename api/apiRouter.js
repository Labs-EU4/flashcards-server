const appRouter = require('express').Router();

const authRouter = require('../resources/auth/router');
const flashcardsRouter = require('../resources/flashcards/router');
const deckRouter = require('../resources/decks/router');
const userRouter = require('../resources/users/router');
const { authorized } = require('../resources/global/middlewares');

appRouter.use('/auth', authRouter);
appRouter.use('/decks', authorized, deckRouter);
appRouter.use('/cards', authorized, flashcardsRouter);
appRouter.use('/users', authorized, userRouter);

module.exports = appRouter;
