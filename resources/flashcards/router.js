const express = require('express');

const {
  makeCard,
  fetchCardById,
  fetchAllCardsByUser,
  deleteCard,
  editCard,
} = require('./controller');
const { flashCardSchema } = require('./flashcardsSchema');
const validate = require('../../utils/validate');
const { cardExists } = require('./middlewares');

const flashcardsRouter = express.Router();

flashcardsRouter.post('/', validate(flashCardSchema), makeCard);
flashcardsRouter.get('/', fetchAllCardsByUser);
flashcardsRouter.get('/:id', cardExists, fetchCardById);
flashcardsRouter.put('/:id', cardExists, validate(flashCardSchema), editCard);
flashcardsRouter.delete('/:id', cardExists, deleteCard);

module.exports = flashcardsRouter;
