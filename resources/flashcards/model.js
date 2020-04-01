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

async function initialiseDeckScore(userId, cardIds) {
  for (i = 0; i < cardIds.length; i++) {
    await db('card_mastery').insert({
      user_id: userId,
      flashcard_id: cardIds[i],
      value: 0,
    });
  }
  return cardIds.length;
}

function getNonMasteredCards(limit, deck_id, user_id) {
  return db('flashcards as f')
    .leftJoin('card_mastery as cm', 'cm.flashcard_id', 'f.id')
    .select(
      'f.id',
      'f.deck_id',
      'f.user_id',
      'f.question',
      'f.answer',
      'cm.value'
    )
    .groupBy(
      'f.id',
      'f.deck_id',
      'f.user_id',
      'f.question',
      'f.answer',
      'cm.value'
    )
    .orderBy('cm.value')
    .limit(limit)
    .where({ deck_id }, { user_id });
}

async function updateMemorizationRank(cardIds, ranks) {
  for (i = 0; i < cardIds.length; i++) {
    await db('card_mastery')
      .where({ flashcard_id: cardIds[i] })
      .update({ value: ranks[i] });
  }
}

module.exports = {
  getCardById,
  getAllCardsByUser,
  createCard,
  removeCard,
  updateCard,
  getNonMasteredCards,
  updateMemorizationRank,
  initialiseDeckScore,
};
