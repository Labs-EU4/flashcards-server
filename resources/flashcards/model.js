const db = require('../../data/dbConfig');

function getCardById(id) {
  return db('flashcards')
    .where({ id })
    .first();
}

function getAllCardsByUser(userId) {
  return db('flashcards').where({ user_id: userId });
}

function createCard(card) {
  return db('flashcards')
    .insert(card, 'id')
    .then(ids => getCardById(ids[0]));
}

function removeCard(id) {
  return db('flashcards')
    .where({ id })
    .del();
}

function updateCard(id, card) {
  return db('flashcards')
    .where({ id })
    .update(card)
    .then(() => getCardById(id));
}

module.exports = {
  getCardById,
  getAllCardsByUser,
  createCard,
  removeCard,
  updateCard,
};
