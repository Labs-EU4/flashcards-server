const express = require('express');

const {
  makeCard,
  fetchCardById,
  fetchAllCardsByUser,
  deleteCard,
  editCard,
  fetchCardOfTheDay,
  rateCard,
} = require('./controller');
const { flashCardSchema, ratingsSchema } = require('./flashcardsSchema');
const validate = require('../../utils/validate');
const { cardExists, userOwnsCard, cardIsRated } = require('./middlewares');

const flashcardsRouter = express.Router();

flashcardsRouter.post('/', validate(flashCardSchema), makeCard);
flashcardsRouter.get('/', fetchAllCardsByUser);
flashcardsRouter.get('/COTD', fetchCardOfTheDay);
flashcardsRouter.get('/:id', cardExists, fetchCardById);
flashcardsRouter.put(
  '/:id',
  cardExists,
  userOwnsCard,
  validate(flashCardSchema),
  editCard
);
flashcardsRouter.delete('/:id', userOwnsCard, cardExists, deleteCard);

flashcardsRouter.post(
  '/scoring',
  cardIsRated,
  validate(ratingsSchema),
  rateCard
);

module.exports = flashcardsRouter;
