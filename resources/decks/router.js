const router = require('express').Router();

const {
  addDeck,
  getUsersDecks,
  getDeck,
  deleteDeck,
  updateDeck,
  getAllDecks,
  getFavoriteTags,
  accessDeck,
  recentlyAccessed,
  removeAccessed,
  setDeckMastery,
} = require('./controller');
const validate = require('../../utils/validate');
const { deckSchema, editDeckSchema } = require('./schema');
const {
  deckExists,
  tagsExists,
  preventDuplicateTags,
  userOwnsDeck,
} = require('./middlewares');
const { checkId } = require('../global/middlewares');

router.get('/access', recentlyAccessed);
router.put('/access/:id', deckExists, accessDeck);
router.delete('/access/:id', deckExists, removeAccessed);
router.post('/', validate(deckSchema), tagsExists, addDeck);
router.post('/test', setDeckMastery);
router.get('/', getUsersDecks);
router.get('/favorite', getFavoriteTags);
router.get('/public', getAllDecks);
router.get('/:id', checkId, deckExists, getDeck);
router.put(
  '/:id',
  validate(editDeckSchema),
  deckExists,
  checkId,
  userOwnsDeck,
  tagsExists,
  preventDuplicateTags,
  updateDeck
);
router.delete('/:id', checkId, userOwnsDeck, deckExists, deleteDeck);

module.exports = router;
