const express = require('express');

const {
  fetchSessionById,
  getUserSessions,
  makeSession,
  modifySession,
  removeSession,
} = require('./controller');

const {
  cardExists,
  deckExists,
  cardAlreadyMarked,
  sessionExists,
  cardBelongsToDeck,
  preventDuplicateIncompleteSessions,
} = require('./middleware');

const sessionRouter = express.Router();

sessionRouter.get('/', getUserSessions);

sessionRouter.post(
  '/',
  deckExists,
  preventDuplicateIncompleteSessions,
  makeSession
);

sessionRouter.get('/:id', sessionExists, fetchSessionById);

sessionRouter.put(
  '/:id',
  sessionExists,
  cardExists,
  cardAlreadyMarked,
  cardBelongsToDeck,
  modifySession
);

sessionRouter.delete('/:id', sessionExists, removeSession);

module.exports = sessionRouter;
