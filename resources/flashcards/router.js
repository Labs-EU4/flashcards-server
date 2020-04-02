const express = require('express');

const {
  makeCard,
  fetchCardById,
  fetchAllCardsByUser,
  deleteCard,
  editCard,
  getLowCards,
  updateMemoRank,
  initialise,
} = require('./controller');
const { flashCardSchema } = require('./flashcardsSchema');
const validate = require('../../utils/validate');
const { cardExists, userOwnsCard } = require('./middlewares');

const flashcardsRouter = express.Router();

flashcardsRouter.post('/', validate(flashCardSchema), makeCard);
flashcardsRouter.post('/initialise', initialise);
flashcardsRouter.get('/', fetchAllCardsByUser);
flashcardsRouter.get('/spaced-repetition', getLowCards);
flashcardsRouter.get('/:id', cardExists, fetchCardById);
flashcardsRouter.put(
  '/:id',
  cardExists,
  userOwnsCard,
  validate(flashCardSchema),
  editCard
);
flashcardsRouter.put('/', updateMemoRank);
flashcardsRouter.delete('/:id', cardExists, userOwnsCard, deleteCard);

module.exports = flashcardsRouter;
